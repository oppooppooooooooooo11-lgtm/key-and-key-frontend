import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://key-and-key-backen.onrender.com/api/properties';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('حدث خطأ أثناء جلب العقارات:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <span className="text-3xl">🔑</span>
            <h1 className="text-2xl font-bold tracking-wide">Key & Key</h1>
          </div>
          <nav className="space-x-6 space-x-reverse hidden md:flex font-semibold">
            <a href="#home" className="hover:text-blue-300 transition">الرئيسية</a>
            <a href="#properties" className="hover:text-blue-300 transition">العقارات</a>
            <a href="#about" className="hover:text-blue-300 transition">من نحن</a>
          </nav>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg transition shadow">
            + أضف عقارك
          </button>
        </div>
      </header>

      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            عقارك المثالي في الجزائر بين يديك 🇩🇿
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            شقق، فيلات، وأراضٍ للبيع وللإيجار في جميع الولايات
          </p>
          <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3 text-gray-800">
            <input
              type="text"
              placeholder="البحث بالولاية (مثال: الجزائر العاصمة، وهران...)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white">
              <option value="">جميع الأنواع</option>
              <option value="شقة">شقة</option>
              <option value="فيلا">فيلا</option>
              <option value="أرض">أرض</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition shadow">
              بحث
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full" id="properties">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-r-4 border-amber-500 pr-3">
          أحدث العقارات المتاحة
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-semibold">جاري تحميل العقارات...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md mx-auto my-6 border border-gray-200">
            <span className="text-5xl">🏢</span>
            <h4 className="text-xl font-bold mt-3 mb-2 text-gray-700">لا توجد عقارات حالياً</h4>
            <p className="text-gray-500 mb-4">قم بإضافة أول عقار تجريبي ليظهر مباشرة هنا!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100 flex flex-col justify-between">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      {property.category}
                    </span>
                    <span className="text-xs text-gray-400">📍 {property.wilaya}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-lg font-extrabold text-amber-600">
                    {property.price ? property.price.toLocaleString() : 0} د.ج
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-bold">
                    التفاصيل ←
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center border-t border-gray-800 text-sm">
        <p>© 2026 Key & Key - جميع الحقوق محفوظة لـ منصة العقارات الجزائرية.</p>
      </footer>
    </div>
  );
}

export default App;
