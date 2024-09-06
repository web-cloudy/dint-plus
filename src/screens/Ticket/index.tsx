import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { View, StyleSheet, Text, SafeAreaView } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../navigator/navigation'

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen'
import { getRandomNum } from 'utils'
import { useTheme } from 'contexts/ThemeContext'
import { getCurrentTheme } from 'constants/Colors'

type Props = Record<string, never>
type TicketRouteProp = RouteProp<RootStackParamList, 'Ticket'>

const Ticket: FunctionComponent<Props> = ({}: Props) => {
  const navigation = useNavigation<RootNavigationProp>()
  const route = useRoute<TicketRouteProp>()
  const [randomNum, setRandomNum] = useState(getRandomNum())
  const { theme } = useTheme()
  const Color = getCurrentTheme(theme || 'light')
  const styles = screenStyles(Color)

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const rand = Math.floor(Math.random() * 100000 + 999999)
      setRandomNum(rand)
      updateAuthid(rand)
    }, 60 * 1000)
  }, [])

  const updateAuthid = (rand: number) => {}

  const onHeaderIconPress = () => {
    navigation.pop()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.codeContainer}>
        <Text style={styles.titleView}>Use Dint Scanner</Text>
        <View style={styles.qrContainer}>
          <QRCode
            size={widthPercentageToDP(70)}
            // value={`Eventid :${eventId}, Userid:${userId}, authid:${randomNum}`}
            value="asd"
          />
        </View>
        <Text style={styles.ticketNum}>{randomNum}</Text>
        <Text style={styles.infoText}>
          {'For security purposes your ticket regenerates every 60 seconds.'}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    qrContainer: {
      marginTop: heightPercentageToDP(5),
    },
    infoText: {
      color: '#424242',
      marginTop: heightPercentageToDP(1),
      fontSize: 16,
      textAlign: 'center',
    },
    ticketNum: {
      color: 'black',
      fontWeight: '600',
      marginTop: heightPercentageToDP(3),
      fontSize: widthPercentageToDP(7),
    },
    titleView: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: widthPercentageToDP(7),
    },
    codeContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: widthPercentageToDP(15),
    },
    container: {
      flex: 1,
    },
  })
}

export default Ticket
