import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';
import { ConfettiProvider } from './contexts/ConfettiContext.tsx';
import { TimersProvider } from './contexts/TimersContext.tsx';
import CharacterRoute from './components/CharacterRoute/CharacterRoute.tsx';
import Auth from './layouts/Auth.tsx';
import Dashboard from './layouts/Dashboard.tsx';
import Register from './components/Auth/Register.tsx';
import ResetPassword from './components/Auth/ResetPassword.tsx';
import UpdatePassword from './components/Auth/UpdatePassword.tsx';
import Home from '@features/Home/Home';
import Character from '@features/Character/Character';
import CharacterCreate from '@features/Character/CharacterCreate';
import CharacterStats from '@features/Character/CharacterStats';
import Equipment from './features/Equipment/Equipment.tsx';
import Shop from '@features/Shop/Shop.tsx';
import Inventory from '@features/Inventory/Inventory';
import Training from '@features/Training/Training';
import Crafting from '@features/Crafting/Crafting';
import Farming from '@features/Farming/Farming';
import Login from '@components/Auth/Login.tsx';
import Fishing from '@features/Fishing/Fishing';
import BountyBoard from '@features/BountyBoard/BountyBoard.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ConfettiProvider>
                <TimersProvider>
                    <BrowserRouter>
                        <ToastContainer position="top-center" autoClose={2500} closeOnClick={true} draggablePercent={80} />
                        <Routes>
                            <Route element={<CharacterRoute />}>
                                <Route element={<Dashboard />} >
                                    <Route index element={<Home />} />
                                    <Route path="character" element={<Character />}>
                                        <Route path='stats' element={<CharacterStats />} />
                                        <Route path="create" element={<CharacterCreate />} />
                                    </Route>
                                    <Route path="equipment" element={<Equipment />} />
                                    <Route path="bounty-board" element={<BountyBoard />} />
                                    <Route path="shop" element={<Shop />} />
                                    <Route path="inventory" element={<Inventory />} />
                                    <Route path="training" element={<Training />} />
                                    <Route path="crafting" element={<Crafting />} />
                                    <Route path="farming" element={<Farming />} />
                                    <Route path="fishing" element={<Fishing />} />
                                    <Route path="/account/update-password" element={<UpdatePassword />} />
                                </Route>
                            </Route>
                            <Route element={<Auth />}>
                                <Route path="login" element={<Login />} />
                                <Route path="register" element={<Register />} />
                                <Route path="reset-password" element={<ResetPassword />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </TimersProvider>
            </ConfettiProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
