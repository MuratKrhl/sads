import React from 'react';

const SummaryStatCard = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-4">

                    {/* 1. TOPLAM SUNUCU */}
                    {/* Mobilde sağında ve altında çizgi. Masaüstünde sadece sağında. */}
                    <div className="p-4 md:p-6 border-gray-200 border-b md:border-b-0 border-r flex flex-col justify-between min-h-[110px]">
                        <div>
                            <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TOPLAM SUNUCU</h6>
                            <p className="text-3xl font-extrabold text-blue-600 leading-tight mb-2">148</p>
                        </div>
                        <div className="flex items-center">
                            <span className="text-[11px] text-gray-500 font-medium">
                                <span className="text-blue-600 font-bold mr-1">97</span>Linux - <span className="text-blue-600 font-bold mx-1">51</span>AIX
                            </span>
                        </div>
                    </div>

                    {/* 2. TOPLAM UYGULAMA */}
                    {/* Mobilde sadece altında çizgi. Masaüstünde sağında. */}
                    <div className="p-4 md:p-6 border-gray-200 border-b md:border-b-0 md:border-r flex flex-col justify-between min-h-[110px]">
                        <div>
                            <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TOPLAM UYGULAMA</h6>
                            <p className="text-3xl font-extrabold text-sky-500 leading-tight mb-2">137</p>
                        </div>
                        <div className="flex items-center">
                            <span className="text-[11px] text-gray-500 font-medium">
                                <span className="text-sky-500 font-bold mr-1">9</span>farklı platform
                            </span>
                        </div>
                    </div>

                    {/* 3. KDB SERTİFİKA */}
                    {/* Mobilde sağında çizgi. Masaüstünde sağında çizgi. */}
                    <div className="p-4 md:p-6 border-gray-200 border-r flex flex-col justify-between min-h-[110px]">
                        <div>
                            <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">KDB SERTİFİKA</h6>
                            <p className="text-3xl font-extrabold text-orange-500 leading-tight mb-2">79</p>
                        </div>
                        <div className="flex items-center">
                            <span className="text-[11px] text-gray-500 font-medium">
                                <span className="text-orange-500 font-bold mr-1">5</span>sertifika türü
                            </span>
                        </div>
                    </div>

                    {/* 4. JAVA SERTİFİKA */}
                    {/* Kenarlıksız */}
                    <div className="p-4 md:p-6 flex flex-col justify-between min-h-[110px]">
                        <div>
                            <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">JAVA SERTİFİKA</h6>
                            <p className="text-3xl font-extrabold text-emerald-500 leading-tight mb-2">134</p>
                        </div>
                        <div className="flex items-center">
                            <span className="text-[11px] text-gray-500 font-medium">
                                <span className="text-emerald-500 font-bold mr-1">3</span>kategori
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SummaryStatCard;
