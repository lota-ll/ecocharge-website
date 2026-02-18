import './globals.css';

export const metadata = {
  title: 'EcoCharge - Regional EV Charging Network',
  description: 'Find and use electric vehicle charging stations across the region',
  keywords: 'EV, charging, electric vehicle, charging station, EcoCharge',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 font-sans antialiased">
        <nav className="bg-white shadow-lg border-b border-green-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center space-x-2">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                  </svg>
                  <span className="text-xl font-bold text-green-700">EcoCharge</span>
                </a>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="/stations" className="text-gray-600 hover:text-green-600 transition font-medium">
                  Станції
                </a>
                <a href="/prices" className="text-gray-600 hover:text-green-600 transition font-medium">
                  Тарифи
                </a>
                <a href="/about" className="text-gray-600 hover:text-green-600 transition font-medium">
                  Про нас
                </a>
                <a href="/auth/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium">
                  Увійти
                </a>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button className="text-gray-600 hover:text-green-600 p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="flex-1">{children}</main>
        
        <footer className="bg-gray-800 text-white py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                  </svg>
                  <span className="text-lg font-bold">EcoCharge</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Регіональний оператор мережі зарядних станцій для електромобілів
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Навігація</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/stations" className="hover:text-white transition">Станції</a></li>
                  <li><a href="/prices" className="hover:text-white transition">Тарифи</a></li>
                  <li><a href="/about" className="hover:text-white transition">Про нас</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Кабінет</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/auth/login" className="hover:text-white transition">Увійти</a></li>
                  <li><a href="/auth/register" className="hover:text-white transition">Реєстрація</a></li>
                  <li><a href="/dashboard" className="hover:text-white transition">Мій кабінет</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Контакти</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>+380 (44) 123-45-67</li>
                  <li>info@ecocharge.local</li>
                  <li>м. Київ, вул. Хрещатик, 1</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2024 EcoCharge. Всі права захищені.
              </p>
              {/* Removed version info for security */}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
