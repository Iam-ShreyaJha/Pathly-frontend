import { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom'; // Back jane ke liye
import { 
  Upload, 
  PlusCircle, 
  CheckCircle, 
  FileUp, 
  AlertCircle, 
  Briefcase, 
  Calendar, 
  BookOpen, 
  Link as LinkIcon, 
  ChevronDown, 
  AlignLeft,
  X // Close icon add kiya gaya
} from 'lucide-react';

const AdminUpload = () => {
  const navigate = useNavigate(); // Navigation hook
  const [type, setType] = useState('notes'); 
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
    category: 'Hackathon', 
    date: '',
    link: '',
    company: '',
    techStack: ''
  });
  const [file, setFile] = useState(null); 
  const [status, setStatus] = useState('');

  const categories = ["Hackathon", "Tech Event", "Workshop", "Webinar", "Exhibition", "Conference", "Cultural Fest"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Processing upload...');
    try {
      const token = localStorage.getItem('token');
      let res;
      if (type === 'notes') {
        const data = new FormData();
        if (file) data.append('file', file);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('subject', formData.subject);
        data.append('semester', formData.semester);
        res = await axios.post(`/notes`, data, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
      } else {
        res = await axios.post(`/${type}`, formData, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
      }
      if (res.data.success) {
        setStatus(`Success! ${type} posted successfully.`);
        setFormData({ title: '', description: '', subject: '', semester: '', category: 'Hackathon', date: '', link: '', company: '', techStack: '' });
        setFile(null);
        e.target.reset(); 
      }
    } catch (err) {
      setStatus('Upload failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-10 max-w-4xl w-full relative">
        
        {/* --- CROSS / BACK BUTTON --- */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          title="Back to Dashboard"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <h1 className="text-4xl font-black mb-10 flex items-center gap-3 text-gray-900 tracking-tighter">
          <PlusCircle className="text-blue-600" size={36} /> Content Manager
        </h1>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-10 bg-gray-50 p-2 rounded-[2rem] border border-gray-100">
          {[
            { id: 'notes', icon: <BookOpen size={18}/> }, 
            { id: 'events', icon: <Calendar size={18}/> }, 
            { id: 'internships', icon: <Briefcase size={18}/> }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setType(t.id); setStatus(''); setFile(null); }}
              className={`flex-1 py-4 rounded-[1.5rem] font-black capitalize transition-all flex items-center justify-center gap-2 text-sm ${type === t.id ? 'bg-white shadow-lg text-blue-600 border border-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              {t.icon} {t.id}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'notes' && (
            <div className="border-4 border-dashed border-blue-50 bg-blue-50/20 p-10 rounded-[2.5rem] text-center hover:border-blue-200 transition-all group cursor-pointer relative">
              <input type="file" required id="file-upload" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                <div className="bg-white p-5 rounded-3xl shadow-sm group-hover:scale-110 transition-transform text-blue-600">
                  <FileUp size={40} />
                </div>
                <p className="text-blue-900 font-black text-lg">{file ? file.name : 'Select PDF Study Material'}</p>
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-full">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Post Title</label>
              <input type="text" placeholder="Enter title" required value={formData.title} className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500 font-bold" onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            {type === 'notes' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Subject</label>
                  <input type="text" placeholder="e.g. Operating Systems" className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Semester</label>
                  <input type="text" placeholder="e.g. 6" className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, semester: e.target.value})} />
                </div>
              </>
            )}

            {type === 'events' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Event Date</label>
                  <input type="date" required className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Category</label>
                  <div className="relative">
                    <select 
                      value={formData.category}
                      className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] appearance-none outline-none focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-5 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest text-blue-600">Event Website / Registration Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-5 top-5 text-gray-400" size={20} />
                    <input type="url" placeholder="https://..." className="w-full pl-14 p-5 bg-blue-50/30 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 font-medium text-blue-700" onChange={(e) => setFormData({...formData, link: e.target.value})} />
                  </div>
                </div>
              </>
            )}

            {type === 'internships' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Company Name</label>
                  <input type="text" placeholder="e.g. Google" className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, company: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Required Tech Stack</label>
                  <input type="text" placeholder="e.g. React, Node, AWS" className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, techStack: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest text-blue-600">Apply Link</label>
                  <input type="url" placeholder="https://..." className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, link: e.target.value})} />
                </div>
              </>
            )}

            <div className="space-y-2 col-span-full">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1">
                <AlignLeft size={12} /> Description / Pathly Expert Tips (Optional)
              </label>
              <textarea 
                placeholder="Write full details about this post..." 
                value={formData.description} 
                className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] h-40 outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed" 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-[0.97] transition-all shadow-xl shadow-blue-200">
            <Upload size={24} /> Post to Pathly Ecosystem
          </button>
        </form>

        {status && (
          <div className={`mt-8 p-5 rounded-[1.5rem] flex items-center gap-3 font-bold ${status.includes('Success') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
             {status.includes('Success') ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
             {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUpload;