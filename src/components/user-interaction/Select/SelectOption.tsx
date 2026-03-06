import clsx from "clsx";
import { CheckIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode, RefObject } from "react";
import { createContext, forwardRef, useContext, useEffect, useId, useRef } from "react";
import type { SelectIconAppearance } from "./SelectContext";
import { useSelectContext } from "./SelectContext";

export type SelectOptionDisplayLocation = "trigger" | "list";

export const SelectOptionDisplayContext = createContext<SelectOptionDisplayLocation | null>(null);

export function useSelectOptionDisplayLocation(): SelectOptionDisplayLocation {
  const context = useContext(SelectOptionDisplayContext);
  if (!context) {
    throw new Error("useSelectOptionDisplayLocation must be used within a SelectOptionDisplayContext");
  }
  return context;
}

export interface SelectOptionProps<T = string> extends HTMLAttributes<HTMLLIElement> {
  value: T;
  label: string;
  disabled?: boolean;
  iconAppearance?: SelectIconAppearance;
}

export const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps<unknown>>(function SelectOption<T = string>({
  children,
  label,
  value,
  disabled = false,
  iconAppearance,
  className,
  ...props
}: SelectOptionProps<T>, ref) {
  const context= useSelectContext<T>();
  const itemRef = useRef<HTMLLIElement>(null);

  const display: ReactNode = children ?? label;
  const iconAppearanceResolved = iconAppearance ?? context.config.iconAppearance;
  
  const generatedId = useId();
  const optionId = props?.id ?? "select-option-" + generatedId;

  useEffect(() => {
    return context.registerOption({
      id: optionId,
      value,
      label,
      display,
      disabled: disabled,
      ref: itemRef as React.RefObject<HTMLElement>,
    });
  }, [value, label, disabled, context.registerOption, display]);

  const isHighlighted = context.highlightedId === optionId;
  const isSelected = context.selectedId === optionId;
  const isVisible = context.visibleOptionIds.includes(optionId);

  return (
    <li
      {...props}
      ref={(node) => {
        itemRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node;
      }}
      id={optionId}
      hidden={!isVisible}
      role="option"
      aria-disabled={disabled}
      aria-selected={isSelected}
      aria-hidden={!isVisible}

      data-name="select-list-option"
      data-highlighted={isHighlighted ? "" : undefined}
      data-selected={isSelected ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-visible={isVisible ? "" : undefined}

      onClick={(event) => {
        if (!disabled) {
          context.toggleSelection(optionId);
          props.onClick?.(event);
        }
      }}
      onMouseEnter={(event) => {
        if (!disabled) {
          context.highlightItem(optionId);
          props.onMouseEnter?.(event);
        }
      }}
    >
      {iconAppearanceResolved === "left" && context.selectedId !== null && (
        <CheckIcon
          className={clsx("w-4 h-4", { "opacity-0": !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
      <SelectOptionDisplayContext.Provider value="list">{display}</SelectOptionDisplayContext.Provider>
      {iconAppearanceResolved === "right" && context.selectedId !== null && (
        <CheckIcon
          className={clsx("w-4 h-4", { "opacity-0": !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
    </li>
  );
});
