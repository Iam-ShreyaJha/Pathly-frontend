import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://pathly-backend-yx6l.onrender.com/api'
});

export default instance;