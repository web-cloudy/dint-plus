import React, { FunctionComponent } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { ms, mvs, vs } from 'react-native-size-matters'
import { AvatarPNG } from 'assets/images'
import { RadioButton } from 'components/atoms'
import { RemoveGroupUserSVG } from 'assets/svgs'
import { SearchUser } from 'types/chat'
import { getCurrentTheme } from 'constants/Colors'
import { useTheme } from 'contexts/ThemeContext'

type Props = {
  data: SearchUser
  onPressRemove?: (item: SearchUser) => void
}

const SelectedGroupUserItem: FunctionComponent<Props> = ({
  data,
  onPressRemove,
}: Props) => {
  const { theme } = useTheme()
  const Color = getCurrentTheme(theme || 'light')
  const styles = screenStyles(Color)

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={data?.profile_image ? { uri: data?.profile_image } : AvatarPNG}
      />
      <Text
        style={{
          fontSize: mvs(12),
          textAlign: 'center',
          color: Color.black,
          marginTop: mvs(3),
        }}
      >
        {data?.display_name}
      </Text>
      <TouchableOpacity
        onPress={() => onPressRemove && onPressRemove(data)}
        style={{ position: 'absolute', right: 0 }}
      >
        <RemoveGroupUserSVG width={ms(18)} height={ms(18)} />
      </TouchableOpacity>
    </View>
  )
}

export default SelectedGroupUserItem

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      width: ms(50),
      marginEnd: ms(24),
    },
    image: {
      width: ms(50),
      height: ms(50),
      backgroundColor: '#dcdcdc',
      borderRadius: ms(25),
    },
    chatInfoContainer: { flex: 1, marginStart: ms(16) },
    name: { color: Color.black, fontWeight: '500', fontSize: mvs(16) },
    description: { fontSize: mvs(14) },
  })
}
