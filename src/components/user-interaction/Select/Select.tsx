import type { ReactNode, JSX } from "react";
import { forwardRef } from "react";
import type { SelectRootProps } from "./SelectRoot";
import { SelectRoot } from "./SelectRoot";
import type { SelectButtonProps } from "./SelectButton";
import { SelectButton } from "./SelectButton";
import type { SelectContentProps } from "./SelectContent";
import { SelectContent } from "./SelectContent";
import { SelectOptionType } from "./SelectContext";

export type SelectProps<T = string> = SelectRootProps<T> & {
  contentPanelProps?: SelectContentProps;
  buttonProps?: Omit<SelectButtonProps<T>, "selectedDisplay"> & {
    selectedDisplay?: (value: SelectOptionType<T> | null) => ReactNode;
  } & { [key: string]: unknown };
};

export const Select = forwardRef<HTMLDivElement, SelectProps<unknown>>(function Select<T>(
  { children, contentPanelProps, buttonProps, ...props }: SelectProps<T>,
  ref
) {

  return (
    <SelectRoot<T> {...props}>
      <SelectButton
        ref={ref}
        {...buttonProps}
        selectedDisplay={(value: SelectOptionType<T> | null) => {
          if (!buttonProps?.selectedDisplay) return undefined;
          return buttonProps.selectedDisplay(value as SelectOptionType<T>);
        }}
      />
      <SelectContent {...contentPanelProps}>{children}</SelectContent>
    </SelectRoot>
  );
}) as <T>(props: SelectProps<T> & React.RefAttributes<HTMLDivElement>) => JSX.Element;
