"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import firebase_app from "@/app/firebase/config";
import { SpinnerGap } from "@phosphor-icons/react";

const auth = getAuth(firebase_app);

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <div
          style={{
            height: "100vh",
            alignItems: "center",
            justifyItems: "center",
            display: "flex",
          }}
        >
          <div style={{ marginRight: "8px" }}>
            <SpinnerGap size={32} color="red" weight="bold" />
          </div>
          <div style={{ fontSize: "20px" }}>Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
