import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Finish Google OAuth on any route that lands with ?loginCode= (Apply, Workbench, App `/`, …).
 * Returns true while the exchange is in flight.
 */
export function useConsumeLoginCode(refresh) {
  const [searchParams, setSearchParams] = useSearchParams();
  const loginCode = searchParams.get("loginCode");
  const authError = searchParams.get("authError");
  const [exchanging, setExchanging] = useState(Boolean(loginCode));

  useEffect(() => {
    if (authError) {
      setSearchParams(
        (p) => {
          p.delete("authError");
          return p;
        },
        { replace: true }
      );
      setExchanging(false);
      return;
    }
    if (!loginCode) {
      setExchanging(false);
      return;
    }

    setExchanging(true);
    fetch("/api/auth/exchange-login-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: loginCode }),
    })
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(async ({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Sign-in link expired");
        if (typeof refresh === "function") await refresh();
        else await fetch("/api/auth/me").catch(() => null);
      })
      .catch((err) => {
        console.error("[auth] loginCode exchange failed:", err.message);
      })
      .finally(() => {
        setExchanging(false);
        setSearchParams(
          (p) => {
            p.delete("loginCode");
            return p;
          },
          { replace: true }
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- consume whatever code is in the URL at mount
  }, []);

  return exchanging;
}
