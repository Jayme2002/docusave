import { auth } from "@/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";

function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return { user, loading };
}

export default useAuth;
