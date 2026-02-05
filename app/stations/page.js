'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Status badge component
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
      <span className="w-2 h-2 mr-1.5 rounded-full bg-white/30 animate-pulse"></span>
      {config.text}
    </span>
  );
}

// Station card component
function StationCard({ station }) {
  return (
    <div className="station-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{station.name}</h3>
          <p className="text-gray-500 text-sm">{station.address}, {station.city}</p>
        </div>
        <StatusBadge status={station.status} />
      </div>
      
      <div className="border-t border-gray-100 pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Конектори:</h4>
        <div className="space-y-2">
          {station.connectors.map((connector) => (
            <div key={connector.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">{connector.type}</span>
                <span className="text-gray-500 text-sm">{connector.power} кВт</span>
              </div>
              <StatusBadge status={connector.status} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div>
          <span className="text-2xl font-bold text-green-600">{station.pricePerKwh}</span>
          <span className="text-gray-500 text-sm ml-1">грн/кВт·год</span>
        </div>
        <Link 
          href={`/stations/${station.id}`}
          className="btn-primary text-sm"
        >
          Детальніше
        </Link>
      </div>
    </div>
  );
}

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchStations();
  }, [filter]);
  
  async function fetchStations() {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/api/stations${params}`);
      const data = await response.json();
      
      if (data.success) {
        setStations(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Помилка завантаження станцій');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Зарядні станції
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Знайдіть найближчу станцію EcoCharge та почніть заряджати свій електромобіль
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { value: 'all', label: 'Всі станції' },
            { value: 'available', label: 'Вільні' },
            { value: 'occupied', label: 'Зайняті' },
            { value: 'maintenance', label: 'Обслуговування' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === option.value
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Завантаження станцій...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg inline-block">
              {error}
            </div>
          </div>
        )}
        
        {/* Stations grid */}
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
            
            {stations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Станції з обраним фільтром не знайдено
                </p>
              </div>
            )}
            
            {/* Stats */}
            <div className="mt-12 text-center text-gray-500">
              Знайдено станцій: <span className="font-semibold">{stations.length}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
