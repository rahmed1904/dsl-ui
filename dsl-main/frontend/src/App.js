import React, { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App.useEffect: Loading user...");
    const savedUser = localStorage.getItem("fyntrac_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        console.log("App.useEffect: User restored");
      } catch (e) {
        localStorage.removeItem("fyntrac_user");
      }
    } else {
      const devUser = { email: "admin@fyntrac.com" };
      localStorage.setItem("fyntrac_user", JSON.stringify(devUser));
      setUser(devUser);
      console.log("App.useEffect: Auto-login set");
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignOut = () => {
    localStorage.removeItem("fyntrac_user");
    setUser(null);
    toast.success("Signed out successfully");
  };

  console.log("App.render:", { loading, userEmail: user?.email });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Dashboard onSignOut={handleSignOut} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
