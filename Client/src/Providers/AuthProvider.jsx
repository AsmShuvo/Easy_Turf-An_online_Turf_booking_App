import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { auth } from "../firebase";
import api from "../api/axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth State Changed - User Email:", currentUser?.email);
      if (currentUser) {
        try {
          console.log("Fetching role for:", currentUser.email);
          const response = await api.get(`/users/${currentUser.email}`);
          console.log("Fetched Role Data:", response.data);
          setUser({ ...currentUser, ...response.data }); // Merge Firebase user with DB user (role)
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setUser(currentUser); // Set user even if role fetch fails
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signout = () => {
    setLoading(true);
    return signOut(auth);
  };

  const authInfo = useMemo(
    () => ({
      user,
      loading,
      signup,
      signin,
      login: signin,
      signout,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
