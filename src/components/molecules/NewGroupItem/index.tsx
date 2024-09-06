import React, { FunctionComponent } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { ms, mvs, vs } from 'react-native-size-matters'
import { AvatarPNG } from 'assets/images'
import { RadioButton } from 'components/atoms'
import { SearchUser } from 'types/chat'
import { getCurrentTheme } from 'constants/Colors'
import { useTheme } from 'contexts/ThemeContext'

type Props = {
  data: SearchUser
  onPress?: (item: SearchUser) => void
}

const NewGroupItem: FunctionComponent<Props> = ({ data, onPress }: Props) => {
  const { theme } = useTheme()
  const Color = getCurrentTheme(theme || 'light')
  const styles = screenStyles(Color)
  return (
    <TouchableOpacity onPress={() => onPress(data)}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={
            data?.profile_image ? { uri: data?.profile_image } : AvatarPNG
          }
        />
        <View style={styles.chatInfoContainer}>
          <Text style={styles.name}>{data?.display_name ?? 'Max P'}</Text>
          <Text style={styles.description}>{'Hey There'}</Text>
        </View>
        <RadioButton isSelected={data?.isSelected || false} />
      </View>
    </TouchableOpacity>
  )
}

export default NewGroupItem

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: vs(8),
      paddingHorizontal: ms(16),
      alignItems: 'center',
    },
    image: {
      width: ms(40),
      height: ms(40),
      backgroundColor: '#dcdcdc',
      borderRadius: ms(25),
    },
    chatInfoContainer: { flex: 1, marginStart: ms(16) },
    name: { color: Color.black, fontWeight: '400', fontSize: mvs(16) },
    description: { fontSize: mvs(14), color: Color.grey },
  })
}
