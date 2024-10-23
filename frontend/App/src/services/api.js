import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchCases = async () => {
  const response = await axios.get(`${API_URL}/cases`);
  return response.data;
};

export const createCase = async (caseData) => {
  const response = await axios.post(`${API_URL}/cases`, caseData);
  return response.data;
};

