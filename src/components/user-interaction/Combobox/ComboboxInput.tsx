import { ComponentProps, forwardRef, useCallback } from "react";
import { Input } from "@/src/components/user-interaction/input/Input";
import { useHightideTranslation } from "@/src/i18n/useHightideTranslation";
import { useComboboxContext } from "./ComboboxContext";

export interface ComboboxInputProps extends Omit<ComponentProps<typeof Input>, "value"> {}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput(props, ref) {
    const translation = useHightideTranslation();
    const {
      searchString,
      setSearchString,
      visibleOptions,
      highlighting,
      onItemClick,
      ids,
    } = useComboboxContext();

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(event);
        switch (event.key) {
          case "ArrowDown":
            highlighting.next();
            event.preventDefault();
            break;
          case "ArrowUp":
            highlighting.previous();
            event.preventDefault();
            break;
          case "Home":
            highlighting.first();
            event.preventDefault();
            break;
          case "End":
            highlighting.last();
            event.preventDefault();
            break;
          case "Enter":
            if (highlighting.value) {
              onItemClick(highlighting.value);
              event.preventDefault();
            }
            break;
          default:
            break;
        }
      },
      [props, highlighting, onItemClick]
    );

    return (
      <Input
        {...props}
        ref={ref}
        value={searchString}
        onValueChange={setSearchString}
        onKeyDown={handleKeyDown}
        placeholder={props.placeholder ?? translation("search")}
        role="combobox"
        aria-expanded={visibleOptions.length > 0}
        aria-controls={ids.listbox}
        aria-activedescendant={highlighting.value ?? undefined}
        aria-autocomplete="list"
      />
    );
  }
);
