'use client';

import { useState, useEffect } from 'react';

function StatusBadge({ status }) {
  const statusConfig = {
    available: { color: 'bg-green-500', text: 'Вільна' },
    occupied: { color: 'bg-yellow-500', text: 'Зайнята' },
    charging: { color: 'bg-blue-500', text: 'Заряджає' },
    maintenance: { color: 'bg-gray-500', text: 'Обслуговування' },
    offline: { color: 'bg-red-500', text: 'Офлайн' }
  };
  
  const config = statusConfig[status] || statusConfig.offline;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${config.color}`}>
      {config.text}
    </span>
  );
}

export default function AdminStationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  
  useEffect(() => {
    fetchStations();
  }, []);
  
  async function fetchStations() {
    try {
      const response = await fetch('/api/stations');
      const data = await response.json();
      
      if (data.success) {
        setStations(data.data);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  }
  
  function handleAction(station, action) {
    alert(`${action} для станції ${station.id} буде виконано через CSMS API`);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Управління станціями</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          + Додати станцію
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">{stations.length}</div>
          <div className="text-gray-500 text-sm">Всього</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {stations.filter(s => s.status === 'available').length}
          </div>
          <div className="text-gray-500 text-sm">Вільних</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {stations.filter(s => s.status === 'occupied').length}
          </div>
          <div className="text-gray-500 text-sm">Зайнятих</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">
            {stations.filter(s => s.status === 'maintenance' || s.status === 'offline').length}
          </div>
          <div className="text-gray-500 text-sm">Офлайн</div>
        </div>
      </div>
      
      {/* Stations Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Назва</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Місто</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Конектори</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тариф</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heartbeat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stations.map((station) => (
              <tr key={station.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{station.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{station.name}</div>
                  <div className="text-sm text-gray-500">{station.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={station.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {station.connectors.map((c, i) => (
                    <span key={i} className="mr-2">{c.type} ({c.power}kW)</span>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₴{station.pricePerKwh}/кВт·год
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(station.lastHeartbeat).toLocaleTimeString('uk-UA')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAction(station, 'Reset')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => handleAction(station, 'Configure')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Config
                    </button>
                    <button 
                      onClick={() => handleAction(station, 'Disable')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Disable
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* OCPP Info */}
      <div className="mt-8 bg-gray-800 text-gray-300 rounded-xl p-6 font-mono text-sm">
        <h3 className="text-green-400 mb-4">OCPP Connection Info</h3>
        <div className="space-y-1">
          <p>CSMS URL: ws://192.168.20.20:9000/ocpp</p>
          <p>Protocol: OCPP 1.6-J / OCPP 2.0.1</p>
          <p>Auth: Basic (charger_id:password)</p>
          <p className="text-yellow-400 mt-2">⚠ Some chargers use unencrypted WebSocket (ws://)</p>
        </div>
      </div>
    </div>
  );
}
