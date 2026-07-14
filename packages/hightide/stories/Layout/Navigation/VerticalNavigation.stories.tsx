import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { ReactNode } from 'react'
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
import { VerticalNavigationMenu } from '@/src/components/layout/navigation/navigation-menus/VerticalNavigationMenu'
import type { NavigationItemData } from '@/src/components/layout/navigation/navigation-menus/types'

function navigationLabel(icon: ReactNode, label: string) {
  return (
    <div className="flex-row-2 items-center">
      <span className="size-5">{icon}</span>
      {label}
    </div>
  )
}

const navigationItems: NavigationItemData[] = [
  {
    id: 'products',
    label: navigationLabel(<Package className="size-5" />, 'Products'),
    items: [
      {
        id: 'clinical',
        label: navigationLabel(<Stethoscope className="size-5" />, 'Clinical'),
        items: [
          { id: 'ward-management', label: navigationLabel(<BedDouble className="size-5" />, 'Ward management'), url: '#' },
          { id: 'patient-overview', label: navigationLabel(<Users className="size-5" />, 'Patient overview'), url: '#' },
        ],
      },
      {
        id: 'operations',
        label: navigationLabel(<Settings className="size-5" />, 'Operations'),
        items: [
          { id: 'task-board', label: navigationLabel(<Kanban className="size-5" />, 'Task board'), url: 'https://helpwave.de/product/tasks', external: true },
          { id: 'staff-planning', label: navigationLabel(<CalendarDays className="size-5" />, 'Staff planning'), url: 'https://helpwave.de/product/staff', external: true },
        ],
      },
      {
        id: 'other',
        label: navigationLabel(<MoreHorizontal className="size-5" />, 'Other'),
        url: '#',
        external: false,
      },
    ],
  },
  {
    id: 'organization',
    label: navigationLabel(<Building2 className="size-5" />, 'Organization'),
    items: [
      {
        id: 'sites',
        label: navigationLabel(<MapPin className="size-5" />, 'Sites'),
        items: [
          { id: 'site-berlin', label: navigationLabel(<MapPin className="size-5" />, 'Berlin'), url: '#' },
          { id: 'site-munich', label: navigationLabel(<MapPin className="size-5" />, 'Munich'), url: '#' },
        ],
      },
      {
        id: 'teams',
        label: navigationLabel(<UsersRound className="size-5" />, 'Teams'),
        items: [
          { id: 'team-nursing', label: navigationLabel(<HeartPulse className="size-5" />, 'Nursing'), url: '#' },
          { id: 'team-administration', label: navigationLabel(<Briefcase className="size-5" />, 'Administration'), url: '#' },
        ],
      },
    ],
  },
  {
    id: 'company',
    label: navigationLabel(<Building className="size-5" />, 'Company'),
    items: [
      { id: 'about', label: navigationLabel(<Info className="size-5" />, 'About'), url: '#' },
      { id: 'careers', label: navigationLabel(<BriefcaseBusiness className="size-5" />, 'Careers'), url: '#' },
    ],
  },
  { id: 'contact', label: navigationLabel(<Mail className="size-5" />, 'Contact'), url: '#' },
]

const meta: Meta<typeof VerticalNavigationMenu> = {
  component: VerticalNavigationMenu,
}

export default meta
type Story = StoryObj<typeof meta>

export const verticalNavigation: Story = {
  args: {
    onlyOneExpandedTree: false,
    items: navigationItems,
  },
  render: (args) => {
    return (
      <div className="w-64 h-96">
        <VerticalNavigationMenu {...args} />
      </div>
    )
  },
}
