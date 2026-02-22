import type { HTMLAttributes, ReactNode, RefObject } from "react";
import { forwardRef, useEffect, useId, useRef } from "react";
import clsx from "clsx";
import { useComboboxContext } from "./ComboboxContext";

export interface ComboboxOptionProps<T = string> extends HTMLAttributes<HTMLLIElement> {
  value: T;
  label: string;
  disabled?: boolean;
  children?: ReactNode;
}

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>( function ComboboxOption<T = string>({
  children,
  value,
  label,
  disabled = false,
  className,
  ...restProps 
}, ref) {
  const id = useId();
  const {
    visibleOptions,
    registerOption,
    highlighting,
    onItemClick,
  } = useComboboxContext<T>();
  const itemRef = useRef<HTMLLIElement>(null);

  const resolvedDisplay = children ?? label;

  useEffect(() => {
    return registerOption({
      id,
      value,
      label,
      display: resolvedDisplay,
      disabled,
      ref: itemRef,
    });
  }, [value, label, resolvedDisplay, disabled, registerOption]);

  const isVisible = visibleOptions.some((o) => o.value === value);
  const highlighted = highlighting.value === id;

  return (
    <li
      {...restProps}
      ref={(node) => {
        itemRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node;
      }}
      id={id}
      role="option"
      aria-selected={highlighted}
      aria-hidden={!isVisible}
      data-name="combobox-option"
      data-highlighted={highlighted ? "" : undefined}
      data-visible={isVisible ? "" : undefined}
      className={clsx(!isVisible && "hidden", className)}
      onClick={(event) => {
        onItemClick(value);
        restProps.onClick?.(event);
      }}
      onMouseEnter={(event) => {
        highlighting.setValue(value);
        restProps.onMouseEnter?.(event);
      }}
    >
      {resolvedDisplay}
    </li>
  );
})

ComboboxOption.displayName = "ComboboxOption";
