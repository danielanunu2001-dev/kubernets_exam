import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Assurez-vous que le port et le préfixe de l'API sont corrects
});

export default api;
