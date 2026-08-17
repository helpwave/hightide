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
  ThemedIcon,
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
          <ListItem title="Anna Müller" subtitle="Name" contentOrder="subtitleFirst" />
          <Divider />
          <ListItem title="12.03.1988" subtitle="Date of birth" contentOrder="subtitleFirst" />
          <Divider />
          <ListItem title="anna@example.com" subtitle="Email" contentOrder="subtitleFirst" />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <ThemedText appearance="description" style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', paddingHorizontal: 4 }}>
          Practice
        </ThemedText>
        <Card>
          <ListItem title="Praxis am Park" subtitle="Practice" contentOrder="subtitleFirst" />
          <Divider />
          <ListNavigationItem
            title="Practice details"
            leading={<ThemedIcon icon={Building2} />}
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
            title="Notifications"
            leading={<ThemedIcon icon={Bell} />}
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
            title="Account"
            leading={<ThemedIcon icon={UserRound} />}
            onPress={action('account')}
          />
          <Divider />
          <ListActionItem
            title="Log out"
            color={theme.colors.negative}
            leading={<ThemedIcon icon={LogOut} />}
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
        <ListItem title="Anna Müller" subtitle="Name" contentOrder="subtitleFirst" />
        <Divider />
        <ListItem title="anna@example.com" subtitle="Email" contentOrder="subtitleFirst" />
      </>
    ),
  },
}

export const profileStyle: Story = {
  render: () => <CardDemo />,
}
