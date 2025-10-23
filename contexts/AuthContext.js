import React, { createContext, useContext, useState } from "react";
import { login as apiLogin } from "../lib/api";

const getFirstObject = (...values) => {
  for (const value of values) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value;
    }
  }
  return null;
};

const normalizeAuthPayload = (payload = {}, { matricula, extra } = {}) => {
  const trimmedMatricula =
    typeof matricula === "string" ? matricula.trim() : matricula ?? null;

  const token =
    payload?.token ??
    payload?.access_token ??
    payload?.jwt ??
    payload?.Token ??
    payload?.data?.token ??
    payload?.data?.access_token ??
    payload?.data?.jwt ??
    payload?.dados?.token ??
    null;

  const userData =
    getFirstObject(
      payload?.user,
      payload?.usuario,
      payload?.aluno,
      payload?.data?.user,
      payload?.data?.usuario,
      payload?.data?.aluno,
      payload?.dados,
      payload?.result,
      payload?.data
    ) || (typeof payload === "object" && !Array.isArray(payload) ? payload : {});

  const normalizedUser = { ...userData };

  if (extra && Object.keys(extra).length > 0) {
    Object.assign(normalizedUser, extra);
  }

  if (trimmedMatricula && !normalizedUser.matricula) {
    normalizedUser.matricula = trimmedMatricula;
  }

  if (token) {
    normalizedUser.token = token;
  }

  return normalizedUser;
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (payload = {}) => {
    // Allow hydrating from a stored payload (no password)
    if (!payload?.password) {
      const normalizedFromPayload = normalizeAuthPayload(payload);

      if (!normalizedFromPayload || Object.keys(normalizedFromPayload).length === 0) {
        throw new Error("Informe RA e senha válidos.");
      }

      setUser(normalizedFromPayload);
      return normalizedFromPayload;
    }

    const { matricula, password, ...rest } = payload;

    if (!matricula || !password) {
      throw new Error("Informe RA e senha válidos.");
    }

    const trimmedMatricula = typeof matricula === "string" ? matricula.trim() : matricula;

    const response = await apiLogin({ matricula: trimmedMatricula, password });

    const normalizedUser = normalizeAuthPayload(response, {
      matricula: trimmedMatricula,
      extra: rest,
    });

    if (!normalizedUser || Object.keys(normalizedUser).length === 0) {
      throw new Error("Não foi possível autenticar.");
    }

    setUser(normalizedUser);
    return normalizedUser;
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
