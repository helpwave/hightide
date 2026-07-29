import {
  Text,
  View
} from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import {
  Bell,
  Building2,
  LogOut,
  UserRound
} from 'lucide-react-native'
import { action } from 'storybook/actions'

import { Card } from '../../src/components/card/Card'
import { CardActionItem } from '../../src/components/card/CardActionItem'
import { CardItem } from '../../src/components/card/CardItem'
import { CardNavigationItem } from '../../src/components/card/CardNavigationItem'
import { Switch } from '../../src/components/user-interaction/Switch'
import { useTheme } from '../../src/global-contexts/theme/ThemeContext'

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
        <Text style={{ color: theme.semantic.description, fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', paddingHorizontal: 4 }}>
          Personal data
        </Text>
        <Card>
          <CardItem label="Name" value="Anna Müller" />
          <CardItem label="Date of birth" value="12.03.1988" />
          <CardItem label="Email" value="anna@example.com" />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: theme.semantic.description, fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', paddingHorizontal: 4 }}>
          Practice
        </Text>
        <Card>
          <CardItem label="Practice" value="Praxis am Park" />
          <CardNavigationItem
            label="Practice details"
            leading={<Building2 size={18} color={theme.colorSchemes.primary.text.base.foreground} />}
            onPress={action('practice-details')}
          />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: theme.semantic.description, fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', paddingHorizontal: 4 }}>
          Settings
        </Text>
        <Card>
          <CardActionItem
            label="Notifications"
            leading={<Bell size={18} color={theme.colorSchemes.primary.text.base.foreground} />}
            trailing={(
              <Switch
                value={true}
                onValueChange={action('notifications')}
              />
            )}
          />
          <CardNavigationItem
            label="Account"
            leading={<UserRound size={18} color={theme.colorSchemes.primary.text.base.foreground} />}
            onPress={action('account')}
          />
          <CardActionItem
            label="Log out"
            danger
            leading={<LogOut size={18} color={theme.colorSchemes.negative.text.base.foreground} />}
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
      <View>
        <CardItem label="Name" value="Anna Müller" />
        <CardItem label="Email" value="anna@example.com" />
      </View>
    ),
  },
}

export const profileStyle: Story = {
  render: () => <CardDemo />,
}
