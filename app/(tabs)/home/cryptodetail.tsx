import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const MAX_POINTS = 30;

export default function CryptoDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const [coin, setCoin] = useState<any>(null);
  const [chart, setChart] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lastPriceRef = useRef<number>(0);
  const lastChartRef = useRef<number[]>([]);
  const intervalRef = useRef<any>(null);

  // ---------- Fetch coin details ----------
  const fetchCoin = async () => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
      const data = await res.json();

      if (data?.status?.error_code) {
        setError(data.status.error_message);
        setCoin(null);
      } else {
        setCoin(data);
        navigation.setOptions({ title: data.name ?? "Crypto Detail" });
        lastPriceRef.current = data.market_data?.current_price?.usd ?? 0;

        // Prefill chart immediately with slight variations
        if (lastChartRef.current.length === 0) {
          const initial = Array(MAX_POINTS)
            .fill(0)
            .map(
              () => lastPriceRef.current * (1 + (Math.random() - 0.5) * 0.01), // ±0.5% random variation
            );
          setChart(initial);
          lastChartRef.current = initial;
        }
      }
    } catch {
      setError("Failed to fetch coin data.");
      setCoin(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Fetch historical chart ----------
  const fetchInitialChart = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=0.02&interval=minute`,
      );
      const data = await res.json();
      const prices = data.prices?.map((p: any) => p[1]) || [];

      if (prices.length > 0) {
        const sliced = prices.slice(-MAX_POINTS);
        setChart(sliced);
        lastChartRef.current = sliced;
        lastPriceRef.current = sliced[sliced.length - 1];
      }
    } catch {
      // silently use prefilled chart if fetch fails
      if (lastChartRef.current.length > 0) setChart(lastChartRef.current);
    }
  };

  // ---------- Fetch live price updates ----------
  //   const fetchLatestPrice = async () => {
  //     try {
  //       if (!id || Array.isArray(id)) return;

  //       const res = await fetch(
  //         `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
  //           id,
  //         )}&vs_currencies=usd`,
  //       );

  //       if (!res.ok) {
  //         // HTTP error (e.g., 429)
  //         setChart((prev) => {
  //           const newData = [...prev, lastPriceRef.current ?? 0];
  //           if (newData.length > MAX_POINTS) newData.shift();
  //           lastChartRef.current = newData;
  //           return newData;
  //         });
  //         return; // exit silently
  //       }

  //       const data: any = await res.json();
  //       const price = data[id]?.usd ?? lastPriceRef.current ?? 0;
  //       lastPriceRef.current = price;

  //       setChart((prev) => {
  //         const newData = [...prev, price];
  //         if (newData.length > MAX_POINTS) newData.shift();
  //         lastChartRef.current = newData;
  //         return newData;
  //       });
  //     } catch {
  //       // Any network or parse error: silently use last price
  //       setChart((prev) => {
  //         const newData = [...prev, lastPriceRef.current ?? 0];
  //         if (newData.length > MAX_POINTS) newData.shift();
  //         lastChartRef.current = newData;
  //         return newData;
  //       });
  //     }
  //   };

  const fetchLatestPrice = async () => {
    try {
      if (!id || Array.isArray(id)) return;

      // Skip fetch if last fetch was very recent (e.g., <30s)
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
          id,
        )}&vs_currencies=usd`,
      );

      if (!res.ok) {
        // Hit rate limit or HTTP error
        // console.warn("Using cached price due to HTTP error");
        updateChart(lastPriceRef.current);
        return;
      }

      const data: any = await res.json();
      const price = data[id]?.usd ?? lastPriceRef.current ?? 0;
      if (price !== lastPriceRef.current) {
        lastPriceRef.current = price;
        updateChart(price);
      }
    } catch {
      //   console.warn("Network error, using last price");
      updateChart(lastPriceRef.current);
    }
  };

  // helper to update chart
  const updateChart = (price: number) => {
    setChart((prev) => {
      const newData = [...prev, price];
      if (newData.length > MAX_POINTS) newData.shift();
      lastChartRef.current = newData;
      return newData;
    });
  };

  // ---------- Effect on mount ----------
  useEffect(() => {
    fetchCoin();
    fetchInitialChart();

    intervalRef.current = setInterval(fetchLatestPrice, 30000); // update every 5s
    return () => clearInterval(intervalRef.current);
  }, []);

  // ---------- Render ----------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={{ color: "#94a3b8", marginTop: 10 }}>
          Loading coin data...
        </Text>
      </View>
    );
  }

  if (error || !coin || !coin.market_data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#f8fafc", textAlign: "center" }}>
          {error ?? "Coin data not available."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {coin.name ?? "Unknown"} ({coin.symbol?.toUpperCase() ?? "---"})
      </Text>

      <Text style={styles.price}>
        ${coin.market_data?.current_price?.usd?.toLocaleString() ?? "---"}
      </Text>

      <LineChart
        data={{
          labels: Array(chart.length).fill(""),
          datasets: [{ data: chart }],
        }}
        width={screenWidth - 40}
        height={250}
        fromZero={false}
        withDots={false}
        withInnerLines={true}
        withVerticalLines={false}
        yAxisLabel="$"
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: "#020617",
          backgroundGradientTo: "#020617",
          color: () => "#38bdf8",
          labelColor: () => "#94a3b8",
        }}
        bezier
        style={{ marginVertical: 20, borderRadius: 16 }}
        segments={5} // number of horizontal lines
        yLabelsOffset={0}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.investBtn}
          onPress={() => router.push("/home/investplan")}
        >
          <Text style={styles.btnText}>Invest Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "700",
  },
  price: {
    color: "#22c55e",
    fontSize: 28,
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  investBtn: {
    backgroundColor: "#38bdf8",
    paddingVertical: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "#020617",
    fontWeight: "700",
    fontSize: 18,
  },
});
