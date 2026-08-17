import type { ReactNode } from 'react'
import { Fragment } from 'react'
import type { StyleProp, TextStyle } from 'react-native'

import { ThemedText } from '../visualization-and-display/ThemedText'

export type ListItemContentOrder = 'titleFirst' | 'subtitleFirst'

export type ListItemTextContentProps = {
  title?: string,
  subtitle?: string,
  content?: ReactNode,
  contentOrder?: ListItemContentOrder,
}

export const ListItemTextContent = ({
  title,
  subtitle,
  content,
  contentOrder = 'titleFirst',
  titleStyle,
  subtitleStyle,
}: ListItemTextContentProps & {
  titleStyle?: StyleProp<TextStyle>,
  subtitleStyle?: StyleProp<TextStyle>,
}) => {
  if (content != null) {
    return <>{content}</>
  }

  const titleNode = title != null
    ? <ThemedText style={titleStyle}>{title}</ThemedText>
    : null
  const subtitleNode = subtitle != null
    ? <ThemedText style={subtitleStyle}>{subtitle}</ThemedText>
    : null

  if (contentOrder === 'subtitleFirst') {
    return (
      <Fragment>
        {subtitleNode}
        {titleNode}
      </Fragment>
    )
  }

  return (
    <Fragment>
      {titleNode}
      {subtitleNode}
    </Fragment>
  )
}
