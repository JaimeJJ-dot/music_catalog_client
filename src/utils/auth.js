// src/utils/auth.js
export const isLoggedIn = () => Boolean(localStorage.getItem('access_token'));