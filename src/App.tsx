import {BrowserRouter, Routes, Route} from 'react-router';

import LoginPage from "./pages/LoginPage";
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from "./pages/ForgotPassword";
import ProfilePage from "./pages/ProfilePage";
import SellerDashboard from './pages/SellerDashboard';

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
                <Route path="/recover" element={<ForgotPasswordPage/>}/>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/seller-dash" element={<SellerDashboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
