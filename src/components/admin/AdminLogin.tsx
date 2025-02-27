
import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This would typically be a server-side hash, but for demo purposes
  // we're using a hardcoded hash. In a real application, this should
  // be handled securely on the server.
  const correctPasswordHash = 'e8ebe56f5c4ab8c5fa26898a1e76c0aa81f216ecbebe4fa5d133ff896e9a602c'; // This is a SHA-256 hash

  const hashPassword = async (password: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const hashedInput = await hashPassword(password);
      
      // In a real app, you would verify against a server
      if (hashedInput === correctPasswordHash) {
        // Create a token that expires in 2 hours
        const now = Math.floor(Date.now() / 1000);
        const tokenData = {
          exp: now + (2 * 60 * 60), // 2 hours from now
          iat: now,
          admin: true
        };
        
        const tokenString = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + 
                          btoa(JSON.stringify(tokenData)) + '.' +
                          btoa('signature'); // In a real app, use proper JWT signing
        
        localStorage.setItem('admin_token', tokenString);
        setIsAuthenticated(true);
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="inline-flex justify-center items-center w-16 h-16 bg-navy text-white rounded-full mb-4">
          <Lock size={24} />
        </div>
        <h2 className="text-2xl font-playfair font-bold">Admin Login</h2>
        <p className="text-gray-600">Enter your password to access the admin panel</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-navy text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
