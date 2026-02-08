import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BookOpen, Calendar, Zap, LogOut, Clock, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const [stats, setStats] = useState({ notesAccessed: 0, eventsTracked: 0, resourcesVisited: 0 });
  const [fetchingStats, setFetchingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return; // Login check

      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data) setStats(data);
      } catch (err) {
        console.error("Dashboard Stats Fetch Error:", err);
      } finally {
        setFetchingStats(false);
      }
    };

    if (!loading) fetchStats();
  }, [user, loading]);

  // Loading Screen
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-gray-400">Loading Pathly...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Welcome, {user?.name ? user.name.split(' ')[0] : 'Student'}! 👋
            </h1>
            <p className="text-gray-500 font-medium">Here's your academic portal overview.</p>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 bg-white text-red-600 px-5 py-2.5 rounded-2xl font-bold hover:bg-red-50 transition-all border border-red-100 shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Notes Uploaded</p>
              <p className="text-3xl font-black text-gray-900">{stats.notesAccessed}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
            <div className="bg-purple-600 p-4 rounded-2xl text-white shadow-lg shadow-purple-100 group-hover:scale-105 transition-transform">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest">Events Tracked</p>
              <p className="text-3xl font-black text-gray-900">{stats.eventsTracked}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
            <div className="bg-orange-600 p-4 rounded-2xl text-white shadow-lg shadow-orange-100 group-hover:scale-105 transition-transform">
              <Zap size={28} />
            </div>
            <div>
              <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">Resources Visited</p>
              <p className="text-3xl font-black text-gray-900">{stats.resourcesVisited}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <Clock size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Your Recent Activity</h2>
          </div>

          {fetchingStats ? (
             <div className="flex gap-4 items-center animate-pulse">
                <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                <div className="flex-grow space-y-2">
                   <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                   <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                </div>
             </div>
          ) : stats.notesAccessed > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-3xl border border-blue-100 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                  <BookOpen size={20} />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-blue-900">Pathly Library Updated</p>
                  <p className="text-sm text-blue-700">Database now contains {stats.notesAccessed} study documents.</p>
                </div>
                <Link to="/notes" className="bg-blue-600 text-white p-2 rounded-xl group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No activity recorded yet. Start exploring the portal!</p>
              <Link to="/notes" className="mt-4 inline-block text-blue-600 font-bold hover:underline">Explore Notes</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;