// authService.js

// src/services/auth.js
import axios from 'axios';



// export const login = async (email, password) => {
//   const response = await axios.post(`api/login`, { email, password });
//   if (response.data.token) {
//     localStorage.setItem('user', JSON.stringify(response.data));
//   }
//   return response.data;
// };

// export const logout = () => {
//   localStorage.removeItem('user');
// };

export const getCurrentStudent = () => {
  return localStorage.getItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');

};

// export const setToken = (token) => {
//   console.log(token);
//   localStorage.setItem('jwtToken', token);
// };

export const clearToken = () => {
  localStorage.removeItem('token');
};







