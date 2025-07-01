# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

- `InputModal` is now a modal and not a dialog
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
- `ThemeModal`
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
