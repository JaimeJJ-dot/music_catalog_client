import axios from 'client';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const loginWithOAuth = async (username, password, clientId, clientSecret) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await axios.post(`${API_BASE_URL}/o/token/`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};