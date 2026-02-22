import clsx from "clsx";
import { CheckIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode, RefObject } from "react";
import { createContext, forwardRef, useContext, useEffect, useRef } from "react";
import type { MultiSelectIconAppearance } from "./MultiSelectContext";
import { useMultiSelectContext } from "./MultiSelectContext";

export type MultiSelectOptionDisplayLocation = "trigger" | "list";

export const MultiSelectOptionDisplayContext =
  createContext<MultiSelectOptionDisplayLocation | null>(null);

export function useMultiSelectOptionDisplayLocation(): MultiSelectOptionDisplayLocation {
  const context = useContext(MultiSelectOptionDisplayContext);
  if (!context) {
    throw new Error(
      "useMultiSelectOptionDisplayLocation must be used within a MultiSelectOptionDisplayContext"
    );
  }
  return context;
}

export interface MultiSelectOptionProps extends Omit<HTMLAttributes<HTMLLIElement>, "children"> {
  value: string;
  label: string;
  disabled?: boolean;
  iconAppearance?: MultiSelectIconAppearance;
  children?: ReactNode;
}

export const MultiSelectOption = forwardRef<HTMLLIElement, MultiSelectOptionProps>(function MultiSelectOption(
  { children, label, value, disabled = false, iconAppearance, className, ...restProps },
  ref
) {
  const { state, item, iconAppearance: ctxIconAppearance } = useMultiSelectContext();
  const { register, toggleSelection, highlightItem } = item;
  const itemRef = useRef<HTMLLIElement>(null);

  const display: ReactNode = children ?? label;
  const iconAppearanceResolved = iconAppearance ?? ctxIconAppearance;

  useEffect(() => {
    return register({
      value,
      label,
      display,
      disabled,
      ref: itemRef as React.RefObject<HTMLElement>,
    });
  }, [value, label, disabled, register, display]);

  const isHighlighted = state.highlightedValue === value;
  const isSelected = state.value.includes(value);
  const isVisible = state.visibleOptions.some((opt) => opt.value === value);

  return (
    <li
      {...restProps}
      ref={(node) => {
        itemRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node;
      }}
      id={value}
      role="option"
      aria-disabled={disabled}
      aria-selected={isSelected}
      aria-hidden={!isVisible}
      data-highlighted={isHighlighted ? "" : undefined}
      data-selected={isSelected ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-visible={isVisible ? "" : undefined}
      className={clsx(
        "flex-row-1 items-center px-2 py-1 rounded-md",
        "data-highlighted:bg-primary/20",
        "data-disabled:text-disabled data-disabled:cursor-not-allowed",
        "not-data-disabled:cursor-pointer",
        !isVisible && "hidden",
        className
      )}
      onClick={(event) => {
        if (!disabled) {
          toggleSelection(value);
          restProps.onClick?.(event);
        }
      }}
      onMouseEnter={(event) => {
        if (!disabled) {
          highlightItem(value);
          restProps.onMouseEnter?.(event);
        }
      }}
    >
      {iconAppearanceResolved === "left" && (
        <CheckIcon
          className={clsx("w-4 h-4", { "opacity-0": !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
      <MultiSelectOptionDisplayContext.Provider value="list">
        {display}
      </MultiSelectOptionDisplayContext.Provider>
      {iconAppearanceResolved === "right" && (
        <CheckIcon
          className={clsx("w-4 h-4", { "opacity-0": !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
    </li>
  );
});
