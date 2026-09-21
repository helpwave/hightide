import type { ReactNode } from 'react'
import type { ExpandableProps } from './Expandable'
import { ExpandableContent, ExpandableHeader, ExpandableRoot } from './Expandable'

export type FAQItem = Pick<ExpandableProps, 'isExpanded' | 'className'> & {
  title: string,
  content: ReactNode,
}

export type FAQSectionProps = {
  entries: FAQItem[],
}

// TODO add a descirption
export const FAQSection = ({
  entries,
}: FAQSectionProps) => {
  return (
    <ul className="flex-col-4">
      {entries.map(({ title, content, ...restProps }, index) => (
        <li key={index}>
          <ExpandableRoot
            {...restProps}
            allowContainerToggle={true}
          >
            <ExpandableHeader>
              {title}
            </ExpandableHeader>
            <ExpandableContent>
              {content}
            </ExpandableContent>
          </ExpandableRoot>
        </li>
      ))}
    </ul>
  )
}
