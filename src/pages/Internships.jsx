import { useState } from 'react';
import { Briefcase, Code, Rocket, CheckCircle, ArrowUpRight, Lightbulb } from 'lucide-react';

const Internships = () => {
  // Dummy data (Baad mein ise backend se connect karenge)
  const [internships] = useState([
    {
      id: 1,
      role: "Full Stack Developer Intern",
      company: "TechNova Solutions",
      techStack: ["React", "Node.js", "MongoDB"],
      description: "Build scalable web applications and integrate REST APIs.",
      tips: "Focus on your MERN stack projects and strengthen your Javascript basics.",
      link: "https://example.com/apply"
    },
    {
      id: 2,
      role: "DevOps Trainee",
      company: "CloudStream Systems",
      techStack: ["Docker", "Kubernetes", "AWS"],
      description: "Learn to automate deployments and manage cloud infrastructure.",
      tips: "Get hands-on experience with Linux commands and containerization.",
      link: "https://example.com/devops-apply"
    }
  ]);

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Career Opportunities</h1>
          <p className="text-gray-500 text-lg">Curated internships to kickstart your tech journey.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {internships.map((job) => (
            <div key={job.id} className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm hover:shadow-2xl transition-all group border-b-8 border-b-blue-600">
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
                {job.techStack.map(tech => (
                  <span key={tech} className="px-4 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl border border-gray-100 flex items-center gap-2">
                    <Code size={14} /> {tech}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed mb-8">{job.description}</p>

              {/* Tips Section */}
              <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 mb-8 flex gap-4">
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600 h-fit">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-orange-800 mb-1 tracking-tight uppercase text-xs">Pathly Expert Tip</h4>
                  <p className="text-sm text-orange-700 leading-relaxed font-medium italic">{job.tips}</p>
                </div>
              </div>

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
      </div>
    </div>
  );
};

export default Internships;