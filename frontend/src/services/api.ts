const API_URL = 'http://localhost:5000/api';

export const getComponents = async (category?: string) => {
    const url = category ? `${API_URL}/components?category=${category}` : `${API_URL}/components`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch components');
    return res.json();
};
