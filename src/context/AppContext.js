import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const AppContext = createContext();

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const resetMessage = useCallback(() => setMessage(null), []);

  const goTo = useCallback((nextScreen) => {
    setScreen(nextScreen);
    resetMessage();
  }, [resetMessage]);

  const login = useCallback(async ({ matricula, password }) => {
    resetMessage();

    const trimmedMatricula = matricula?.trim();
    if (!trimmedMatricula || !password) {
      throw new Error('Informe matrícula e senha.');
    }

    setLoading(true);
    try {
      await delay(700);

      const fakeUser = {
        id: `user-${trimmedMatricula}`,
        name: 'Aluno Atenas',
        matricula: trimmedMatricula,
        email: `${trimmedMatricula}@aluno.atenas.br`,
        token: 'demo-token',
      };

      setUser(fakeUser);
      setScreen('home');
      setMessage(null);
      return fakeUser;
    } finally {
      setLoading(false);
    }
  }, [resetMessage]);

  const logout = useCallback(() => {
    setUser(null);
    setScreen('login');
    resetMessage();
  }, [resetMessage]);

  const sendPasswordReset = useCallback(async (email) => {
    resetMessage();
    const trimmedEmail = email?.trim();

    if (!trimmedEmail) {
      throw new Error('Informe um e-mail válido.');
    }

    setLoading(true);
    try {
      await delay(700);
      setMessage('Enviamos um link de recuperação para o seu e-mail.');
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, [resetMessage]);

  const value = useMemo(
    () => ({
      loading,
      login,
      logout,
      sendPasswordReset,
      screen,
      goTo,
      user,
      message,
      resetMessage,
    }),
    [loading, login, logout, sendPasswordReset, screen, goTo, user, message, resetMessage]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};
