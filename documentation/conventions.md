### Components

When designing components we follow the following principles:

1. Separation of logic and styling
2. Same structure of components as described below

### Component Structure

Here is an example how a good component looks like

```typescript jsx
// 1. Define Props first
// Dont overwrite HTMLAttributes, always use a different name, even if its longer
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value"> &
  FormElement<string> & {
    editCompleteOptions?: EditCompleteOptions;
  };

// 2. Give a documentation description
/**
 * A Component for inputting text or other information
 *
 * Its state is managed must be managed by the parent
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    value,
    onValueChange,
    onEditComplete,
    editCompleteOptions,
    disabled = false,
    invalid = false,
    ...props
  },
  forwardedRef
) {
  // 1. States
  // Exceptions are allowed when it is sematically more coherent to put it on top
  // of the corresponding hook like for inner ref

  // 2. Constants and Memos
  const {
    onBlur: allowEditCompleteOnBlur,
    afterDelay,
    delay,
    allowEnterComplete,
  } = { ...defaultEditCompleteOptions, ...editCompleteOptions };

  // 3. Other hooks and effects
  const { restartTimer, clearTimer } = useDelay({
    delay,
    disabled: !afterDelay,
  });

  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current);

  const { focusNext } = useFocusManagement();

  return (
    <input
      // 1. Props
      {...props}
      // 2. Refs
      ref={innerRef}
      // 3. Values and state variables
      value={value}
      disabled={disabled}
      // 4. Functions, Actions, Callbacks
      // If it is a HTML event also trigger the corresponding function,
      // unless your action *must* prevent it
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (!allowEnterComplete) {
          return;
        }
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          innerRef.current?.blur();
          onEditComplete?.((event.target as HTMLInputElement).value);
          focusNext();
        }
      }}
      onBlur={(event) => {
        props.onBlur?.(event);
        if (allowEditCompleteOnBlur) {
          onEditComplete?.(event.target.value);
          clearTimer();
        }
      }}
      onChange={(event) => {
        props.onChange?.(event);
        const value = event.target.value;
        restartTimer(() => {
          innerRef.current?.blur();
          onEditComplete?.(value);
        });
        onValueChange?.(value);
      }}
      // 5. data-attributes
      data-name={DataAttributesUtil.name("input", props)}
      data-value={DataAttributesUtil.bool(!!value)}
      data-disabled={DataAttributesUtil.bool(disabled)}
      data-invalid={DataAttributesUtil.bool(invalid)}
      // 6. ARIA
      aria-invalid={props["aria-invalid"] ?? invalid}
      aria-disabled={props["aria-disabled"] ?? disabled}

      // 7. ClassName and style
    />
  );
});
```

## Naming

### Functions

- Callback are always written in present tense e.g. onComplete, onChange and never use the name as the native HTML callbacks unless they share the same parameters
