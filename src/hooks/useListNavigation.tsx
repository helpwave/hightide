import { useCallback, useMemo } from "react";
import { useControlledState } from "@/src/hooks/useControlledState";

export interface ListNavigationReturn {
  highlightedId: string | null;
  highlight: (id: string) => void;
  first: () => void;
  last: () => void;
  next: () => void;
  previous: () => void;
}

export interface ListNavigationOptions {
  options: ReadonlyArray<string>;
  value?: string | null;
  onValueChange?: (highlightedId: string | null) => void;
  initialValue?: string | null;
}

export function useListNavigation({
  options,
  value,
  onValueChange,
  initialValue,
}: ListNavigationOptions): ListNavigationReturn {
  const [highlightedId, setHighlightedId] = useControlledState<string | null>({
    value,
    onValueChange,
    defaultValue: initialValue,
  });

  const resolvedHighlightId = useMemo(() => {
    if (options.length === 0) return null;
    if (highlightedId != null && options.includes(highlightedId)) {
      return highlightedId;
    }
    return options[0] ?? null;
  }, [options, highlightedId]);

  const highlight = useCallback((id: string) => {
    if (!options.includes(id)) return;
    setHighlightedId(id);
  }, [options, setHighlightedId])

  const next = useCallback(() => {
    if (options.length <= 1 || resolvedHighlightId === null) return;
    const idx = options.indexOf(resolvedHighlightId);
    const nextIdx = idx < 0 ? 0 : (idx + 1) % options.length;
    setHighlightedId(options[nextIdx]);
  }, [options, resolvedHighlightId, setHighlightedId]);

  const previous = useCallback(() => {
    if (options.length <= 1 || resolvedHighlightId === null) return;
    const idx = options.indexOf(resolvedHighlightId);
    const previousIdx =
      idx <= 0
      ? options.length - 1
      : (idx - 1 + options.length) % options.length;
    setHighlightedId(options[previousIdx]);
  }, [options, resolvedHighlightId, setHighlightedId]);

  const first = useCallback(() => {
    if (options.length <= 1 || resolvedHighlightId === null) return;
    setHighlightedId(options[0]);
  }, [options, resolvedHighlightId, setHighlightedId]);

  const last = useCallback(() => {
    if (options.length <= 1 || resolvedHighlightId === null) return;
    setHighlightedId(options[options.length - 1]);
  }, [options, resolvedHighlightId, setHighlightedId]);

  return useMemo((): ListNavigationReturn => ({
    highlightedId: resolvedHighlightId,
    highlight,
    first,
    last,
    next,
    previous,
  }), [resolvedHighlightId, highlight, first, last, next, previous]);
}
