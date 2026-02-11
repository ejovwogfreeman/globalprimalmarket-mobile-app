// import { useUser } from "@/context/UserContext";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import React, { useEffect, useState } from "react";
// import {
//   Image,
//   ImageStyle,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextStyle,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Home() {
//   const { user } = useUser(); // ✅ get user from context

//   if (!user) {
//     return null; // or loader
//   }
//   const [photoUri, setPhotoUri] = useState<string[]>(
//     user?.profilePicture ? user.profilePicture : [],
//   );

//   React.useEffect(() => {
//     if (user?.profilePicture) {
//       setPhotoUri(
//         Array.isArray(user.profilePicture)
//           ? user.profilePicture
//           : [user.profilePicture],
//       );
//     }
//   }, [user]);

//   useEffect(() => {
//     // console.log("Logged-in user:", user); // ✅ check the user
//   }, [user]);

//   const getGreeting = () => {
//     const hour = new Date().getHours();

//     if (hour < 12) return "Good morning";
//     if (hour < 17) return "Good afternoon";
//     if (hour < 21) return "Good evening";
//     return "Good night";
//   };

//   const getFormattedDateTime = () => {
//     const now = new Date();

//     const date = now.toLocaleDateString("en-US", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//     const time = now.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     return `${date} • ${time}`;
//   };

//   const formatCurrency = (amount?: number) => {
//     return new Intl.NumberFormat("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount ?? 0);
//   };

//   return (
//     <SafeAreaView style={styles.safe} edges={["top"]}>
//       <StatusBar style="light" />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.container}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.welcome}>{getGreeting()} 👋</Text>
//             <Text style={styles.name}> {user?.userName || "Guest"}</Text>
//             <Text style={styles.welcome}>{getFormattedDateTime()}</Text>
//           </View>

//           {/* <View style={styles.profile}>
//             <Text style={styles.profileText}>
//               {user?.userName?.charAt(0).toUpperCase()}
//             </Text>
//           </View> */}
//           <View style={styles.profile}>
//             {photoUri && photoUri.length > 0 ? (
//               <Image source={{ uri: photoUri[0] }} style={styles.avatar} />
//             ) : (
//               <Text style={styles.profileText}>
//                 {user?.userName?.charAt(0).toUpperCase()}
//               </Text>
//             )}
//           </View>
//         </View>

//         {/* Balance Card */}
//         <View style={styles.balanceCard}>
//           <Text style={styles.balanceLabel}>Total Portfolio Value</Text>
//           <Text style={styles.balance}>${formatCurrency(user?.balance)}</Text>

//           <View style={styles.balanceRow}>
//             <Text style={styles.profit}>+3.12%</Text>
//             <Text style={styles.profitText}>Today</Text>
//           </View>
//         </View>

//         {/* Actions */}
//         <View style={styles.actions}>
//           <ActionButton
//             title="Deposit"
//             route="/home/depositmethod"
//             iconName="cash-outline"
//           />
//           <ActionButton
//             title="Withdraw"
//             route="/home/withdrawmethod"
//             iconName="arrow-down-outline"
//           />
//           <ActionButton
//             title="Invest"
//             route="/home/investplan"
//             iconName="trending-up-outline"
//           />
//           <ActionButton
//             title="Transactions"
//             route="/home/transactions"
//             iconName="swap-horizontal-outline"
//           />
//         </View>

//         {/* Portfolio */}
//         <SectionTitle title="Portfolio" />

//         <CryptoItem
//           name="Bitcoin"
//           symbol="BTC"
//           price="$42,120"
//           change="+2.4%"
//         />
//         <CryptoItem
//           name="Ethereum"
//           symbol="ETH"
//           price="$2,310"
//           change="-0.8%"
//           negative
//         />
//         <CryptoItem name="Solana" symbol="SOL" price="$98.40" change="+5.1%" />

//         {/* Market Movers */}
//         <SectionTitle title="Top Movers" />

//         <MoverItem name="DOGE" change="+12.5%" />
//         <MoverItem name="AVAX" change="+8.2%" />
//         <MoverItem name="ADA" change="-3.1%" negative />

//         {/* Transactions */}
//         <SectionTitle title="Recent Activity" />

//         <TransactionItem
//           title="Sent Bitcoin"
//           amount="-0.002 BTC"
//           date="Today"
//           negative
//         />
//         <TransactionItem
//           title="Received ETH"
//           amount="+0.45 ETH"
//           date="Yesterday"
//         />
//         <TransactionItem title="Bought SOL" amount="+12 SOL" date="Jan 26" />

//         {/* News */}
//         <SectionTitle title="Crypto News" />

//         <NewsItem title="Bitcoin hits new resistance at $43k" />
//         <NewsItem title="Ethereum gas fees drop by 18%" />

//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// type SectionTitleProps = {
//   title: string;
// };

// function SectionTitle({ title }: SectionTitleProps) {
//   return <Text style={styles.sectionTitle}>{title}</Text>;
// }

// type ActionButtonProps = {
//   title: string;
//   route:
//     | "/home/depositmethod"
//     | "/home/withdrawmethod"
//     | "/home/investplan"
//     | "/home/transactions";
//   iconName:
//     | "cash-outline"
//     | "arrow-down-outline"
//     | "trending-up-outline"
//     | "swap-horizontal-outline"; // pick Ionicons names you’ll use
// };

// function ActionButton({ title, route, iconName }: ActionButtonProps) {
//   const router = useRouter();

//   return (
//     <TouchableOpacity
//       style={styles.actionBtn}
//       onPress={() => router.push(route as Parameters<typeof router.push>[0])}
//     >
//       <Ionicons
//         name={iconName} // ✅ no need for `as any`
//         size={20}
//         color="#fff"
//         style={{ marginRight: 6 }}
//       />
//       <Text style={styles.actionText}>{title}</Text>
//     </TouchableOpacity>
//   );
// }

