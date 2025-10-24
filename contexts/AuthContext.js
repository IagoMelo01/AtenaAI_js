import { createContext, useContext, useMemo, useState } from "react";
import {
  fetchProfile,
  login,
  requestPasswordReset,
  updateProfile as updateProfileApi,
} from "../lib/api";

const AuthContext = createContext({
  user: null,
  signIn: async () => {},
  signOut: () => {},
  requestPasswordReset: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = async ({ matricula, password }) => {
    const session = await login({ matricula, password });
    setUser(session);
    return session;
  };

  const signOut = () => {
    setUser(null);
  };

  const handlePasswordReset = async (email) => {
    await requestPasswordReset(email);
  };

  const handleUpdateProfile = async (payload) => {
    if (!user?.token) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    const updated = await updateProfileApi({ token: user.token, ...payload });
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      requestPasswordReset: handlePasswordReset,
      updateProfile: handleUpdateProfile,
      refreshProfile: async () => {
        if (!user?.token) return null;
        const profile = await fetchProfile({ token: user.token });
        setUser((prev) => ({ ...prev, ...profile }));
        return profile;
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
