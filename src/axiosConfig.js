import axios from 'axios';

const instance = axios.create({
    // Isse ye variable Vercel se uthayega, warna fallback Render URL par jayega
    baseURL: import.meta.env.VITE_API_URL || 'https://pathly-backend-yx6l.onrender.com/api'
});

export default instance;