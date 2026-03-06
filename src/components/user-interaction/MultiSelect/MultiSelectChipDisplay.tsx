import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useMultiSelectContext } from "./MultiSelectContext";
import type { MultiSelectRootProps } from "./MultiSelectRoot";
import { MultiSelectRoot } from "./MultiSelectRoot";
import type { MultiSelectContentProps } from "./MultiSelectContent";
import { MultiSelectContent } from "./MultiSelectContent";
import { IconButton } from "@/src/components/user-interaction/IconButton";
import { useHightideTranslation } from "@/src/i18n/useHightideTranslation";
import { XIcon, Plus } from "lucide-react";

export type MultiSelectChipDisplayButtonProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  placeholder?: ReactNode;
};

export const MultiSelectChipDisplayButton = forwardRef<
  HTMLDivElement,
  MultiSelectChipDisplayButtonProps
>(function MultiSelectChipDisplayButton({ id, ...props }, ref) {
  const translation = useHightideTranslation();
  const context = useMultiSelectContext<unknown>();

  useEffect(() => {
    if (id) context.config.setIds((prev) => ({ ...prev, trigger: id }));
  }, [id, context.config.setIds]);

  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current!);

  useEffect(() => {
    const unregister = context.layout.registerTrigger(innerRef);
    return () => unregister();
  }, [context.layout.registerTrigger]);

  const disabled = !!props?.disabled || !!context.disabled;
  const invalid = context.invalid;
  const selectedOptions = context.selectedIds
    .map((oid) => context.idToOptionMap[oid])
    .filter(Boolean);

  return (
    <div
      {...props}
      ref={innerRef}
      onClick={(event) => {
        props.onClick?.(event);
        if(event.defaultPrevented) return;
        context.toggleIsOpen();
      }}
      data-name={props["data-name"] ?? "multi-select-chip-display-button"}
      data-value={context.value.length > 0 ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      aria-invalid={invalid}
      aria-disabled={disabled}
    >
      {selectedOptions.map((opt) => (
        <div key={opt.id} data-name="multi-select-chip-display-chip">
          {opt.display}
          <IconButton
            tooltip={translation("remove")}
            onClick={(e) => {
              context.toggleSelection(opt.id, false)
              e.preventDefault();
            }}
            size="sm"
            color="negative"
            coloringStyle="text"
            className="flex-row-0 items-center size-7 p-1"
          >
            <XIcon className="size-5" />
          </IconButton>
        </div>
      ))}
      <IconButton
        id={context.config.ids.trigger}
        onClick={(event) => {
          event.stopPropagation();
          context.toggleIsOpen();
        }}
        onKeyDown={(event) => {
          switch (event.key) {
            case "ArrowDown":
              context.setIsOpen(true, "first");
              break;
            case "ArrowUp":
              context.setIsOpen(true, "last");
          }
        }}
        tooltip={translation("changeSelection")}
        size="md"
        color="neutral"
        aria-invalid={invalid}
        aria-disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={context.isOpen}
        aria-controls={
          context.isOpen ? context.config.ids.content : undefined
        }
        className="size-9"
      >
        <Plus />
      </IconButton>
    </div>
  );
});

export type MultiSelectChipDisplayProps<T = string> = MultiSelectRootProps<T> & {
  contentPanelProps?: MultiSelectContentProps;
  chipDisplayProps?: MultiSelectChipDisplayButtonProps;
};

export const MultiSelectChipDisplay = forwardRef(
  function MultiSelectChipDisplay<T = string>(
    {
      children,
      contentPanelProps,
      chipDisplayProps,
      ...props
    }: MultiSelectChipDisplayProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    return (
      <MultiSelectRoot<T> {...props}>
        <MultiSelectChipDisplayButton ref={ref} {...chipDisplayProps} />
        <MultiSelectContent {...contentPanelProps}>{children}</MultiSelectContent>
      </MultiSelectRoot>
    );
  }
);
