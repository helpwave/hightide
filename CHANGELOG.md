# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2026-01-29

### Added
- keyboard controls to `DayPicker`

### Fixed
- removed all disable react-hooks/exhaustive-deps lint warning and fix them appropriately
- `IconButton` not reacting to blur for closing the tooltip

### Changed
- all components now use a hybrid approach for hybrid and controlled state management
- `data-name` for components to a classname instead


### Removed
- Geometry Components such as `Ring` and `Circle` as these can be CSS only solutions

## [0.7.0] - 2026-01-29

### Added
- `ColumnSizingWithTargetFeature` and `AutoColumnOrderFeature` to Table for column size fixing and column ordering
- `Tooltip` to `TableColumnSwitcher`
- `forceMount` attribute to `Drawer`
- `TooltipRoot`, `TooltipTrigger`, and `TooltipDisplay` to make it decomposable
- `useResizeObserver` and `useScrollObserver` to react to resize and scroll events on HTMLElements
  - added these to the `AnchoredFloatingContainer` as options
- `IconButton` to better capture the different accessibility requirements of both button types
  - use `IconButton` instead of buttons with `layout="icon"`

### Changed
- `useLocalStorage` to be called `useStorage` and allow for listing to storage changes
- `ThemeDialog` is now split into `ThemeSelect` and `ThemeIcon`
- `useTransitionState` uses the window to get animations if no valid ref is provided, and it warns if a ref is provided and its value is null
- names for Tablefilters
  - `tags` is now `multiTags`
  - `tagsSingle` is now `singleTag`

### Fixed
- Table column sizing when toggling visibility and changing order

## [0.6.16] - 2026-01-26

### Fixed
- `TextFilter` popup having 2 case-sensitive checkboxes

## [0.6.15] - 2026-01-26

### Changed
- `Tooltip` now closes on click

### Fixed
- `TableProvider` to use a Partial state for controlled state management

## [0.6.14] - 2026-01-26

### Changed
- `datetime` to `dateTime` for TableFilter

### Fixed
- `dateTime` and `tagsSingle` and now part of the `FilterFns` object on table

## [0.6.13] - 2026-01-26

### Added
- `TableFilter` for date time and single tags
- `ToolTips` to `TableFilterButton` and `TableSortButton`
- `label` meta attribute to column defs to allow for omitting the header name but still showing one for the `ColumnSwitcher` 

### Fixed
- `FormObserverKey` using the restricted `key` property

## [0.6.12] - 2026-01-25

### Added
- `useCreateForm`s update method in its return type now accepts a boolean to indicate whether an update should be triggerd

### Fixed
- `TablePagination` for smaller screens
- `NumberProperty` and `TextProperty` to not use `onRemove`

## [0.6.11] - 2026-01-25

### Fixed
- `FormStore` to return stable copies to prevent infinite loops

## [0.6.10] - 2026-01-25

### Fixed
- `TableBody` not showing filler row cells if `columnOrder` does not exist

## [0.6.9] - 2026-01-25

### Added
- `onFillerRowClick` for `Table`s to react to such clicks
- `useFormObserver` and `FormObserver` to listen to form updates

### Changed
- `DateTimeInput` now only exposes its triggering elements ref
- Moved `ValidationBehavoir` from the `FormStore` to the `FormField` 

### Fixed
- `DateTimeInput` always showing the value as a placeholder
- `TableBody` filler rows reacting to sorting and visibility

## [0.6.8] - 2026-01-24

### Changed
- The body rows of a `TableBody` now have data attribute `data-clickable` if a defined `onRowClick` is provided

### Fixed
- `Checkbox` not enforcing its sizing
- `TableHeader` cells not being relative to allow for proper positioning of the resize indicator

### Removed
- inconsistent usage of `default-style-none` on some classes by removing it entirely as `all: unset` is available through css

## [0.6.7] - 2026-01-24

### Added
- `Table` as a default implementation of a table with a provider pagination, title and actions
- `TablePagination` an opinionated component for Table pagination
- `TableColumnSwticher` a button with a pop-up for changing the column sorting and visibility

### Changed
- `TablePagination` buttons now show a tooltip
- Table element styling now uses classNames and no longer data-attributes

