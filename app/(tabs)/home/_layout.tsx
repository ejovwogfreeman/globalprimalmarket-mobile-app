import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#020617" },
        headerTintColor: "#f8fafc",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      {/* Home screen: no header, but also no title */}
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />

      {/* Other screens: headers enabled */}
      <Stack.Screen
        name="depositmethod"
        options={{ title: "Deposit Method" }}
      />
      <Stack.Screen name="deposit" options={{ title: "Deposit" }} />
      <Stack.Screen
        name="withdrawmethod"
        options={{ title: "Withdraw Method" }}
      />
      <Stack.Screen name="withdraw" options={{ title: "Withdraw" }} />
      <Stack.Screen name="investplan" options={{ title: "Invest Method" }} />
      <Stack.Screen name="invest" options={{ title: "Invest" }} />
      <Stack.Screen
        name="transaction"
        options={{ title: "Transaction Details" }}
      />
      <Stack.Screen name="transactions" options={{ title: "Transactions" }} />
      <Stack.Screen name="crypto" options={{ title: "Live Market Prices" }} />
      <Stack.Screen name="cryptodetail" options={{ title: "Crypto Details" }} />
    </Stack>
  );
}
