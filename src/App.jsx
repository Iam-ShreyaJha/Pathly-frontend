import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Events from "./pages/Events"; // Is line ko check karein
import Resources from "./pages/Resources";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from './pages/Profile';
import AdminUpload from './pages/AdminUpload';
import Internships from './pages/Internships';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="p-20 text-center text-4xl font-bold">
                Welcome to Pathly
              </div>
            }
          />
          <Route path="/signup" element={<Signup />} />

          {/* Pehle yahan sirf <div> tha, ab asli Dashboard component hai */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/events" element={<Events />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/upload" element={<ProtectedRoute><AdminUpload /></ProtectedRoute>} />
          <Route path="/internships" element={<Internships />} />
          

          {/* Baaki routes (Login, Notes) hum baad mein add karenge */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
