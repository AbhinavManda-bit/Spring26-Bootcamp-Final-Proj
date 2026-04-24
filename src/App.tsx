import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useEffect } from 'react';

function App() {
  const { currentUser, 
          currentUserData, 
          loading, 
          signupAndLogin, 
          login, 
          logout, 
          sendResetPWEmail } = useAuth();

  const { items,
          loadingCart,
          addItem,
          removeItem,
          clearCart,
          calcTotalPrice } = useCart();

  useEffect(() => {
    window.signupAndLogin = signupAndLogin;
    window.login = login;
    window.logout = logout;
    window.sendResetPWEmail = sendResetPWEmail;

    window.addItem = addItem;
    window.removeItem = removeItem;
    window.clearCart = clearCart;
    window.calcTotalPrice = calcTotalPrice;
  }, [signupAndLogin, login, logout, sendResetPWEmail]);

  return (
          <>
            <p>{currentUser ? currentUser.email : "not logged in no email from user context"}</p>
            <p>{currentUserData ? currentUserData.email : "not logged in no email from user data context"}</p>
            <p>{currentUserData ? currentUserData.name : "not logged in no name"}</p>
            <p>{currentUserData ? currentUserData.role : "not logged in no role"}</p>
            <p>{loading.toString()}</p>
            <p>-----</p>
            <p>-----Cart------</p>
            <p>-----</p>
            <p>{items ? items.toString() : "items are not defined in cart"}</p>
            <p>{loadingCart.toString()}</p>
          </>
  );
}

export default App
