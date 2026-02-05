'use client';

import { useState, useEffect } from 'react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('today');
  
  useEffect(() => {
    fetchTransactions();
  }, [dateFilter]);
  
  async function fetchTransactions() {
    // Simulated transaction data
    const mockTransactions = [
      {
        id: 'TXN-001245',
        date: '2025-02-05T14:32:00',
        user: 'user@ecocharge.local',
        station: 'EV-CH-001',
        stationName: 'ТРЦ "Глобус"',
        connector: 'CCS2',
        kwh: 25.5,
        duration: '00:42:15',
        amount: 229.50,
        status: 'completed'
      },
      {
        id: 'TXN-001244',
        date: '2025-02-05T13:15:00',
        user: 'ivan@example.com',
        station: 'EV-CH-003',
        stationName: 'АЗС "ЕКО"',
        connector: 'CCS2',
        kwh: 42.0,
        duration: '00:35:00',
        amount: 378.00,
        status: 'completed'
      },
      {
        id: 'TXN-001243',
        date: '2025-02-05T11:45:00',
        user: 'maria@example.com',
        station: 'EV-CH-002',
        stationName: 'Паркінг "Центральний"',
        connector: 'Type2',
        kwh: 18.2,
        duration: '01:20:00',
        amount: 127.40,
        status: 'completed'
      },
      {
        id: 'TXN-001242',
        date: '2025-02-05T10:30:00',
        user: 'operator@ecocharge.local',
        station: 'EV-CH-005',
        stationName: 'Готель "Hilton"',
        connector: 'Type2',
        kwh: 15.0,
        duration: '00:55:00',
        amount: 150.00,
        status: 'completed'
      },
      {
        id: 'TXN-001241',
        date: '2025-02-05T09:15:00',
        user: 'user@ecocharge.local',
        station: 'EV-CH-001',
        stationName: 'ТРЦ "Глобус"',
        connector: 'CHAdeMO',
        kwh: 0,
        duration: '00:02:30',
        amount: 0,
        status: 'failed',
        error: 'Connection timeout'
      }
    ];
    
    setTransactions(mockTransactions);
    setLoading(false);
  }
  
  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalKwh = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.kwh, 0);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Транзакції</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Експорт CSV
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            Звіт
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">{transactions.length}</div>
          <div className="text-gray-500 text-sm">Транзакцій сьогодні</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">₴{totalRevenue.toFixed(2)}</div>
          <div className="text-gray-500 text-sm">Дохід</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{totalKwh.toFixed(1)} кВт·год</div>
          <div className="text-gray-500 text-sm">Передано енергії</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">
            {transactions.filter(t => t.status === 'failed').length}
          </div>
          <div className="text-gray-500 text-sm">Невдалих</div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {['today', 'week', 'month', 'all'].map((filter) => (
          <button
            key={filter}
            onClick={() => setDateFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              dateFilter === filter
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter === 'today' ? 'Сьогодні' :
             filter === 'week' ? 'Тиждень' :
             filter === 'month' ? 'Місяць' : 'Всі'}
          </button>
        ))}
      </div>
      
      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата/Час</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Користувач</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Станція</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Конектор</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">кВт·год</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тривалість</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сума</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{tx.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tx.date).toLocaleString('uk-UA')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.user}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{tx.station}</div>
                  <div className="text-sm text-gray-500">{tx.stationName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.connector}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.kwh}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₴{tx.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                    tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tx.status === 'completed' ? 'Завершено' :
                     tx.status === 'failed' ? 'Помилка' : 'В процесі'}
                  </span>
                  {tx.error && (
                    <div className="text-xs text-red-500 mt-1">{tx.error}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Database Info */}
      <div className="mt-8 bg-gray-800 text-gray-300 rounded-xl p-6 font-mono text-sm">
        <h3 className="text-green-400 mb-4">Database Connection</h3>
        <div className="space-y-1">
          <p>Host: localhost:5432</p>
          <p>Database: ecocharge_db</p>
          <p>User: ecocharge_app</p>
          <p>Tables: transactions, users, stations, connectors</p>
          <p className="text-yellow-400 mt-2">⚠ Direct SQL queries enabled for reporting</p>
        </div>
      </div>
    </div>
  );
}
