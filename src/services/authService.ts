interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

let currentUser: User | null = null;

export const signIn = async (email: string, password: string): Promise<User> => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid login credentials');
  }

  const data = await res.json();
  const token = data.token;
  localStorage.setItem('authToken', token);

  // Decode token or fetch user info if needed; here we mock user info
  currentUser = {
    id: 'admin-id',
    name: 'Admin User',
    email,
    role: 'admin',
  };

  return currentUser;
};

export const signOut = async (): Promise<void> => {
  currentUser = null;
  localStorage.removeItem('authToken');
  return;
};

export const getCurrentUser = async (): Promise<User | null> => {
  return currentUser;
};
