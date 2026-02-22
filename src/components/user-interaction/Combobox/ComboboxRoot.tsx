import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { ComboboxContext } from "./ComboboxContext";
import type { RegisteredComboboxOption } from "./ComboboxContext";
import type { UseComboboxProps } from "./useCombobox";
import { useCombobox } from "./useCombobox";
import { DOMUtils } from "@/src/utils/dom";

export interface ComboboxRootProps extends Omit<UseComboboxProps, "options"> {
  children: ReactNode;
}

export function ComboboxRoot(props: ComboboxRootProps) {
  const { children, ...hookProps } = props;
  const [options, setOptions] = useState<RegisteredComboboxOption[]>([]);

  const registerOption = useCallback(
    (option: RegisteredComboboxOption) => {
      setOptions((prev) => {
        const next = prev.filter((o) => o.value !== option.value);
        next.push(option);
        next.sort((a, b) =>
          DOMUtils.compareDocumentPosition(a.ref.current, b.ref.current)
        );
        return next;
      });
      return () =>
        setOptions((prev) => prev.filter((o) => o.value !== option.value));
    },
    []
  );

  const value = useCombobox({ ...hookProps, options });
  return (
    <ComboboxContext.Provider value={{ ...value, registerOption }}>
      {children}
    </ComboboxContext.Provider>
  );
}
