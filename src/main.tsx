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
import LoginAccessToken from './components/Auth/LoginAccessToken.tsx';
import Home from './containers/Home.tsx';
import Character from './containers/Character.tsx';
import CharacterCreate from './components/Character/CharacterCreate.tsx';
import CharacterStats from './components/Character/CharacterStats.tsx';
import Shop from './containers/Shop.tsx';
import Inventory from './containers/Inventory.tsx';
import Training from './features/Training/Training.tsx';
import Crafting from './containers/Crafting.tsx';
import Farming from './containers/Farming.tsx';
import Login from './components/Auth/Login.tsx';
import Fishing from './containers/Fishing.tsx';
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <ConfettiProvider>
            <TimersProvider>
                <BrowserRouter>
                    <ToastContainer position="top-center" autoClose={2250} closeOnClick={true} draggablePercent={80} />
                    <Routes>
                        <Route element={<CharacterRoute />}>
                            <Route element={<Dashboard />} >
                                <Route index element={<Home />} />
                                <Route path="character" element={<Character />}>
                                    <Route index element={<CharacterStats />} />
                                    <Route path="create" element={<CharacterCreate />} />
                                </Route>
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
                            <Route path="login-access-token" element={<LoginAccessToken />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </TimersProvider>
        </ConfettiProvider>
    </QueryClientProvider>
)
