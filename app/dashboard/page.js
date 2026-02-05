'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCharges: 15,
    totalKwh: 245.5,
    totalSpent: 2100.00,
    balance: 500.00
  });
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, date: '2025-01-30', station: 'ТРЦ "Глобус"', kwh: 25.5, amount: 216.75 },
    { id: 2, date: '2025-01-28', station: 'Паркінг "Центральний"', kwh: 18.2, amount: 127.40 },
    { id: 3, date: '2025-01-25', station: 'АЗС "ЕКО"', kwh: 42.0, amount: 378.00 },
  ]);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  function checkAuth() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (e) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }
  
  function handleLogout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Привіт, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-gray-500">Ваш особистий кабінет EcoCharge</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-700 transition"
          >
            Вийти
          </button>
        </div>
        
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 mb-1">Ваш баланс</p>
              <p className="text-4xl font-bold">₴{stats.balance.toFixed(2)}</p>
            </div>
            <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-50 transition">
              Поповнити
            </button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-gray-800">{stats.totalCharges}</div>
            <div className="text-gray-500">Зарядок</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.totalKwh} кВт·год</div>
            <div className="text-gray-500">Спожито</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-gray-800">₴{stats.totalSpent}</div>
            <div className="text-gray-500">Витрачено</div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/stations" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Знайти станцію</h3>
              <p className="text-gray-500 text-sm">Карта зарядних станцій</p>
            </div>
          </Link>
          
          <Link href="/dashboard/cards" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">RFID картки</h3>
              <p className="text-gray-500 text-sm">Управління картками</p>
            </div>
          </Link>
          
          <Link href="/dashboard/settings" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Налаштування</h3>
              <p className="text-gray-500 text-sm">Профіль та безпека</p>
            </div>
          </Link>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Останні зарядки</h2>
            <Link href="/dashboard/history" className="text-green-600 hover:underline text-sm">
              Вся історія →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3">Дата</th>
                  <th className="pb-3">Станція</th>
                  <th className="pb-3">Спожито</th>
                  <th className="pb-3 text-right">Сума</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-4 text-gray-600">{tx.date}</td>
                    <td className="py-4 text-gray-800 font-medium">{tx.station}</td>
                    <td className="py-4 text-gray-600">{tx.kwh} кВт·год</td>
                    <td className="py-4 text-right font-semibold text-gray-800">₴{tx.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* User Info Card */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h3 className="font-medium text-gray-700 mb-2">Інформація про акаунт</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <span className="ml-2 text-gray-800">{user?.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Роль:</span>
              <span className="ml-2 text-gray-800">{user?.role}</span>
            </div>
            <div>
              <span className="text-gray-500">ID:</span>
              <span className="ml-2 text-gray-800">{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
