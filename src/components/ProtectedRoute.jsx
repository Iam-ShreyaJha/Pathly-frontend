import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Agar context abhi load ho raha hai (token check kar raha hai)
  if (loading) {
    return <div className="flex justify-center items-center h-screen font-bold">Checking authentication...</div>;
  }

  // Agar user logged in nahi hai, toh login page par bhej do
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar user logged in hai, toh page dikhao
  return children;
};

export default ProtectedRoute;