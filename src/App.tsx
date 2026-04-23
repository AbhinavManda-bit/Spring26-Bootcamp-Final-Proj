import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

function App() {
  const { currentUser, 
          currentUserData, 
          loading, 
          signupAndLogin, 
          login, 
          logout, 
          sendResetPWEmail } = useAuth();

  useEffect(() => {
    window.signupAndLogin = signupAndLogin;
    window.login = login;
    window.logout = logout;
    window.sendResetPWEmail = sendResetPWEmail;
  }, [signupAndLogin, login, logout, sendResetPWEmail]);

  return (
          <>
            <p>{currentUser ? currentUser.email : "not logged in no email from user context"}</p>
            <p>{currentUserData ? currentUserData.email : "not logged in no email from user data context"}</p>
            <p>{currentUserData ? currentUserData.name : "not logged in no name"}</p>
            <p>{currentUserData ? currentUserData.role : "not logged in no role"}</p>
            <p>{loading.toString()}</p>
          </>
  );
}

export default App
