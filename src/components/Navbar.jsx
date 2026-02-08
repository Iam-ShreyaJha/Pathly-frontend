import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, User as UserIcon, ShieldAlert, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-black text-blue-600 tracking-tighter">
          <BookOpen size={28} strokeWidth={3} />
          <span>Pathly</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Common Links for Logged In Users */}
              <Link to="/notes" className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors">Notes</Link>
              <Link to="/events" className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors">Events</Link>
              
              {/* --- NEW INTERNSHIPS LINK --- */}
              <Link to="/internships" className="text-gray-600 hover:text-blue-600 font-bold text-sm flex items-center gap-1.5 transition-colors">
                <Briefcase size={16} /> Internships
              </Link>
              
              <Link to="/resources" className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors">Roadmaps</Link>
              
              {/* --- ADMIN MODE BUTTON --- */}
              <Link 
                to="/admin/upload" 
                className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-xl text-[10px] font-black hover:bg-orange-100 transition-all flex items-center gap-1 border border-orange-200 uppercase tracking-tighter"
              >
                <ShieldAlert size={14} /> Admin Panel ⚡
              </Link>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-4 ml-4 border-l pl-6">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-bold text-sm">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
                    <UserIcon size={16} />
                  </div>
                  {user?.name ? user.name.split(' ')[0] : 'User'}
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 font-black text-sm transition-colors"
                >
                  <LogOut size={18} /> Exit
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-bold text-sm">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;