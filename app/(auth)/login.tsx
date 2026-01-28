import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Login() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Login Screen</Text>
      <Button title="Login" onPress={() => router.replace("/home")} />
    </View>
  );
}
