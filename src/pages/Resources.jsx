import { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Lightbulb, ArrowRight, Compass, GraduationCap, Globe } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // FIXED: Localhost URL hata kar sirf endpoint rakha
        const { data } = await axios.get('/resources');
        setResources(data.data);
      } catch (err) {
        console.error("Error fetching resources", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600 shadow-sm">
              <Lightbulb size={28} />
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Learning Roadmaps</h1>
          </div>
          <p className="text-gray-500 text-lg font-medium max-w-2xl">
            Curated paths and masterclasses to help you navigate modern technologies and excel in your tech journey.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="font-bold text-blue-600 animate-pulse">Mapping out resources...</p>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {resources.map((res) => (
              <div key={res._id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all group flex flex-col justify-between relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors duration-500"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-blue-600 transition-colors">
                        <Compass size={20} />
                     </div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Guided Path</span>
                  </div>
                  
                  <h3 className="text-3xl font-black mb-4 text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {res.title}
                  </h3>
                  <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                    {res.description || "Step-by-step guide to mastering this technology from scratch to advanced level."}
                  </p>
                </div>

                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <GraduationCap size={16} /> Certificate Included
                  </div>
                  <a 
                    href={res.link} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-3 font-black text-blue-600 hover:gap-5 transition-all text-sm group-hover:translate-x-1"
                  >
                    START LEARNING <ArrowRight size={20} strokeWidth={3} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm">
            <Globe size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">New roadmaps are being curated. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;