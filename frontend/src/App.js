import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { Toaster } from './components/ui/toaster';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import PlayerBar from './components/PlayerBar';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            user.role === 'admin' ? <AdminPanel /> : <Dashboard />
          } />
        </Routes>
        <PlayerBar />
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AppContent />
        <Toaster />
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;