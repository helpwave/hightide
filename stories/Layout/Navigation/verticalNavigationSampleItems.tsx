import {
  BedDouble,
  Briefcase,
  BriefcaseBusiness,
  Building,
  Building2,
  CalendarDays,
  FileIcon,
  Folder,
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
import type { NavigationItemData } from '@/src/components/layout/navigation/navigation-menus/types'
import type { ReactNode } from 'react'

export function navigationLabel(Icon: ReactNode, label: string) {
  return (
    <div className="flex-row-2 items-center">
      <span className="size-5">
        {Icon}
      </span>
      {label}
    </div>
  )
}

export const sampleNavigationItems: NavigationItemData[] = [
  {
    id: 'products',
    label: navigationLabel(<Package className="size-5" />, 'Products'),
    items: [
      {
        id: 'clinical',
        label: navigationLabel(<Stethoscope className="size-5" />, 'Clinical'),
        items: [
          { id: 'ward-management', label: navigationLabel(<BedDouble className="size-5" />  , 'Ward management'), url: '#' },
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

export const longNavigationItems: NavigationItemData[] = [
  ...sampleNavigationItems,
  ...Array.from({ length: 10 }, (_, sectionIndex) => ({
    id: `section-${sectionIndex}`,
    label: navigationLabel(<Folder className="size-5" />, `Section ${sectionIndex + 1}`),
    items: Array.from({ length: 6 }, (_, itemIndex) => ({
      id: `section-${sectionIndex}-item-${itemIndex}`,
      label: navigationLabel(<FileIcon className="size-5" />, `Item ${itemIndex + 1}`),
      url: '#',
    })),
  })),
]
