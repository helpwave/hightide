import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { SelectContext } from "./SelectContext";
import type { RegisteredSelectOption } from "./SelectContext";
import type { UseSelectProps } from "./useSelect";
import { useSelect } from "./useSelect";
import { DOMUtils } from "@/src/utils/dom";

export interface SelectRootProps extends Omit<UseSelectProps, "options"> {
  children: ReactNode;
}

export function SelectRoot(props: SelectRootProps) {
  const { children, ...hookProps } = props;
  const [options, setOptions] = useState<RegisteredSelectOption[]>([]);

  const registerOption = useCallback(
    (item: RegisteredSelectOption) => {
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

  const value = useSelect({ ...hookProps, options });
  return (
    <SelectContext.Provider
      value={{
        ...value,
        item: {
          ...value.item,
          register: registerOption,
        },
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}
