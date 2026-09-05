import { useCallback, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { MONACO_SHARED_OPTIONS } from "../engines/monacoEditorConfig.js";
import "./WorkspaceEditor.css";

const LANGUAGE_BY_EXT = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  css: "css",
  html: "html",
  md: "markdown",
  yml: "yaml",
  yaml: "yaml",
};

function languageForPath(path) {
  const ext = path.split(".").pop()?.toLowerCase();
  return LANGUAGE_BY_EXT[ext] || "plaintext";
}

/**
 * Deliberately does NOT call configureMonacoDiagnosticsOff (the lesson editors' helper, which
 * turns off semantic/syntax validation since those toy editors are graded server-side). This is a
 * real dev workspace committing real code — real squiggly-underline diagnostics are exactly what a
 * learner needs here, not something to suppress.
 *
 * Monaco's TS compiler options are a single global per browser tab, so full simultaneous
 * frontend+backend project support isn't realistic yet — pick one preset per task based on its
 * `codingFocus` (frontend: JSX+DOM lib+ESM; backend: CommonJS+ambient Node globals via a small
 * hand-written .d.ts instead of shipping @types/node into the bundle). Revisit only if a real task
 * needs both contexts open at once.
 */
function configureCompilerOptions(monaco, codingFocus) {
  const ts = monaco.languages.typescript;
  if (!ts) return;
  const isBackend = codingFocus === "backend";
  const base = {
    target: ts.ScriptTarget.ES2020,
    allowJs: true,
    esModuleInterop: true,
    resolveJsonModule: true,
    noEmit: true,
    skipLibCheck: true,
    strict: false,
  };
  const options = isBackend
    ? { ...base, module: ts.ModuleKind.CommonJS, moduleResolution: ts.ModuleResolutionKind.NodeJs }
    : {
        ...base,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        jsx: ts.JsxEmit.ReactJSX,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
      };
  ts.typescriptDefaults.setCompilerOptions(options);
  ts.javascriptDefaults.setCompilerOptions(options);

  if (isBackend) {
    const nodeAmbient = `declare const process: any;
declare const module: any;
declare const __dirname: string;
declare const __filename: string;
declare function require(id: string): any;`;
    ts.javascriptDefaults.addExtraLib(nodeAmbient, "ts:node-ambient.d.ts");
    ts.typescriptDefaults.addExtraLib(nodeAmbient, "ts:node-ambient.d.ts");
  }
}

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr",
]);

/**
 * Monaco has no built-in JSX/HTML "auto close tag" — that's a feature of VS Code's separate
 * typescript-language-features extension, not something monaco-typescript (or @monaco-editor/react,
 * which just wraps monaco-editor core) ships. `autoClosingBrackets`/`autoClosingQuotes` below only
 * cover `()[]{}` and quotes. Hand-rolled here: on every real keystroke of `>` (onDidType only fires
 * for actual typing, not paste/undo/programmatic edits, so we never double-insert), check whether
 * the text just before the cursor completes a plain opening tag — not a closing tag, not
 * self-closing (`<br />` or a void element), not a TS generic like `useState<T>()` (the regex
 * requires `>` immediately after the tag name or after `\s+attrs`, which a generic's `<T>` or
 * `<T[]>` never satisfies) — and if so, insert the matching `</tag>` right after the cursor and
 * leave the cursor exactly where the learner left it, before the closing tag.
 */
function registerAutoCloseTag(editor, monaco) {
  return editor.onDidType((text) => {
    if (text !== ">") return;
    const model = editor.getModel();
    const position = editor.getPosition();
    if (!model || !position) return;
    if (!["typescript", "javascript", "html"].includes(model.getLanguageId())) return;

    const lineText = model.getLineContent(position.lineNumber);
    const textBeforeCursor = lineText.slice(0, position.column - 1);
    const match = textBeforeCursor.match(/<([A-Za-z][\w.:-]*)((?:\s+[^<>]*)?)>$/);
    if (!match) return;
    const [fullMatch, tagName] = match;
    if (VOID_TAGS.has(tagName.toLowerCase()) || /\/\s*>$/.test(fullMatch)) return;

    const restOfLine = lineText.slice(position.column - 1);
    if (restOfLine.startsWith(`</${tagName}>`)) return; // already closed — don't double up

    editor.executeEdits("auto-close-tag", [
      {
        range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
        text: `</${tagName}>`,
        forceMoveMarkers: true,
      },
    ]);
    editor.setPosition(position);
  });
}

/**
 * Real multi-file Monaco editor. `@monaco-editor/react`'s `path` prop already does the
 * per-file-model bookkeeping we'd otherwise have to do by hand with `monaco.editor.createModel` —
 * switching `path` reuses (or creates) that file's own model, preserving its undo stack and view
 * state, all within one live `<Editor>` instance.
 *
 * Props:
 *   openFiles   — string[] of open file paths (tab order)
 *   activePath  — currently-focused path
 *   contents    — { [path]: string } current in-memory content per open file
 *   dirtyPaths  — Set<string> of paths with unsaved changes
 *   onActivate, onClose — (path) => void
 *   onChange    — (path, newValue) => void
 *   codingFocus — "frontend" | "backend" | "both" | "" — picks the compiler-options preset
 */
export default function WorkspaceEditor({ openFiles, activePath, contents, dirtyPaths, onActivate, onClose, onChange, codingFocus }) {
  const focusRef = useRef(codingFocus);
  focusRef.current = codingFocus;
  const autoCloseDisposableRef = useRef(null);

  const handleBeforeMount = useCallback((monaco) => {
    configureCompilerOptions(monaco, focusRef.current);
  }, []);

  const handleMount = useCallback((editor, monaco) => {
    autoCloseDisposableRef.current?.dispose();
    autoCloseDisposableRef.current = registerAutoCloseTag(editor, monaco);
  }, []);

  useEffect(() => () => autoCloseDisposableRef.current?.dispose(), []);

  const activeContent = activePath != null ? contents[activePath] ?? "" : "";

  return (
    <div className="we-root">
      {openFiles.length > 0 && (
        <div className="we-tabs">
          {openFiles.map((path) => (
            <div
              key={path}
              className={`we-tab${path === activePath ? " we-tab-active" : ""}`}
              onClick={() => onActivate(path)}
              title={path}
            >
              <span className="we-tab-name">
                {path.split("/").pop()}
                {dirtyPaths.has(path) ? " •" : ""}
              </span>
              <button
                type="button"
                className="we-tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(path);
                }}
                aria-label={`Close ${path}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="we-editor-wrap">
        {activePath ? (
          <Editor
            path={activePath}
            language={languageForPath(activePath)}
            value={activeContent}
            theme="vs"
            beforeMount={handleBeforeMount}
            onMount={handleMount}
            onChange={(val) => onChange(activePath, val ?? "")}
            options={{
              ...MONACO_SHARED_OPTIONS,
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",
              fontLigatures: true,
              lineNumbers: "on",
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: "on",
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              bracketPairColorization: { enabled: true },
              guides: { bracketPairs: true },
            }}
          />
        ) : (
          <div className="we-empty">Open a file from the tree to start editing.</div>
        )}
      </div>
    </div>
  );
}
