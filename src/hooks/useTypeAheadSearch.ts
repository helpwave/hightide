import { useCallback, useEffect, useRef } from "react";
import { useEventCallbackStabilizer } from "@/src/hooks/useEventCallbackStabelizer";

export interface UseTypeAheadSearchOptions<T> {
  options: ReadonlyArray<T>;
  resetTimer: number;
  toString?: (value: T) => string;
  onResultChange: (value: T | null) => void;
}

export interface UseTypeAheadSearchReturn {
  addToTypeAhead: (str: string) => void;
  reset: () => void;
}

function defaultToString<T>(value: T): string {
  return String(value);
}

export function useTypeAheadSearch<T>({
  options,
  resetTimer,
  toString: toStringProp,
  onResultChange,
}: UseTypeAheadSearchOptions<T>): UseTypeAheadSearchReturn {
  const bufferRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toString = toStringProp ?? defaultToString;
  const toStringStable = useEventCallbackStabilizer(toString);
  const onResultChangeStable = useEventCallbackStabilizer(onResultChange);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    bufferRef.current = "";
    onResultChangeStable(null);
  }, [onResultChangeStable]);

  useEffect(() => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const addToTypeAhead = useCallback((str: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      bufferRef.current += str;
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        bufferRef.current = "";
        onResultChangeStable(null);
      }, resetTimer);

      const buf = bufferRef.current.trim().toLowerCase();
      if (!buf) {
        onResultChangeStable(null);
        return;
      }
      const found = options.find((opt) => {
        const s = toStringStable(opt)?.trim().toLowerCase() ?? "";
        return s.startsWith(buf);
      });
      onResultChangeStable(found ?? null);
  }, [options, resetTimer, toStringStable, onResultChangeStable]);

  return { addToTypeAhead, reset };
}
