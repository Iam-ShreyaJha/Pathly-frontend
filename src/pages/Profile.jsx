import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../axiosConfig';
import { User, Mail, Lock, ShieldCheck, Save, Camera, GraduationCap, Github, Linkedin, Globe } from 'lucide-react';

const Profile = () => {
  const { user, login } = useContext(AuthContext); // login hum user state update karne ke liye use karenge
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [profileData, setProfileData] = useState({
    college: user?.college || '',
    degree: user?.degree || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- Profile Picture Update Logic ---
  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      setLoading(true);
      const { data } = await axios.put('/auth/updateprofilepic', formData);
      login({ user: data.user, token: localStorage.getItem('token') }); // UI update karne ke liye
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await axios.put('/auth/updatepassword', passwords);
      setMessage({ type: 'success', text: data.message });
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: User Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center relative overflow-hidden">
            <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer" onClick={handleImageClick}>
              <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border-4 border-white shadow-md overflow-hidden">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Camera className="text-white" size={24} />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user?.name}</h2>
            <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">{user?.role}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
              <div className="flex items-center gap-3 text-gray-500 justify-center">
                <Mail size={16} /> <span className="text-sm font-medium">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Connect</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Github size={18} className="text-gray-700" />
                <input type="text" placeholder="Github URL" className="bg-transparent border-none outline-none text-xs w-full" defaultValue={user?.github} />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Linkedin size={18} className="text-blue-700" />
                <input type="text" placeholder="LinkedIn URL" className="bg-transparent border-none outline-none text-xs w-full" defaultValue={user?.linkedin} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Info & Security */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Education Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap size={22} className="text-blue-600" /> Education Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">College/University</label>
                <input type="text" placeholder="e.g. Modern School" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" defaultValue={user?.college} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Degree/Stream</label>
                <input type="text" placeholder="e.g. B.Tech CSE" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" defaultValue={user?.degree} />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Lock size={20} className="text-blue-600" /> Account Security
            </h3>
            {message.text && (
              <div className={`p-4 rounded-2xl mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Current Password</label>
                  <input type="password" required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">New Password</label>
                  <input type="password" required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2">
                <Save size={20} /> Update Account
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;