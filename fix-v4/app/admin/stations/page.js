'use client';

import { useState, useEffect } from 'react';
import { Modal, SuccessModal, ConfirmModal } from '../../../components/Modal';

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
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  
  useEffect(() => {
    fetchStations();
  }, []);
  
  async function fetchStations() {
    try {
      // Fetch with internal data for admin
      const response = await fetch('/api/stations?internal=true');
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
  
  function handleReset() {
    setSuccessMessage(`Команда Reset надіслана на станцію ${selectedStation?.id}. Станція перезавантажується...`);
    setShowSuccessModal(true);
  }
  
  function handleConfigure() {
    setSuccessMessage(`Конфігурацію станції ${selectedStation?.id} оновлено через OCPP.`);
    setShowSuccessModal(true);
  }
  
  function handleDisable() {
    setStations(stations.map(s => 
      s.id === selectedStation?.id 
        ? { ...s, status: s.status === 'maintenance' ? 'available' : 'maintenance' } 
        : s
    ));
    setSuccessMessage(
      selectedStation?.status === 'maintenance' 
        ? `Станцію ${selectedStation?.id} увімкнено.`
        : `Станцію ${selectedStation?.id} вимкнено для обслуговування.`
    );
    setShowSuccessModal(true);
  }
  
  function handleAddStation() {
    setSuccessMessage('Нову станцію додано. Очікуємо першого Heartbeat від станції...');
    setShowSuccessModal(true);
    setShowAddModal(false);
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
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
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
                  {station.connectors?.map((c, i) => (
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
                      onClick={() => { setSelectedStation(station); setShowResetModal(true); }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => { setSelectedStation(station); setShowConfigModal(true); }}
                      className="text-green-600 hover:text-green-900"
                    >
                      Config
                    </button>
                    <button 
                      onClick={() => { setSelectedStation(station); setShowDisableModal(true); }}
                      className="text-red-600 hover:text-red-900"
                    >
                      {station.status === 'maintenance' ? 'Enable' : 'Disable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add Station Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Додати станцію">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Station ID</label>
            <input
              type="text"
              placeholder="EV-CH-XXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Назва</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Адреса</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OCPP версія</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="1.6">OCPP 1.6-J</option>
              <option value="2.0.1">OCPP 2.0.1</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Скасувати
            </button>
            <button
              onClick={handleAddStation}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Додати
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Reset Confirmation */}
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        title="Перезавантажити станцію?"
        message={`Надіслати команду Reset на станцію ${selectedStation?.id}? Всі активні сесії будуть перервані.`}
        confirmText="Reset"
        danger={true}
      />
      
      {/* Config Modal */}
      <Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} title={`Конфігурація ${selectedStation?.id}`}>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <p><strong>IP:</strong> {selectedStation?._internal?.ip || 'N/A'}</p>
            <p><strong>OCPP:</strong> {selectedStation?._internal?.ocppVersion || 'N/A'}</p>
            <p><strong>Firmware:</strong> {selectedStation?._internal?.firmware || 'N/A'}</p>
            <p><strong>Vendor:</strong> {selectedStation?._internal?.vendor || 'N/A'}</p>
            <p><strong>Model:</strong> {selectedStation?._internal?.model || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heartbeat Interval (сек)</label>
            <input
              type="number"
              defaultValue={60}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тариф (грн/кВт·год)</label>
            <input
              type="number"
              step="0.5"
              defaultValue={selectedStation?.pricePerKwh}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowConfigModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Скасувати
            </button>
            <button
              onClick={() => { setShowConfigModal(false); handleConfigure(); }}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Зберегти
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Disable Confirmation */}
      <ConfirmModal
        isOpen={showDisableModal}
        onClose={() => setShowDisableModal(false)}
        onConfirm={handleDisable}
        title={selectedStation?.status === 'maintenance' ? 'Увімкнути станцію?' : 'Вимкнути станцію?'}
        message={
          selectedStation?.status === 'maintenance' 
            ? `Повернути станцію ${selectedStation?.id} в робочий режим?`
            : `Перевести станцію ${selectedStation?.id} в режим обслуговування? Нові сесії не будуть дозволені.`
        }
        confirmText={selectedStation?.status === 'maintenance' ? 'Увімкнути' : 'Вимкнути'}
        danger={selectedStation?.status !== 'maintenance'}
      />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
      
      {/* CitrineOS CSMS Info - Information Disclosure */}
      <div className="mt-8 bg-gray-800 text-gray-300 rounded-xl p-6 font-mono text-sm">
        <h3 className="text-green-400 mb-4">CitrineOS CSMS Connection Info</h3>
        <div className="space-y-1">
          <p>REST API: http://192.168.20.20:8080</p>
          <p>GraphQL: http://192.168.20.20:8090/v1/graphql</p>
          <p>Hasura Admin Secret: CitrineOS!</p>
          <p className="mt-2 text-blue-400">--- OCPP WebSocket Endpoints ---</p>
          <p>OCPP 1.6-J: ws://192.168.20.20:8092/&lt;stationId&gt;</p>
          <p>OCPP 2.0.1: ws://192.168.20.20:8081/&lt;stationId&gt;</p>
          <p>OCPP 2.0.1 TLS: wss://192.168.20.20:8443/&lt;stationId&gt;</p>
          <p className="mt-2 text-blue-400">--- Database ---</p>
          <p>PostgreSQL: 192.168.20.20:5432</p>
          <p>Database: citrine | User: citrine | Pass: citrine</p>
          <p className="mt-2 text-blue-400">--- Storage ---</p>
          <p>MinIO: http://192.168.20.20:9001 (minioadmin/minioadmin)</p>
          <p>RabbitMQ: http://192.168.20.20:15672 (guest/guest)</p>
          <p className="text-yellow-400 mt-3">⚠ Security Profile 0 - No authentication required!</p>
        </div>
      </div>
    </div>
  );
}
