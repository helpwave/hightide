# hightide-native-storybook

## Usage

### USB connection

#### Both devices in the same Network

1. Run this:
```shell
pnpm run storybook-native
```
2. Chose your device by pressing `a` for android of `i` for iOS

#### Different Networks

1. Run this:
```shell
adb reverse tcp:8081 tcp:8081
pnpm run storybook-native --localhost
```
2. Chose your device by pressing `a` for android of `i` for iOS