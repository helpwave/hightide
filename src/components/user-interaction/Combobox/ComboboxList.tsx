import type { HTMLAttributes, RefObject } from "react";
import { forwardRef, useEffect, useRef } from "react";
import clsx from "clsx";
import { useComboboxContext } from "./ComboboxContext";
import { useHightideTranslation } from "@/src/i18n/useHightideTranslation";

export interface ComboboxListProps extends HTMLAttributes<HTMLUListElement> {}

export const ComboboxList = forwardRef<HTMLUListElement, ComboboxListProps>(
  function ComboboxList({ children, ...props }, ref) {
    const translation = useHightideTranslation();
    const context = useComboboxContext();
    const innerRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
      return context.layout.registerList(innerRef as RefObject<HTMLUListElement | null>);
    }, [context.layout.registerList]);

    const setRefs = (node: HTMLUListElement | null) => {
      (innerRef as RefObject<HTMLUListElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as RefObject<HTMLUListElement | null>).current = node;
    };

    const count = context.visibleOptionIds.length;

    return (
      <ul
        {...props}
        ref={setRefs}
        id={context.config.ids.listbox}
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
