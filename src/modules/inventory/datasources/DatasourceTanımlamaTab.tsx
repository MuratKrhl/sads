import React, { useState } from 'react';

// Reusable components (similar to other self-service tabs)
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-6">{children}</h3>
);

const FormField: React.FC<{ label: string; isRequired?: boolean; children: React.ReactNode }> = ({ label, isRequired, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const commonInputStyle = "block w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm text-gray-900";

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={commonInputStyle} />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className={commonInputStyle} />
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
                            Datasource tanımlama işlemi başarıyla tamamlandı.
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

const InfoBox: React.FC = () => (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <div className="flex">
            <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <p className="text-sm text-blue-700">
                    Database şifresi için GT-Oracle Team'e, GT-Agile Wild Wild WAST ekibimizi CC'ye alarak mail atınız. Şifre gelmesi ardından datasource tanımınız aktif edilecektir.
                    <br />
                    <strong className="font-semibold">Önemli Not:</strong> Bu servis sadece JBoss üzerinde datasource tanımlaması yapmaktadır. WAS için HYS'den "Application Server - Unix Uzerinde -Parametre/Konfigurasyon Değişikliği" ile kayıt açmalısınız.
                </p>
            </div>
        </div>
    </div>
);


const DatasourceTanımlamaTab: React.FC = () => {
    const [dbType, setDbType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccessModal(true);
        }, 2000);
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };

    const renderOptionalFields = () => {
        switch (dbType) {
            case 'oracle':
                return (
                    <>
                        <FormField label="Current Schema" isRequired={false}>
                            <FormInput name="currentSchema" />
                        </FormField>
                        <FormField label="Set Client Info" isRequired={false}>
                            <FormInput name="set_client_info" />
                        </FormField>
                        <FormField label="Set Module" isRequired={false}>
                            <FormInput name="set_module" />
                        </FormField>
                    </>
                );
            case 'ibmdb2':
                return (
                    <>
                        <FormField label="Current Schema" isRequired={false}>
                            <FormInput name="currentSchema" />
                        </FormField>
                         <FormField label="Client Applcompat" isRequired={false}>
                            <FormSelect name="clientApplcompat">
                                <option value="V12R1">V12R1</option>
                                <option value="V11R1">V11R1</option>
                            </FormSelect>
                        </FormField>
                         <FormField label="Enable Connection Concentrator" isRequired={false}>
                            <FormSelect name="enableConnectionConcentrator">
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </FormSelect>
                        </FormField>
                        <FormField label="Statement Concentrator" isRequired={false}>
                            <FormSelect name="statementConcentrator">
                                <option value="2">2 (With Literals)</option>
                                <option value="1">1 (Without Literals)</option>
                            </FormSelect>
                        </FormField>
                        <FormField label="Read Only" isRequired={false}>
                             <FormSelect name="readOnly">
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </FormSelect>
                        </FormField>
                    </>
                );
            case 'microsoftsql':
                return (
                    <FormField label="Current Schema" isRequired={false}>
                        <FormInput name="currentSchema" />
                    </FormField>
                );
            default:
                return null;
        }
    };
    
    return (
        <>
            {showSuccessModal && <SuccessModal onClose={handleCloseModal} />}
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
                <InfoBox />
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <SectionTitle>Datasource Tanımlama</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <FormField label="Sunucu Adı" isRequired>
                                <FormInput name="sunucuAdi" required />
                            </FormField>
                            <FormField label="Datasource Adı" isRequired>
                                <FormInput name="datasourceAdi" placeholder="java:/jdbc/ olmadan giriniz" required />
                            </FormField>
                             <FormField label="Uygulama Adı" isRequired>
                                <FormInput name="uygulamaAdi" required />
                            </FormField>
                            <FormField label="Veritabanı Tipi" isRequired>
                                <FormSelect name="dbType" value={dbType} onChange={(e) => setDbType(e.target.value)} required>
                                    <option value="">--Seçiniz--</option>
                                    <option value="oracle">Oracle</option>
                                    <option value="ibmdb2">IBM DB2</option>
                                    <option value="microsoftsql">MsSQL</option>
                                </FormSelect>
                            </FormField>
                            <FormField label="Port" isRequired>
                                <FormInput name="port" type="number" required />
                            </FormField>
                            <FormField label="Servis Adı" isRequired>
                                <FormInput name="servisAdi" required />
                            </FormField>
                             <FormField label="Database Sunucu Adı" isRequired>
                                <FormInput name="dbSunucuAdi" required />
                            </FormField>
                             <FormField label="Kullanıcı Adı" isRequired>
                                <FormInput name="kullaniciAdi" required />
                            </FormField>
                        </div>
                    </div>

                    {dbType && (
                        <div>
                            <SectionTitle>Opsiyonel Parametreler ({dbType.toUpperCase()})</SectionTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {renderOptionalFields()}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-5 border-t mt-8 space-x-3">
                        <button type="button" className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
                        >
                            {isSubmitting ? 'Oluşturuluyor...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default DatasourceTanımlamaTab;
