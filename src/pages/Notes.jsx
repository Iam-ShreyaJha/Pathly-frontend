import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Download, Search, Filter, BookOpen, Inbox } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSem, setSelectedSem] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All'); // Naya Subject Filter
  const [loading, setLoading] = useState(true);

  const semesterList = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/notes');
        setNotes(data.data);
      } catch (err) {
        console.error("Error fetching notes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // 1. Dynamic Subject List: Jo semester select kiya hai, uske subjects nikalna
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
    <div className="container mx-auto p-8 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Study Materials</h1>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" placeholder="Search title..." 
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Semester Filter */}
          <div className="relative w-full sm:w-44">
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
            <select 
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
              onChange={(e) => {
                setSelectedSem(e.target.value);
                setSelectedSubject('All'); // Sem badalne par subject reset karein
              }}
            >
              <option value="All">All Semesters</option>
              {semesterList.map(num => <option key={num} value={num}>Semester {num}</option>)}
            </select>
          </div>

          {/* Subject Filter (Dynamic) */}
          <div className="relative w-full sm:w-44">
            <BookOpen className="absolute left-3 top-3 text-gray-400" size={20} />
            <select 
              value={selectedSubject}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 font-bold text-blue-600 animate-pulse text-xl">Loading Pathly Library...</div>
      ) : (
        semesterList.map((semNum) => {
          if (selectedSem !== 'All' && selectedSem !== semNum.toString()) return null;

          const subjectsInSem = groupedData[semNum] || {};
          const hasNotes = Object.keys(subjectsInSem).length > 0;

          return (
            <div key={semNum} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black text-blue-800">Semester {semNum}</h2>
                <div className="h-[2px] flex-grow bg-blue-100 rounded-full"></div>
              </div>

              {hasNotes ? (
                Object.entries(subjectsInSem).map(([subject, notesList]) => (
                  <div key={subject} className="mb-10">
                    <h3 className="text-lg font-bold text-gray-600 mb-6 flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-lg w-fit">
                      <BookOpen className="text-blue-500" size={20} /> {subject}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {notesList.map((note) => (
                        <div key={note._id} className="bg-white p-5 rounded-3xl border border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                          <div>
                            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <FileText size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2 leading-tight">{note.title}</h4>
                            <p className="text-gray-500 text-xs mb-6 line-clamp-2">{note.description}</p>
                          </div>
                          <div className="pt-4 border-t border-gray-50 flex flex-col gap-3">
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md uppercase w-fit">{note.subject}</span>
                            <a href={note.link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-md">
                              <Download size={16} /> Download PDF
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 py-8 px-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                  <Inbox className="text-gray-300" size={24} />
                  <p className="text-gray-400 italic">No notes uploaded for Semester {semNum} yet.</p>
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