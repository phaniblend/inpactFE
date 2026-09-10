import { useEffect, useRef, useState } from "react";
import "./GuidedTour.css";

/**
 * The reusable cinematic guided-tour engine — chrome + orchestration only. All product-specific
 * content (the mock UI, and each chapter's own DOM mutations) lives in a per-product file like
 * MiniERPTour.jsx, which supplies `renderStage` (the mock UI, wiring named refs via `reg(name)`)
 * and `chapters` (each with title/caption/narration/setup(refs)/run(sId, helpers)).
 *
 * Deliberately imperative for the animated bits (cursor position, highlight-box geometry, ledger
 * entries sliding in) — same choice the original hand-authored version made: CSS transitions read
 * DOM style changes, not React re-renders, so those particular mutations go straight through refs
 * rather than through state. Chapter/caption/play-pause UI state is ordinary React state since none
 * of that needs to animate smoothly frame-by-frame.
 *
 * Narration uses the real Web Speech API (window.speechSynthesis) — gracefully absent (silently
 * skipped) wherever it isn't available, exactly like the original.
 */
export default function GuidedTour({ renderStage, chapters, autoStart = false }) {
  const stageRef = useRef(null);
  const highlightRef = useRef(null);
  const cursorRef = useRef(null);
  const elRefs = useRef({});
  const sessionRef = useRef(0);
  const pausedRef = useRef(false);
  const voiceRef = useRef(null);

  const [caption, setCaption] = useState('Select a chapter below or click "Start Tour" to begin.');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeChapter, setActiveChapter] = useState(-1);
  const [playLabel, setPlayLabel] = useState("Start Tour");

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    function loadVoices() {
      const voices = synth.getVoices();
      voiceRef.current =
        voices.find((v) => /Natural|Guy|David|Male/.test(v.name) && v.lang.startsWith("en")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        null;
    }
    loadVoices();
    synth.onvoiceschanged = loadVoices;
    return () => {
      synth.cancel();
    };
  }, []);

  function register(name) {
    return (node) => {
      elRefs.current[name] = node;
    };
  }

  function highlightElement(name, styleClass = "", padding = 6) {
    const el = elRefs.current[name];
    const box = highlightRef.current;
    const stage = stageRef.current;
    if (!el || !box || !stage) return;
    const stageRect = stage.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    box.className = "gt-highlight" + (styleClass ? ` ${styleClass}` : "");
    box.style.top = `${elRect.top - stageRect.top - padding}px`;
    box.style.left = `${elRect.left - stageRect.left - padding}px`;
    box.style.width = `${elRect.width + padding * 2}px`;
    box.style.height = `${elRect.height + padding * 2}px`;
    box.classList.add("active");
  }

  function clearHighlight() {
    if (highlightRef.current) highlightRef.current.classList.remove("active");
  }

  function moveCursorTo(x, y, duration = 1000) {
    return new Promise((resolve) => {
      const cur = cursorRef.current;
      if (!cur) return resolve();
      cur.style.transition = `transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      cur.style.transform = `translate(${x}px, ${y}px)`;
      setTimeout(resolve, duration);
    });
  }

  /** Moves the cursor to a real, measured position near a named element — robust to layout, unlike
   * hardcoded pixel coordinates tuned to one exact stage size. `offsetX`/`offsetY` nudge it off the
   * element's top-left corner (e.g. toward its center or just past its edge). */
  function moveCursorToRef(name, offsetX = 16, offsetY = 16, duration = 1000) {
    const el = elRefs.current[name];
    const stage = stageRef.current;
    if (!el || !stage) return Promise.resolve();
    const stageRect = stage.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return moveCursorTo(elRect.left - stageRect.left + offsetX, elRect.top - stageRect.top + offsetY, duration);
  }

  function speakText(text, sId) {
    return new Promise((resolve, reject) => {
      const synth = window.speechSynthesis;
      if (!synth) return resolve();
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utter.voice = voiceRef.current;
      utter.pitch = 0.95;
      utter.rate = 0.95;
      utter.onend = () => (sId === sessionRef.current ? resolve() : reject("CANCELED"));
      utter.onerror = () => (sId === sessionRef.current ? resolve() : reject("CANCELED"));
      synth.speak(utter);
    });
  }

  function sleep(ms, sId) {
    return new Promise((resolve, reject) => {
      const interval = 50;
      let elapsed = 0;
      const timer = setInterval(() => {
        if (sId !== sessionRef.current) {
          clearInterval(timer);
          reject("CANCELED");
          return;
        }
        if (!pausedRef.current) {
          elapsed += interval;
          if (elapsed >= ms) {
            clearInterval(timer);
            resolve();
          }
        }
      }, interval);
    });
  }

  const helpers = { highlightElement, clearHighlight, moveCursorTo, moveCursorToRef, speakText, sleep };

  async function executeFlowFrom(index) {
    const thisSession = ++sessionRef.current;
    pausedRef.current = false;
    setIsPaused(false);
    setIsRunning(true);
    setPlayLabel("Restart Tour");

    for (let i = index; i < chapters.length; i++) {
      if (thisSession !== sessionRef.current) return;
      setActiveChapter(i);
      setCaption(chapters[i].caption);
      try {
        chapters[i].setup(elRefs.current);
        await chapters[i].run(thisSession, helpers, elRefs.current);
      } catch (e) {
        if (e === "CANCELED") return;
      }
    }

    if (thisSession === sessionRef.current) {
      setCaption("Tour complete. Choose any chapter to replay or restart.");
      setIsRunning(false);
      setPlayLabel("Start Tour");
      setActiveChapter(-1);
    }
  }

  function togglePlayTour() {
    executeFlowFrom(0);
  }

  // Fires once, only when a caller (the curiosity-nudge modal) asks for it — the standalone
  // overview page and lesson-intro embed still start on a deliberate click, same as always.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStart && !autoStartedRef.current) {
      autoStartedRef.current = true;
      executeFlowFrom(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  function togglePause() {
    if (!isRunning) return;
    const synth = window.speechSynthesis;
    if (!isPaused) {
      pausedRef.current = true;
      setIsPaused(true);
      synth?.pause();
    } else {
      pausedRef.current = false;
      setIsPaused(false);
      synth?.resume();
    }
  }

  function jumpToChapter(idx) {
    executeFlowFrom(idx);
  }

  return (
    <div className="gt-wrapper">
      <div className="gt-stage" ref={stageRef}>
        <div className="gt-highlight" ref={highlightRef} />
        {renderStage(register)}
        <div className="gt-cursor" ref={cursorRef}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="gt-tray">
        <div className="gt-tray-row">
          <div className="gt-captions">{caption}</div>
          <div className="gt-btn-group">
            <button type="button" className="gt-ctl-btn gt-ctl-btn-secondary" onClick={togglePause} disabled={!isRunning}>
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button type="button" className="gt-ctl-btn" onClick={togglePlayTour}>
              {isRunning ? "↺" : "▶"} {playLabel}
            </button>
          </div>
        </div>
        <div className="gt-chapter-bar">
          <span className="gt-chapter-label">Jump to:</span>
          {chapters.map((c, i) => (
            <button
              key={c.title}
              type="button"
              className={`gt-chapter-btn${activeChapter === i ? " active" : ""}`}
              onClick={() => jumpToChapter(i)}
            >
              {i + 1}. {c.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
