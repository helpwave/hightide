import type { ComponentProps } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useMultiSelectContext } from "./MultiSelectContext";
import clsx from "clsx";
import { useHightideTranslation } from "@/src/i18n/useHightideTranslation";
import { PopUp, type PopUpProps } from "@/src/components/layout/popup/PopUp";
import { Input } from "@/src/components/user-interaction/input/Input";
import { Visibility } from "@/src/components/layout/Visibility";

const TYPEAHEAD_RESET_MS = 500;

export interface MultiSelectContentProps extends PopUpProps {
  showSearch?: boolean;
  searchInputProps?: Omit<ComponentProps<typeof Input>, "value" | "onValueChange">;
}

export const MultiSelectContent = forwardRef<HTMLUListElement, MultiSelectContentProps>(
  function MultiSelectContent(
    { id, options, showSearch: showSearchOverride, searchInputProps, ...props },
    ref
  ) {
    const translation = useHightideTranslation();
    const innerRef = useRef<HTMLUListElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const typeAheadBufferRef = useRef("");
    const typeAheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useImperativeHandle(ref, () => innerRef.current!);

    const { trigger, state, item, ids, setIds, search } = useMultiSelectContext();

    useEffect(() => {
      if (id) setIds((prev) => ({ ...prev, content: id }));
    }, [id, setIds]);

    useEffect(() => {
      if (!state.isOpen) {
        typeAheadBufferRef.current = "";
        if (typeAheadTimeoutRef.current) {
          clearTimeout(typeAheadTimeoutRef.current);
          typeAheadTimeoutRef.current = null;
        }
      }
    }, [state.isOpen]);

    useEffect(
      () => () => {
        if (typeAheadTimeoutRef.current) clearTimeout(typeAheadTimeoutRef.current);
      },
      []
    );

    const showSearch = showSearchOverride ?? search.showSearch;
    const listboxAriaLabel = showSearch ? translation("searchResults") : undefined;

    const keyHandler = useCallback(
      (event: React.KeyboardEvent) => {
        switch (event.key) {
          case "ArrowDown":
            item.moveHighlightedIndex(1);
            event.preventDefault();
            break;
          case "ArrowUp":
            item.moveHighlightedIndex(-1);
            event.preventDefault();
            break;
          case "Home":
            event.preventDefault();
            item.highlightFirst();
            break;
          case "End":
            event.preventDefault();
            item.highlightLast();
            break;
          case "Enter":
          case " ":
            if (showSearch && event.key === " ") return;
            if (state.highlightedValue) {
              item.toggleSelection(state.highlightedValue);
              event.preventDefault();
            }
            break;
          default:
            if (!showSearch && !event.ctrlKey && !event.metaKey && !event.altKey) {
              const char = event.key.toLowerCase();
              if (typeAheadTimeoutRef.current) clearTimeout(typeAheadTimeoutRef.current);
              typeAheadBufferRef.current += char;
              typeAheadTimeoutRef.current = setTimeout(() => {
                typeAheadBufferRef.current = "";
              }, TYPEAHEAD_RESET_MS);
              const opts = state.visibleOptions;
              const buf = typeAheadBufferRef.current;
              if (opts.length === 0) {
                event.preventDefault();
                return;
              }
              const currentIndex = opts.findIndex((o) => o.value === state.highlightedValue);
              const startFrom = currentIndex >= 0 ? (currentIndex + 1) % opts.length : 0;
              for (let i = 0; i < opts.length; i++) {
                const j = (startFrom + i) % opts.length;
                if (!opts[j].disabled && opts[j].label.toLowerCase().startsWith(buf)) {
                  item.highlightItem(opts[j].value);
                  event.preventDefault();
                  return;
                }
              }
              event.preventDefault();
            }
            break;
        }
      },
      [showSearch, state.visibleOptions, state.highlightedValue, item]
    );

    return (
      <PopUp
        {...props}
        id={ids.content}
        isOpen={state.isOpen}
        anchor={trigger.ref}
        options={options}
        forceMount={true}
        onClose={() => {
          trigger.toggleOpen(false);
          props.onClose?.();
        }}
        aria-labelledby={ids.trigger}
        className="gap-y-1"
      >
        {showSearch && (
          <Input
            {...searchInputProps}
            ref={searchInputRef}
            id={ids.searchInput}
            value={search.searchQuery}
            onValueChange={search.setSearchQuery}
            onKeyDown={keyHandler}
            placeholder={searchInputProps?.placeholder ?? translation("filterOptions")}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={state.isOpen}
            aria-controls={ids.listbox}
            aria-activedescendant={
              state.highlightedValue ? ids.listbox + "-" + state.highlightedValue : undefined
            }
            aria-label={searchInputProps?.["aria-label"] ?? translation("filterOptions")}
            className={clsx("mx-2 mt-2 shrink-0", searchInputProps?.className)}
          />
        )}
        <ul
          ref={innerRef}
          id={ids.listbox}
          onKeyDown={showSearch ? undefined : keyHandler}
          role="listbox"
          aria-multiselectable={true}
          aria-orientation="vertical"
          aria-label={listboxAriaLabel}
          tabIndex={showSearch ? undefined : 0}
          className={clsx("flex-col-1 p-2 overflow-auto")}
        >
          {props.children}
          <Visibility isVisible={showSearch}>
            <li
              role="option"
              aria-selected={false}
              aria-disabled={true}
              aria-live="polite"
              aria-atomic={true}
              data-name="select-list-status"
              className={clsx({ "sr-only": state.visibleOptions.length > 0 })}
            >
              {translation("nResultsFound", { count: state.visibleOptions.length })}
            </li>
          </Visibility>
        </ul>
      </PopUp>
    );
  }
);
