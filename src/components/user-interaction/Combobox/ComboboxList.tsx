import type { HTMLAttributes, RefObject } from "react";
import { forwardRef, useCallback } from "react";
import clsx from "clsx";
import { useComboboxContext } from "./ComboboxContext";
import { useHightideTranslation } from "@/src/i18n/useHightideTranslation";

export interface ComboboxListProps extends HTMLAttributes<HTMLUListElement> {}

export const ComboboxList = forwardRef<HTMLUListElement, ComboboxListProps>(
  function ComboboxList({ children, ...props }, ref) {
    const translation = useHightideTranslation();
    const { ids, listRef, visibleOptions } = useComboboxContext();

    const setRefs = useCallback((node: HTMLUListElement | null) => {
      (listRef as RefObject<HTMLUListElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as RefObject<HTMLUListElement | null>).current = node;
    }, [ref, listRef]);

    const count = visibleOptions.length;

    return (
      <ul
        {...props}
        ref={setRefs}
        id={ids.listbox}
        role="listbox"
        aria-label={translation("filterOptions")}
        tabIndex={-1}
        data-name="combobox-list"
      >
        {children}
        <li
          role="option"
          aria-selected={false}
          aria-disabled={true}
          aria-live="polite"
          aria-atomic={true}
          data-name="combobox-list-status"
          className={clsx({ "sr-only": count > 0 })}
        >
          {translation("nResultsFound", { count })}
        </li>
      </ul>
    );
  }
);
