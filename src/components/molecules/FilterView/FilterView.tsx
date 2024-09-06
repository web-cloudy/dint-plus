import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "navigator/navigation";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { Images } from "assets/images";

type Props = {
  filters?: any;
  onClickFilter?: any;
  onClickFilterOption?: any
};

const FilterView: FunctionComponent<Props> = ({
  filters,
  onClickFilterOption,
  onClickFilter
}: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  return (
    <View style={styles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={filters}
        horizontal={true}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => onClickFilterOption(index)}
              style={[
                styles.filterView,
                { backgroundColor: item?.selected ? "#836900" : Color.white },
              ]}
            >
              <Text style={styles.filterText}>{item?.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity onPress={onClickFilter}>
      <Image
        resizeMode="contain"
        source={Images.filters}
        style={styles.filterIcon}
      />
      </TouchableOpacity>
     
    </View>
  );
};

export default FilterView;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingTop: hp(2),
      paddingHorizontal: wp(5),
      alignItems: "center",
      backgroundColor: Color.plain_white,
      justifyContent: "center",
      width: wp(100),
    },

    filterIcon: {
      height: hp(1.9),
      width: hp(1.9),
      alignSelf: "center",
    },
    filterView: {
      borderRadius: 30,
      paddingHorizontal: wp(3.5),
      paddingVertical: hp(1.2),
      backgroundColor: Color.white,
      marginRight: wp(3),
      alignSelf: "center",
    },
    filterText: {
      fontSize: hp(1.6),
      fontWeight: "500",
      color: Color.black,
    },
  });
};
