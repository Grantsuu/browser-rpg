import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { SupabaseProvider } from './contexts/SupabaseContext.tsx';

import './index.css'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import Home from './layouts/Home.tsx';
import Auth from './layouts/Auth.tsx';
import Login from './components/Auth/Login.tsx';
import Register from './components/Auth/Register.tsx';
import ResetPassword from './components/Auth/ResetPassword.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SupabaseProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoute redirectPath='login' />}>
                        <Route index element={<Home />} />
                    </Route>
                    <Route element={<Auth />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="reset-password" element={<ResetPassword />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </SupabaseProvider>
    </StrictMode>,
)