### Fixed
- Table Context updates not triggering on sorting or other changes
- A bug in `useTransitionState` that caused it to 

## [0.6.6] - 2026-01-24

### Added
- Paginated Loading of Table entries
- `TableColumnPicker` for choosing the displayed columns
- `TableContext`
- `TableColumn` for defining the columns through the table context 
- `PopUp` for simplifying the usage of the `AnchoredFloatingContainer` with conditional hiding logic and a `FocusTrap`
- Add `DialogRoot` and `DialogOpener`
- Add several new `TableFilter`

### Changed
- `TableFilterButton` now uses the `DateTimeInput` component
- the folder name for global contexts to `global-contexts` instead of the previous `context` to be more verbose about its purpose
- `FocusTrap` by splitting it into `FocusTrap` which takes a ref of the element to entrap and `FocusTrapWrapper` which directly provided this element as a `<div>`
- `OverlayRegistry` now returns the unsubscribes as a return function of the subscribe function
- several components to now use interfaces instead of types

### Fixed
- impure calls and hooks for `useTransitionState`

### Removed
- `usePopOverPosition` in favor of `useAnchoredPosition`

## [0.6.5] - 2026-01-09

### Fixed
- `FillerCell`s not having their padding on the table component
- type in `expandable-content-h-*` utitlity class

## [0.6.4] - 2026-01-09

### Changed
- `Select` and `MultiSelect` to have different types for their options

### Fixed
- `Tooltip` not closing
- `Select`s in dialogs


## [0.6.3] - 2026-01-08

### Added
- `useFormCreate` now returns the functions `onUpdate()`
- Functionality to form handling to differentiate local changes and updates that should be sent to the server

### Changed
- `Select` and `MultiSelect` to have different types for their options

### Fixed
- `MultiSelect` not triggering `onEditComplete`
- `Expandable` to only show one expansion icon

## [0.6.2] - 2026-01-08

### Added
- `useFormCreate` now returns the functions `getErrors()` and `getIsValid()`

## [0.6.1] - 2026-01-08

### Added
- `useFormCreate` now returns the functions `getValues()` and allows update to receive an `updater` function

## [0.6.0] - 2026-01-07

### Added

- `HightideConfigContext` for storing Look and Feel Variables
- `HightideProvider` to bundle all hightide contexts in one provider
- Added Code panel to storybook
- `Drawer` component that alows for stacking
- autoprefixer for CSS backwards compatability
- `useTransitionState` hook to keep track of transition changes
- `Form` and `FormStore` for form handling
- `InifinteScroll` component for infinitly scrolling lists
- `PropertyField` type for enforcing the same interface for all properties 

### Changed

- `Tables` to no longer round their column size
- Split `Expandable` into 3 components `ExpandableRoot`, `ExpandableHeader`, `ExpandableContent`
- storybook folder structure and removed title from stories to allow for dynamic folder structure
- Component styling to be CSS and data-attribute based instead of relying on in component classNames
- Moved `ExpansionIcon` out of `Expandable` file and into its own
- Changed internal folder structure
- Replaced `ZIndexRegistry` with `OverlayRegistry` to allow for saving more information about overlays then just their zIndex
- `FormElementWrapper` to clone children and give them the required props when not using the bag
- Input elements such as `Input`, `TextArea`, `Select`, etc. now all use `onValueChange` and `onEditComplete` instead of other alternative names
- Date- and Time-Picker to use the `value`, `onValueChange`, `onEditComplete` pattern

### Fixed

- `useOverwritableState` propagating the old instead of the updated state
- `Table` background to overflow on the edges

### Removed

- `Label` component due to it having no functionality

## [0.5.4] - 2025-12-18

### Fixed

- `useFloatingElement` calculating when no container exists yet

## [0.5.3] - 2025-12-18

### Fixed

- `DateTimeInput` missing translation
- a bug where changing days caused the minutes to change as well
- the many `Tooltip`s story

## [0.5.2] - 2025-12-18

### Fixed

- `LoadingAndErrorComponent` and `Visibility` to always return a `JSX.Element`

## [0.5.1] - 2025-12-18

### Fixed

