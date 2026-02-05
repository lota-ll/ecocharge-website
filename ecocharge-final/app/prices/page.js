export default function PricesPage() {
  const tariffs = [
    {
      name: 'AC Type 2',
      power: '7-22 кВт',
      price: 7.00,
      description: 'Повільна зарядка, ідеально для паркування на кілька годин',
      features: ['Домашній тип зарядки', 'Підходить для всіх EV', 'Економний варіант']
    },
    {
      name: 'DC CCS2',
      power: '50-150 кВт',
      price: 9.00,
      description: 'Швидка зарядка для подорожей та термінових випадків',
      features: ['Зарядка за 30-60 хв', 'Європейський стандарт', 'Найпопулярніший']
    },
    {
      name: 'DC CHAdeMO',
      power: '50 кВт',
      price: 8.50,
      description: 'Швидка зарядка для автомобілів з роз\'ємом CHAdeMO',
      features: ['Nissan, Mitsubishi', 'Японський стандарт', 'Швидке підключення']
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Тарифи</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Прозорі ціни без прихованих платежів. Оплата тільки за спожиту енергію.
          </p>
        </div>

        {/* Tariff Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tariffs.map((tariff, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 ${
                index === 1 ? 'ring-2 ring-green-500 relative' : ''
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Популярний
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{tariff.name}</h3>
                <p className="text-gray-500 text-sm">{tariff.power}</p>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-green-600">₴{tariff.price.toFixed(2)}</span>
                <span className="text-gray-500">/кВт·год</span>
              </div>
              
              <p className="text-gray-600 text-center mb-6">{tariff.description}</p>
              
              <ul className="space-y-3 mb-6">
                {tariff.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 rounded-xl font-medium transition ${
                index === 1 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}>
                Знайти станцію
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Додаткова інформація</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Способи оплати</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Банківська картка (Visa, Mastercard)</li>
                <li>• RFID картка EcoCharge</li>
                <li>• Мобільний додаток</li>
                <li>• Apple Pay / Google Pay</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Важливо знати</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Мінімальна сума поповнення: ₴50</li>
                <li>• Тарифікація посекундна</li>
                <li>• Без абонентської плати</li>
                <li>• Кешбек 5% для власників RFID</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-green-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Часті питання</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Чому різні ціни на AC та DC?</h3>
              <p className="text-gray-600">DC зарядка потребує дорожчого обладнання та більшої потужності від мережі, тому має вищу ціну.</p>
            </div>
            
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Чи є знижки для корпоративних клієнтів?</h3>
              <p className="text-gray-600">Так, ми пропонуємо індивідуальні тарифи для компаній з автопарком електромобілів. Зв\'яжіться з нами для деталей.</p>
            </div>
            
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Чи є плата за простій?</h3>
              <p className="text-gray-600">Перші 15 хвилин після завершення зарядки безкоштовні. Далі — ₴2/хв для звільнення місця іншим користувачам.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
