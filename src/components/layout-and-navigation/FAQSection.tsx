import type { ReactNode } from 'react'
import clsx from 'clsx'
import type { ExpandableProps } from './Expandable'
import { ExpansionIcon } from './Expandable'
import { ExpandableUncontrolled } from './Expandable'
import { MarkdownInterpreter } from './MarkdownInterpreter'

type ContentType = {
  type: 'markdown',
  value: string,
} | {
  type: 'custom',
  value: ReactNode,
}

export type FAQItem = Pick<ExpandableProps, 'isExpanded' | 'className'> & {
  id: string,
  title: string,
  content: ContentType,
}

export type FAQSectionProps = {
  entries: FAQItem[],
  expandableClassName?: string,
}

/**
 * Description
 */
export const FAQSection = ({
                             entries,
                             expandableClassName
                           }: FAQSectionProps) => {
  return (
    <div className="flex-col-4">
      {entries.map(({ id, title, content, ...restProps }) => (
        <ExpandableUncontrolled
          key={id}
          {...restProps}
          label={(<h3 id={id} className="typography-title-md-semibold">{title}</h3>)}
          clickOnlyOnHeader={false}
          icon={(expanded) => (<ExpansionIcon isExpanded={expanded} className="text-primary"/>)}
          className={clsx('rounded-xl', expandableClassName)}
        >
          <div className="mt-2">
            {content.type === 'markdown' ? (<MarkdownInterpreter text={content.value}/>) : content.value}
          </div>
        </ExpandableUncontrolled>
      ))}
    </div>
  )
}