- fixed race condition in tooltip

## [0.5.0] - 2025-12-17

### Added

- VisibilityComponent

### Changed

- Upgrade to Storybook 10.0.0
- Disable `Button`s `onClick` event propagation by default
  - This can be reactivated with the `allowClickEventPropagation` flag
- Change DateTimePicker styling and arrangement
- deprecated `MutableRefObject` to `RefObject`
- `TableSortButton` show the index at which it currently is applied
- Changed Tooltip to be position based on anchor an not relative

### Fixed

- tooltips not disappearing if mouseleave happens too fast
- .arb variable typing not set

### Removed

- Tests for translation parser which are now in [@helpwave/hightide](https://github.com/helpwave/hightide)

### Security

- Update dependencies

## [0.4.0] - 2025-12-16

### Added

- A [conventions document](/documentation/conventions.md)
- A `input-element` style for all user-input elements

### Changed

- All user-input elements now provide `data-disabled`, `data-invalid` and `data-value` attributes for styling
- Focus styling now uses these tailwind utilities
  - `focus-style-outline` provided also as `focus-style-default` for every element (deactivatable with `focus-style-none`)
  - `focus-style-border`
  - `focus-style-none`
- Styling location of several user-input elements to component.css
- CSS exports to differentiate better between utilities and theming

## [0.3.0] - 2025-12-15

### Added

- `coloring-<solid | text | outline>` CSS class uses the colors below to color the element according to the color
- `prmiary`, `secondary`, `positive`, `negative`, `warning`, `disabled` CSS classes to set the variables for `coloring-*`
- `useZIndexRegistry` hook to manage zIndex of elements that pop in and out of the viewport like `Select`, `Dialog`, `Tooltip`

### Changed

- Consolidated `SolidButton`, `TextButton`, `OutlinedButton`, `IconButton` into on component `Button` with four attributes `ButtonSize`, `ButtonColoringStyle`, `ButtonLayout`, `ButtonColor`
- Split css classes into theming and utility
- `SelectOption`s now only use marker padding when there is a selected value
- Changed styling of `DayPicker` to make the currently selected day more easily visible

### Fixed

- Fixed `Carousel` having negative indexes for when left button is used

### Removed

- `SolidButton`
- `TextButton`
- `OutlinedButton`
- `IconButton`
- `color-tag-*` are removed and `Chip` now uses the button colors
- Dependency on `react-custom-scrollbars-2` and `tinycolor2`
- Removed `shading` utilities

## [0.2.0] - 2025-12-15

### Added

- `PromiseUtils` with a `sleep` and `delayed` function

### Changed

- `CheckBox` now propagates value changes with `onCheckedChange`

### Removed

- Removed `row` and `col` css utilities use `flex-row-2` and `flex-col-2` instead
  - Regex for checking usage `` ("|'|`| )col("|'|`| ) `` or `` ("|'|`| )row("|'|`| ) ``
- Removed dependency on `radix-ui`

### Fixed

- Allow Tables to be sorted by multiple columns
- Pagination max Page count now has the same size as the Input for the current page

### Security

- Update and pin all dependencies

## [0.1.48] - 2025-12-01

### Added

- Added `TabView` and `Tab` for easily changing between tabs

### Update

- `"@helpwave/internationalization": "0.4.0"`

## [0.1.47] - 2025-11-24

### Change

- `tsup` now only uses one entrypoint
- Merged `build` and `build-production` into one `build` script

### Fix

- fix commonJS and module exports

## [0.1.46] - 2025-11-24

### Fix

- Fix build to properly recognize external packages

### Security

- Remove unused dependencies

## [0.1.45] - 2025-11-24

### Upgrade

- Increase version of `@helpwave/internationalization` to `0.3.0`

## [0.1.44] - 2025-11-23

### Changed

- Change the name of the translations to `HightideTranslation` to be easier to integrate with other translations

## [0.1.43] - 2025-11-21

### Changed

- Changed translation to use the arb format and ICU string replacements
- Moved translations to the [locales folder](locales/)
- Locales are now used instead of Languages
- translations are now split into 2 translation functions
  - `useTranslation`: directly usable and uses the preferred locale
  - `useICUTranslation`: parses every input with a ICU interpreter (less efficient)

### Fixed

- fixed padding on the `InsideLabel` to be properly aligned

## [0.1.42] - 2025-10-31

### Fixed

- Fixed `NavigationItemWithSubItem` to make all links have the same length int the menu
- Fixed `<li>` elements in `Navigation`

## [0.1.41] - 2025-10-31

### Fixed

- Fixed `ThemeDialog` and `LanguageDialog` to properly show select options

## [0.1.40] - 2025-10-30

### Fixed

- Fixed `Carousel` having more than one focusable item

## [0.1.39] - 2025-10-30

### Changed

- Changed `Carousel` to have an event `onSlideChanged` when the slide changes

### Removed

- Removed `TextImage` component

## [0.1.38] - 2025-10-30

### Changed

- Changed `Dialog`s to only be part of the DOM-Tree when open

### Fixed

- Fixed `SelectButton` not reacting correctly to arrow keys when determining the highlighted value
- Fixed `ThemeProvider` and `LanguageProvider` to consider the `system` value as an overwrite
- Fixed `ConfirmDialog` story using a wrong initial state

## [0.1.37] - 2025-10-30

### Changed

- Exported and renamed `NavigationItem` to `NavigationItemType`

### Fixed

- Fixed `Dialog` not being client side by default

## [0.1.36] - 2025-10-06

### Changed

- Changed `useLocalStorage` to remove values that produce an error on load

### Fixed

- Fixed closing animation for `Dialog`
- Fixed `LanguageProvider` and `ThemeProvider` to not set undefined values into storage

## [0.1.35] - 2025-10-06

### Added

- Added `--clean` option to barrel script
- Added `useOverwritableState` to wrap `useState` and `useEffect` in uncontrolled components
- Added `FormElementWrapper` onTouched callback and aria-attributes
- Added `ValidatorError`s and translation for selection items

### Changed

- Changed `barrel` script location to a dedicated [scripts folder](scripts)
- Split `build` script in `build` and `build-production`
- Stopped saving of system theme and language values and instead load them if value is not found

### Removed

- Removed index.ts files from version control to force direct imports
- Removed usages of `noop`

## [0.1.34] - 2025-10-03

### Changed

- Changed Dialog z-index to 100

### Fixed

- Fix `FormElementWrapper` labelledBy misspelling

## [0.1.33] - 2025-10-03

### Changed

- Change `Dialog` to only use fixed positions

## [0.1.32] - 2025-10-03

### Changed

- Changed the default background for surfaces and inputs to create higher contrasts

### Fixed

- Fix a `Dialog`s description rendering a div when not set
- Fix initial misalignment of `Dialog`s in some cases

## [0.1.31] - 2025-10-03

### Changed

- Make `SingleSelectProperty` and `MultiSelectProperty` use `SelectOption`s for styling

## [0.1.30] - 2025-10-03

### Changed

- Changed `SingleSelectProperty` and `MultiSelectProperty` to accept a label

## [0.1.29] - 2025-10-02

### Added

- HTML elements now use `color-scheme: dark` when in dark mode
- Add invalid state styling to Selects
- Add a placeholder color called `placeholder`
- Add a hook for localized validation translation `useTranslatedValidators`

### Changed

- `disabled` and `required` are now optional in `FormElementWrapper`
- changed focus to draw an outline instead of a ring

### Removed

- removed several typography entries that only change the `font-weight` (e.g. `typography-label-md-bold` -> `typography-label-md font-bold`)

### Fix

- Fix disabled color for `Select`

## [0.1.28] - 2025-10-02

### Added

- added barreling script and barrel files

### Changed

- pin dependencies

### Fixed

- Fix css export path

## [0.1.27] - 2025-10-02

### Added

- Add a theme preference listener to `useTheme` hook
- Add icons to the Theme dialog
- Add a config attribute to the `SelectRoot` component
- Add `Navigation` and `NavigationList` components for reusable Navigation menus
- Add accessibility for carousel

### Changed

- move `isMultiSelect` attribute of `SelectRoot` into the config `SelectConfiguration`
- split `layout-and-navigation` into `layout` and `navigation` (same for stories)

## [0.1.26] - 2025-09-24

### Added

- Add `FloatingContainer` and `useFloatingElement` for aligning a floating element
- Add `ListBox` for selecting a value from a list
- Added accessibility for `Select`, `MultiSelect`, `Expandable`, `Avatar`
- `FormElementWrapper` to label and validate inputs
- Add size options for `Expandable`
- Add `ScrollArea`
- Add `FocusTrap` and `useFocusTrap` for focus trapping
- Add `useIsMounted` for checking when a component is rendered

### Changed

- Renamed `textstyle` to `typography` for ClassNames
- Changed css folder to style folder
- Changed `HelpwaveBadge`, `HelpwaveLogo` to allow for different sizes
- Merged `Dialog` and `Modal` and made modal a configuration option
- Adjust `LanguageDialog`, `ThemeDialog`, `ConfirmDialog`, `InputDialog`, `DiscardChangeDialog` for changes to `Dialog`
- Updated Stories
- Changed `range` function syntax: (new) `range(value, [lower, higher])`
- Changed relative to absolute imports (only partial)

### Removed

- removed typographies (full list below)
  - `typography-title-3xl`
  - `typography-title-2xl`
  - `typography-title-xl`
  - `typography-title-sm`
  - `textstyle-title-normal`
  - `textstyle-accent`
  - `textstyle-description`
  - `textstyle-table-name`
  - `textstyle-table-header`
  - `textstyle-navigation-item`
  - `textstyle-form-error`
  - `textstyle-form-description`
- Removed Label from base input components. (full list below)
  - `Input`
  - `Select`
  - `MultiSelect`
  - `Textarea`
- Removed `InputModal`, `LanguageModal`, `ThemeModal`

## [0.1.25] - 2025-07-19

### Added

- Added a story for a form example

### Fixed

- Fixed `ThemeProvider` to correctly use the stored theme in the context
- Fixed disabled state and styling on `Checkbox`, `Input`, `Select`, `MultiSelect`

## [0.1.24] - 2025-07-17

### Fixed

- Fixed `useTheme` and `ThemeProvider` to correctly load the theme

## [0.1.23] - 2025-07-17

### Changed

- Changed `Avatar` to show backup icon when no name or image supplied
- Changed component to use next `Image` and `Link`
- Changed CSS to use referential values
- Changed `LoadingAndErrorComponent` to have a minimum loading time
- Changed design of `BreadCrumb`s
- Update multiple storybook stories

## [0.1.22] - 2025-07-16

### Added

- Added `coloredHoverBackground` option to `TextButton`
- Added colors for input elements to css instead of using surface

### Changed

- Change `Avatar` component to allow for name displays
- Change color for `Modal`s and `Menu`s

### Fixed

- Fixed `Menu` and `Overlay` z-Indexes

## [0.1.21] - 2025-07-14

### Added

- Save theme choice to local storage

### Changed

- Changed storybook background
- Changed color on dark surface to be brighter

### Fixed

- Fixed `Menu` and `Overlay` z-Indexes

## [0.1.20] - 2025-07-14

### Added

- Added `LoadingContainer` for showing a loading animation

### Changed

- Changed `Expandable` to allow for styling the expansion container

## [0.1.19] - 2025-07-11

### Added

- Add animations for `Expandable`, `Select`, `MultiSelect`, `Menu`, `Modal`, `Dialog`
- Add utility for defining a flex-column or flex-row with its gap directly
- Add hook `usePopoverPosition` to easily define the position of a popover based on a trigger element

### Changed

- Changed the disabled color for dark and light mode
- Changed overlay background color to be configurable
- Changed `Select` and `MultiSelect` to now be variants of `Menu`
- Made `Select` and `MultiSelect` scrollable
- Menu now allows for defining the direction in which the PopOver is openend
- Changed the design of `SingleSelectProperty` and `MultiSelectProperty`

## [0.1.18] - 2025-07-07

### Fix

- fix console logging in `useDelay`
- fix helpwave icon animation for safari

## [0.1.17] - 2025-07-07

### Fix

- fix `TableWithSelection` access to `bodyRowClassName`

## [0.1.16] - 2025-07-07

### Added

- Added a `useDelay` story
- Added a `CopyToClipboardWrapper` to allow for easy copy to clipboard buttons

### Changed

- `TableWithSelection` now allows for disabling row selection

## [0.1.13] - 2025-07-04

### Added

- Added a `TableCell` component which is used to display all unspecified table cells

### Changed

- `TableState` is now optional on the table

### Fixed

- Fixed `Table` stories to only use known properties

## [0.1.12] - 2025-07-02

### Added

- Added filtering, resizing and filler rows for the `Table`
- Added transparent background option for `IconButtons`
- tailwind utilities for spacing scalable rounding
- Added a page input to the pagination component
- Added a `resolveSetState` function to easily get the value that result from a `SetState` in a `Dispatch`
- Added `useRerender` hook to allow for easy rerendering
- Added `useFocusMangement`, `useFocusOnceVisible`. `useResizeCallbackWrapper`

### Changed

- Changed hardcoded `px`, or `rem` value in components to spacing scalable alternatives
- Split uncompiled CSS into many different files for easier readability
- Changed `range`utility to be configurable and end-exclusive

### Fixed

- Fixed `CheckBox` disabled state

## [0.1.11] - 2025-07-02

### Changed

- change negative color in dark mode
- `Select` component selection indicator to the suffix rather than prefix
- changed `Select` component stories to display them with less width

### Fixed

- fixed `LanguageModal` and `ThemeDialog` not displaying their text in the Select

## [0.1.10] - 2025-07-02

### Changed

- `useChipDisplay` is now optional for `MultiSelect`
- increased shadows for `Menu`, `Select` and `MultiSelect`
- Update `PropsForTranslation` to not assume a props type

## [0.1.9] - 2025-07-01

### Changed

- Changed localization
  - added separate localization packages
  - added a `TranslationPlural` object to make pluralization easy
  - make every translation a function
  - added formatting

## [0.1.8] - 2025-06-30

### Added

- `Menu` story
- `Carousel` story

### Changed

- Changed `Select` and `MultiSelct` to have an inbuild search and close when clicked outside
- Changed `Menu` to have no negative margin
- Changed css to reduce duplications and instead use variable

### Removed

- Removed `SearchableSelect` -> now inbuild in `Select`

## [0.1.7] - 2025-06-30

### Changed

- Changed `StepperBar` to have a simplified state and more options
- Update colors and adapt borders to dark-mode for `Select`-based components

## [0.1.6] - 2025-06-23

### Removed

- removed default exports

## [0.1.5] - 2025-06-23

### Removed

- removed next from dependencies and replace next image with img
- removed `TileWithImage` for `TextImage`

## [0.1.4] - 2025-06-23

### Added

- `StepperBar` story

### Changed

- Differentiate between `Expandable` and `ExpandableUncontrolled`
- Differentiate between `StepperBar` and `StepperBarUncontrolled` and an option to disable steps
- Removed gap between the title and description of a `Tile` and added a default title style

## [0.1.3] - 2025-06-21

### Fixed

- `InputDialog` is now a modal and not a dialog
- Button now have the not-allowed cursor when disabled
- Removed gap in `BreadCrumb` components

## [0.1.2] - 2025-06-20

### Added

- `Expandable` story

### Changed

- `Expandable` graphically and to allow for disabling

## [0.1.1] - 2025-06-20

### Added

- `ConfirmModal`

### Changed

- `ConfirmDialog` to not include a cancel option -> use the `ConfirmModal` instead
- Change dark mode colors in `globals.css`

## [0.1.0] - 2025-06-04

### Added

- .editorconfig
- `IconButton`
- `ThemeDialog`
- [`storybookThemeOverride.css`](./.storybook/storybookStyleOverrides.css)

### Changed

- Update [README.md](README.md) to hold more information on publishing
- Update controllable Components to also offer an uncontrolled version (controlled stays the default)
- Update file structure
- Update imports to allow for absolute imports with `@`
- Update Storybook to version `9.0.10`
- Differentiate `Overlay`, `Modal` and `Dialog`
- Update the `Tooltip` appearance

### Removed

- examples which are now part of their corresponding story

## [Unreleased]
