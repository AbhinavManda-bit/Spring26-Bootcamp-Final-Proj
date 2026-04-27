
import {BrowserRouter, Routes, Route} from 'react-router';
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import Navbar from './Components/Navbar';
import CatalogPage from './pages/CatalogPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from "./pages/ForgotPassword";
import ProfilePage from "./pages/ProfilePage";
import SellerDashboard from './pages/SellerDashboard';
import CartPage from './pages/CartPage';


function HomePage() {
  return <main className="p-8"><h1>Welcome to ThriftUMD</h1></main>;
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
