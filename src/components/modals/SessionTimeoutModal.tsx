import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  countdown: number;
  onExtend: () => void;
  onLogout: () => void;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({ isOpen, countdown, onExtend, onLogout }) => {
  if (!isOpen) {
    return null;
  }

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Session Timeout Warning
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  You've been inactive for a while. For your security, you will be logged out automatically.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Time remaining: <span className="font-bold">{formattedTime}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onExtend}
          >
            Stay Logged In
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
