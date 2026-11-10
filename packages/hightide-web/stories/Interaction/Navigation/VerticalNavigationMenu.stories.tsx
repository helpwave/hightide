import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BedDouble,
  Briefcase,
  BriefcaseBusiness,
  Building,
  Building2,
  CalendarDays,
  HeartPulse,
  Info,
  Kanban,
  Mail,
  MapPin,
  MoreHorizontal,
  Package,
  Settings,
  Stethoscope,
  Users,
  UsersRound
} from 'lucide-react'
import { VerticalNavigationMenu } from '../../../src/components/interaction/navigation/VerticalNavigationMenu'
import type { NavigationItemData } from '../../../src/components/interaction/navigation/types'

const navigationItems: NavigationItemData[] = [
  {
    id: 'products',
    label: 'Products',
    icon: <Package className="size-5" />,
    items: [
      {
        id: 'clinical',
        label: 'Clinical',
        icon: <Stethoscope className="size-5" />,
        items: [
          { id: 'ward-management', label: 'Ward management', icon: <BedDouble className="size-5" />, url: '#' },
          { id: 'patient-overview', label: 'Patient overview', icon: <Users className="size-5" />, url: '#' },
        ],
      },
      {
        id: 'operations',
        label: 'Operations',
        icon: <Settings className="size-5" />,
        items: [
          { id: 'task-board', label: 'Task board', icon: <Kanban className="size-5" />, url: 'https://helpwave.de/product/tasks', external: true },
          { id: 'staff-planning', label: 'Staff planning', icon: <CalendarDays className="size-5" />, url: 'https://helpwave.de/product/staff', external: true },
        ],
      },
      {
        id: 'other',
        label: 'Other',
        icon: <MoreHorizontal className="size-5" />,
        url: '#',
      },
    ],
  },
  {
    id: 'organization',
    label: 'Organization',
    icon: <Building2 className="size-5" />,
    items: [
      {
        id: 'sites',
        label: 'Sites',
        icon: <MapPin className="size-5" />,
        items: [
          { id: 'site-berlin', label: 'Berlin', icon: <MapPin className="size-5" />, url: '#' },
          { id: 'site-munich', label: 'Munich', icon: <MapPin className="size-5" />, url: '#' },
        ],
      },
      {
        id: 'teams',
        label: 'Teams',
        icon: <UsersRound className="size-5" />,
        items: [
          { id: 'team-nursing', label: 'Nursing', icon: <HeartPulse className="size-5" />, url: '#' },
          { id: 'team-administration', label: 'Administration', icon: <Briefcase className="size-5" />, url: '#' },
        ],
      },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    icon: <Building className="size-5" />,
    items: [
      { id: 'about', label: 'About', icon: <Info className="size-5" />, url: '#' },
      { id: 'careers', label: 'Careers', icon: <BriefcaseBusiness className="size-5" />, url: '#' },
    ],
  },
  { id: 'contact', label: 'Contact', icon: <Mail className="size-5" />, url: '#' },
]

const meta = {
  component: VerticalNavigationMenu,
  args: {
    onlyOneExpandedTree: false,
    items: navigationItems,
  },
} satisfies Meta<typeof VerticalNavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const verticalNavigationMenu: Story = {
  render: (args) => (
    <div className="w-64 h-96">
      <VerticalNavigationMenu {...args} />
    </div>
  ),
}
