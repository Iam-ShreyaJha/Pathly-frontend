import { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Custom instance use kiya
import { FileText, Download, Search, Filter, BookOpen, Inbox } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSem, setSelectedSem] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All'); 
  const [loading, setLoading] = useState(true);

  const semesterList = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // FIXED: Pura URL hata kar endpoint ko chota kiya
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

  // 1. Dynamic Subject List logic
  const availableSubjects = selectedSem === 'All' 
    ? [...new Set(notes.map(n => n.subject))]
    : [...new Set(notes.filter(n => n.semester.toString() === selectedSem).map(n => n.subject))];

  // 2. Main Filtering Logic
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
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
        <div>
           <h1 className="text-4xl font-black text-gray-900 tracking-tight">Pathly Library</h1>
           <p className="text-gray-500 font-medium mt-1">Access {notes.length} curated study resources.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search by title..." 
              className="w-full pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Semester Filter */}
          <div className="relative w-full sm:w-44">
            <Filter className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={18} />
            <select 
              className="w-full pl-12 pr-10 py-3 bg-white border-none shadow-sm rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none font-bold text-gray-700"
              onChange={(e) => {
                setSelectedSem(e.target.value);
                setSelectedSubject('All');
              }}
            >
              <option value="All">Semesters</option>
              {semesterList.map(num => <option key={num} value={num}>Semester {num}</option>)}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="relative w-full sm:w-44">
            <BookOpen className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={18} />
            <select 
              value={selectedSubject}
              className="w-full pl-12 pr-10 py-3 bg-white border-none shadow-sm rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none font-bold text-gray-700"
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-bold text-blue-600 animate-pulse">Syncing Library Data...</p>
        </div>
      ) : (
        semesterList.map((semNum) => {
          if (selectedSem !== 'All' && selectedSem !== semNum.toString()) return null;

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
                          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="relative">
                            <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center text-gray-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                              <FileText size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{note.title}</h4>
                            <p className="text-gray-400 text-xs mb-8 line-clamp-3 font-medium">{note.description || "Comprehensive notes for exam preparation."}</p>
                          </div>
                          
                          <div className="pt-6 border-t border-gray-50 flex flex-col gap-4 relative">
                            <a 
                              href={note.fileUrl || note.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                            >
                              <Download size={16} /> DOWNLOAD RESOURCE
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
                  <p className="text-gray-400 font-bold">Semester {semNum} is currently empty.</p>
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