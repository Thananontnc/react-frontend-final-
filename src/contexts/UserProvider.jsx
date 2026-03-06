//UserProvider.jsx

import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {

  const getInitialUser = () => {
    const saved = localStorage.getItem("session");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return {
      isLoggedIn: false,
      role: '',
      email: ''
    };
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(getInitialUser);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include" // for cookies
      });

      if (!response.ok) return false;

      // fetch profile
      const profileRes = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include"
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        const newUser = {
          isLoggedIn: true,
          email: profile.email,
          role: profile.role,
          id: profile._id
        };
        setUser(newUser);
        localStorage.setItem("session", JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  const logout = async () => {
    const result = await fetch(`${API_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include"
    });
    const newUser = { isLoggedIn: false, name: '', email: '', role: '' };
    setUser(newUser);
    localStorage.removeItem("session"); // or clear
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}