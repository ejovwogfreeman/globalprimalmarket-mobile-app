import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
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
export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [market, setMarket] = useState<MarketCoin[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(true);

  // if (!user) {
  //   return null; // or loader
  // }

  const [photoUri, setPhotoUri] = useState<string[]>(
    user?.profilePicture ? user.profilePicture : [],
  );

  React.useEffect(() => {
    if (user?.profilePicture) {
      setPhotoUri(
        Array.isArray(user.profilePicture)
          ? user.profilePicture
          : [user.profilePicture],
      );
    }
  }, [user]);

  useEffect(() => {
    // console.log("Logged-in user:", user); // ✅ check the user
  }, [user]);

  /* ---------- Helpers ---------- */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const getFormattedDateTime = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount?: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount ?? 0);

  /* ---------- Fetch real-time crypto ---------- */
  const lastMarketRef = useRef<MarketCoin[]>([]);

  const fetchMarket = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
      );

      const data: any = await res.json();

      if (data?.status?.error_code === 429) {
        // Use last successful data
        setMarket(lastMarketRef.current);
        return;
      }

      if (Array.isArray(data)) {
        setMarket(data);
        // Save successful data for fallback
        lastMarketRef.current = data;
      } else {
        console.log("Unexpected API response:", data);
        setMarket(lastMarketRef.current);
      }
    } catch (err) {
      console.log("Market fetch error — using last market data:", err);
      setMarket(lastMarketRef.current);
    } finally {
      setLoadingMarket(false);
    }
  };

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ---------- BALANCE SELECT LOGIC ---------- */
  // const currencies = Object.entries(user?.balance || []); // [["BTC", 0.5], ["ETH", 2], ...]
  const currencies = user ? Object.entries(user.balance || {}) : [];
  const [selected, setSelected] = useState(
    currencies.find(([symbol]) => symbol.toUpperCase() === "BTC") ||
      currencies[0] || ["BTC", 0],
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (symbol: string, amount: number) => {
    setSelected([symbol, amount]);
    setShowDropdown(false);
  };

  if (!user) {
    return null; // or loader
  }

  /* ===================== UI ===================== */
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>{getGreeting()} 👋</Text>
            <Text style={styles.name}>{user.userName}</Text>
            <Text style={styles.welcome}>{getFormattedDateTime()}</Text>
          </View>

          <View style={styles.profile}>
            {photoUri && photoUri.length > 0 ? (
              <Image source={{ uri: photoUri[0] }} style={styles.avatar} />
            ) : (
              <Text style={styles.profileText}>
                {user?.userName?.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        </View>

        {/* BALANCE */}
        <View style={[styles.balanceCard, { position: "relative" }]}>
          <Text style={styles.balanceLabel}>Portfolio Balance</Text>

          {/* SELECTED BALANCE DISPLAY */}
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Text style={{ fontSize: 32, fontWeight: "700", color: "#f8fafc" }}>
              {formatCurrency(Number(selected[1])) || 0}
            </Text>
            <Text style={{ fontSize: 16, color: "#f8fafc", marginLeft: 6 }}>
              {selected[0].toUpperCase()}
            </Text>
            <Ionicons
              name={showDropdown ? "caret-up-outline" : "caret-down-outline"}
              size={18}
              color="#38bdf8"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>

          {/* DROPDOWN - absolute overlay */}
          {showDropdown && currencies.length > 0 && (
            <View
              style={{
                position: "absolute",
                top: 80, // adjust based on balance card padding + selected row height
                left: 50,
                right: 0,
                backgroundColor: "#1e293b",
                borderWidth: 1,
                borderColor: "#38bdf8",
                borderRadius: 8,
                width: 200,
                padding: 6,
                zIndex: 9999, // bring above everything
              }}
            >
              {currencies.map(([symbol, amount]) => (
                <TouchableOpacity
                  key={symbol}
                  onPress={() => handleSelect(symbol, Number(amount))}
                  style={{ paddingVertical: 6 }}
                >
                  <Text style={{ color: "#f8fafc", fontSize: 16 }}>
                    {formatCurrency(Number(amount)) || 0} {symbol.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.profitText}>Market updates every 30 seconds</Text>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <ActionButton
            title="Deposit"
            icon="cash-outline"
            route="/home/depositmethod"
          />
          <ActionButton
            title="Withdraw"
            icon="arrow-down-outline"
            route="/home/withdrawmethod"
          />
          <ActionButton
            title="Invest"
            icon="trending-up-outline"
            route="/home/investplan"
          />
          <ActionButton
            title="History"
            icon="swap-horizontal-outline"
            route="/home/transactions"
          />
        </View>

        {/* LIVE MARKET */}
        <View style={styles.sectionHeader}>
          <SectionTitle title="Live Market Prices" />

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => router.push("/home/crypto")}
          >
            <Text style={styles.viewAll}>View All Cryoto</Text>
            <Ionicons name="chevron-forward" size={14} color="#38bdf8" />
          </TouchableOpacity>
        </View>

        {loadingMarket ? (
          <Text style={{ color: "#94a3b8" }}>Loading market data...</Text>
        ) : (
          market.map((coin) => (
            <CryptoItem
              key={coin.id}
              name={coin.name}
              symbol={coin.symbol.toUpperCase()}
              price={`$${formatCurrency(coin.current_price)}`}
              change={`${coin.price_change_percentage_24h?.toFixed(2) ?? "0.00"}%`}
              negative={coin.price_change_percentage_24h < 0}
              image={coin.image}
            />
          ))
        )}

        {/* INSIGHTS */}
        <SectionTitle title="Market Insights" />
        <Insight text="🔥 Bitcoin dominance remains strong among large investors." />
        <Insight text="📈 Ethereum shows accumulation near key support levels." />
        <Insight text="⚠️ Increased volatility expected this week." />

        {/* WHY US */}
        <SectionTitle title="Why Choose Us?" />
        <Insight text="✅ Smart investment tools built for long-term growth." />
        <Insight text="🔒 Secure transactions with modern encryption." />
        <Insight text="🚀 Built for serious crypto investors." />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===================== COMPONENTS ===================== */

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function ActionButton({
  title,
  icon,
  route,
}: {
  title: string;
  icon: any;
  route: any;
}) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.actionBtn}
      onPress={() => router.push(route)}
    >
      <Ionicons name={icon} size={18} color="#38bdf8" />
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
}

function CryptoItem({
  name,
  symbol,
  price,
  change,
  negative,
  image,
}: {
  name: string;
  symbol: string;
  price: string;
  change: string;
  negative?: boolean;
  image: string;
}) {
  return (
    <View style={styles.listItem}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: image }} style={styles.coinIcon} />
        <View>
          <Text style={styles.listTitle}>{name}</Text>
          <Text style={styles.listSub}>{symbol}</Text>
        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.listValue}>{price}</Text>
        <Text
          style={[styles.change, { color: negative ? "#ef4444" : "#22c55e" }]}
        >
          {change}
        </Text>
      </View>
    </View>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <View style={styles.newsItem}>
      <Text style={styles.newsText}>{text}</Text>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  welcome: { color: "#94a3b8", fontSize: 13 },
  name: { color: "#f8fafc", fontSize: 22, fontWeight: "700" },
  profile: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#38bdf8",
  },
  profileText: { color: "#38bdf8", fontWeight: "700" },
  balanceCard: {
    backgroundColor: "#0f172a",
    padding: 20,
    borderRadius: 18,
    marginBottom: 24,
  },
  balanceLabel: { color: "#94a3b8" },
  balance: { color: "#f8fafc", fontSize: 32, fontWeight: "700" },
  profitText: { color: "#94a3b8", marginTop: 4 },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionBtn: {
    backgroundColor: "#1e293b",
    width: "48%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: { color: "#38bdf8", fontWeight: "600", marginTop: 6 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
  },

  viewAll: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 5,
  },

  sectionTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 10,
  },
  listItem: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coinIcon: { width: 32, height: 32, marginRight: 10 },
  listTitle: { color: "#f8fafc", fontWeight: "600" },
  listSub: { color: "#94a3b8", fontSize: 12 },
  listValue: { color: "#f8fafc", fontWeight: "600" },
  change: { fontSize: 12, marginTop: 4 },
  newsItem: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  newsText: { color: "#e5e7eb", fontSize: 14 },
});
