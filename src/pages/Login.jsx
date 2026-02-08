import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig'; // Custom instance use kar rahe hain
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react'; // Thode icons aur add kar diye

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for button
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // FIXED: Pura URL hata kar endpoint ko chota kiya
      const { data } = await axios.post('/auth/login', formData);
      
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <div className="relative">
          <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Welcome Back</h2>
          <p className="text-gray-500 font-medium mb-8">Login to access your Pathly dashboard.</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transform active:scale-95 transition-all shadow-xl shadow-blue-100 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Authenticating...' : (
                <>Sign In <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 font-medium">
            New to Pathly? <Link to="/signup" className="text-blue-600 font-black hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;