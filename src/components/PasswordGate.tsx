"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { unlockApp, type UnlockState } from "@/app/auth-actions";

const DIGITS = 6;
const initialState: UnlockState = { error: null, attempt: 0 };

export function PasswordGate() {
  const formId = useId();
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: DIGITS }, () => "")
  );
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);

  const [state, formAction, pending] = useActionState(unlockApp, initialState);

  const code = digits.join("");
  const complete = code.length === DIGITS && digits.every((d) => d !== "");

  // Focus first cell on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Wrong code: shake, clear, refocus (attempt bumps every failure)
  useEffect(() => {
    if (!state.error || state.attempt === 0) return;
    submittingRef.current = false;
    setShake(true);
    setDigits(Array.from({ length: DIGITS }, () => ""));
    const t = window.setTimeout(() => {
      setShake(false);
      inputRefs.current[0]?.focus();
    }, 420);
    return () => window.clearTimeout(t);
  }, [state.error, state.attempt]);

  const setDigitAt = useCallback((index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < DIGITS - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (digits[index]) {
          setDigits((prev) => {
            const next = [...prev];
            next[index] = "";
            return next;
          });
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          setDigits((prev) => {
            const next = [...prev];
            next[index - 1] = "";
            return next;
          });
        }
        e.preventDefault();
        return;
      }

      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
        e.preventDefault();
      }
      if (e.key === "ArrowRight" && index < DIGITS - 1) {
        inputRefs.current[index + 1]?.focus();
        e.preventDefault();
      }
    },
    [digits]
  );

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, DIGITS);
    if (!pasted) return;

    const next = Array.from({ length: DIGITS }, (_, i) => pasted[i] ?? "");
    setDigits(next);
    const focusAt = Math.min(pasted.length, DIGITS - 1);
    inputRefs.current[focusAt]?.focus();
  }, []);

  // Auto-submit once six digits are in
  useEffect(() => {
    if (!complete || pending || submittingRef.current) return;
    submittingRef.current = true;
    formRef.current?.requestSubmit();
  }, [complete, pending]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!complete) {
      e.preventDefault();
    }
  };

  return (
    <main
      id="main"
      className="relative min-h-dvh flex flex-col items-center justify-center px-5 py-16"
    >
      <div className="access-stamp w-full max-w-md">
        <header className="access-stamp__head">
          <p className="label-micro">Private ledger</p>
          <h1 className="font-mono text-5xl sm:text-6xl font-bold uppercase tracking-[0.2em] leading-none mt-3">
            GAME
          </h1>
          <div className="access-stamp__rule" aria-hidden />
        </header>

        <form
          ref={formRef}
          id={formId}
          action={formAction}
          onSubmit={onSubmit}
          className="access-stamp__body"
          aria-describedby={state.error ? `${formId}-error` : undefined}
        >
          <input type="hidden" name="password" value={code} />

          <fieldset className="border-0 p-0 m-0" disabled={pending}>
            <legend className="label-micro mb-4">Access code</legend>

            <div
              className={`access-digits ${shake ? "access-digits--shake" : ""}`}
              role="group"
              aria-label="Six-digit access code"
            >
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  name={`digit-${i}`}
                  maxLength={1}
                  value={digit}
                  aria-label={`Digit ${i + 1} of ${DIGITS}`}
                  className="access-digit"
                  onChange={(e) => setDigitAt(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
          </fieldset>

          {state.error ? (
            <p
              id={`${formId}-error`}
              role="alert"
              className="access-error mt-5"
            >
              {state.error}
            </p>
          ) : (
            <p className="mt-5 text-sm text-muted">
              Six digits. Opens the ledger.
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary mt-8 w-full sm:w-auto min-w-[10rem]"
            disabled={!complete || pending}
          >
            {pending ? "Opening…" : "Open ledger"}
          </button>
        </form>
      </div>
    </main>
  );
}
