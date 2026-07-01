import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip"

import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import User from './pages/User';

import Login from './pages/Login';
import Register from './pages/Register';

import DashboardPage from './pages/DashboardPage';
import Items from './pages/Items';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path='items' element={<Items />} />
            <Route path='user' element={<User />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)
