interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://admincontrolled-portfolio.onrender.com/api';

let currentUser: User | null = null;

export const signIn = async (email: string, password: string): Promise<User> => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Login failed: ${err}`);
  }

  const data = await res.json();
  const token = data.token;

  localStorage.setItem('authToken', token);

  currentUser = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
  };

  return currentUser;
};

export const signOut = async (): Promise<void> => {
  currentUser = null;
  localStorage.removeItem('authToken');
};

export const getCurrentUser = async (): Promise<User | null> => {
  return currentUser;
};
