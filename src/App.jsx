import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, MapPin, User, LogOut } from 'lucide-react';

const journals = [
  { id: 1, name: 'A Self-Care Spiral Bound Blank Journal for Women', price: 20.99, category: 'Women', image: '📓' },
  { id: 2, name: 'Women Empowerment Journal Daily Reminder', price: 25.99, category: 'Women', image: '📚' },
  { id: 3, name: 'Empowerment Blank Journal for Women\'s Self-Reflection', price: 29.99, category: 'Women', image: '✨' },
  { id: 4, name: 'Goddess Empowerment Radiant Faith Journal', price: 25.99, category: 'Women', image: '👑' },
  { id: 5, name: 'Women Empowerment Boss Up Journal', price: 29.99, category: 'Women', image: '💪' },
  { id: 6, name: 'Daily Reminder For Personal Growth', price: 27.99, category: 'Women', image: '🌟' },
  { id: 7, name: 'Legacy Leaders: Empowering Journals for Black Men', price: 25.99, category: 'Men', image: '👨' },
  { id: 8, name: 'Believing In Me - Women Empowerment Journal', price: 27.99, category: 'Women', image: '💎' },
  { id: 9, name: 'Visionary Queens: Empowering Women\'s Spiral Journal', price: 27.99, category: 'Women', image: '👸' },
  { id: 10, name: 'Empowering Black Kings- The Kingdom\'s Visionary Spiral', price: 25.99, category: 'Men', image: '🤴' }
];

export default function Store() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [demographics, setDemographics] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    ethnicity: '',
    income: '',
    purchaseHistory: 0
  });
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation({
              city: data.address?.city || data.address?.town,
              country: data.address?.country,
              lat: latitude,
              lon: longitude
            });
          } catch (err) {
            console.log('Location fetch error:', err);
          }
        },
        () => console.log('Geolocation denied')
      );
    }
  }, []);

  const getRecommendations = () => {
    const recs = [];
    
    if (demographics.gender === 'Female' || demographics.gender === 'Non-binary') {
      recs.push(...journals.filter(j => j.category === 'Women'));
    } else if (demographics.gender === 'Male') {
      recs.push(...journals.filter(j => j.category === 'Men'));
    }

    if (demographics.income === 'Low') {
      recs.sort((a, b) => a.price - b.price);
    } else if (demographics.income === 'High') {
      recs.sort((a, b) => b.price - a.price);
    }

    setRecommendations(recs.slice(0, 3));
  };

  const handleUserSubmit = () => {
    if (demographics.name && demographics.email && demographics.gender) {
      setUser(demographics);
      getRecommendations();
      setShowUserModal(false);
    }
  };

  const addToCart = (journal) => {
    const existing = cart.find(item => item.id === journal.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === journal.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...journal, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, qty } : item));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black bg-opacity-40 backdrop-blur-sm border-b border-purple-500 border-opacity-20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            👑 The Goddess Empowerment
          </h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-purple-300">
                <User size={18} />
                <span className="text-sm">{user.name}</span>
                {location && (
                  <div className="flex items-center gap-1 ml-2 text-xs bg-purple-500 bg-opacity-20 px-2 py-1 rounded">
                    <MapPin size={14} />
                    {location.city || 'Location'}
                  </div>
                )}
                <button
                  onClick={() => setUser(null)}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
            <button
              onClick={() => {
                if (!user) setShowUserModal(true);
                else setShowCart(!showCart);
              }}
              className="relative bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-purple-500 border-opacity-30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Your Profile</h2>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={demographics.name}
                onChange={(e) => setDemographics({ ...demographics, name: e.target.value })}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-purple-500 border-opacity-30 focus:border-purple-500 outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={demographics.email}
                onChange={(e) => setDemographics({ ...demographics, email: e.target.value })}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-purple-500 border-opacity-30 focus:border-purple-500 outline-none"
              />
              <select
                value={demographics.gender}
                onChange={(e) => setDemographics({ ...demographics, gender: e.target.value })}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-purple-500 border-opacity-30 focus:border-purple-500 outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
              <input
                type="number"
                placeholder="Age"
                value={demographics.age}
                onChange={(e) => setDemographics({ ...demographics, age: e.target.value })}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-purple-500 border-opacity-30 focus:border-purple-500 outline-none"
              />
              <select
                value={demographics.income}
                onChange={(e) => setDemographics({ ...demographics, income: e.target.value })}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-purple-500 border-opacity-30 focus:border-purple-500 outline-none"
              >
                <option value="">Select Income Level</option>
                <option value="Low">Low ($0-30k)</option>
                <option value="Medium">Medium ($30k-75k)</option>
                <option value="High">High ($75k+)</option>
              </select>
              <button
                onClick={handleUserSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded font-semibold hover:from-purple-700 hover:to-pink-700 transition"
              >
                Get Personalized Recommendations
              </button>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="bg-slate-800 w-full max-w-md flex flex-col border-l border-purple-500 border-opacity-30">
            <div className="flex justify-between items-center p-6 border-b border-purple-500 border-opacity-20">
              <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-400">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-slate-700 bg-opacity-50 p-4 rounded border border-purple-500 border-opacity-20">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white text-sm">{item.name.substring(0, 30)}...</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400">${item.price.toFixed(2)}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="bg-slate-600 text-white px-2 py-1 rounded text-sm"
                        >
                          -
                        </button>
                        <span className="text-white px-2">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="bg-slate-600 text-white px-2 py-1 rounded text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-purple-500 border-opacity-20 p-6 space-y-3">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded font-semibold hover:from-purple-700 hover:to-pink-700 transition">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-12">
        {recommendations.length > 0 && (
          <div className="mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-opacity-20 border border-purple-500 border-opacity-30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">✨ Personalized for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map(journal => (
                <div key={journal.id} className="bg-slate-800 rounded-lg p-4 border border-purple-500 border-opacity-20 hover:border-purple-500 transition group cursor-pointer">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition">{journal.image}</div>
                  <h3 className="font-semibold text-white mb-2 text-sm line-clamp-2">{journal.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      ${journal.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(journal)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-3xl font-bold text-white mb-8">All Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {journals.map(journal => (
              <div
                key={journal.id}
                className="bg-slate-800 bg-opacity-50 rounded-lg p-4 border border-purple-500 border-opacity-20 hover:border-purple-500 transition group cursor-pointer"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition">{journal.image}</div>
                <h3 className="font-semibold text-white mb-2 text-sm line-clamp-3 h-12">{journal.name}</h3>
                <p className="text-xs text-purple-300 mb-3">{journal.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    ${journal.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(journal)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-black bg-opacity-40 border-t border-purple-500 border-opacity-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>© 2025 The Goddess Empowerment. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4 text-purple-400">
            <a href="#" className="hover:text-purple-300">Privacy Policy</a>
            <a href="#" className="hover:text-purple-300">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
