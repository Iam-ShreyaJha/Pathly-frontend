import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../axiosConfig'; 
import { BookOpen, Calendar, Zap, Clock, ArrowRight, Briefcase, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ 
    notesAccessed: 0, 
    eventsTracked: 0, 
    internshipsAvailable: 0 
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [fetchingStats, setFetchingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const response = await axios.get('/dashboard/stats');
        const result = response.data.data || response.data;

        if (result) {
          setStats({
            notesAccessed: Number(result.notesAccessed) || 0,
            eventsTracked: Number(result.eventsTracked) || 0,
            internshipsAvailable: Number(result.internshipsAvailable) || 0
          });
          setRecentEvents(result.recentEvents || []); 
        }
      } catch (err) {
        console.error("Dashboard Stats Fetch Error:", err);
      } finally {
        setFetchingStats(false);
      }
    };

    if (!loading) {
      if (!user) navigate('/login');
      else fetchStats();
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HERO SECTION */}
      <div className="bg-white border-b py-16 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">
              Welcome, <span className="text-blue-600">{user?.name?.split(' ')[0]}</span>! 🚀
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed text-left">
              Manage your progress and explore new opportunities.
            </p>
          </div>
          <div className="hidden lg:block bg-blue-50 p-8 rounded-[3rem] border border-blue-100">
             <Layout size={80} className="text-blue-200" />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-12">
        {/* STATS GRID - NOW CLICKABLE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Study Material (Notes) Card */}
          <div 
            onClick={() => navigate('/notes')} 
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all group"
          >
            <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-xl shadow-blue-100 group-hover:bg-blue-700 transition-colors">
              <BookOpen size={32} />
            </div>
            <div>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1 text-left">Study Material</p>
              <p className="text-4xl font-black text-gray-900 text-left">
                {fetchingStats ? "..." : stats.notesAccessed}
              </p>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div 
            onClick={() => navigate('/events')} 
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all group"
          >
            <div className="bg-purple-600 p-5 rounded-3xl text-white shadow-xl shadow-purple-100 group-hover:bg-purple-700 transition-colors">
              <Calendar size={32} />
            </div>
            <div>
              <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest mb-1 text-left">Upcoming Events</p>
              <p className="text-4xl font-black text-gray-900 text-left">
                {fetchingStats ? "..." : stats.eventsTracked}
              </p>
            </div>
          </div>

          {/* Active Roles (Internships) Card */}
          <div 
            onClick={() => navigate('/internships')} 
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all group"
          >
            <div className="bg-emerald-600 p-5 rounded-3xl text-white shadow-xl shadow-emerald-100 group-hover:bg-emerald-700 transition-colors">
              <Briefcase size={32} />
            </div>
            <div>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1 text-left">Active Roles</p>
              <p className="text-4xl font-black text-gray-900 text-left">
                {fetchingStats ? "..." : stats.internshipsAvailable}
              </p>
            </div>
          </div>
        </div>

        {/* LATEST UPDATES SECTION */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3 mb-10 text-left">
            <Zap size={24} className="text-orange-500 fill-orange-500" /> Latest Activities
          </h2>

          {fetchingStats ? (
             <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-gray-50 rounded-[2rem]"></div>
                <div className="h-20 bg-gray-50 rounded-[2rem]"></div>
             </div>
          ) : recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {recentEvents.map(event => (
                <div key={event._id} className="flex items-center gap-6 p-6 bg-blue-50/40 rounded-[2rem] border border-blue-100/50 hover:bg-blue-50 transition-colors text-left">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Zap size={24} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-lg font-black text-blue-900 leading-tight">{event.title}</p>
                    <p className="text-blue-700/70 font-medium mt-1">{event.description || 'New update available'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
              <p className="text-gray-500 font-bold text-lg">No recent activity</p>
              <p className="text-gray-400 text-sm mt-1 text-center italic">Start exploring to see real-time updates here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;