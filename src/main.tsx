import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from 'react-toastify';
import { SupabaseProvider } from './contexts/SupabaseContext.tsx';
import './index.css'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import Dashboard from './layouts/Dashboard.tsx';
import Home from './containers/Home.tsx';
import Character from './containers/Character.tsx';
import Shop from './containers/Shop.tsx';
import Inventory from './containers/Inventory.tsx';
import Crafting from './containers/Crafting.tsx';
import Farming from './containers/Farming.tsx';
import Auth from './layouts/Auth.tsx';
import Login from './components/Auth/Login.tsx';
import Register from './components/Auth/Register.tsx';
import ResetPassword from './components/Auth/ResetPassword.tsx';
import UpdatePassword from './components/Auth/UpdatePassword.tsx';
import CharacterCreate from './components/Character/CharacterCreate.tsx';
import { CharacterProvider } from './contexts/CharacterContext.tsx';
import CharacterStats from './components/Character/CharacterStats.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ToastContainer position="top-center" />
        <SupabaseProvider>
            <BrowserRouter>
                <CharacterProvider>
                    <Routes>
                        <Route element={<ProtectedRoute redirectPath='login' />}>
                            <Route element={<Dashboard />} >
                                <Route index element={<Home />} />
                                <Route path="character" element={<Character />}>
                                    <Route index element={<CharacterStats />} />
                                    <Route path="create" element={<CharacterCreate />} />
                                </Route>
                                <Route path="shop" element={<Shop />} />
                                <Route path="inventory" element={<Inventory />} />
                                <Route path="crafting" element={<Crafting />} />
                                <Route path="farming" element={<Farming />} />
                                <Route path="/account/update-password" element={<UpdatePassword />} />
                            </Route>
                        </Route>
                        <Route element={<Auth />}>
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="reset-password" element={<ResetPassword />} />
                        </Route>
                    </Routes>
                </CharacterProvider>
            </BrowserRouter>
        </SupabaseProvider>
    </StrictMode>
)
