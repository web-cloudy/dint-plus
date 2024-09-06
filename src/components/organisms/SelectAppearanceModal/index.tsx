import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Modal,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { getCurrentTheme } from 'constants/Colors'
import { ms, mvs } from 'react-native-size-matters'
import { Button, LineDivider } from 'components/atoms'
import { useTheme } from 'contexts/ThemeContext'

type Props = {
  isVisible: boolean
  hideModal: () => void
  onPressSave: (option: number) => void
  onPressCancel: () => void
}

const SelectAppearanceModal: FunctionComponent<Props> = ({
  isVisible,
  hideModal,
  onPressSave,
  onPressCancel,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState(0)
  const { theme } = useTheme()
  const Color = getCurrentTheme(theme || 'light')
  const styles = screenStyles(Color)

  useEffect(() => {
    if (isVisible) {
      theme === 'dark'
        ? setSelectedOption(1)
        : theme === 'light'
        ? setSelectedOption(0)
        : setSelectedOption(2)
    }
  }, [isVisible])

  const OptionsView = ({ id, mode }: { id: number; mode: string }) => {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={styles.optionView}
        onPress={() => setSelectedOption(id)}
      >
        <View>
          <Text style={styles.modeText}>{mode}</Text>
          {mode?.includes('settings') && (
            <Text style={styles.descText}>
              {"We'll follow your display device theme"}
            </Text>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => setSelectedOption(id)}
          style={[styles.radioButton]}
        >
          <View
            style={[
              styles.radioInner,
              {
                backgroundColor:
                  selectedOption === id ? Color.black : Color.transparent,
              },
            ]}
          ></View>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return (
    <Modal visible={isVisible} onRequestClose={hideModal} transparent={true}>
      <Pressable style={styles.outerContainer} onPress={hideModal}>
        <View style={styles.innerContainer}>
          <Text style={styles.selectImage}>Appearance</Text>
          <LineDivider />
          <OptionsView id={0} mode={'Light Mode'} />
          <OptionsView id={1} mode={'Dark Mode'} />
          <OptionsView id={2} mode={'Use device settings'} />
          <Button
            text="Save"
            onPress={() => onPressSave(selectedOption)}
            textStyle={styles.save}
            btnStyle={[
              styles.saveBtn,
              {
                backgroundColor:
                  selectedOption === 1 ? Color.chock_black : Color.shaded_white,
              },
            ]}
          />

          <Text style={styles.cancel} onPress={onPressCancel}>
            Cancel
          </Text>
        </View>
      </Pressable>
    </Modal>
  )
}

export default SelectAppearanceModal

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff30',
    },
    optionView: {
      width: '100%',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingVertical: mvs(15),
      paddingHorizontal: ms(25),
      borderBottomWidth: 1,
      borderBottomColor: Color.backgroundColor,
      alignItems: 'center',
    },
    radioButton: {
      height: ms(20),
      width: ms(20),
      borderRadius: 100,
      borderWidth: 1,
      borderColor: Color.black,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioInner: {
      height: ms(12),
      width: ms(12),
      borderRadius: 100,
    },
    outerContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: Color.grey_transparent,
    },
    innerContainer: {
      borderRadius: ms(20),
      backgroundColor: Color.white,
      paddingVertical: mvs(16),
      elevation: 5,
      bottom: 0,
      position: 'absolute',
      width: '100%',
    },
    selectImage: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: '600',
      paddingBottom: mvs(16),
      textAlign: 'center',
    },

    cancel: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: '500',
      paddingVertical: mvs(15),
      textAlign: 'center',
    },

    save: {
      color: Color.grey,
      fontSize: mvs(20),
      fontWeight: '500',
      textAlign: 'center',
    },

    modeText: {
      color: Color.black,
      fontSize: mvs(16),
      fontWeight: '500',
      textAlign: 'left',
    },
    descText: {
      color: Color.grey,
      fontSize: mvs(14),
      fontWeight: '500',
      textAlign: 'left',
    },
    saveBtn: {
      borderRadius: 10,
      marginHorizontal: ms(25),
      marginTop: ms(25),
    },
  })
}
