import React, { useState } from 'react';

const AskGTPageSimple: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('jboss');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Makale ara..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('jboss')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === 'jboss'
                  ? 'text-white bg-orange-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">☕</span>
              JBoss
            </button>
            <button
              onClick={() => setSelectedCategory('websphere')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === 'websphere'
                  ? 'text-white bg-blue-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">🌐</span>
              WebSphere
            </button>
            <button
              onClick={() => setSelectedCategory('nginx')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === 'nginx'
                  ? 'text-white bg-green-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">⚡</span>
              Nginx
            </button>
            <button
              onClick={() => setSelectedCategory('hazelcast')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === 'hazelcast'
                  ? 'text-white bg-purple-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">💾</span>
              Hazelcast
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            {selectedCategory} kategorisinde makaleler
          </p>
        </div>

        {/* Articles List */}
        <div className="max-w-4xl mx-auto space-y-8">
          {selectedCategory === 'jboss' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Technology
                  </span>
                  <span className="px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                    JBoss
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  JBoss EAP 7.4 Performans Optimizasyonu
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  JBoss EAP 7.4 üzerinde uygulama performansını artırma teknikleri ve en iyi uygulamalar.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">AY</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">by Ahmet Yılmaz</p>
                      <p className="text-xs text-gray-500">15 Oca 2024 - 8 min read</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-colors">
                    READ MORE
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'websphere' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Technology
                  </span>
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                    WebSphere
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  WebSphere Liberty Profile Güvenlik Yapılandırması
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  WebSphere Liberty Profile üzerinde güvenlik ayarları ve SSL konfigürasyonu.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">FD</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">by Fatma Demir</p>
                      <p className="text-xs text-gray-500">12 Oca 2024 - 12 min read</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-colors">
                    READ MORE
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'nginx' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Technology
                  </span>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    Nginx
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  Nginx Load Balancer Konfigürasyonu
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nginx ile yük dengeleme yapılandırması ve failover stratejileri.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">MK</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">by Mehmet Kaya</p>
                      <p className="text-xs text-gray-500">10 Oca 2024 - 15 min read</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-colors">
                    READ MORE
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'hazelcast' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Technology
                  </span>
                  <span className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                    Hazelcast
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  Hazelcast Distributed Cache Yapılandırması
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Hazelcast ile dağıtık cache sistemi kurulumu ve optimizasyonu.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">AÖ</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">by Ayşe Özkan</p>
                      <p className="text-xs text-gray-500">8 Oca 2024 - 10 min read</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-colors">
                    READ MORE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AskGTPageSimple;
