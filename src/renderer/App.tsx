import React from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import AuthPage from '../pages/auth/Auth';
import HelloPage from '../pages/hello/Hello';
import HomePage from '../pages/home/Home';
import './App.css';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-app h-full w-full -z-20">
      <div className="bg-black/80 backdrop-blur-md h-full w-full -z-10">
        <div className="z-0 text-white h-full w-full flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppLayout>
      <Router>
        <Routes>
          <Route path="/" element={<HelloPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </AppLayout>
  );
}
