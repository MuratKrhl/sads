import React, { useState } from 'react';

// Reusable components (similar to UygulamaKurulumTab)
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-6">{children}</h3>
);

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        {children}
    </div>
);

const commonInputStyle = "block w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm text-gray-900";

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={commonInputStyle} />
);

const SuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-6">
            <div className="flex items-center justify-center flex-col">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Tanımlama Başarılı
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Evam Listener tanımlama işlemi başarıyla tamamlandı.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-6">
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none"
                    onClick={onClose}
                >
                    Kapat
                </button>
            </div>
        </div>
    </div>
);

const EvamListenerTab: React.FC = () => {
    const [formData, setFormData] = useState({
        copyApplicationName: '',
        newApplicationName: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate creation process
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccessModal(true);
            setFormData({ copyApplicationName: '', newApplicationName: '' }); // Reset form
        }, 2000); // Simulate a 2-second process
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <>
            {showSuccessModal && <SuccessModal onClose={handleCloseModal} />}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm space-y-10 max-w-2xl mx-auto">
                <div>
                    <SectionTitle>Evam Listener Tanımlama</SectionTitle>
                    <div className="grid grid-cols-1 gap-y-6">
                        <FormField label="Kopyalanacak Application Name">
                            <FormInput 
                                name="copyApplicationName" 
                                value={formData.copyApplicationName} 
                                onChange={handleChange} 
                                placeholder="Örn: MevcutListener"
                                required 
                            />
                        </FormField>
                        <FormField label="Yeni Application Name">
                            <FormInput 
                                name="newApplicationName" 
                                value={formData.newApplicationName} 
                                onChange={handleChange} 
                                placeholder="Örn: YeniListener"
                                required 
                            />
                        </FormField>
                    </div>
                </div>

                <div className="flex justify-end pt-5 border-t mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Tanımlanıyor...' : 'Oluştur'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default EvamListenerTab;
