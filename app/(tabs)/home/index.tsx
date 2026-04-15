import { useUser } from "@/context/UserContext";
import { CRYPTO_MODES } from "@/data/crypto";
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

type BalanceMap = {
  [key: string]: number;
};

type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
};

type UserType = {
  userName: string;
  profilePicture?: string | string[];
  balance: BalanceMap;
};

/* ===================== SCREEN ===================== */

export default function Home() {
  const { user } = useUser() as { user: UserType | null };
  const router = useRouter();

  const [market, setMarket] = useState<MarketCoin[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(true);

  const [photoUri, setPhotoUri] = useState<string[]>([]);

  const [selectedCoin, setSelectedCoin] = useState<string>("usdt");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const balances: BalanceMap = user?.balance || {};

  useEffect(() => {
    if (user?.profilePicture) {
      setPhotoUri(
        Array.isArray(user.profilePicture)
          ? user.profilePicture
          : [user.profilePicture],
      );
    }
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
    return new Date().toLocaleString("en-US", {
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

  /* ---------- MARKET ---------- */

  const lastMarketRef = useRef<MarketCoin[]>([]);

  const fetchMarket = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=1",
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setMarket(data);
        lastMarketRef.current = data;
      } else {
        setMarket(lastMarketRef.current);
      }
    } catch {
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

  /* ---------- BALANCE LOGIC ---------- */

  const totalUSDT = Object.keys(balances).reduce((sum, coin) => {
    const crypto = CRYPTO_MODES.find((c) => c.symbol === coin);
    const amount = Number(balances[coin]) || 0;

    if (coin === "usdt") return sum + amount;
    if (!crypto) return sum;

    return sum + amount * crypto.rate;
  }, 0);

  const displayAmount =
    selectedCoin === "usdt" ? totalUSDT : Number(balances[selectedCoin]) || 0;

  const crypto = CRYPTO_MODES.find((c) => c.symbol === selectedCoin);

  const selectedUsdtValue =
    selectedCoin === "usdt"
      ? totalUSDT
      : crypto
        ? Number(balances[selectedCoin] || 0) * crypto.rate
        : 0;

  const allCurrencies = ["usdt", ...Object.keys(balances)];

  const handleSelect = (symbol: string) => {
    setSelectedCoin(symbol);
    setShowDropdown(false);
  };

  if (!user) return null;

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
            {photoUri.length > 0 ? (
              <Image source={{ uri: photoUri[0] }} style={styles.avatar} />
            ) : (
              <Text style={styles.profileText}>
                {user.userName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        </View>

        {/* BALANCE */}
        <View style={[styles.balanceCard, { position: "relative" }]}>
          <Text style={styles.balanceLabel}>
            {selectedCoin === "usdt"
              ? "TOTAL PORTFOLIO BALANCE"
              : `${selectedCoin.toUpperCase()} BALANCE`}
          </Text>

          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Text style={{ fontSize: 32, fontWeight: "700", color: "#f8fafc" }}>
              {formatCurrency(displayAmount)}
            </Text>

            <Text style={{ marginLeft: 6, color: "#f8fafc" }}>
              {selectedCoin.toUpperCase()}
            </Text>

            <Ionicons
              name={showDropdown ? "caret-up-outline" : "caret-down-outline"}
              size={18}
              color="#38bdf8"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>

          <Text style={{ color: "#94a3b8", marginTop: 4 }}>
            ≈ {formatCurrency(selectedUsdtValue)} USDT
          </Text>

          {/* DROPDOWN */}
          {showDropdown && (
            <View
              style={{
                position: "absolute",
                top: 80,
                left: 50,
                backgroundColor: "#1e293b",
                borderWidth: 1,
                borderColor: "#38bdf8",
                borderRadius: 8,
                width: 300,
                padding: 6,
                zIndex: 9999,
              }}
            >
              {allCurrencies.map((symbol) => {
                const isUSDT = symbol === "usdt";

                const amount = isUSDT
                  ? totalUSDT
                  : Number(balances[symbol]) || 0;

                return (
                  <TouchableOpacity
                    key={symbol}
                    onPress={() => handleSelect(symbol)}
                    style={{ paddingVertical: 6 }}
                  >
                    <Text style={{ color: "#f8fafc" }}>
                      {symbol === "usdt"
                        ? `USDT (TOTAL) — ${formatCurrency(amount)} USDT`
                        : `${symbol.toUpperCase()} — ${formatCurrency(amount)} ${symbol.toUpperCase()}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
            <Text style={styles.viewAll}>View All Crypto</Text>
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
