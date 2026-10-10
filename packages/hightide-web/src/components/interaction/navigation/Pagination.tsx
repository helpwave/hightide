import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { TextInput } from '../../data-input/input/TextInput'
import { useEditCompletable } from '@helpwave/hightide-utils/hooks'
import { MathUtil } from '@helpwave/hightide-utils/utils'
import type { HTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { IconButton } from '../IconButton'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  pageIndex: number,
  pageCount: number,
  onPageIndexChanged?: (pageIndex: number) => void,
}

/**
 * A Component showing the pagination allowing first, before, next and last page navigation
 */
export const Pagination = ({
  pageIndex,
  pageCount,
  onPageIndexChanged,
  ...props
}: PaginationProps) => {
  const translation = useHightideTranslation()
  const [value, setValue] = useState<string>((pageIndex + 1).toString())
  const edit = useEditCompletable({
    value,
    delay: 800,
    onEditComplete: (next) => {
      onPageIndexChanged?.(MathUtil.clamp(Number(next) - 1, 0, pageCount - 1))
    },
  })

  const noPages = pageCount === 0
  const onFirstPage = pageIndex === 0 && !noPages
  const onLastPage = pageIndex === pageCount - 1

  useEffect(() => {
    if (noPages) {
      setValue('0')
    } else {
      setValue((pageIndex + 1).toString())
    }
  }, [pageIndex, noPages])

  const changePage = (page: number) => {
    onPageIndexChanged?.(page)
  }

  return (
    <div {...props} className={clsx('flex-row-1', props.className)} >
      <IconButton
        tooltip={translation('first')}
        variant="foreground"
        color="neutral"
        onClick={() => changePage(0)} disabled={onFirstPage || noPages}
        icon={ChevronFirst}
      />
      <IconButton
        tooltip={translation('previous')}
        variant="foreground"
        color="neutral"
        onClick={() => changePage(pageIndex - 1)} disabled={onFirstPage || noPages}
        icon={ChevronLeft}
      />
      <div className="flex-row-2 min-w-56 items-center justify-center mx-2 text-center">
        <TextInput
          value={value}
          isDisabled={noPages}
          onValueChange={next => {
            const nextValue = next
              ? MathUtil.clamp(Number(next), 1, pageCount).toString()
              : next
            setValue(nextValue)
            edit.setTimer()
          }}
          inputProps={{
            className: clsx('w-24 text-center font-bold input-indicator-hidden h-10'),
            type: 'number',
            min: 1,
            max: pageCount,
            onBlur: () => {
              edit.completeNow()
            },
          }}
        />
        <span className="select-none w-10">{translation('of')}</span>
        <span
          className="flex-row-2 w-24 items-center justify-center select-none h-10 bg-input-background text-input-text rounded-md font-bold"
        >
          {pageCount}
        </span>
      </div>
      <IconButton
        tooltip={translation('next')}
        variant="foreground"
        color="neutral"
        onClick={() => changePage(pageIndex + 1)} disabled={onLastPage || noPages}
        icon={ChevronRight}
      />
      <IconButton
        tooltip={translation('last')}
        variant="foreground"
        color="neutral"
        onClick={() => changePage(pageCount - 1)} disabled={onLastPage || noPages}
        icon={ChevronLast}
      />
    </div>
  )
}
