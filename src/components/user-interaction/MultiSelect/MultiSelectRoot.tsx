import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { MultiSelectContext } from "./MultiSelectContext";
import type { RegisteredMultiSelectOption } from "./MultiSelectContext";
import type { UseMultiSelectProps } from "./useMultiSelect";
import { useMultiSelect } from "./useMultiSelect";
import { DOMUtils } from "@/src/utils/dom";

export interface MultiSelectRootProps extends Omit<UseMultiSelectProps, "options"> {
  children: ReactNode;
}

export function MultiSelectRoot(props: MultiSelectRootProps) {
  const { children, ...hookProps } = props;
  const [options, setOptions] = useState<RegisteredMultiSelectOption[]>([]);

  const registerOption = useCallback(
    (item: RegisteredMultiSelectOption) => {
      setOptions((prev) => {
        const next = prev.filter((o) => o.value !== item.value);
        next.push(item);
        next.sort((a, b) =>
          DOMUtils.compareDocumentPosition(a.ref.current, b.ref.current)
        );
        return next;
      });
      return () =>
        setOptions((prev) => prev.filter((o) => o.value !== item.value));
    },
    []
  );

  const value = useMultiSelect({ ...hookProps, options });
  return (
    <MultiSelectContext.Provider
      value={{
        ...value,
        item: {
          ...value.item,
          register: registerOption,
        },
      }}
    >
      {children}
    </MultiSelectContext.Provider>
  );
}
