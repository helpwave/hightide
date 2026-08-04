import type {
  Meta,
  StoryObj
} from '@storybook/react'
import { action } from 'storybook/actions'

import type { ViewStyle } from 'react-native'
import { View, Pressable, Text } from 'react-native'

type ButtonSize =
  | 'small'
  | 'medium'
  | 'large';

type ButtonVariant =
  | 'filled'
  | 'outlined'
  | 'text';

type ButtonColorRole =
  | 'primary'
  | 'error'
  | 'secondary';

type ButtonProps = {
  size?: ButtonSize,
  variant?: ButtonVariant,
  colorRole?: ButtonColorRole,
  disabled?: boolean,
  selected?: boolean,
  onPress?: () => void,
  icon?: React.ReactNode,
  style?: ViewStyle,
};

function LayeredButton({
  size='medium',
  variant='filled',
  disabled=false,
  onPress,
}: ButtonProps) {
  const sizeMapping: Record<ButtonSize, ViewStyle> = {
    small: {
      height: 40,
    },
    medium: {
      height: 48,
    },
    large: {
      height: 56,
    }
  }
  const sizeValue = sizeMapping[size]

  const color = {
    container:'#6750A4',
    content:'#FFFFFF',
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        alignContent: 'center',
        minWidth: 48,
        minHeight: 48,
        width: 200,
      }}
    >
      {({ pressed })=>{
        return (
          <View
            style={[
              {
                backgroundColor: color.container,
                height: sizeValue.height,
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 12,
                borderWidth: variant === 'outlined' ? 1 : 0,
                opacity: disabled ? 0.38 : 1,
              }
            ]}
          >
            <View
              pointerEvents="none"
              style={[{
                backgroundColor: color.content,
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                opacity: pressed ? 0.12 : 0,
              }]}
            />
            <View style={{
              position: 'absolute',
              zIndex: 1,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'center',
              gap:8,
              paddingHorizontal: 12,
            }}>
              <Text
                style={{
                  color: color.content,
                  fontSize:14,
                  fontWeight:'500',
                }}
              >
                {'Test'}
              </Text>
            </View>
          </View>
        )
      }}
    </Pressable>
  )
}

const meta = {
  component: LayeredButton,
} satisfies Meta<typeof LayeredButton>

export default meta
type Story = StoryObj<typeof meta>

export const layeredButton: Story = {
  args: {
    size: 'small',
    disabled: false,
    onPress: action('Pressed'),
  },
}
