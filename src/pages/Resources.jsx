import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lightbulb, ArrowRight } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/resources');
        setResources(data.data);
      } catch (err) {
        console.error("Error fetching resources", err);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
        <Lightbulb className="text-orange-500" /> Learning Roadmaps
      </h1>
      <p className="text-gray-600 mb-10">Curated paths to master modern technologies.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((res) => (
          <div key={res._id} className="bg-white p-8 rounded-3xl shadow-sm border hover:border-blue-500 transition-all group">
            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600">{res.title}</h3>
            <p className="text-gray-500 mb-6">{res.description}</p>
            <a 
              href={res.link} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 font-bold text-blue-600 hover:gap-4 transition-all"
            >
              Start Learning <ArrowRight size={20} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;