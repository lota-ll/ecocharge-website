export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Про EcoCharge
          </h1>
          <p className="text-xl text-gray-600">
            Ваш надійний партнер у світі електромобільності
          </p>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Наша місія</h2>
          <p className="text-gray-600 mb-6">
            EcoCharge — регіональний оператор мережі зарядних станцій для електромобілів. 
            Ми прагнемо зробити електрозарядку доступною, швидкою та зручною для кожного 
            власника електромобіля в Україні.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Наша історія</h2>
          <p className="text-gray-600 mb-6">
            Заснована у 2020 році, компанія EcoCharge швидко стала одним із провідних 
            операторів зарядної інфраструктури в регіоні. Сьогодні наша мережа налічує 
            понад 20 зарядних станцій у Києві та області.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Наші переваги</h2>
          <ul className="space-y-3 text-gray-600 mb-6">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Швидкі зарядні станції потужністю до 150 кВт
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Підтримка всіх типів конекторів: CCS2, CHAdeMO, Type2
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Зручне розташування біля торгових центрів та магістралей
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Цілодобова підтримка та моніторинг станцій
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Прозора тарифікація без прихованих платежів
            </li>
          </ul>
        </div>
        
        {/* Contact info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Контакти</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Адреса офісу</h3>
              <p className="text-gray-600">
                м. Київ, вул. Хрещатик, 1<br />
                Бізнес-центр "EcoTower", офіс 501
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Телефон підтримки</h3>
              <p className="text-gray-600">
                +380 (44) 123-45-67<br />
                Цілодобово, без вихідних
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Email</h3>
              <p className="text-gray-600">
                info@ecocharge.local<br />
                support@ecocharge.local
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Соціальні мережі</h3>
              <p className="text-gray-600">
                Facebook: /ecocharge.ua<br />
                Instagram: @ecocharge_ua
              </p>
            </div>
          </div>
        </div>
        
        {/* Tech info - Information disclosure for CTF */}
        <div className="bg-gray-100 rounded-xl p-6 text-sm text-gray-500">
          <p className="font-mono">
            © 2024 EcoCharge. Powered by Next.js 14 & React 18.
          </p>
          <p className="font-mono mt-1">
            System Version: 1.0.0 | API Gateway: api.ecocharge.local
          </p>
        </div>
      </div>
    </div>
  );
}
