import type { RefObject } from "react";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DOMUtils } from "@/src/utils/dom";
import { useControlledState } from "@/src/hooks/useControlledState";

export interface HighlightOption {
  id: string;
  disabled: boolean;
  ref: RefObject<HTMLElement>;
}

export interface HighlightContextType {
  highlightedId: string | null;
  highlightedOption: HighlightOption | null;
  options: ReadonlyArray<HighlightOption>;
  highlight: (id: string) => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  registerOption: (option: HighlightOption) => () => void;
}

export const HighlightContext = createContext<HighlightContextType | null>(null);

export function useHighlightContext(): HighlightContextType {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error("useHighlightContext must be used within a HighlightProvider");
  }
  return context;
}

function sortOptionsByDomPosition(options: HighlightOption[]): HighlightOption[] {
  return [...options].sort((a, b) =>
    DOMUtils.compareDocumentPosition(a.ref?.current, b.ref?.current)
  );
}

function firstEnabledId(options: ReadonlyArray<HighlightOption>): string | null {
  const opt = options.find((o) => !o.disabled);
  return opt?.id ?? null;
}

export interface HighlightProviderProps {
  children: ReactNode;
  value?: null;
  onHighlightChange?: (highlightedId: string) => void;
  initialHighlightId?: string;
}

export function HighlightProvider({ children, value, onHighlightChange, initialHighlightId }: HighlightProviderProps) {
  const [options, setOptions] = useState<HighlightOption[]>([]);
  const [highlightedId, setHighlightedId] = useControlledState<string | null>({
    value: value,
    onValueChange: onHighlightChange,
    defaultValue: initialHighlightId,
  });

  const sortedOptions = useMemo(() => sortOptionsByDomPosition(options), [options]);

  const resolveHighlightId = useCallback((opts: ReadonlyArray<HighlightOption>, currentId: string | null): string | null => {
      if (opts.length === 0) return null;
      const defaultId =
        initialHighlightId && opts.some((o) => o.id === initialHighlightId && !o.disabled)
          ? initialHighlightId
          : null;
      const candidate = defaultId ?? firstEnabledId(opts);
      if (currentId && opts.some((o) => o.id === currentId && !o.disabled)) return currentId;
      return candidate;
    },
    [initialHighlightId]
  );

  useEffect(() => {
    const next = resolveHighlightId(sortedOptions, highlightedId);
    if (next !== highlightedId) setHighlightedId(next);
  }, [sortedOptions, highlightedId, resolveHighlightId]);

  const registerOption = useCallback((option: HighlightOption) => {
    setOptions((prev) => sortOptionsByDomPosition([...prev, option]));
    return () => setOptions((prev) => prev.filter((o) => o.id !== option.id));
  }, []);

  const highlight = useCallback(
    (id: string) => {
      if (!sortedOptions.some((o) => o.id === id && !o.disabled)) return;
      setHighlightedId(id);
    },
    [sortedOptions]
  );

  const enabledOptions = useMemo(
    () => sortedOptions.filter((o) => !o.disabled),
    [sortedOptions]
  );

  const highlightNext = useCallback(() => {
    if (enabledOptions.length <= 1) return;
    const idx = enabledOptions.findIndex((o) => o.id === highlightedId);
    const nextIdx = idx < 0 ? 0 : (idx + 1) % enabledOptions.length;
    setHighlightedId(enabledOptions[nextIdx].id);
  }, [enabledOptions, highlightedId]);

  const highlightPrevious = useCallback(() => {
    if (enabledOptions.length <= 1) return;
    const idx = enabledOptions.findIndex((o) => o.id === highlightedId);
    const nextIdx =
      idx <= 0 ? enabledOptions.length - 1 : (idx - 1 + enabledOptions.length) % enabledOptions.length;
    setHighlightedId(enabledOptions[nextIdx].id);
  }, [enabledOptions, highlightedId]);

  const highlightedOption = useMemo(
    () => sortedOptions.find((o) => o.id === highlightedId),
    [sortedOptions, highlightedId]
  );

  const contextValue = useMemo(
    (): HighlightContextType => ({
      highlightedId,
      highlightedOption: highlightedOption ?? null,
      options: sortedOptions,
      highlight,
      highlightNext,
      highlightPrevious,
      registerOption,
    }),
    [
      highlightedId,
      highlightedOption,
      sortedOptions,
      highlight,
      highlightNext,
      highlightPrevious,
      registerOption,
    ]
  );

  return (
    <HighlightContext.Provider value={contextValue}>
      {children}
    </HighlightContext.Provider>
  );
}
