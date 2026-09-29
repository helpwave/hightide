# Components

How components are structured.

## Anatomy

Every component is split into primitives, and every component has an aggregate.

The aggregate is the component used in the common case. Primitives are the individual elements of that component, attached as static members of the aggregate.

```tsx
<Select value={value} onValueChange={setValue}>
  <Select.Option value="a">A</Select.Option>
</Select>
```

`<Select />` is the aggregate. `Select.Root`, `Select.Trigger`, `Select.Content`, and `Select.Option` are the primitives. Each element of the component has its own primitive.

The aggregate composes those primitives into the default arrangement. Callers who need a different arrangement use the primitives directly. Both forms are part of the public API.

### Aggregate

Props that belong to an individual primitive can be set on the aggregate. A dedicated props object for that primitive overwrites the values the aggregate already applied.

```tsx
<Select
  value={value}
  onValueChange={setValue}
  placeholder="Choose"
  triggerProps={{ className: 'w-full' }}
  contentProps={{ className: 'max-h-64' }}
>
  <Select.Option value="a">A</Select.Option>
</Select>
```

`value` and `onValueChange` parameterize `Select.Root`. `placeholder` parameterizes `Select.Trigger`. `triggerProps` and `contentProps` are applied on top of the props the aggregate already passed, so they win when both set the same prop.

That aggregate is the same composition as:

```tsx
<Select.Root value={value} onValueChange={setValue}>
  <Select.Trigger placeholder="Choose" className="w-full" />
  <Select.Content className="max-h-64">
    <Select.Option value="a">A</Select.Option>
  </Select.Content>
</Select.Root>
```

### Primitives

A primitive owns one element: the root, the trigger, the content panel, an option, and so on. Name them `Component.Element`, and export them on the aggregate.

### Root

When primitives share state, the component provides a `Component.Root` primitive. Root parameterizes that state and provides it through context. The other primitives read the context. They do not own the shared state themselves.

`Select.Root` holds the open state, the current value, interaction flags such as disabled, invalid, and read-only, and option registration, and passes them through `Select.Context`.

A component whose primitives do not share state does not have a Root.

### Context

When a component has a context, the object that collects its primitives exposes that context and its consumer.

- `Component.Context` is the React context.
- `Component.Consumer` is `Component.Context.Consumer`.

```tsx
<Expandable.Root>
  <Expandable.Consumer>
    {(state) => (state?.isExpanded ? 'Open' : 'Closed')}
  </Expandable.Consumer>
</Expandable.Root>
```

Callers read shared state through `Component.Consumer` or the component hook. They do not reach the consumer by importing the context module.

## Styling identification

Components identify themselves for styling with class names. Do not use `data-name`, or any other data attribute, as the styling hook.

Data attributes are reserved for states and configuration, for example `data-disabled`, `data-invalid`, and `data-processing="subtle"`.
