'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStations: 0,
    activeStations: 0,
    totalUsers: 0,
    todayTransactions: 0,
    todayRevenue: 0,
    activeCharging: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  async function fetchDashboardData() {
    try {
      // Fetch stations data
      const stationsRes = await fetch('/api/stations');
      const stationsData = await stationsRes.json();
      
      if (stationsData.success) {
        const stations = stationsData.data;
        const available = stations.filter(s => s.status === 'available').length;
        const charging = stations.filter(s => s.status === 'occupied').length;
        
        setStats({
          totalStations: stations.length,
          activeStations: stations.filter(s => s.status !== 'maintenance' && s.status !== 'offline').length,
          totalUsers: 1250,
          todayTransactions: 89,
          todayRevenue: 12450.00,
          activeCharging: charging
        });
      }
      
      setRecentActivity([
        { time: '14:32', event: 'Станція EV-CH-001 - Початок зарядки', user: 'RFID-****5678', type: 'start' },
        { time: '14:28', event: 'Станція EV-CH-003 - Завершення зарядки', user: 'user@email.com', type: 'end' },
        { time: '14:15', event: 'Новий користувач зареєстрований', user: 'new@user.com', type: 'user' },
        { time: '14:01', event: 'Станція EV-CH-002 - Помилка підключення', user: 'System', type: 'error' },
        { time: '13:45', event: 'Станція EV-CH-005 - Початок зарядки', user: 'RFID-****1234', type: 'start' },
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-3xl font-bold text-green-600">{stats.totalStations}</div>
          <div className="text-gray-500 text-sm">Всього станцій</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-3xl font-bold text-green-600">{stats.activeStations}</div>
          <div className="text-gray-500 text-sm">Активних</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
          <div className="text-gray-500 text-sm">Користувачів</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-3xl font-bold text-yellow-600">{stats.activeCharging}</div>
          <div className="text-gray-500 text-sm">Заряджають</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-3xl font-bold text-purple-600">{stats.todayTransactions}</div>
          <div className="text-gray-500 text-sm">Транзакцій сьогодні</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-3xl font-bold text-green-600">₴{stats.todayRevenue.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">Дохід сьогодні</div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/stations" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">Управління станціями</h3>
          <p className="text-gray-500 text-sm mt-1">Перегляд та налаштування станцій</p>
        </Link>
        
        <Link href="/admin/users" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">Користувачі</h3>
          <p className="text-gray-500 text-sm mt-1">Управління акаунтами</p>
        </Link>
        
        <Link href="/admin/transactions" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">Транзакції</h3>
          <p className="text-gray-500 text-sm mt-1">Історія та звіти</p>
        </Link>
        
        <Link href="/admin/settings" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200 transition">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">Налаштування</h3>
          <p className="text-gray-500 text-sm mt-1">Системні параметри</p>
        </Link>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Остання активність</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm w-12">{activity.time}</span>
                <span className={`w-2 h-2 rounded-full ${
                  activity.type === 'start' ? 'bg-green-500' :
                  activity.type === 'end' ? 'bg-blue-500' :
                  activity.type === 'error' ? 'bg-red-500' : 'bg-gray-500'
                }`}></span>
                <span className="text-gray-700">{activity.event}</span>
              </div>
              <span className="text-gray-500 text-sm">{activity.user}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* System Info - Information Disclosure */}
      <div className="bg-gray-800 text-gray-300 rounded-xl p-6 font-mono text-sm">
        <h3 className="text-green-400 mb-4">System Information</h3>
        <div className="space-y-1">
          <p>Server: ecocharge-web (192.168.125.50)</p>
          <p>API Gateway: 192.168.100.20:8080</p>
          <p>CSMS Backend: 192.168.20.20</p>
          <p>Grafana Monitoring: 192.168.100.30:3000</p>
          <p>Database: PostgreSQL @ localhost:5432</p>
          <p className="text-yellow-400 mt-2">⚠ Debug mode enabled</p>
        </div>
      </div>
    </div>
  );
}
