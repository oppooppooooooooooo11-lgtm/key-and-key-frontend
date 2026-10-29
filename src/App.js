import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://key-and-key-backen.onrender.com/api/properties';
const ADMIN_PASSWORD = '123'; // 🔒 يمكنك تغيير كلمة السر هذه إلى أي كلمة سر تريدها

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالات لوحة التحكم والإدارة
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // بيانات العقار الجديد
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'شقة',
    wilaya: 'الجزائر العاصمة'
  });

  const fetchProperties = () => {
    setLoading(true);
    axios.get(API_URL)
      .then((response) => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('حدث خطأ أثناء جلب العقارات:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // التحقق من كلمة السر
  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowAdminLogin(false);
      setShowAddForm(true);
      setInputPassword('');
      alert('تم تسجيل الدخول بنجاح! مرحباً بك في لوحة الإدارة 🔑');
    } else {
      alert('كلمة السر خاطئة! لا يمكنك الوصول للوحة التحكم.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // إضافة عقار جديد
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_URL, formData)
      .then((res) => {
        alert('تمت إضافة العقار بنجاح! 🎉');
        setFormData({ title: '', description: '', price: '', category: 'شقة', wilaya: 'الجزائر العاصمة' });
        fetchProperties();
      })
      .catch((err) => {
        console.error('خطأ أثناء إضافة العقار:', err);
        alert('حدث خطأ أثناء الإضافة. تأكد من عمل السيرفر.');
      });
  };

  // تسجيل الخروج من لوحة الإدارة
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      {/* الشريط العلوي */}
      <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <span className="text-3xl">🔑</span>
            <h1 className="text-2xl font-bold tracking-wide">Key & Key</h1>
          </div>
          
          <nav className="space-x-6 space-x-reverse hidden md:flex font-semibold">
            <a href="#properties" className="hover:text-blue-300 transition">العقارات</a>
            <a href="#about" className="hover:text-blue-300 transition">من نحن</a>
          </nav>

          <div>
            {!isAuthenticated ? (
              <button 
                onClick={() => setShowAdminLogin(!showAdminLogin)} 
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg transition shadow text-sm"
              >
                🔒 دخول الإدارة
              </button>
            ) : (
              <button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition shadow text-sm"
              >
                خروج من الإدارة
              </button>
            )}
          </div>
        </div>
      </header>

      {/* نافذة تسجيل الدخول للمدير */}
      {showAdminLogin && !isAuthenticated && (
        <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-2xl shadow-xl border border-amber-300 w-11/12 text-center">
          <span className="text-4xl">🔐</span>
          <h3 className="text-xl font-bold mt-2 mb-4 text-gray-800">دخول مدير المنصة</h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="أدخل كلمة السر الخاصة بك" 
              value={inputPassword} 
              onChange={(e) => setInputPassword(e.target.value)} 
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
              required 
            />
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl transition">
              تأكيد الدخول
            </button>
          </form>
        </div>
      )}

      {/* لوحة إضافة العقارات (تظهر فقط بعد الدخول الصحيح) */}
      {isAuthenticated && (
        <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-2xl shadow-xl border-2 border-blue-600 w-11/12">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-xl font-bold text-blue-900">⚙️ لوحة تحكم الإدارة - إضافة عقار</h3>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
              أنت متصل كـ مدير
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">عنوان العقار</label>
              <input 
                type="text" 
                name="title" 
                required 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="مثال: شقة F4 لوكس في سعيد حمدين" 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">النوع</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                  <option value="شقة">شقة</option>
                  <option value="فيلا">فيلا</option>
                  <option value="أرض">أرض</option>
                  <option value="محل">محل تجاري</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">الولاية</label>
                <input 
                  type="text" 
                  name="wilaya" 
                  required 
                  value={formData.wilaya} 
                  onChange={handleChange} 
                  placeholder="مثال: الجزائر العاصمة" 
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">السعر (د.ج)</label>
                <input 
                  type="number" 
                  name="price" 
                  required 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="مثال: 18000000" 
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">الوصف والتفاصيل</label>
              <textarea 
                name="description" 
                rows="3" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="معلومات الاتصال، الموقع بالتفصيل، الخصائص..." 
                className="w-full px-3 py-2 border rounded-lg"
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition shadow">
              نشر العقار في الموقع 🚀
            </button>
          </form>
        </div>
      )}

      {/* الواجهة الرئيسية للموقع */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-14 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            عقارك المثالي في الجزائر بين يديك 🇩🇿
          </h2>
          <p className="text-lg md:text-xl text-blue-100">
            منصتك الموثوقة لاكتشاف أفضل العقارات المعروضة حصرياً بمصداقية وأمان
          </p>
        </div>
      </section>

      {/* قائمة العقارات المتاحة للزوار */}
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
            <p className="text-gray-500 mb-4">سقم المدير بإضافة عقارات حقيقية قريباً!</p>
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
                    {property.price ? Number(property.price).toLocaleString() : 0} د.ج
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* قسم "من نحن" الاحترافي */}
      <section className="bg-white py-12 px-4 border-t border-gray-200" id="about">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-blue-900 mb-4">من نحن - Key & Key</h3>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            نحن منصة عقارية جزائرية متخصصة نهدف إلى تقديم أفضل الفرص العقارية (شقق، فيلات، أراضي، ومحلات تجارية) عبر مختلف ولايات الوطن. نضمن للزائر معلومات دقيقة ومعروضة بكل مصداقية لتسهيل الوصول للعقار المناسب.
          </p>
          <div className="flex justify-center gap-6 text-gray-500 text-sm font-semibold flex-wrap">
            <span>🇩🇿 موجه خصيصاً للسوق الجزائري</span>
            <span>🔒 عقارات موثوقة ومفحوصة</span>
            <span>⚡ تصفح سريع وسهل</span>
          </div>
        </div>
      </section>

      {/* التذييل */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center border-t border-gray-800 text-sm">
        <p>© 2026 Key & Key - جميع الحقوق محفوظة لمنصة العقارات في الجزائر.</p>
      </footer>
    </div>
  );
}

export default App;
