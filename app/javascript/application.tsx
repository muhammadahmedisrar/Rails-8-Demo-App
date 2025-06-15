import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import { AuthProvider, useAuth } from './AuthContext';
import Setting from './components/Setting';
import VerifyOtp from './components/VerifyOtp';
import NotFound from './components/NotFound';
import RecoverOtpForm from './components/RecoverOtpForm';
import ResetPassword from './components/ResetPassword';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const NonPrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated){
    localStorage.removeItem('fromLogin');
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const FromLoginRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const fromLogin = localStorage.getItem('fromLogin') === 'true';

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated){
    return <Navigate to="/" />
  }
  return !isAuthenticated && fromLogin ? <>{children}</> : <Navigate to="/login" />;
};

const ResetPasswordWrapper: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  return <ResetPassword token={token} />;
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Setting /></PrivateRoute>} />
              <Route path="/login" element={ <NonPrivateRoute> <Login /> </NonPrivateRoute>} />
              <Route path="/signup" element={ <NonPrivateRoute> <SignUp /> </NonPrivateRoute>} />
              <Route path="/forgot_password" element={<NonPrivateRoute> <ForgotPassword /> </NonPrivateRoute>} />
              <Route path="/reset_password/:token" element={<NonPrivateRoute><ResetPasswordWrapper /></NonPrivateRoute>} />
              <Route path="/verify-otp-form" element={<FromLoginRoute> <VerifyOtp /> </FromLoginRoute>} />
              <Route path="/recover-otp-form" element={<FromLoginRoute> <RecoverOtpForm /> </FromLoginRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );
  }
});