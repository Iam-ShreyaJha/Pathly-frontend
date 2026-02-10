import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Request to backend
      const { data } = await axios.post('/auth/register', formData);
      
      // 2. data contains { success: true, token: "...", user: {...} }
      // This will set the user in context and localStorage
      if (data.token) {
        login(data); 
        
        // 3. Direct navigation to dashboard (Auto-login)
        navigate('/dashboard'); 
      }
    } catch (err) {
      // Shows specific error from backend (like duplicate email)
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
        {/* Top Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="text-center mb-10">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Join Pathly</h2>
          <p className="text-gray-500 font-medium mt-2">Start your academic journey today.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Your Name"
                required 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="name@university.edu"
                required 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="A-z, 0-9, @# (Min. 8)"
                required 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <p className="text-[9px] text-gray-400 ml-2 italic">Must include uppercase, lowercase, number & symbol.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transform active:scale-95 transition-all shadow-xl shadow-blue-100 mt-4 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 font-medium">
          Already a member? <Link to="/login" className="text-blue-600 font-black hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;