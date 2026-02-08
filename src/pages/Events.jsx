import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Bell, Laptop, Cpu, Search, Clock, Globe } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events');
        if (data.success) setEvents(data.data);
      } catch (err) { console.error("Fetch error:", err); }
      finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (e.category && e.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- FIXED FILTERING LOGIC ---
  // Ab hum exact category match karenge taaki overlap na ho
  const hackathons = filteredEvents.filter(e => e.category === 'Hackathon');
  const techEvents = filteredEvents.filter(e => e.category === 'Tech Event' || e.category === 'Exhibition' || e.category === 'Workshop');
  const otherEvents = filteredEvents.filter(e => e.category !== 'Hackathon' && e.category !== 'Tech Event' && e.category !== 'Exhibition' && e.category !== 'Workshop');

  const EventCard = ({ event, bgColor, textColor }) => {
    const calculateDaysLeft = (eventDate) => {
      const today = new Date();
      const eventD = new Date(eventDate);
      const diffTime = eventD - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const daysLeft = calculateDaysLeft(event.date);

    return (
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group h-full flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className={`px-3 py-1 ${bgColor} ${textColor} bg-opacity-10 text-[10px] font-black rounded-full uppercase tracking-widest`}>
              {event.category}
            </span>
            
            {daysLeft > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 animate-pulse">
                <Clock size={12} className="font-bold" />
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  {daysLeft} Days Left
                </span>
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="text-xs font-bold text-gray-400 flex items-center gap-2">
            <Calendar size={14} /> 
            {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          
          <div className="flex gap-2">
            {event.link && (
              <a href={event.link} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Register
              </a>
            )}
            <button 
              onClick={() => {
                const eventDate = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
                window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${eventDate}/${eventDate}&details=${encodeURIComponent(event.description)}`, '_blank');
              }}
              className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-gray-100"
            >
              <Bell size={16} /> Remind Me
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-16">Event Hub</h1>

        {loading ? (
          <div className="text-center py-20 font-bold text-blue-600 animate-pulse">Syncing...</div>
        ) : (
          <div className="space-y-20">
            {/* 1. HACKATHONS SECTION - */}
            {hackathons.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white"><Laptop size={24} /></div>
                  <h2 className="text-3xl font-black text-gray-800">Hackathons</h2>
                  <div className="h-[2px] flex-grow bg-blue-100 rounded-full opacity-30"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {hackathons.map(e => (
                    <EventCard key={e._id} event={e} bgColor="bg-blue-600" textColor="text-blue-600" />
                  ))}
                </div>
              </section>
            )}

            {/* 2. TECH EVENTS SECTION - */}
            {techEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-purple-600 rounded-2xl text-white"><Cpu size={24} /></div>
                  <h2 className="text-3xl font-black text-gray-800">Tech Events & Summits</h2>
                  <div className="h-[2px] flex-grow bg-purple-100 rounded-full opacity-30"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {techEvents.map(e => (
                    <EventCard key={e._id} event={e} bgColor="bg-purple-600" textColor="text-purple-600" />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;