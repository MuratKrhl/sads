import React from 'react';
import { ON_CALL_ROSTER_DATA } from '@/utils/constants';
import { OnCallPerson } from '@/utils/types';
import { PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const TodayOnCallCard: React.FC = () => {
  const getTodayString = () => {
    // Şimdilik örnek için Osman Polat'ın nöbet tarihini kullanıyoruz
    return '2024-08-16';
    
    // Gerçek tarih için:
    // const today = new Date();
    // const year = today.getFullYear();
    // const month = String(today.getMonth() + 1).padStart(2, '0');
    // const day = String(today.getDate()).padStart(2, '0');
    // return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();
  
  const todayOnCall: OnCallPerson | undefined = ON_CALL_ROSTER_DATA.find(
    person => person.date === todayStr
  );

  if (!todayOnCall) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <ClockIcon className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bugünkü Nöbetçi</h3>
            <p className="text-sm text-gray-500">Nöbetçi bilgisi bulunamadı</p>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">Bu tarih için nöbetçi atanmamış</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ClockIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bugünkü Nöbetçi</h3>
          <p className="text-sm text-gray-500">Acil durumlar için</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={todayOnCall.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(todayOnCall.name)}&background=3B82F6&color=fff&size=80`}
            alt={todayOnCall.name}
            className="h-16 w-16 rounded-full object-cover border-2 border-blue-100"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 truncate">
            {todayOnCall.name}
          </h4>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <PhoneIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{todayOnCall.phone}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{todayOnCall.email}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Son güncelleme</span>
          <span>{new Date().toLocaleDateString('tr-TR')}</span>
        </div>
      </div>
    </div>
  );
};

export default TodayOnCallCard;
