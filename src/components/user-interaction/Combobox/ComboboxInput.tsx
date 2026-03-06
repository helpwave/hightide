import { type ComponentProps, forwardRef, useCallback } from "react";
import { Input } from "@/src/components/user-interaction/input/Input";
import { useHightideTranslation } from "@/src/i18n/useHightideTranslation";
import { useComboboxContext } from "./ComboboxContext";

export interface ComboboxInputProps extends Omit<ComponentProps<typeof Input>, "value"> {}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput(props, ref) {
    const translation = useHightideTranslation();
    const context = useComboboxContext();

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(event);
        switch (event.key) {
          case "ArrowDown":
            context.highlightNext();
            event.preventDefault();
            break;
          case "ArrowUp":
            context.highlightPrevious();
            event.preventDefault();
            break;
          case "Home":
            context.highlightFirst();
            event.preventDefault();
            break;
          case "End":
            context.highlightLast();
            event.preventDefault();
            break;
          case "Enter":
            if (context.highlightedId) {
              context.selectOption(context.highlightedId);
              event.preventDefault();
            }
            break;
          default:
            break;
        }
      },
      [props, context.highlightedId, context.highlightNext, context.highlightPrevious, context.highlightFirst, context.highlightLast, context.selectOption]
    );

    return (
      <Input
        {...props}
        ref={ref}
        value={context.search.searchQuery}
        onValueChange={context.search.setSearchQuery}
        onKeyDown={handleKeyDown}
        placeholder={props.placeholder ?? translation("search")}
        role="combobox"
        aria-expanded={context.visibleOptionIds.length > 0}
        aria-controls={context.config.ids.listbox}
        aria-activedescendant={context.highlightedId ?? undefined}
        aria-autocomplete="list"
      />
    );
  }
);
