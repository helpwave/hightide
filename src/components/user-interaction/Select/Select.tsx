import type { ReactNode } from "react";
import { forwardRef } from "react";
import type { SelectRootProps } from "./SelectRoot";
import { SelectRoot } from "./SelectRoot";
import type { SelectButtonProps } from "./SelectButton";
import { SelectButton } from "./SelectButton";
import type { SelectContentProps } from "./SelectContent";
import { SelectContent } from "./SelectContent";

export type SelectProps = SelectRootProps & {
  contentPanelProps?: SelectContentProps;
  buttonProps?: Omit<SelectButtonProps, "selectedDisplay"> & {
    selectedDisplay?: (value: string) => ReactNode;
  } & { [key: string]: unknown };
};

export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  { children, contentPanelProps, buttonProps, ...props },
  ref
) {
  return (
    <SelectRoot {...props}>
      <SelectButton
        ref={ref}
        {...buttonProps}
        selectedDisplay={(values) => {
          const value = values[0];
          if (!buttonProps?.selectedDisplay) return undefined;
          return buttonProps.selectedDisplay(value);
        }}
      />
      <SelectContent {...contentPanelProps}>{children}</SelectContent>
    </SelectRoot>
  );
});
