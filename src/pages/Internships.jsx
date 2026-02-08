import { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Custom axios instance use kiya
import { Briefcase, Code, Rocket, ArrowUpRight, Lightbulb, Globe } from 'lucide-react';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        // FIXED: Pura URL hatakar endpoints use kiye
        const { data } = await axios.get('/internships');
        if (data.success) {
          setInternships(data.data);
        }
      } catch (err) {
        console.error("Internships Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Career Opportunities</h1>
          <p className="text-gray-500 text-lg">Real-time internship openings synced from Pathly Database.</p>
        </header>

        {internships.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {internships.map((job) => (
              <div key={job._id} className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm hover:shadow-2xl transition-all group border-b-8 border-b-blue-600">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{job.role}</h2>
                    <p className="text-blue-600 font-bold flex items-center gap-2 text-lg">
                      <Briefcase size={20} /> {job.company}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Rocket size={24} />
                  </div>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {job.techStack && job.techStack.map(tech => (
                    <span key={tech} className="px-4 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl border border-gray-100 flex items-center gap-2">
                      <Code size={14} /> {tech}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-500 leading-relaxed mb-8">{job.description || "No description provided."}</p>

                {/* Tips Section (Optional rendering) */}
                {job.tips && (
                  <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 mb-8 flex gap-4">
                    <div className="p-3 bg-orange-100 rounded-2xl text-orange-600 h-fit">
                      <Lightbulb size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-800 mb-1 tracking-tight uppercase text-xs">Pathly Expert Tip</h4>
                      <p className="text-sm text-orange-700 leading-relaxed font-medium italic">{job.tips}</p>
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <a 
                  href={job.link} target="_blank" rel="noreferrer"
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-gray-100"
                >
                  Apply Now <ArrowUpRight size={20} />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <Globe size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold">No internships posted yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;