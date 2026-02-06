'use client';

import { useState, useEffect } from 'react';
import { Modal, SuccessModal, ConfirmModal } from '../../../components/Modal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: ''
  });
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  async function fetchUsers() {
    setUsers([
      {
        id: 1,
        name: 'System Administrator',
        email: 'admin@ecocharge.local',
        role: 'admin',
        phone: '+380501234567',
        balance: 10000.00,
        totalCharges: 45,
        lastActive: '2025-02-05T14:30:00',
        status: 'active'
      },
      {
        id: 2,
        name: 'Station Operator',
        email: 'operator@ecocharge.local',
        role: 'operator',
        phone: '+380502345678',
        balance: 5000.00,
        totalCharges: 120,
        lastActive: '2025-02-05T13:15:00',
        status: 'active'
      },
      {
        id: 3,
        name: 'Test User',
        email: 'user@ecocharge.local',
        role: 'user',
        phone: '+380503456789',
        balance: 500.00,
        totalCharges: 15,
        lastActive: '2025-02-04T18:45:00',
        status: 'active'
      },
      {
        id: 4,
        name: 'Іван Петренко',
        email: 'ivan@example.com',
        role: 'user',
        phone: '+380504567890',
        balance: 1250.00,
        totalCharges: 28,
        lastActive: '2025-02-05T10:20:00',
        status: 'active'
      },
      {
        id: 5,
        name: 'Марія Коваленко',
        email: 'maria@example.com',
        role: 'user',
        phone: '+380505678901',
        balance: 0.00,
        totalCharges: 5,
        lastActive: '2025-01-20T09:00:00',
        status: 'inactive'
      }
    ]);
    setLoading(false);
  }
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  function handleAddUser() {
    // Simulate adding user
    const newUser = {
      id: users.length + 1,
      ...formData,
      balance: 0,
      totalCharges: 0,
      lastActive: new Date().toISOString(),
      status: 'active'
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', role: 'user', password: '' });
    setSuccessMessage('Користувача успішно додано!');
    setShowSuccessModal(true);
  }
  
  function handleEditUser() {
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    setShowEditModal(false);
    setSuccessMessage('Дані користувача оновлено!');
    setShowSuccessModal(true);
  }
  
  function handleBlockUser() {
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
    setSuccessMessage(selectedUser.status === 'active' ? 'Користувача заблоковано!' : 'Користувача розблоковано!');
    setShowSuccessModal(true);
  }
  
  function handleResetPassword(user) {
    setSuccessMessage(`Новий пароль надіслано на ${user.email}`);
    setShowSuccessModal(true);
  }
  
  function openEditModal(user) {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: ''
    });
    setShowEditModal(true);
  }
  
  function openBlockModal(user) {
    setSelectedUser(user);
    setShowBlockModal(true);
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
        <h1 className="text-3xl font-bold text-gray-800">Користувачі</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Додати користувача
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">{users.length}</div>
          <div className="text-gray-500 text-sm">Всього</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-gray-500 text-sm">Активних</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {users.filter(u => u.role === 'admin' || u.role === 'operator').length}
          </div>
          <div className="text-gray-500 text-sm">Адмінів/Операторів</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">
            ₴{users.reduce((sum, u) => sum + u.balance, 0).toLocaleString()}
          </div>
          <div className="text-gray-500 text-sm">Загальний баланс</div>
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Пошук за ім'ям або email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Користувач</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Баланс</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Зарядок</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{user.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'operator' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₴{user.balance.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.totalCharges}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 
                    user.status === 'blocked' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status === 'active' ? 'Активний' : 
                     user.status === 'blocked' ? 'Заблокований' : 'Неактивний'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleResetPassword(user)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => openBlockModal(user)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {user.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add User Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Додати користувача">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="user">User</option>
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Скасувати
            </button>
            <button
              onClick={handleAddUser}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Додати
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Edit User Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Редагувати користувача">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="user">User</option>
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Скасувати
            </button>
            <button
              onClick={handleEditUser}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Зберегти
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Block Confirmation Modal */}
      <ConfirmModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={handleBlockUser}
        title={selectedUser?.status === 'active' ? 'Заблокувати користувача?' : 'Розблокувати користувача?'}
        message={`Ви впевнені що хочете ${selectedUser?.status === 'active' ? 'заблокувати' : 'розблокувати'} ${selectedUser?.name}?`}
        confirmText={selectedUser?.status === 'active' ? 'Заблокувати' : 'Розблокувати'}
        danger={selectedUser?.status === 'active'}
      />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
      
      {/* Security Note */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <strong>⚠ Примітка безпеки:</strong> Паролі користувачів зберігаються з використанням MD5 хешування. 
        Рекомендується оновити до bcrypt у наступній версії системи.
      </div>
    </div>
  );
}
