import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
  useState,
} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  BackHandler,
  TextInput,
  Pressable,
} from 'react-native'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import Back from 'assets/images/back.png'
import { useNavigation } from '@react-navigation/native'
import { RootNavigationProp } from 'navigator/navigation'
import { ms, mvs, vs } from 'react-native-size-matters'
import { useDispatch } from 'react-redux'
import { searchUserAPI } from 'store/slices/chat'
import { OptionSVG } from 'assets/svgs'
import { getCurrentTheme } from 'constants/Colors'
import { useTheme } from 'contexts/ThemeContext'

type Props = {}
const NewGroupHeader: FunctionComponent<Props> = ({}: Props) => {
  const { theme } = useTheme()
  const Color = getCurrentTheme(theme || 'light')
  const styles = screenStyles(Color)

  const dispatch = useDispatch()
  const navigation = useNavigation<RootNavigationProp>()

  const onBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      BackHandler.exitApp()
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity onPress={onBackPress}>
          <Image
            tintColor={Color.black}
            source={Back}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>New Group</Text>
          <Text style={styles.subTitle}>Add Participants</Text>
        </View>
      </View>
    </View>
  )
}

export default NewGroupHeader

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: vs(8),
      paddingHorizontal: ms(16),
      borderBottomWidth: 1,
      borderBottomColor: Color.border,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Color.primary,
    },
    backIcon: {
      width: ms(16),
      height: ms(16),
    },
    image: {
      width: ms(50),
      height: ms(50),
      backgroundColor: '#dcdcdc',
      borderRadius: ms(25),
      marginStart: ms(10),
    },
    title: {
      fontSize: ms(18),
      color: Color.black,
      fontWeight: '500',
      marginStart: ms(10),
    },
    subTitle: {
      fontSize: ms(12),
      color: Color.black,
      fontWeight: '500',
      marginStart: ms(10),
    },
    search: {
      width: ms(200),
      backgroundColor: Color.messageBackgroundSender,
      paddingVertical: vs(5),
      height: mvs(30),
      paddingHorizontal: ms(10),
      fontSize: mvs(12),
    },
  })
}
