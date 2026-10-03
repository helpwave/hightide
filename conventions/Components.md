# Components

How components are structured.

## Anatomy

Every component is split into parts, and every component has an aggregate.

The aggregate is the component used in the common case. Parts are the individual elements of that component, attached as static members of the aggregate.

```tsx
<Select value={value} onValueChange={setValue}>
  <Select.Option value="a">A</Select.Option>
</Select>
```

`<Select />` is the aggregate. `Select.Root`, `Select.Trigger`, `Select.Content`, and `Select.Option` are its parts.

The aggregate composes those parts into the default arrangement. Callers who need a different arrangement use the parts directly. Both forms are part of the public API.

### Aggregate

Props that belong to an individual part can be set on the aggregate. A dedicated props object for that part overwrites the values the aggregate already applied.

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

### Parts

Every part of the aggregate is one of these.

#### Context, Provider, and Consumer

When a component has a context, the aggregate always exposes all three.

- `Component.Context` is the React context.
- `Component.Provider` is `Component.Context.Provider`.
- `Component.Consumer` is `Component.Context.Consumer`.

```tsx
<Expandable.Root>
  <Expandable.Consumer>
    {(state) => (state?.isExpanded ? 'Open' : 'Closed')}
  </Expandable.Consumer>
</Expandable.Root>
```

Callers read shared state through `Component.Consumer` or the component hook. They do not reach the consumer by importing the context module.

#### Root

`Component.Root` is the logic of the component. It parameterizes shared state and provides it through context. It renders no HTML element.

The other parts read that context. They do not own the shared state themselves.

`Select.Root` holds the open state, the current value, interaction flags such as disabled, invalid, and read-only, and option registration, and passes them through `Select.Context`.

A component whose parts do not share state does not have a Root.

#### Subcomponent

A subcomponent wraps HTML for one purpose: the trigger, the content panel, an option, and so on. Name it `Component.Element`, and export it on the aggregate.

It contains one HTML element. It is a `forwardRef` to that element, and its props extend `HTMLAttributes` for that element.

When a subcomponent contains more than one HTML element, it still forwards a ref, and every HTML element inside has its own `HTMLAttributes` props.

## Distinction

A component folder matches what the component does.

Grouping folders stay lowercase: `layout`, `interaction`, `data-input`, `visualization`, `properties`, `chat`, and `branding`.

A folder that holds one aggregate uses that aggregate's name, capitalized the same way: `Select`, `Modal`, `Drawer`, `PopUp`, `Table`, `Carousel`, `WheelPicker`, `Avatar`.

### layout

A layout component takes configuration and elements, and arranges those elements. It does not read or write a value through `InputInterface`.

`Modal`, `Carousel`, `Card`, and `Form` are layout components.

### interaction

An interaction component reacts to the user. It does not implement `InputInterface`.

`Button`, `Menu`, `Tooltip`, and `WheelPicker` are interaction components.

### data-input

A data-input component reads and writes a value through `InputInterface`. Every component in `data-input` implements that interface.

`Input`, `Select`, `Combobox`, `Checkbox`, and `DateTimeInput` are data-input components.

### visualization

A visualization component takes required data and displays it. Icons are visualization components.

`Icon`, `Avatar`, `Chip`, and `ProgressIndicator` are visualization components.

### Feature folders

A feature that extends the core components has its own folder. `chat` holds chat features. `branding` holds icons and marks for a specific product.

Inside a feature folder, components use the same folders: `layout`, `interaction`, `data-input`, and `visualization`.

## Styling identification

Components identify themselves for styling with class names. Do not use `data-name`, or any other data attribute, as the styling hook.

Data attributes are reserved for states and configuration, for example `data-disabled`, `data-invalid`, and `data-processing="subtle"`.
