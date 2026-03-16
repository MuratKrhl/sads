import React from 'react';

const LogoMarquee: React.FC = () => {
    const logos = [
        { name: 'Jboss', url: 'https://images.seeklogo.com/logo-png/25/1/jboss-logo-png_seeklogo-250496.png' },
        { name: 'WebSphere', url: 'https://www.datocms-assets.com/21957/1721662869-20240722-was-img.png?auto=format' },
        { name: 'Nginx', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSNxQRvzT6IVswRU40JB87Er3SKjDvn50iVw&s' },
        { name: 'Wyden', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHbOp3W3Opsh7MihhJZqEVlPH4c8zB-kCs_A&s' },
        { name: 'Openshift', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPkSxibG4zCe3irzkvKLWNiEG2-siTdbX48g&s' },
        { name: 'LinuxOne', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpXlhofqfOo5dIgSPybEFeUJkVzHvFR9JFVA&s' },
        { name: 'PowerCurve', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Experian_logo.svg/3840px-Experian_logo.svg.png' },
        { name: 'Provenir', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQnoIDYrQb_yb9dUBneZPmIURZefCU1jpCLA&s' },
        { name: 'Evam', url: 'https://www.patika.dev/_next/image?url=%2Fstatic%2Fimages%2Fpatika%2F168c6203268c.png&w=3840&q=75&dpl=dpl_6tFNxF9Ew1ZrDp3GZEddCK3WKvNs' },
        { name: 'Aware', url: 'https://s.yimg.com/ny/api/res/1.2/7_ZJFLF4.tLtoZ8Ncm80jw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTQyMDtoPTMxNQ--/https://media.zenfs.com/en/globenewswire.com/e6d3e48b8c74a7c5cd85e9afc673c367' },
    ];

    // Standard logo item with fixed width for "equal size" look
    const LogoItem = ({ logo }: { logo: typeof logos[0] }) => (
        <div className="flex-shrink-0 w-36 flex items-center justify-center">
            <img
                src={logo.url}
                alt={logo.name}
                className="h-7 w-auto max-w-[120px] object-contain block opacity-90 transition-opacity"
                loading="lazy"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://avatar.oxro.io/avatar.svg?name=${logo.name.charAt(0)}&background=3b82f6&color=fff&width=100&height=100`;
                    target.style.borderRadius = "4px";
                    target.style.height = "24px";
                }}
            />
        </div>
    );

    // Ensure we have enough logos to fill the marquee width smoothly
    const fullLogos = [...logos, ...logos];

    return (
        <div className="relative flex overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm h-14 group">
            {/* Strip 1 */}
            <div className="flex items-center min-w-full animate-marquee whitespace-nowrap">
                {fullLogos.map((logo, i) => <LogoItem key={`s1-${i}`} logo={logo} />)}
            </div>

            {/* Strip 2 - positioned absolute so it sits exactly where it needs to start */}
            <div className="absolute top-0 flex items-center min-w-full animate-marquee2 whitespace-nowrap h-full">
                {fullLogos.map((logo, i) => <LogoItem key={`s2-${i}`} logo={logo} />)}
            </div>

            {/* Gradient Mask Edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
        </div>
    );
};

export default LogoMarquee;
