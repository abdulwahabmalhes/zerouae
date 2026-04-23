"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/lib/api/apiClient";

export interface User {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  type: "admin" | "user";
  profile?: string;
}

interface AuthCtx {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null, token: null, isLoading: true,
  login: () => {}, logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("zoro_token");
    const u = localStorage.getItem("zoro_user");
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("zoro_token", newToken);
    localStorage.setItem("zoro_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("zoro_token");
    localStorage.removeItem("zoro_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
