import type { ComponentProps } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useSelectContext } from "./SelectContext";
import clsx from "clsx";
import { useHightideTranslation } from "@/src/i18n/useHightideTranslation";
import { PopUp, type PopUpProps } from "@/src/components/layout/popup/PopUp";
import { Input } from "@/src/components/user-interaction/input/Input";
import { Visibility } from "@/src/components/layout/Visibility";

export interface SelectContentProps extends PopUpProps {
  showSearch?: boolean;
  searchInputProps?: Omit<ComponentProps<typeof Input>, "value" | "onValueChange">;
}

export const SelectContent = forwardRef<HTMLUListElement, SelectContentProps>(function SelectContent<T>({
  id, options, showSearch: showSearchOverride, searchInputProps, ...props
}, ref) {
  const translation = useHightideTranslation();
  const innerRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current!);

  const context = useSelectContext<T>();

  useEffect(() => {
    if (id) context.config.setIds((prev) => ({ ...prev, content: id }));
  }, [id, context.config.setIds]);

  const showSearch = showSearchOverride ?? context.search.hasSearch;
  const listboxAriaLabel = showSearch ? translation("searchResults") : undefined;

  const keyHandler = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          context.highlightNext();
          event.preventDefault();
          break;
        case "ArrowUp":
          context.highlightPrevious();
          event.preventDefault();
          break;
        case "Home":
          event.preventDefault();
          context.highlightFirst();
          break;
        case "End":
          event.preventDefault();
          context.highlightLast();
          break;
        case "Enter":
        case " ":
          if (showSearch && event.key === " ") return;
          if (context.highlightedId) {
            context.toggleSelection(context.highlightedId);
            event.preventDefault();
          }
          break;
        default:
          if (!showSearch && !event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
            if (context.handleTypeaheadKey(event.key)) {
              event.preventDefault();
            }
          }
          break;
      }
    },
    [showSearch, context]
  );

  return (
    <PopUp
      {...props}
      id={context.config.ids.content}
      isOpen={context.isOpen}
      anchor={context.layout.triggerRef}
      options={options}
      forceMount={true}
      onClose={() => {
        context.setIsOpen(false);
        props.onClose?.();
      }}
      aria-labelledby={context.config.ids.trigger}
      className={clsx("gap-y-1", props.className)}
    >
      {showSearch && (
        <Input
          {...searchInputProps}
          ref={searchInputRef}
          id={context.config.ids.searchInput}
          value={context.search.searchQuery}
          onValueChange={context.search.setSearchQuery}
          onKeyDown={keyHandler}
          placeholder={searchInputProps?.placeholder ?? translation("filterOptions")}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={context.isOpen}
          aria-controls={context.config.ids.listbox}
          aria-activedescendant={
            context.highlightedId ? context.config.ids.listbox + "-" + context.highlightedId : undefined
          }
          aria-label={searchInputProps?.["aria-label"] ?? translation("filterOptions")}
          className={clsx("mx-2 mt-2 shrink-0", searchInputProps?.className)}
        />
      )}
      <ul
        ref={innerRef}
        id={context.config.ids.listbox}
        onKeyDown={showSearch ? undefined : keyHandler}
        role="listbox"
        aria-multiselectable={false}
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
            className={clsx({ "sr-only": context.visibleOptionIds.length > 0 })}
          >
            {translation("nResultsFound", { count: context.visibleOptionIds.length })}
          </li>
        </Visibility>
      </ul>
    </PopUp>
  );
});
