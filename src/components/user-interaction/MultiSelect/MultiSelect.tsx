import { forwardRef } from "react";
import type { MultiSelectRootProps } from "./MultiSelectRoot";
import { MultiSelectRoot } from "./MultiSelectRoot";
import type { MultiSelectButtonProps } from "./MultiSelectButton";
import { MultiSelectButton } from "./MultiSelectButton";
import type { MultiSelectContentProps } from "./MultiSelectContent";
import { MultiSelectContent } from "./MultiSelectContent";

export interface MultiSelectProps extends MultiSelectRootProps {
  contentPanelProps?: MultiSelectContentProps;
  buttonProps?: MultiSelectButtonProps;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  function MultiSelect({ children, contentPanelProps, buttonProps, ...props }, ref) {
    return (
      <MultiSelectRoot {...props}>
        <MultiSelectButton ref={ref} {...buttonProps} />
        <MultiSelectContent {...contentPanelProps}>{children}</MultiSelectContent>
      </MultiSelectRoot>
    );
  }
);
