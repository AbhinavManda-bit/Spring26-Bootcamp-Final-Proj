
import './App.css'

import {BrowserRouter, Routes, Route} from 'react-router';

import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
