# Interaction and Feedback

Minimum states an element must differentiate. These apply to mobile and web unless a state is marked web only.

There are three component types: Presentation, Interactive, and DataInput. Each type lists its own states. States are not inherited from another type.

LoadingState is separate from these types. It describes whether the element is available, waiting on data, blocked by an external operation or dependency, or performing an operation.

## Presentation

Presentation elements display content. They do not take input.

Presentation elements have no interaction states.

## Interactive

Interactive elements can be activated.

| State | Scope |
| --- | --- |
| `hover` | web only |
| `pressed` | mobile and web |
| `focus` | mobile and web |
| `focus-visible` | web only, often replacing `focus` |
| `disabled` | mobile and web |

## DataInput

Data input elements accept or display an editable value.

| State | Scope |
| --- | --- |
| `readonly` | data input only |
| `invalid` | data input only |
| `hover` | web only |
| `pressed` | mobile and web |
| `focus` | mobile and web |
| `focus-visible` | web only, often replacing `focus` |
| `disabled` | mobile and web |

## LoadingState

Every element can be in one loading state:

```ts
type LoadingState = 'idle' | 'loading' | 'blocked' | 'processing'
```

### idle

The element is available to be used.

### loading

The element is loading data. Its content is not ready to show yet.

Show a skeleton or a placeholder in its place. The placeholder is often a rounded rectangle that roughly approximates the element's size.

### blocked

An external operation or dependency is preventing this element from being used.

### processing

This element is updating, or performing an operation, and that operation stops interaction. The element stays visible while the operation runs.

## Interaction states

`readonly`, `invalid`, `hover`, `pressed`, `focus`, `focus-visible`, and `disabled` follow the matching HTML semantics.

### hover

Web only. The pointer is over the element. This matches the CSS `:hover` pseudo-class. Mobile does not use this state.

### pressed

The element is being activated by a pointer or touch press. This matches `:active`.

### focus

The element has focus. This matches `:focus`.

### focus-visible

Web only. The element has focus and that focus should be shown, typically because it came from the keyboard. This matches `:focus-visible`.

On web, `focus-visible` often replaces the `focus` visual, so pointer focus does not draw a focus ring. Mobile does not use this state.

### disabled

The element cannot be interacted with. This matches the `disabled` attribute and `:disabled`.

### readonly

Data input only. The value can be read and is not editable. This matches the `readonly` attribute.

### invalid

Data input only. The current value fails validation. This matches `:invalid` and `aria-invalid`.
