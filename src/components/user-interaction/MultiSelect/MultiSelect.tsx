import { forwardRef } from "react";
import type { MultiSelectRootProps } from "./MultiSelectRoot";
import { MultiSelectRoot } from "./MultiSelectRoot";
import type { MultiSelectButtonProps } from "./MultiSelectButton";
import { MultiSelectButton } from "./MultiSelectButton";
import type { MultiSelectContentProps } from "./MultiSelectContent";
import { MultiSelectContent } from "./MultiSelectContent";

export interface MultiSelectProps<T = string> extends MultiSelectRootProps<T> {
  contentPanelProps?: MultiSelectContentProps;
  buttonProps?: MultiSelectButtonProps<T>;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps<unknown>>(
  function MultiSelect<T = string>({ children, contentPanelProps, buttonProps, ...props }: MultiSelectProps<T>, ref) {
    return (
      <MultiSelectRoot<T> {...props}>
        <MultiSelectButton ref={ref} {...buttonProps} />
        <MultiSelectContent {...contentPanelProps}>{children}</MultiSelectContent>
      </MultiSelectRoot>
    );
  }
);
