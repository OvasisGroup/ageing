// Example usage of the registration API
// This file demonstrates how to call the registration endpoint

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com' 
  : 'http://localhost:3000';

export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'moderator';
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Example usage:
/*
async function example() {
  try {
    const result = await registerUser({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      role: 'user'
    });
    
    console.log('Registration successful:', result);
  } catch (error) {
    console.error('Failed to register:', error);
  }
}
*/

export async function getAllUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}