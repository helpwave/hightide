import type { ComponentType, ImgHTMLAttributes } from 'react'

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>

export type ImageComponent = ComponentType<ImageProps> | 'img'
