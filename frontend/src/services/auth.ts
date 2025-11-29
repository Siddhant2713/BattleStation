import api from './api';

export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const signup = async (username, password) => {
    const response = await api.post('/auth/signup', { username, password });
    return response.data;
};
