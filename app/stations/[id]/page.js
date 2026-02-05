'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${config.color}`}>
      <span className="w-2 h-2 mr-2 rounded-full bg-white/30 animate-pulse"></span>
      {config.text}
    </span>
  );
}

export default function StationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (params.id) {
      fetchStation(params.id);
    }
  }, [params.id]);
  
  async function fetchStation(stationId) {
    setLoading(true);
    try {
      const response = await fetch('/api/stations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stationId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStation(data.data);
      } else {
        setError(data.error || 'Станцію не знайдено');
      }
    } catch (err) {
      setError('Помилка завантаження даних');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження станції...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-xl mb-4">
            {error}
          </div>
          <Link href="/stations" className="text-green-600 hover:underline">
            ← Повернутися до списку станцій
          </Link>
        </div>
      </div>
    );
  }
  
  if (!station) {
    return null;
  }
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link href="/stations" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Всі станції
        </Link>
        
        {/* Station Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{station.name}</h1>
              <p className="text-gray-500 text-lg">{station.address}, {station.city}</p>
              <p className="text-gray-400 text-sm mt-1">ID: {station.id}</p>
            </div>
            <StatusBadge status={station.status} />
          </div>
          
          {/* Price */}
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Тариф</span>
              <div>
                <span className="text-3xl font-bold text-green-600">{station.pricePerKwh}</span>
                <span className="text-gray-500 ml-1">грн/кВт·год</span>
              </div>
            </div>
          </div>
          
          {/* Map placeholder */}
          <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center mb-6">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>Координати: {station.coordinates?.lat}, {station.coordinates?.lng}</p>
            </div>
          </div>
          
          {/* Last heartbeat */}
          <div className="text-sm text-gray-500">
            Остання активність: {new Date(station.lastHeartbeat).toLocaleString('uk-UA')}
          </div>
        </div>
        
        {/* Connectors */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Конектори</h2>
          <div className="space-y-4">
            {station.connectors?.map((connector) => (
              <div key={connector.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Конектор #{connector.id}</h3>
                      <p className="text-gray-500 text-sm">{connector.type}</p>
                    </div>
                  </div>
                  <StatusBadge status={connector.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-3">
                  <div>
                    <span className="text-gray-500 text-sm">Потужність</span>
                    <p className="font-semibold text-gray-800">{connector.power} кВт</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Тип</span>
                    <p className="font-semibold text-gray-800">{connector.type}</p>
                  </div>
                </div>
                
                {connector.status === 'available' && (
                  <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition">
                    Почати зарядку
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Station Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Додаткова інформація</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Режим роботи</h3>
              <p className="text-gray-600">Цілодобово, 24/7</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Оплата</h3>
              <p className="text-gray-600">Картка, RFID, мобільний додаток</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Зручності</h3>
              <p className="text-gray-600">Wi-Fi, освітлення, відеоспостереження</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Підтримка</h3>
              <p className="text-gray-600">+380 (44) 123-45-67</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
