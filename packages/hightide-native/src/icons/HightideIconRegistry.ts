import {
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Minus,
  Pencil,
  Plus,
  Search,
  SendHorizontal,
  User,
  X
} from 'lucide-react-native'

import type { IconComponent } from './types'

export const HightideIconRegistry = {
  Check: Check,
  CheckCheck: CheckCheck,
  ChevronDown: ChevronDown,
  ChevronRight: ChevronRight,
  Clock: Clock,
  Download: Download,
  FileText: FileText,
  Minus: Minus,
  Pencil: Pencil,
  Plus: Plus,
  Search: Search,
  SendHorizontal: SendHorizontal,
  User: User,
  X: X,
} as const satisfies Record<string, IconComponent>

export type HightideIconName = keyof typeof HightideIconRegistry
