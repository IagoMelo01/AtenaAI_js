import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (payload = {}) => {
    // Accept API responses that wrap the user and token
    if (payload?.user) {
      const enrichedUser = { ...payload.user };
      if (payload.token) {
        enrichedUser.token = payload.token;
      }
      setUser(enrichedUser);
      return enrichedUser;
    }

    const { matricula, password, ...rest } = payload;

    if (!matricula || !password) {
      if (rest && Object.keys(rest).length > 0) {
        setUser({ ...rest });
        return rest;
      }
      throw new Error("Informe RA e senha válidos.");
    }

    if (rest && Object.keys(rest).length > 0) {
      const userData = { matricula, ...rest };
      setUser(userData);
      return userData;
    }

    if (matricula === "123" && password === "1234") {
      const userData = { name: "Aluno Exemplo", matricula };
      setUser(userData);
      return userData;
    }

    throw new Error("RA ou senha incorretos.");
  };

  const logout = () => setUser(null);

  const updateEmail = async (email) => {
    setUser((prev) => ({ ...prev, email }));
    return { email };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
