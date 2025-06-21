import { useState, useEffect } from 'react';
import { API_BASE } from '../config/config';
import { useNavigate } from 'react-router-dom';

interface UserData {
  username: string;
  email: string;
}

export function useProfile() {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [navigate]);

  return { data, loading, error };
}
