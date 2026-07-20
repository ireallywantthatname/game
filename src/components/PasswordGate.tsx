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

/**
 * Minimal access overlay — floats over the empty ledger shell.
 * Six digit cells only; auto-submits when complete.
 */
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

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (!state.error || state.attempt === 0) return;
    submittingRef.current = false;
    setShake(true);
    setDigits(Array.from({ length: DIGITS }, () => ""));
    const t = window.setTimeout(() => {
      setShake(false);
      inputRefs.current[0]?.focus();
    }, 240);
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

  useEffect(() => {
    if (!complete || pending || submittingRef.current) return;
    submittingRef.current = true;
    formRef.current?.requestSubmit();
  }, [complete, pending]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!complete) e.preventDefault();
  };

  return (
    <div
      className="access-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-label`}
    >
      <form
        ref={formRef}
        id={formId}
        action={formAction}
        onSubmit={onSubmit}
        className="access-panel"
        aria-describedby={state.error ? `${formId}-error` : undefined}
      >
        <input type="hidden" name="password" value={code} />

        <p id={`${formId}-label`} className="label-micro mb-3">
          Code
        </p>

        <fieldset className="border-0 p-0 m-0 min-w-0" disabled={pending}>
          <legend className="sr-only">Six-digit access code</legend>

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

        <p
          id={`${formId}-error`}
          role={state.error ? "alert" : undefined}
          className={`access-status ${state.error ? "access-status--error" : ""}`}
        >
          {pending
            ? "Opening…"
            : state.error
              ? state.error
              : "\u00a0"}
        </p>
      </form>
    </div>
  );
}
