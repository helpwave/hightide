import type { ReactNode } from 'react'
import type { ExpandableSectionProps } from './ExpandableSection'
import { ExpandableSection } from './ExpandableSection'

export type FAQItem = Pick<ExpandableSectionProps, 'isExpanded' | 'className'> & {
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
          <ExpandableSection
            {...restProps}
            trigger={title}
            contentProps={{ isClosingOnClick: true }}
          >
            {content}
          </ExpandableSection>
        </li>
      ))}
    </ul>
  )
}