// type CryptoItemProps = {
//   name: string;
//   symbol: string;
//   price: string;
//   change: string;
//   negative?: boolean;
// };

// function CryptoItem({
//   name,
//   symbol,
//   price,
//   change,
//   negative,
// }: CryptoItemProps) {
//   return (
//     <View style={styles.listItem}>
//       <View>
//         <Text style={styles.listTitle}>{name}</Text>
//         <Text style={styles.listSub}>{symbol}</Text>
//       </View>

//       <View style={{ alignItems: "flex-end" }}>
//         <Text style={styles.listValue}>{price}</Text>
//         <Text
//           style={[styles.change, { color: negative ? "#ef4444" : "#22c55e" }]}
//         >
//           {change}
//         </Text>
//       </View>
//     </View>
//   );
// }

// type MoverItemProps = {
//   name: string;
//   change: string;
//   negative?: boolean;
// };

// function MoverItem({ name, change, negative }: MoverItemProps) {
//   return (
//     <View style={styles.moverItem}>
//       <Text style={styles.listTitle}>{name}</Text>
//       <Text
//         style={[styles.change, { color: negative ? "#ef4444" : "#22c55e" }]}
//       >
//         {change}
//       </Text>
//     </View>
//   );
// }

// type TransactionItemProps = {
//   title: string;
//   amount: string;
//   date: string;
//   negative?: boolean;
// };

// function TransactionItem({
//   title,
//   amount,
//   date,
//   negative,
// }: TransactionItemProps) {
//   return (
//     <View style={styles.listItem}>
//       <View>
//         <Text style={styles.listTitle}>{title}</Text>
//         <Text style={styles.listSub}>{date}</Text>
//       </View>

//       <Text
//         style={[styles.listValue, { color: negative ? "#ef4444" : "#22c55e" }]}
//       >
//         {amount}
//       </Text>
//     </View>
//   );
// }

// type NewsItemProps = {
//   title: string;
// };

// function NewsItem({ title }: NewsItemProps) {
//   return (
//     <View style={styles.newsItem}>
//       <Text style={styles.newsText}>{title}</Text>
//     </View>
//   );
// }

// type Styles = {
//   safe: ViewStyle;
//   container: ViewStyle;
//   header: ViewStyle;
//   welcome: TextStyle;
//   name: TextStyle;
//   profile: ViewStyle;
//   profileText: TextStyle;
//   balanceCard: ViewStyle;
//   balanceLabel: TextStyle;
//   balance: TextStyle;
//   balanceRow: ViewStyle;
//   profit: TextStyle;
//   avatar: ImageStyle;
//   profitText: TextStyle;
//   actions: ViewStyle;
//   actionBtn: ViewStyle;
//   actionText: TextStyle;
//   sectionTitle: TextStyle;
//   listItem: ViewStyle;
//   moverItem: ViewStyle;
//   listTitle: TextStyle;
//   listSub: TextStyle;
//   listValue: TextStyle;
//   change: TextStyle;
//   newsItem: ViewStyle;
//   newsText: TextStyle;
// };

// /* 🎨 Styles */
// const styles = StyleSheet.create<Styles>({
//   safe: {
//     flex: 1,
//     backgroundColor: "#020617",
//   },
//   container: {
//     padding: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   welcome: {
//     color: "#94a3b8",
//     fontSize: 14,
//   },
//   name: {
//     color: "#f8fafc",
//     fontSize: 22,
//     fontWeight: "700",
//     marginLeft: -5,
//   },
//   profile: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#1e293b",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#1e293b",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "#38bdf8",
//   },
//   profileText: {
//     color: "#38bdf8",
//     fontWeight: "700",
//   },
//   balanceCard: {
//     backgroundColor: "#0f172a",
//     borderRadius: 18,
//     padding: 20,
//     marginBottom: 24,
//   },
//   balanceLabel: {
//     color: "#94a3b8",
//   },
//   balance: {
//     color: "#f8fafc",
//     fontSize: 32,
//     fontWeight: "700",
//     marginVertical: 8,
//   },
//   balanceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   profit: {
//     color: "#22c55e",
//     fontWeight: "600",
//     marginRight: 6,
//   },
//   profitText: {
//     color: "#94a3b8",
//   },
//   actions: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginBottom: 30,
//   },
//   actionBtn: {
//     backgroundColor: "#1e293b",
//     width: "48%",
//     paddingVertical: 14,
//     borderRadius: 14,
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   actionText: {
//     color: "#38bdf8",
//     fontWeight: "600",
//   },
//   sectionTitle: {
//     color: "#f8fafc",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 12,
//     marginTop: 10,
//   },
//   listItem: {
//     backgroundColor: "#0f172a",
//     borderRadius: 14,
//     padding: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   moverItem: {
//     backgroundColor: "#0f172a",
//     borderRadius: 14,
//     padding: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   listTitle: {
//     color: "#f8fafc",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   listSub: {
//     color: "#94a3b8",
//     fontSize: 12,
//   },
//   listValue: {
//     color: "#f8fafc",
//     fontWeight: "600",
//   },
//   change: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   newsItem: {
//     backgroundColor: "#0f172a",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 12,
//   },
//   newsText: {
//     color: "#e5e7eb",
//     fontSize: 14,
//   },
// });

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

  if (!user) {
    return null; // or loader
  }
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
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Portfolio Value</Text>
          <Text style={styles.balance}>${formatCurrency(user.balance)}</Text>
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
              change={`${coin.price_change_percentage_24h.toFixed(2)}%`}
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
