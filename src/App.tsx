
import './App.css'

import {BrowserRouter, Routes, Route} from 'react-router';

import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from "./pages/ForgotPassword";

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/signup" element={<SignupPage/>}/>
                    <Route path="/recover" element={<ForgotPasswordPage/>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
