import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, Dimensions } from "react-native";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import { hp, wp } from "utils/metrix";
import { HeaderWithTitle } from "components/molecules";
import { BarChart } from "react-native-chart-kit";
import useAppDispatch from "hooks/useAppDispatch";
import moment from "moment";
import { EventSelectors, getEarningDetails } from "store/slices/event";

const EarningDetail = ({ navigation, route }) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const dispatch = useAppDispatch();
  const { earningDetailData } = EventSelectors();
  const [labels, setLabels] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getEarningDetails(moment(new Date()).format("YYYY")));
  }, []);

  useEffect(() => {
    if (earningDetailData?.data) {
      let labelData: string[] = [];
      let amountData: string[] = [];

      earningDetailData?.data?.map((res: any) => {
        labelData.push(res?.month);
        amountData.push(res?.total_price);
      });

      setLabels([...labelData]);
      setAmounts([...amountData]);
    }
  }, [earningDetailData]);

  const Options = ({ title, value }: { title: string; value: string }) => {
    return (
      <View style={styles.detailView}>
        <Text style={styles.descText}>{title}</Text>
        <Text style={styles.descText}>{value}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithTitle title="Earnings" blackBar />
      <View style={styles.chartView}>
        <Text style={styles.balance}>Available Balance</Text>
        <Text style={styles.amount}>$3650</Text>
        <BarChart
          data={{
            labels: [...labels],
            datasets: [
              {
                data: [...amounts],
                colors: [
                  (opacity = 1) => Color.primary,
                  (opacity = 1) => Color.primary,
                  (opacity = 1) => Color.primary,
                  (opacity = 1) => Color.primary,
                  (opacity = 1) => Color.primary,
                  (opacity = 1) => Color.primary,
                  (opacity = 1) => Color.primary,
                  (opacity = 1) => Color.primary,
                  (opacity = 1) => Color.primary,
                ],
              },
            ],
          }}
          segments={2}
          width={wp(80)}
          height={hp(28)}
          chartConfig={{
            backgroundColor: "red",
            backgroundGradientFrom: Color.white,
            backgroundGradientTo: Color.white,
            color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`, // Yellow color
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            strokeWidth: 1,
            barPercentage: 0.3,
            decimalPlaces: 0,
            barRadius: 5, // Round radius ends
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "2", // Dot radius
              strokeWidth: "2", // Dot stroke width
              stroke: "#fff",
            },
          }}
          yAxisLabel="$"
          yAxisSuffix=""
          withCustomBarColorFromData={true}
          flatColor={true}
          fromZero={true}
        />
      </View>
      <View style={styles.upcomingView}>
        <Text style={styles.titleText}>Up Coming</Text>
        <Options title={"March"} value={"-$269.00"} />
        <Options title={"March"} value={"-$269.00"} />
        <Options title={"March"} value={"-$269.00"} />
      </View>
      <View style={styles.upcomingView}>
        <Text style={styles.titleText}>Paid</Text>
        <Options title={"March"} value={"-$269.00"} />
        <Options title={"March"} value={"-$269.00"} />
        <Options title={"March"} value={"-$269.00"} />
      </View>
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.plain_white,
    },

    upcomingView: {
      backgroundColor: Color.white,
      width: wp(100),
      marginVertical: hp(2),
      padding: wp(5),
    },
    titleText: {
      color: Color.primary,
      fontSize: hp(1.65),
      fontWeight: "500",
    },
    detailView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: hp(1),
    },
    descText: {
      color: Color.black,
      fontSize: hp(1.65),
      fontWeight: "400",
    },
    chartView: {
      backgroundColor: Color.white,
      width: wp(90),
      marginVertical: hp(2),
      padding: wp(5),
      alignSelf: "center",
      borderRadius: 10,
    },
    balance: {
      color: Color.black,
      fontSize: hp(1),
      fontWeight: "700",
    },
    amount: {
      color: Color.black,
      fontSize: hp(2.2),
      fontWeight: "500",
      marginBottom: hp(2),
    },
  });
};

export default EarningDetail;
