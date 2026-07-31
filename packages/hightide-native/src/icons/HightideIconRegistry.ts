import {
  Check,
  CheckCheck,
  ChevronRight,
  Download,
  FileText,
  Minus,
  Plus,
  SendHorizontal,
  User
} from 'lucide-react-native'

import type { IconComponent } from './types'

export const HightideIconRegistry = {
  Check: Check,
  CheckCheck: CheckCheck,
  ChevronRight: ChevronRight,
  Download: Download,
  FileText: FileText,
  Minus: Minus,
  Plus: Plus,
  SendHorizontal: SendHorizontal,
  User: User,
} as const satisfies Record<string, IconComponent>

export type HightideIconName = keyof typeof HightideIconRegistry
