import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import {
  Bell,
  Building2,
  LogOut,
  UserRound
} from 'lucide-react-native'
import { action } from 'storybook/actions'

import {
  Card,
  Divider,
  ListActionItem,
  ListItem,
  ListNavigationItem,
  Switch,
  ThemedText
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

const meta = {
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const CardDemo = () => {
  const { theme } = useTheme()

  return (
    <View style={{ padding: 16, gap: 20, maxWidth: 420 }}>
      <View style={{ gap: 8 }}>
        <ThemedText appearance="description" style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', paddingHorizontal: 4 }}>
          Personal data
        </ThemedText>
        <Card>
          <ListItem label="Name" value="Anna Müller" />
          <Divider />
          <ListItem label="Date of birth" value="12.03.1988" />
          <Divider />
          <ListItem label="Email" value="anna@example.com" />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <ThemedText appearance="description" style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', paddingHorizontal: 4 }}>
          Practice
        </ThemedText>
        <Card>
          <ListItem label="Practice" value="Praxis am Park" />
          <Divider />
          <ListNavigationItem
            label="Practice details"
            leading={<Building2 size={18} color={theme.colors.primary.color} />}
            onPress={action('practice-details')}
          />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <ThemedText appearance="description" style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', paddingHorizontal: 4 }}>
          Settings
        </ThemedText>
        <Card>
          <ListActionItem
            label="Notifications"
            leading={<Bell size={18} color={theme.colors.primary.color} />}
            trailing={(
              <View
                style={(() => {
                  const switchTheme = theme.components.switch.track({})
                  const switchThemeContainer = theme.components.switch.container({})
                  return {
                    'position': 'relative',
                    'height': switchTheme.height,
                    'width': switchTheme.width,
                    'maxHeight': switchTheme.maxHeight,
                    'maxWidth': switchTheme.maxWidth,
                    'minHeight': switchTheme.minHeight,
                    'minWidth': switchTheme.minWidth,
                    'padding-right': switchThemeContainer.padding
                  }
                })()}
              >
                <Switch
                  onValueChange={action('notifications')}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: [
                      { translateX: '-50%' },
                      { translateY: '-50%' },
                    ],

                  }}
                />
              </View>
            )}
          />
          <Divider />
          <ListNavigationItem
            label="Account"
            leading={<UserRound size={18} color={theme.colors.primary.color} />}
            onPress={action('account')}
          />
          <Divider />
          <ListActionItem
            label="Log out"
            color={theme.colors.negative}
            leading={<LogOut size={18} color={theme.colors.negative.color} />}
            onPress={action('logout')}
          />
        </Card>
      </View>
    </View>
  )
}

export const card: Story = {
  args: {
    children: (
      <>
        <ListItem label="Name" value="Anna Müller" />
        <Divider />
        <ListItem label="Email" value="anna@example.com" />
      </>
    ),
  },
}

export const profileStyle: Story = {
  render: () => <CardDemo />,
}
