import {
  BedDouble,
  Briefcase,
  BriefcaseBusiness,
  Building,
  Building2,
  CalendarDays,
  File,
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
  UsersRound,
  type LucideIcon
} from 'lucide-react'
import type { NavigationItemData } from '@/src/components/layout/navigation/navigation-menus/types'

export function navigationLabel(Icon: LucideIcon, label: string) {
  return (
    <div className="flex-row-2 items-center">
      <Icon className="size-4 shrink-0" aria-hidden />
      {label}
    </div>
  )
}

export const sampleNavigationItems: NavigationItemData[] = [
  {
    id: 'products',
    label: navigationLabel(Package, 'Products'),
    items: [
      {
        id: 'clinical',
        label: navigationLabel(Stethoscope, 'Clinical'),
        items: [
          { id: 'ward-management', label: navigationLabel(BedDouble, 'Ward management'), url: '#' },
          { id: 'patient-overview', label: navigationLabel(Users, 'Patient overview'), url: '#' },
        ],
      },
      {
        id: 'operations',
        label: navigationLabel(Settings, 'Operations'),
        items: [
          { id: 'task-board', label: navigationLabel(Kanban, 'Task board'), url: 'https://helpwave.de/product/tasks', external: true },
          { id: 'staff-planning', label: navigationLabel(CalendarDays, 'Staff planning'), url: 'https://helpwave.de/product/staff', external: true },
        ],
      },
      {
        id: 'other',
        label: navigationLabel(MoreHorizontal, 'Other'),
        url: '#',
        external: false,
      },
    ],
  },
  {
    id: 'organization',
    label: navigationLabel(Building2, 'Organization'),
    items: [
      {
        id: 'sites',
        label: navigationLabel(MapPin, 'Sites'),
        items: [
          { id: 'site-berlin', label: navigationLabel(MapPin, 'Berlin'), url: '#' },
          { id: 'site-munich', label: navigationLabel(MapPin, 'Munich'), url: '#' },
        ],
      },
      {
        id: 'teams',
        label: navigationLabel(UsersRound, 'Teams'),
        items: [
          { id: 'team-nursing', label: navigationLabel(HeartPulse, 'Nursing'), url: '#' },
          { id: 'team-administration', label: navigationLabel(Briefcase, 'Administration'), url: '#' },
        ],
      },
    ],
  },
  {
    id: 'company',
    label: navigationLabel(Building, 'Company'),
    items: [
      { id: 'about', label: navigationLabel(Info, 'About'), url: '#' },
      { id: 'careers', label: navigationLabel(BriefcaseBusiness, 'Careers'), url: '#' },
    ],
  },
  { id: 'contact', label: navigationLabel(Mail, 'Contact'), url: '#' },
]

export const longNavigationItems: NavigationItemData[] = [
  ...sampleNavigationItems,
  ...Array.from({ length: 10 }, (_, sectionIndex) => ({
    id: `section-${sectionIndex}`,
    label: navigationLabel(Folder, `Section ${sectionIndex + 1}`),
    items: Array.from({ length: 6 }, (_, itemIndex) => ({
      id: `section-${sectionIndex}-item-${itemIndex}`,
      label: navigationLabel(File, `Item ${itemIndex + 1}`),
      url: '#',
    })),
  })),
]
