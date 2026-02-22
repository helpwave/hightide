import type { ReactNode } from "react";
import { ComboboxRoot } from "./ComboboxRoot";
import { ComboboxInput } from "./ComboboxInput";
import { ComboboxList } from "./ComboboxList";
import type { ComboboxInputProps } from "./ComboboxInput";
import type { ComboboxListProps } from "./ComboboxList";

export interface ComboboxProps {
  children: ReactNode;
  onItemClick: (id: string) => void;
  id?: string;
  searchString?: string;
  onSearchStringChange?: (value: string) => void;
  initialSearchString?: string;
  inputProps?: ComboboxInputProps;
  listProps?: ComboboxListProps;
}

export function Combobox({
  children,
  onItemClick,
  id,
  searchString,
  onSearchStringChange,
  initialSearchString,
  inputProps,
  listProps,
}: ComboboxProps) {
  return (
    <ComboboxRoot
      id={id}
      onItemClick={onItemClick}
      searchString={searchString}
      onSearchStringChange={onSearchStringChange}
      initialSearchString={initialSearchString}
    >
      <ComboboxInput {...inputProps} />
      <ComboboxList {...listProps}>{children}</ComboboxList>
    </ComboboxRoot>
  );
}
