import React, { useState, useEffect } from 'react';

// Mock data based on scripts and common practice
const MOCK_DATA = {
    environments: ['DVL', 'TST', 'QA', 'EDU'],
    companies: ['G Teknoloji', 'BMW'],
    domains: ['fw.D.com.tr', 'fw.gr.com.tr', 'fw.gab.com.tr', 'fw.gem.com.tr'],
    serversByEnv: {
        DVL: [
            { name: 'gjdvl01', ip: '10.1.1.1' },
            { name: 'gjdvl02', ip: '10.1.1.2' },
        ],
        TST: [
            { name: 'gjtst01', ip: '10.2.1.1' },
            { name: 'gjtst02', ip: '10.2.1.2' },
        ],
        QA: [
            { name: 'gjqa01', ip: '10.3.1.1' },
        ],
        EDU: [
            { name: 'gjedu01', ip: '10.4.1.1' },
        ],
    }
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-6">{children}</h3>
);

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        {children}
    </div>
);

const commonInputStyle = "block w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm text-gray-900 disabled:bg-gray-200";

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
                        Kurulum Başarılı
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Uygulama kurulumu başarıyla tamamlandı.
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


const UygulamaKurulumTab: React.FC = () => {
    const [formData, setFormData] = useState({
        ortam: '',
        firma: '',
        uygulamaAdi: '',
        sunucu: '',
        domain: '',
        ip: '',
        url: '',
        ssl: 'Hayır',
        warDosyaIsmi: '',
        scmKodu: '',
        degisecekDosyalar: '',
    });
    
    const [availableServers, setAvailableServers] = useState<{name: string, ip: string}[]>([]);
    const [isInstalling, setIsInstalling] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (formData.ortam) {
            setAvailableServers(MOCK_DATA.serversByEnv[formData.ortam as keyof typeof MOCK_DATA.serversByEnv] || []);
            setFormData(prev => ({ ...prev, sunucu: '', ip: '' }));
        } else {
            setAvailableServers([]);
        }
    }, [formData.ortam]);

    useEffect(() => {
        if (formData.sunucu) {
            const selectedServer = availableServers.find(s => s.name === formData.sunucu);
            setFormData(prev => ({ ...prev, ip: selectedServer ? selectedServer.ip : '' }));
        } else {
            setFormData(prev => ({ ...prev, ip: '' }));
        }
    }, [formData.sunucu, availableServers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, ssl: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsInstalling(true);

        // Simulate installation process
        setTimeout(() => {
            setIsInstalling(false);
            setShowSuccessModal(true);
        }, 3000); // Simulate a 3-second installation
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <>
            {showSuccessModal && <SuccessModal onClose={handleCloseModal} />}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm space-y-10 max-w-4xl mx-auto">
                <div>
                    <SectionTitle>Ortam Bilgileri</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField label="Ortam">
                            <FormSelect name="ortam" value={formData.ortam} onChange={handleChange} required>
                                <option value="">--Seçiniz--</option>
                                {MOCK_DATA.environments.map(env => <option key={env} value={env}>{env}</option>)}
                            </FormSelect>
                        </FormField>
                        <FormField label="Firma">
                            <FormSelect name="firma" value={formData.firma} onChange={handleChange} required>
                                <option value="">--Seçiniz--</option>
                                {MOCK_DATA.companies.map(c => <option key={c} value={c}>{c}</option>)}
                            </FormSelect>
                        </FormField>
                    </div>
                </div>

                <div>
                    <SectionTitle>Uygulama Bilgileri</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField label="Uygulama Adı">
                            <FormInput name="uygulamaAdi" value={formData.uygulamaAdi} onChange={handleChange} required />
                        </FormField>
                        <FormField label="Kurulum Yapılacak Sunucu">
                            <FormSelect name="sunucu" value={formData.sunucu} onChange={handleChange} required disabled={!formData.ortam}>
                                <option value="">--Önce bir ortam seçiniz--</option>
                                {availableServers.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                            </FormSelect>
                        </FormField>
                        <FormField label="Domain">
                            <FormSelect name="domain" value={formData.domain} onChange={handleChange} required>
                                <option value="">--Seçiniz--</option>
                                {MOCK_DATA.domains.map(d => <option key={d} value={d}>{d}</option>)}
                            </FormSelect>
                        </FormField>
                        <FormField label="IP">
                            <FormInput name="ip" value={formData.ip} readOnly disabled placeholder="--Önce bir sunucu seçiniz--" />
                        </FormField>
                        <FormField label="URL">
                            <FormInput name="url" value={formData.url} onChange={handleChange} required />
                        </FormField>
                        <FormField label="Uygulama war dosyasının ismi">
                            <FormInput name="warDosyaIsmi" value={formData.warDosyaIsmi} onChange={handleChange} required />
                        </FormField>
                         <FormField label="SCM Kodu">
                            <FormInput name="scmKodu" value={formData.scmKodu} onChange={handleChange} required />
                        </FormField>
                        <FormField label="SSL">
                            <div className="flex items-center space-x-6 h-full pt-2">
                                <label className="flex items-center">
                                    <input type="radio" name="ssl" value="Evet" checked={formData.ssl === 'Evet'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                    <span className="ml-2 text-sm text-gray-700">Evet</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="ssl" value="Hayır" checked={formData.ssl === 'Hayır'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                    <span className="ml-2 text-sm text-gray-700">Hayır</span>
                                </label>
                            </div>
                        </FormField>
                        <div className="md:col-span-2">
                            <FormField label="İsmi Değişecek Dosyalar">
                                <textarea name="degisecekDosyalar" value={formData.degisecekDosyalar} onChange={handleChange} rows={3} className={commonInputStyle} />
                            </FormField>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-5 border-t mt-8">
                    <button
                        type="submit"
                        disabled={isInstalling}
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {isInstalling ? 'Kuruluyor...' : 'Kurulumu Başlat'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default UygulamaKurulumTab;
