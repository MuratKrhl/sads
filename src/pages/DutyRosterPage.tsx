import React from 'react';
import { ON_CALL_ROSTER_DATA } from '@/utils/constants';
import {
  PencilSquareIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const DutyRosterPage: React.FC = () => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('tr-TR', options);
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  return (
    <div className="container-fluid">
      {/* Block Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Nöbet Listesi</h2>
          <nav className="flex text-sm text-gray-500 mt-1">
            <span className="hover:text-cyan-600 cursor-pointer transition-colors">App</span>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Nöbet Listesi</span>
          </nav>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-shadow shadow-sm font-medium text-sm">
            Tümünü Gör
          </button>
          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-shadow shadow-sm font-medium text-sm">
            Yeni Ekle
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
          <h3 className="text-lg font-semibold text-gray-800">Personel Listesi</h3>
          <div className="flex items-center text-xs text-gray-400 font-medium">
            <CalendarDaysIcon className="w-4 h-4 mr-1" />
            <span>Son Güncelleme: 06 Mart 2026</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-left">
                <th className="px-6 py-4 w-12">
                  <div className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İsim / Görev</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tarih</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">E-posta</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ON_CALL_ROSTER_DATA.map((person, index) => {
                const isToday = person.date === todayStr;
                return (
                  <tr key={index} className={`hover:bg-gray-50/80 transition-colors ${isToday ? 'bg-cyan-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={person.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&color=fff&size=100`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            alt={person.name}
                          />
                          {isToday && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-gray-800 flex items-center">
                            {person.name}
                            {isToday && (
                              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-700 rounded-full border border-cyan-200">
                                BUGÜN
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">Kıdemli Uzman</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${isToday ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200' : 'bg-gray-100 text-gray-600'}`}>
                        {formatDate(person.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        {person.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <EnvelopeIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        {person.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors border border-transparent hover:border-cyan-100" title="Düzenle">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100" title="Sil">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination/Summary Footer */}
        <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <p>Toplam <span className="font-bold text-gray-700">{ON_CALL_ROSTER_DATA.length}</span> kayıt gösteriliyor</p>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all">
              &laquo;
            </button>
            <button className="w-6 h-6 flex items-center justify-center bg-cyan-600 text-white rounded border border-cyan-600 font-bold shadow-sm shadow-cyan-100">
              1
            </button>
            <button className="w-6 h-6 flex items-center justify-center hover:bg-white rounded border border-transparent hover:border-gray-200 font-medium">
              2
            </button>
            <button className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all">
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DutyRosterPage;
