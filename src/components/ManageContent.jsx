import { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Trash2, BookOpen, Calendar, Briefcase, Search, Loader2, AlertCircle } from 'lucide-react';

const ManageContent = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch items based on active tab
  const fetchItems = async () => {
    setLoading(true);
    try {
      // FIXED: removed '/api' because axiosConfig already handles it
      const { data } = await axios.get(`/${activeTab}`);
      
      // Handle different response structures
      if (data.success && data.data) {
        setItems(data.data);
      } else if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      try {
        const token = localStorage.getItem('token');
        // FIXED: removed '/api' to prevent double /api/api in URL
        await axios.delete(`/${activeTab}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Remove from UI immediately
        setItems(items.filter(item => item._id !== id));
      } catch (err) {
        alert("Delete failed: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const filteredItems = items.filter(item => {
    const title = item.title || item.role || item.company || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-[3rem] shadow-xl border border-gray-100 mt-10">
      <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3 tracking-tighter">
        <Trash2 className="text-red-500" size={32} /> Manage Content
      </h2>

      {/* Tabs Switcher */}
      <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-[2rem]">
        {[
          { id: 'notes', icon: <BookOpen size={18} />, label: 'Notes' },
          { id: 'events', icon: <Calendar size={18} />, label: 'Events' },
          { id: 'internships', icon: <Briefcase size={18} />, label: 'Internships' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
            className={`flex-1 py-4 rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        />
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-blue-600 gap-3">
            <Loader2 className="animate-spin" size={40} />
            <p className="font-bold">Fetching your data...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
                  {activeTab === 'notes' ? <BookOpen size={24} /> : activeTab === 'events' ? <Calendar size={24} /> : <Briefcase size={24} />}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-gray-800 truncate">{item.title || `${item.role} at ${item.company}`}</h4>
                  <p className="text-xs text-gray-400 font-medium truncate">
                    {item.subject || item.category || item.techStack} • {new Date(item.createdAt || item.postedAt || item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item._id)}
                className="p-3 text-gray-300 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm active:scale-90 shrink-0"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center py-20 text-gray-300 gap-3">
            <AlertCircle size={48} />
            <p className="font-bold">No {activeTab} found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContent;