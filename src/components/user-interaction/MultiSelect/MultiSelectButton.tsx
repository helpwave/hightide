import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useMultiSelectContext } from "./MultiSelectContext";
import clsx from "clsx";
import { useHightideTranslation } from "@/src/i18n/useHightideTranslation";
import { ExpansionIcon } from "@/src/components/display-and-visualization/ExpansionIcon";
import { MultiSelectOptionDisplayContext } from "./MultiSelectOption";

export interface MultiSelectButtonProps extends ComponentPropsWithoutRef<"div"> {
  placeholder?: ReactNode;
  disabled?: boolean;
  selectedDisplay?: (values: string[]) => ReactNode;
  hideExpansionIcon?: boolean;
}

export const MultiSelectButton = forwardRef<HTMLDivElement, MultiSelectButtonProps>(function MultiSelectButton(
  { id, placeholder, disabled: disabledOverride, selectedDisplay, hideExpansionIcon = false, ...props },
  ref
) {
  const translation = useHightideTranslation();
  const { state, trigger, setIds, ids } = useMultiSelectContext();
  const { register, unregister, toggleOpen } = trigger;

  useEffect(() => {
    if (id) setIds((prev) => ({ ...prev, trigger: id }));
  }, [id, setIds]);

  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current!);

  useEffect(() => {
    register(innerRef);
    return () => unregister();
  }, [register, unregister]);

  const disabled = !!disabledOverride || !!state.disabled;
  const invalid = state.invalid;
  const hasValue = state.value.length > 0;

  return (
    <div
      {...props}
      ref={innerRef}
      id={ids.trigger}
      onClick={(event) => {
        props.onClick?.(event);
        toggleOpen(!state.isOpen);
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (disabled) return;
        switch (event.key) {
          case "Enter":
          case " ":
            toggleOpen(!state.isOpen);
            event.preventDefault();
            event.stopPropagation();
            break;
          case "ArrowDown":
            toggleOpen(true, { highlightStartPositionBehavior: "first" });
            event.preventDefault();
            event.stopPropagation();
            break;
          case "ArrowUp":
            toggleOpen(true, { highlightStartPositionBehavior: "last" });
            event.preventDefault();
            event.stopPropagation();
            break;
        }
      }}
      data-name={props["data-name"] ?? "select-button"}
      data-value={hasValue ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-invalid={invalid}
      aria-disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={state.isOpen}
      aria-controls={state.isOpen ? ids.content : undefined}
    >
      <MultiSelectOptionDisplayContext.Provider value="trigger">
        {hasValue
          ? selectedDisplay?.(state.value) ?? (
              <div className={clsx("flex flex-wrap gap-x-1 gap-y-2")}>
                {state.selectedOptions.map(({ value, display }, index) => (
                  <span key={value} className="flex-row-0">
                    {display}
                    {index < state.value.length - 1 && <span>,</span>}
                  </span>
                ))}
              </div>
            )
          : placeholder ?? translation("clickToSelect")}
      </MultiSelectOptionDisplayContext.Provider>
      {!hideExpansionIcon && <ExpansionIcon isExpanded={state.isOpen} />}
    </div>
  );
});
