
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router';
import LoginPage from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from './Components/Navbar';
import CatalogPage from './pages/CatalogPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from "./pages/ForgotPassword";
import ProfilePage from "./pages/ProfilePage";
import SellerDashboard from './pages/SellerDashboard';
import CartPage from './pages/CartPage';
import { useEffect } from 'react';


function HomePage() {
  const { currentUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(currentUserData){
      if(currentUserData.role == "buyer"){
        navigate("products");
      } else {
        navigate("seller-dash");
      }
    } else {
      navigate("/signup");
    }
  }, [currentUserData])
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<CatalogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/recover" element={<ForgotPasswordPage/>}/>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/seller-dash" element={<SellerDashboard />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
