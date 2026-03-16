import React from 'react';
import { IMPORTANT_LINKS_DATA } from '@/utils/constants';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const ImportantLinksPage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Önemli Linkler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {IMPORTANT_LINKS_DATA.map((link) => (
          <a
            key={link.category}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-800">{link.category}</h3>
                {link.description && <p className="text-sm text-gray-500 group-hover:text-blue-700">{link.description}</p>}
            </div>
            <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ImportantLinksPage;
