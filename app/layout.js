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
      </head>
      <body className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-lg border-b border-green-200">
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
                <a href="/stations" className="text-gray-600 hover:text-green-600 transition">
                  Станції
                </a>
                <a href="/prices" className="text-gray-600 hover:text-green-600 transition">
                  Тарифи
                </a>
                <a href="/about" className="text-gray-600 hover:text-green-600 transition">
                  Про нас
                </a>
                <a href="/auth/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  Увійти
                </a>
              </div>
            </div>
          </div>
        </nav>
        
        <main>{children}</main>
        
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2024 EcoCharge. Регіональний оператор мережі зарядних станцій.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Powered by Next.js 15 & React 19.1.0
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
