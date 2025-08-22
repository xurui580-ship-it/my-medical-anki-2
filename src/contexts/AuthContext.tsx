"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, pass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = {
  test: "test",
  manager: "manager",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("mediFlashUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("mediFlashUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, pass: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(res => setTimeout(res, 500));
    
    if (mockUsers[username as keyof typeof mockUsers] === pass) {
      const loggedInUser: User = {
        id: username === 'manager' ? 'manager-id' : 'test-id',
        username,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        todayStats: { learned: 0, reviewed: 0, dateISO: new Date().toISOString().split('T')[0] },
      };
      setUser(loggedInUser);
      localStorage.setItem("mediFlashUser", JSON.stringify(loggedInUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const register = async (username: string, pass: string): Promise<boolean> => {
    // In a real app, this would hit an API to create a user.
    // For the demo, we'll just pretend it works and add to our mock users.
    if (mockUsers[username as keyof typeof mockUsers]) {
      return false; // User already exists
    }
    (mockUsers as any)[username] = pass;
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mediFlashUser");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
