import type { ListItemContentProps } from './ListItemTypes'

export function ListItemContent({
  title,
  subtitle,
  content,
  contentOrder = 'titleFirst',
  leading,
  trailing,
}: ListItemContentProps) {
  const titleNode = title != null
    ? <span className="list-item-title">{title}</span>
    : null
  const subtitleNode = subtitle != null
    ? <span className="list-item-subtitle">{subtitle}</span>
    : null
  const text = content != null
    ? content
    : contentOrder === 'subtitleFirst'
      ? <>{subtitleNode}{titleNode}</>
      : <>{titleNode}{subtitleNode}</>

  return (
    <>
      {leading != null && (
        <span className="list-item-leading">{leading}</span>
      )}
      <span className="list-item-content">
        {text}
      </span>
      {trailing != null && (
        <span className="list-item-trailing">{trailing}</span>
      )}
    </>
  )
}
