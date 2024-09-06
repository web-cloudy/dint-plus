import React, { FunctionComponent } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { getCurrentTheme } from 'constants/Colors'
import { useTheme } from 'contexts/ThemeContext'

type Props = { style?: ViewStyle }

const LineDivider: FunctionComponent<Props> = ({ style }: Props) => {
  const { theme } = useTheme()
  const Color = theme && getCurrentTheme(theme)
  const styles = screenStyles(Color)

  return <View style={[styles.container, style]} />
}

export default LineDivider

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      height: 1,
      width: '100%',
      backgroundColor: Color.backgroundColor,
    },
  })
}
