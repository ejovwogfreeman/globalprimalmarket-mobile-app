import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ===================== TYPES ===================== */
type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
};

/* ===================== SCREEN ===================== */
export default function AllCryptos() {
  const [market, setMarket] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  /* ---------- Fetch all cryptos ---------- */
  const lastMarketRef = useRef<MarketCoin[]>([]);

  const fetchMarket = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      );

      const data: any = await res.json();

      // Handle rate limit (429)
      if (data?.status?.error_code === 429) {
        if (lastMarketRef.current.length > 0) {
          setMarket(lastMarketRef.current); // instantly use cached data
          setLoading(false); // stop loading immediately
        }
        return; // skip API update
      }

      // Ensure response is an array with items
      if (Array.isArray(data) && data.length > 0) {
        setMarket(data);
        lastMarketRef.current = data; // store for fallback
        setLoading(false); // stop loading
      } else {
        console.log("Unexpected API response:", data);
        // fallback to cached data instantly
        if (lastMarketRef.current.length > 0) {
          setMarket(lastMarketRef.current);
          setLoading(false);
        }
      }
    } catch (err) {
      console.log("Market error — using last market data:", err);
      if (lastMarketRef.current.length > 0) {
        setMarket(lastMarketRef.current); // instantly show cached data
        setLoading(false);
      }
      // else: keep loading spinner if we have no data at all
    }
  };

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ---------- Search filter ---------- */
  const filteredMarket = useMemo(() => {
    if (!Array.isArray(market)) return [];
    if (!search) return market;

    return market.filter(
      (coin) =>
        coin.name?.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, market]);

  const formatCurrency = (amount?: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    }).format(amount ?? 0);

  /* ===================== UI ===================== */
  return (
    // <SafeAreaView style={styles.safe} edges={["top"]}>
    <SafeAreaView style={styles.safe} edges={[]}>
      <View style={styles.container}>
        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            placeholder="Search crypto (BTC, ETH, TRX...)"
            placeholderTextColor="#64748b"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* LIST */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={{ color: "#94a3b8", marginTop: 10 }}>
              Loading market data...
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredMarket.map((coin) => (
              <TouchableOpacity
                key={coin.id}
                style={styles.listItem}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/home/cryptodetail",
                    params: {
                      id: coin.id,
                      symbol: coin.symbol,
                      name: coin.name,
                    },
                  })
                }
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: coin.image }} style={styles.coinIcon} />
                  <View>
                    <Text style={styles.listTitle}>{coin.name}</Text>
                    <Text style={styles.listSub}>
                      {coin.symbol.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.listValue}>
                    ${formatCurrency(coin.current_price)}
                  </Text>
                  <Text
                    style={[
                      styles.change,
                      {
                        color:
                          coin.price_change_percentage_24h < 0
                            ? "#ef4444"
                            : "#22c55e",
                      },
                    ]}
                  >
                    {coin.current_price != null
                      ? coin.current_price.toFixed(2)
                      : "0.00"}
                    %
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: "#f8fafc",
    marginHorizontal: 8,
    fontSize: 14,
  },
  coinIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  listTitle: {
    color: "#f8fafc",
    fontWeight: "600",
  },
  listSub: {
    color: "#94a3b8",
    fontSize: 12,
  },
  listValue: {
    color: "#f8fafc",
    fontWeight: "600",
  },
  change: {
    fontSize: 12,
    marginTop: 4,
  },
});
