import {
  Switch,
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

import { Menu } from '@/src/components/menu/Menu'
import { MenuActionItem } from '@/src/components/menu/MenuActionItem'
import { MenuItem } from '@/src/components/menu/MenuItem'
import { MenuNavigationItem } from '@/src/components/menu/MenuNavigationItem'
import { useTheme } from '@/src/global-contexts/theme/ThemeContext'

const meta = {
  component: Menu,
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

const MenuDemo = () => {
  const { theme } = useTheme()

  return (
    <View style={{ padding: 16, gap: 8, maxWidth: 420 }}>
      <Menu title="Personal data">
        <MenuItem label="Name" value="Anna Müller" />
        <MenuItem label="Date of birth" value="12.03.1988" />
        <MenuItem label="Email" value="anna@example.com" />
      </Menu>

      <Menu title="Practice">
        <MenuItem label="Practice" value="Praxis am Park" />
        <MenuNavigationItem
          label="Practice details"
          leading={<Building2 size={18} color={theme.semantic.primary} />}
          onPress={action('practice-details')}
        />
      </Menu>

      <Menu title="Settings">
        <MenuActionItem
          label="Notifications"
          leading={<Bell size={18} color={theme.semantic.primary} />}
          trailing={(
            <Switch
              value={true}
              onValueChange={action('notifications')}
            />
          )}
        />
        <MenuNavigationItem
          label="Account"
          leading={<UserRound size={18} color={theme.semantic.primary} />}
          onPress={action('account')}
        />
        <MenuActionItem
          label="Log out"
          danger
          leading={<LogOut size={18} color={theme.semantic.negative} />}
          onPress={action('logout')}
        />
      </Menu>
    </View>
  )
}

export const menu: Story = {
  args: {
    title: 'Personal data',
    children: (
      <View>
        <MenuItem label="Name" value="Anna Müller" />
        <MenuItem label="Email" value="anna@example.com" />
      </View>
    ),
  },
}

export const profileStyle: Story = {
  args: {
    title: 'Profile',
  },
  render: () => <MenuDemo />,
}
