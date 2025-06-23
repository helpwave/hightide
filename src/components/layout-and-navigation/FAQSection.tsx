import type { ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ExpandableProps } from './Expandable'
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
  const chevronSize = 28
  return (
    <div className="col gap-y-4">
      {entries.map(({ id, title, content, ...restProps }) => (
        <ExpandableUncontrolled
          key={id}
          {...restProps}
          label={(<h3 id={id} className="textstyle-title-md">{title}</h3>)}
          clickOnlyOnHeader={false}
          icon={(expanded) => expanded ?
            (<ChevronUp size={chevronSize} className="text-primary" style={{ minWidth: `${chevronSize}px` }}/>) :
            (<ChevronDown size={chevronSize} className="text-primary"/>)
          }
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
