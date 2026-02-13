import { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { FileText, Download, Search, Filter, BookOpen, Inbox, ArrowRight, Quote } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSem, setSelectedSem] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All'); 
  const [loading, setLoading] = useState(true);
  
  // New State for Year Selection
  const [activeYear, setActiveYear] = useState('1st Year');

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const semesterList = [1, 2, 3, 4, 5, 6, 7, 8];

  // Logic to determine which semesters to show based on activeYear
  const getSemsForYear = (year) => {
    if (year === '1st Year') return [1, 2];
    if (year === '2nd Year') return [3, 4];
    if (year === '3rd Year') return [5, 6];
    if (year === '4th Year') return [7, 8];
    return [];
  };

  const quotes = {
    '1st Year': { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    '2nd Year': { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
    '3rd Year': { text: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
    '4th Year': { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get('/notes');
        setNotes(data.data);
      } catch (err) {
        console.error("Error fetching notes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSem = selectedSem === 'All' || note.semester.toString() === selectedSem;
    const matchesSub = selectedSubject === 'All' || note.subject === selectedSubject;
    return matchesSearch && matchesSem && matchesSub;
  });

  const groupedData = filteredNotes.reduce((acc, note) => {
    const semKey = note.semester;
    if (!acc[semKey]) acc[semKey] = {};
    if (!acc[semKey][note.subject]) acc[semKey][note.subject] = [];
    acc[semKey][note.subject].push(note);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-8 max-w-[1400px] min-h-screen bg-[#F8FAFC]">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Pathly Library</h1>
        <p className="text-gray-500 font-medium mt-1">Access curated study resources for your B.Tech journey.</p>
      </div>

      {/* 1. Year Selection Options (Sundar Buttons) */}
      <div className="flex flex-wrap gap-4 mb-10">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => {
              setActiveYear(year);
              setSelectedSem('All'); // Reset sem filter when year changes
            }}
            className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 shadow-sm ${
              activeYear === year 
              ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg scale-105' 
              : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* 2. Active Year Detail Section (Row with Quote and Syllabus) */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 mb-16">
        <h2 className="text-5xl font-black text-gray-900 mb-8 tracking-tighter italic">
          {activeYear}
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Left: Motivating Quote */}
          <div className="lg:w-1/2 p-8 bg-blue-50 rounded-[2.5rem] relative overflow-hidden group">
            <Quote className="absolute -top-4 -left-2 text-blue-100 w-24 h-24 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative z-10">
              <p className="text-2xl font-medium text-blue-900 italic leading-relaxed">
                "{quotes[activeYear].text}"
              </p>
              <p className="mt-4 text-blue-600 font-bold uppercase tracking-widest text-sm">
                — {quotes[activeYear].author}
              </p>
            </div>
          </div>

          {/* Right: Syllabus Card */}
          <div className="lg:w-1/2 w-full bg-gray-900 text-white p-8 rounded-[2.5rem] flex items-center gap-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-blue-400">
              <FileText size={40} />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold mb-1">Syllabus for 2025-26</h3>
              <p className="text-gray-400 text-sm leading-snug">
                This syllabus comprises of topics of various subjects of your curriculum for {activeYear}.
              </p>
            </div>
            <button 
              className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
              onClick={() => window.open('#', '_blank')} // Replace # with your PDF link
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Search & Quick Filters */}
      <div className="flex flex-wrap gap-4 mb-12">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search notes..." 
              className="w-full pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>

      {/* 4. Notes Listing based on Active Year */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-bold text-blue-600 animate-pulse">Loading {activeYear} Resources...</p>
        </div>
      ) : (
        getSemsForYear(activeYear).map((semNum) => {
          const subjectsInSem = groupedData[semNum] || {};
          const hasNotes = Object.keys(subjectsInSem).length > 0;

          return (
            <div key={semNum} className="mb-20">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-4xl font-black text-gray-900 italic">Sem {semNum}</h2>
                <div className="h-[3px] flex-grow bg-blue-600 rounded-full opacity-10"></div>
              </div>

              {hasNotes ? (
                Object.entries(subjectsInSem).map(([subject, notesList]) => (
                  <div key={subject} className="mb-12">
                    <h3 className="text-sm font-black text-blue-600 mb-6 flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl w-fit uppercase tracking-widest">
                      <BookOpen size={16} /> {subject}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {notesList.map((note) => (
                        <div key={note._id} className="bg-white p-6 rounded-[2.5rem] border border-transparent hover:border-blue-100 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
                          <div className="relative">
                            <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center text-gray-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                              <FileText size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{note.title}</h4>
                            <p className="text-gray-400 text-xs mb-8 line-clamp-2 font-medium">{note.description}</p>
                          </div>
                          <div className="pt-6 border-t border-gray-50 flex flex-col gap-4">
                            <a 
                              href={note.fileUrl || note.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg"
                            >
                              <Download size={16} /> DOWNLOAD
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[3rem] border border-dashed border-gray-100 shadow-sm">
                  <Inbox className="text-gray-200 mb-4" size={48} />
                  <p className="text-gray-400 font-bold">No notes uploaded yet for Semester {semNum}.</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Notes;