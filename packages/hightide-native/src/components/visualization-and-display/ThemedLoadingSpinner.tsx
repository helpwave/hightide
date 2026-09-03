import { useEffect, useRef } from 'react'
import {
  Animated,
  Easing
} from 'react-native'
import { LoaderCircle } from 'lucide-react-native'

import { ThemedIcon, type ThemedIconProps } from './ThemedIcon'

export type ThemedLoadingSpinnerProps = Omit<ThemedIconProps, 'icon'>

export const ThemedLoadingSpinner = (props: ThemedLoadingSpinnerProps) => {
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 750,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
    animation.start()
    return () => {
      animation.stop()
      progress.setValue(0)
    }
  }, [progress])

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <ThemedIcon icon={LoaderCircle} {...props} />
    </Animated.View>
  )
}
