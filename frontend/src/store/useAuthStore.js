import { create } from 'zustand';

const SESSION_EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 hours in ms

const isSessionExpired = () => {
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (!loginTimestamp) return false;
    const elapsed = Date.now() - parseInt(loginTimestamp, 10);
    return elapsed > SESSION_EXPIRATION_TIME;
};

const getInitialToken = () => {
    if (isSessionExpired()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        return null;
    }
    return localStorage.getItem('token');
};

const getInitialUser = () => {
    if (isSessionExpired()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        return null;
    }
    try {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        localStorage.removeItem('user');
        return null;
    }
};

export const useAuthStore = create((set) => ({
    user: getInitialUser(),
    token: getInitialToken(),
    isAuthenticated: !!getInitialToken(),
    setUser: (user) => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        set({ user });
    },
    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        set({ token, isAuthenticated: !!token });
    },
    login: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('loginTimestamp', Date.now().toString());
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        set({ token, user, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        set({ token: null, user: null, isAuthenticated: false });
    }
}));