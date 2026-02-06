'use client';

import { useState } from 'react';
import { SuccessModal } from '../../../components/Modal';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Settings state
  const [settings, setSettings] = useState({
    companyName: 'EcoCharge',
    supportEmail: 'support@ecocharge.local',
    supportPhone: '+380 (44) 123-45-67',
    currency: 'UAH',
    twoFactor: false,
    debugMode: true,
    httpsOnly: false,
    backupSchedule: '0 2 * * *'
  });
  
  const tabs = [
    { id: 'general', label: 'Загальні' },
    { id: 'api', label: 'API' },
    { id: 'security', label: 'Безпека' },
    { id: 'backup', label: 'Backup' },
    { id: 'system', label: 'Система' },
  ];
  
  function handleSave() {
    setSuccessMessage('Налаштування збережено успішно!');
    setShowSuccessModal(true);
  }
  
  function handleToggle(key) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }
  
  function handleBackupNow() {
    setSuccessMessage('Резервне копіювання запущено. Перевірте /var/backups/ecocharge через декілька хвилин.');
    setShowSuccessModal(true);
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Налаштування</h1>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Загальні налаштування</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назва компанії
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email підтримки
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон підтримки
              </label>
              <input
                type="tel"
                value={settings.supportPhone}
                onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Валюта
              </label>
              <select 
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="UAH">UAH (₴)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            
            <button 
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Зберегти зміни
            </button>
          </div>
        </div>
      )}
      
      {/* API Settings */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">API Налаштування</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Gateway URL
                </label>
                <input
                  type="text"
                  defaultValue="http://192.168.100.20:8080"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex">
                  <input
                    type="password"
                    defaultValue="ec0ch4rg3_4p1_k3y_2024!"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg font-mono"
                  />
                  <button className="bg-gray-200 px-4 py-2 rounded-r-lg hover:bg-gray-300">
                    Показати
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSMS WebSocket URL
                </label>
                <input
                  type="text"
                  defaultValue="ws://192.168.20.20:9000/ocpp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono bg-gray-50"
                  readOnly
                />
              </div>
              
              <button 
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Зберегти зміни
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠ Увага</h3>
            <p className="text-yellow-700 text-sm">
              API ключі є конфіденційною інформацією. Не передавайте їх третім особам.
            </p>
          </div>
        </div>
      )}
      
      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Налаштування безпеки</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="font-medium text-gray-800">Двофакторна автентифікація</div>
                  <div className="text-sm text-gray-500">Вимагати 2FA для адміністраторів</div>
                </div>
                <button
                  onClick={() => handleToggle('twoFactor')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.twoFactor ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.twoFactor ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="font-medium text-gray-800">Режим відладки</div>
                  <div className="text-sm text-gray-500">Показувати детальні помилки</div>
                </div>
                <button
                  onClick={() => handleToggle('debugMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.debugMode ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.debugMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="font-medium text-gray-800">HTTPS Only</div>
                  <div className="text-sm text-gray-500">Перенаправляти HTTP на HTTPS</div>
                </div>
                <button
                  onClick={() => handleToggle('httpsOnly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.httpsOnly ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.httpsOnly ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <button 
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition mt-4"
              >
                Зберегти зміни
              </button>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-semibold text-red-800 mb-2">🔓 Виявлені вразливості</h3>
            <ul className="text-red-700 text-sm space-y-1">
              <li>• Паролі зберігаються з MD5 (рекомендується bcrypt)</li>
              <li>• JWT токени без підпису</li>
              <li>• Режим відладки увімкнено</li>
              <li>• HTTPS не примусовий</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Backup Settings */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Резервне копіювання</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Шлях до скрипта
                </label>
                <input
                  type="text"
                  defaultValue="/opt/maintenance/backup.js"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Директорія бекапів
                </label>
                <input
                  type="text"
                  defaultValue="/var/backups/ecocharge"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Розклад (cron)
                </label>
                <input
                  type="text"
                  value={settings.backupSchedule}
                  onChange={(e) => setSettings({...settings, backupSchedule: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono"
                />
                <p className="text-sm text-gray-500 mt-1">Щодня о 02:00</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={handleBackupNow}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Запустити бекап зараз
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Відновити з бекапу
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 text-gray-300 rounded-xl p-6 font-mono text-sm">
            <h3 className="text-green-400 mb-4">Backup Script Info</h3>
            <div className="space-y-1">
              <p>Script: /opt/maintenance/backup.js</p>
              <p>Run as: sudo -u www-data</p>
              <p>Sudoers: www-data ALL=(ALL) NOPASSWD: /usr/bin/node /opt/maintenance/backup.js</p>
              <p className="text-yellow-400 mt-2">⚠ BACKUP_TARGET variable is user-controllable</p>
            </div>
          </div>
        </div>
      )}
      
      {/* System Info */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Системна інформація</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Сервер</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hostname:</span>
                    <span className="font-mono">ecocharge-web</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">IP Address:</span>
                    <span className="font-mono">192.168.125.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">OS:</span>
                    <span className="font-mono">Ubuntu 22.04 LTS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Node.js:</span>
                    <span className="font-mono">v20.x</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Додаток</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Framework:</span>
                    <span className="font-mono">Next.js 15.0.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">React:</span>
                    <span className="font-mono">19.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Database:</span>
                    <span className="font-mono">PostgreSQL 15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Web Server:</span>
                    <span className="font-mono">nginx 1.24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 text-gray-300 rounded-xl p-6 font-mono text-sm">
            <h3 className="text-green-400 mb-4">Network Configuration</h3>
            <div className="space-y-1">
              <p>External Network: 192.168.125.0/24</p>
              <p>DMZ Network: 192.168.100.0/24</p>
              <p>Internal Network: 192.168.20.0/24</p>
              <p>OT Network: 172.16.0.0/24</p>
              <p className="mt-2">---</p>
              <p>API Gateway: 192.168.100.20:8080</p>
              <p>Grafana: 192.168.100.30:3000 (admin:admin)</p>
              <p>Jump Host: 192.168.100.40</p>
              <p>CSMS: 192.168.20.20</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
}
