import React from 'react';
import { ON_CALL_ROSTER_DATA } from '@/utils/constants';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const DutyOfTodayCard: React.FC = () => {
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayStr = getTodayString();
    const todayDuty = ON_CALL_ROSTER_DATA.find(p => p.date === todayStr) || ON_CALL_ROSTER_DATA[0];

    // Yorum satiri: Eğer title eklenmemişse varsayılan bir değer kullanıyoruz. Aynı zamanda mock datadan avatarUrl varsa ihnored edilir, yoksa name'den türetilir
    const avatar = todayDuty.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(todayDuty.name)}&background=11cdef&color=fff&size=180&bold=true`;

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "22px 24px",
                boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                height: "100%",
                minHeight: "420px"
            }}>
                {/* Silver/Gray inner card/background area */}
                <div style={{
                    backgroundColor: "#f4f5f7",
                    borderRadius: "1.5rem",
                    padding: "30px 20px 20px 20px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <img
                        src={avatar}
                        alt="Profile"
                        style={{
                            width: "140px",
                            height: "140px",
                            objectFit: "cover",
                            borderRadius: "100%",
                            marginBottom: "15px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                            border: "4px solid #fff"
                        }}
                    />

                    {/* Social/Action Icon Row */}
                    <div style={{ display: "flex", gap: "25px", marginBottom: "20px" }}>
                        <a href={`mailto:${todayDuty.email}`} title="Email Gönder" style={{ color: "#3498db" }}>
                            <EnvelopeIcon style={{ width: 22, height: 22 }} />
                        </a>
                        <div title="Lokasyon" style={{ color: "#3498db" }}>
                            <MapPinIcon style={{ width: 22, height: 22 }} />
                        </div>
                        <div title="Departman" style={{ color: "#3498db" }}>
                            <BriefcaseIcon style={{ width: 22, height: 22 }} />
                        </div>
                    </div>

                    <h2 style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "#3498db",
                        margin: "0 0 8px 0",
                        fontFamily: "'Open Sans', sans-serif"
                    }}>
                        {todayDuty.name}
                    </h2>

                    <p style={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#333",
                        margin: 0
                    }}>
                        {todayDuty.title || "Middleware Support"}
                    </p>

                    <p style={{
                        fontSize: "0.85rem",
                        color: "#666",
                        marginTop: "4px"
                    }}>
                        BMW Portal OC
                    </p>
                </div>

                <a href={`mailto:${todayDuty.email}`} style={{
                    marginTop: "20px",
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#3498db",
                    color: "#fff",
                    borderRadius: "1rem",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 10px rgba(52, 152, 219, 0.3)",
                    transition: "all 0.2s ease"
                }}>
                    Mail Gönder
                </a>
            </div>
        </div>
    );
};

export default DutyOfTodayCard;
