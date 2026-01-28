import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // same auth logic as root
      await new Promise((res) => setTimeout(res, 500));
      setIsLoggedIn(false);
    };
    checkAuth();
  }, []);

  if (isLoggedIn === null) return null;

  if (isLoggedIn) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/login" />;
  }
}
