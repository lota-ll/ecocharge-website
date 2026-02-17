'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// QR Code Modal Component
function QRCodeModal({ station, isOpen, onClose }) {
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState(256);
  
  useEffect(() => {
    if (isOpen && station) {
      generateQR();
    }
  }, [isOpen, station, format, size]);
  
  async function generateQR() {
    setLoading(true);
    setError(null);
    
    // Build QR API URL
    const apiUrl = `/api/qr?station=${encodeURIComponent(station.id)}&format=${format}&size=${size}`;
    setQrUrl(apiUrl);
    setLoading(false);
  }
  
  async function downloadQR() {
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Помилка генерації QR-коду');
        return;
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_${station.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Помилка завантаження QR-коду');
    }
  }
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">QR-код станції</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm mb-2">{station.name}</p>
          <p className="text-gray-400 text-xs">ID: {station.id}</p>
        </div>
        
        {/* QR Code Preview */}
        <div className="bg-gray-100 rounded-xl p-4 mb-4 flex items-center justify-center min-h-[200px]">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          ) : error ? (
            <div className="text-red-500 text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          ) : (
            <img 
              src={qrUrl} 
              alt={`QR код для ${station.id}`}
              className="max-w-full h-auto"
              onError={() => setError('Помилка завантаження QR-коду')}
            />
          )}
        </div>
        
        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Формат</label>
          <div className="flex gap-2">
            {['png', 'svg', 'eps'].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  format === f 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        {/* Size Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Розмір: {size}px
          </label>
          <input
            type="range"
            min="128"
            max="512"
            step="64"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        {/* Download Button */}
        <button
          onClick={downloadQR}
          disabled={loading || error}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Завантажити QR-код
          </span>
        </button>
        
        {/* API URL for debugging (hidden hint for CTF) */}
        <div className="mt-4 text-xs text-gray-400 break-all">
          {/* <!-- Debug: API endpoint /api/qr?station={id}&format={format}&size={size} --> */}
          <details className="cursor-pointer">
            <summary className="hover:text-gray-600">Технічна інформація</summary>
            <code className="block mt-2 p-2 bg-gray-100 rounded text-gray-600">
              GET /api/qr?station={station.id}&format={format}&size={size}
            </code>
          </details>
        </div>
      </div>
    </div>
  );
}

// Share Modal Component
function ShareModal({ station, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/stations/${station?.id}` 
    : '';
  
  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  
  if (!isOpen || !station) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Поділитися станцією</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">{station.name}</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={shareUrl} 
              readOnly 
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {copied ? '✓' : 'Копіювати'}
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Зарядна станція ${station.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.057-.692-1.654-1.124-2.682-1.8-1.187-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.154.234.17.331.015.097.035.313.019.483z"/>
            </svg>
          </a>
          <a
            href={`viber://forward?text=${encodeURIComponent(`Зарядна станція ${station.name}: ${shareUrl}`)}`}
            className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.027 4.08c3.533.067 6.56 2.133 7.413 5.36.107.4-.133.813-.533.92-.4.107-.813-.133-.92-.533-.667-2.507-3.067-4.12-5.813-4.173-.413-.013-.747-.347-.733-.76.013-.413.36-.747.773-.733.267.013.547.013.813.08v-.16zm.093 2.267c2.027.12 3.707 1.413 4.253 3.253.107.387-.12.787-.507.893-.387.107-.787-.12-.893-.507-.4-1.347-1.653-2.307-3.133-2.4-.413-.027-.72-.387-.693-.8.027-.413.387-.72.8-.693.067.013.12.013.173.027v.227zm.147 2.333c.947.12 1.68.84 1.84 1.773.053.4-.227.773-.627.827-.4.053-.773-.227-.827-.627-.08-.467-.44-.84-.907-.907-.4-.053-.68-.427-.627-.827.053-.4.427-.68.827-.627.12.013.227.04.32.08v.307zm4.213 6.08l-.08.093c-.693.76-1.653 1.2-2.693 1.2-.413 0-.84-.067-1.253-.2-2.12-.693-4.307-2.347-5.813-4.4-1.2-1.64-1.787-3.253-1.653-4.547.093-.867.507-1.627 1.173-2.147l.133-.093c.427-.307.987-.24 1.347.147l1.2 1.28c.32.347.307.88-.027 1.2l-.693.667c-.187.187-.24.467-.133.707.293.653.893 1.56 1.733 2.453.84.893 1.733 1.507 2.387 1.813.24.12.52.067.707-.12l.68-.693c.32-.32.853-.347 1.2-.027l1.293 1.187c.387.36.453.96.147 1.4l-.053.08z"/>
            </svg>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

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
  const [showQRModal, setShowQRModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
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
            <div className="flex flex-col gap-2">
              <StatusBadge status={station.status} />
              {/* Action buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowQRModal(true)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  title="QR-код станції"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  title="Поділитися"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
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
        
        {/* QR Code Modal */}
        <QRCodeModal 
          station={station} 
          isOpen={showQRModal} 
          onClose={() => setShowQRModal(false)} 
        />
        
        {/* Share Modal */}
        <ShareModal 
          station={station} 
          isOpen={showShareModal} 
          onClose={() => setShowShareModal(false)} 
        />
      </div>
    </div>
  );
}
