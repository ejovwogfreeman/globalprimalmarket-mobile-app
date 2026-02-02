import { useUser } from "@/context/UserContext";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function Home() {
  const { user } = useUser(); // ✅ get user from context

  useEffect(() => {
    // console.log("Logged-in user:", user); // ✅ check the user
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const getFormattedDateTime = () => {
    const now = new Date();

    const date = now.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${date} • ${time}`;
  };

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount ?? 0);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>{getGreeting()} 👋</Text>
            <Text style={styles.name}> {user?.userName || "Guest"}</Text>
            <Text style={styles.welcome}>{getFormattedDateTime()}</Text>
          </View>

          <TouchableOpacity style={styles.profile}>
            <Text style={styles.profileText}>
              {user?.userName?.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Portfolio Value</Text>
          <Text style={styles.balance}>${formatCurrency(user?.balance)}</Text>

          <View style={styles.balanceRow}>
            <Text style={styles.profit}>+3.12%</Text>
            <Text style={styles.profitText}>Today</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <ActionButton title="Send" />
          <ActionButton title="Receive" />
          <ActionButton title="Buy" />
          <ActionButton title="Swap" />
        </View>

        {/* Portfolio */}
        <SectionTitle title="Portfolio" />

        <CryptoItem
          name="Bitcoin"
          symbol="BTC"
          price="$42,120"
          change="+2.4%"
        />
        <CryptoItem
          name="Ethereum"
          symbol="ETH"
          price="$2,310"
          change="-0.8%"
          negative
        />
        <CryptoItem name="Solana" symbol="SOL" price="$98.40" change="+5.1%" />

        {/* Market Movers */}
        <SectionTitle title="Top Movers" />

        <MoverItem name="DOGE" change="+12.5%" />
        <MoverItem name="AVAX" change="+8.2%" />
        <MoverItem name="ADA" change="-3.1%" negative />

        {/* Transactions */}
        <SectionTitle title="Recent Activity" />

        <TransactionItem
          title="Sent Bitcoin"
          amount="-0.002 BTC"
          date="Today"
          negative
        />
        <TransactionItem
          title="Received ETH"
          amount="+0.45 ETH"
          date="Yesterday"
        />
        <TransactionItem title="Bought SOL" amount="+12 SOL" date="Jan 26" />

        {/* News */}
        <SectionTitle title="Crypto News" />

        <NewsItem title="Bitcoin hits new resistance at $43k" />
        <NewsItem title="Ethereum gas fees drop by 18%" />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

type SectionTitleProps = {
  title: string;
};

function SectionTitle({ title }: SectionTitleProps) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

type ActionButtonProps = {
  title: string;
};

function ActionButton({ title }: ActionButtonProps) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
}

type CryptoItemProps = {
  name: string;
  symbol: string;
  price: string;
  change: string;
  negative?: boolean;
};

function CryptoItem({
  name,
  symbol,
  price,
  change,
  negative,
}: CryptoItemProps) {
  return (
    <View style={styles.listItem}>
      <View>
        <Text style={styles.listTitle}>{name}</Text>
        <Text style={styles.listSub}>{symbol}</Text>
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

type MoverItemProps = {
  name: string;
  change: string;
  negative?: boolean;
};

function MoverItem({ name, change, negative }: MoverItemProps) {
  return (
    <View style={styles.moverItem}>
      <Text style={styles.listTitle}>{name}</Text>
      <Text
        style={[styles.change, { color: negative ? "#ef4444" : "#22c55e" }]}
      >
        {change}
      </Text>
    </View>
  );
}

type TransactionItemProps = {
  title: string;
  amount: string;
  date: string;
  negative?: boolean;
};

function TransactionItem({
  title,
  amount,
  date,
  negative,
}: TransactionItemProps) {
  return (
    <View style={styles.listItem}>
      <View>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listSub}>{date}</Text>
      </View>

      <Text
        style={[styles.listValue, { color: negative ? "#ef4444" : "#22c55e" }]}
      >
        {amount}
      </Text>
    </View>
  );
}

type NewsItemProps = {
  title: string;
};

function NewsItem({ title }: NewsItemProps) {
  return (
    <View style={styles.newsItem}>
      <Text style={styles.newsText}>{title}</Text>
    </View>
  );
}

type Styles = {
  safe: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  welcome: TextStyle;
  name: TextStyle;
  profile: ViewStyle;
  profileText: TextStyle;
  balanceCard: ViewStyle;
  balanceLabel: TextStyle;
  balance: TextStyle;
  balanceRow: ViewStyle;
  profit: TextStyle;
  profitText: TextStyle;
  actions: ViewStyle;
  actionBtn: ViewStyle;
  actionText: TextStyle;
  sectionTitle: TextStyle;
  listItem: ViewStyle;
  moverItem: ViewStyle;
  listTitle: TextStyle;
  listSub: TextStyle;
  listValue: TextStyle;
  change: TextStyle;
  newsItem: ViewStyle;
  newsText: TextStyle;
};

/* 🎨 Styles */
const styles = StyleSheet.create<Styles>({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: {
    color: "#94a3b8",
    fontSize: 14,
  },
  name: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: -5,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: {
    color: "#38bdf8",
    fontWeight: "700",
  },
  balanceCard: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    color: "#94a3b8",
  },
  balance: {
    color: "#f8fafc",
    fontSize: 32,
    fontWeight: "700",
    marginVertical: 8,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profit: {
    color: "#22c55e",
    fontWeight: "600",
    marginRight: 6,
  },
  profitText: {
    color: "#94a3b8",
  },
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
  actionText: {
    color: "#38bdf8",
    fontWeight: "600",
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
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  moverItem: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listTitle: {
    color: "#f8fafc",
    fontSize: 16,
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
  newsItem: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  newsText: {
    color: "#e5e7eb",
    fontSize: 14,
  },
});
