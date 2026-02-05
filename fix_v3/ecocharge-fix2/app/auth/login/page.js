'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage (vulnerable - for CTF)
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Помилка входу');
      }
    } catch (err) {
      setError('Помилка з\'єднання з сервером');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
              </svg>
              <span className="text-2xl font-bold text-green-700">EcoCharge</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Вхід в систему</h1>
            <p className="text-gray-500 mt-2">Введіть свої облікові дані</p>
          </div>
          
          {/* Success message after registration */}
          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              Реєстрація успішна! Тепер ви можете увійти.
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email адреса
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-green-600 rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-600">Запам'ятати мене</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:underline">
                Забули пароль?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Вхід...
                </>
              ) : (
                'Увійти'
              )}
            </button>
          </form>
          
          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Немає акаунту?{' '}
              <Link href="/auth/register" className="text-green-600 hover:underline font-medium">
                Зареєструватися
              </Link>
            </p>
          </div>
        </div>
        
        {/* Demo credentials hint (only test user, not admin) */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-yellow-800">Демо доступ:</p>
          <p className="text-yellow-700 mt-1">
            Email: user@ecocharge.local<br />
            Password: 12345678
          </p>
        </div>
      </div>
    </div>
  );
}
