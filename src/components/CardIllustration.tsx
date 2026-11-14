import React, { useState } from 'react';
import { IllustrationTheme } from '../types';

interface CardIllustrationProps {
  theme: IllustrationTheme;
  imageUrl?: string;
  word: string;
  className?: string;
}

export const CardIllustration: React.FC<CardIllustrationProps> = ({
  theme,
  imageUrl,
  word,
  className = 'w-full h-48',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Reset imageFailed state if imageUrl changes (e.g. flipping between cards)
  React.useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  // If user provided a valid direct image URL and it didn't fail

  if (imageUrl && !imageFailed) {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-slate-100 ${className}`}>
        <img
          src={imageUrl}
          alt={word}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // High-fidelity thematic SVG vector illustrations with rich gradients and detailed educational visual elements
  const renderThematicSvg = () => {
    switch (theme) {
      case 'work':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="workBg" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient id="cardSurface" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#F8FAFC" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" rx="16" fill="url(#workBg)" />
            <circle cx="65" cy="45" r="55" fill="#818CF8" opacity="0.22" />
            <circle cx="345" cy="195" r="70" fill="#A78BFA" opacity="0.2" />

            {/* Schedule / Calendar Card */}
            <g transform="translate(55, 42)">
              <rect x="0" y="0" width="150" height="145" rx="14" fill="url(#cardSurface)" />
              <rect x="0" y="0" width="150" height="36" rx="14" fill="#0EA5E9" />
              <rect x="0" y="20" width="150" height="16" fill="#0EA5E9" />
              <circle cx="32" cy="18" r="5" fill="#E0F2FE" />
              <circle cx="118" cy="18" r="5" fill="#E0F2FE" />
              {/* Calendar Slots */}
              <rect x="18" y="52" width="32" height="22" rx="5" fill="#E0E7FF" />
              <rect x="59" y="52" width="32" height="22" rx="5" fill="#10B981" />
              <path d="M69 63 L74 68 L83 58" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="100" y="52" width="32" height="22" rx="5" fill="#E0E7FF" />
              <rect x="18" y="84" width="32" height="22" rx="5" fill="#FEF3C7" />
              <rect x="59" y="84" width="32" height="22" rx="5" fill="#E0E7FF" />
              <rect x="100" y="84" width="32" height="22" rx="5" fill="#E0E7FF" />
              <line x1="18" y1="122" x2="112" y2="122" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Client Communication Speech Bubble */}
            <g transform="translate(185, 72)">
              <rect x="0" y="0" width="165" height="92" rx="16" fill="#FFFFFF" />
              <polygon points="24,90 42,90 22,110" fill="#FFFFFF" />
              <circle cx="30" cy="30" r="14" fill="#FDE047" />
              <path d="M24 30 Q 30 37 36 30" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />
              <rect x="54" y="20" width="88" height="8" rx="4" fill="#4F46E5" />
              <rect x="54" y="36" width="66" height="6" rx="3" fill="#CBD5E1" />
              <rect x="20" y="60" width="122" height="16" rx="8" fill="#ECFDF5" />
              <text x="81" y="72" fill="#059669" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ENROLLMENT OPEN</text>
            </g>

            {/* Sparkle Accent */}
            <path d="M350 45 Q 354 55 364 59 Q 354 63 350 73 Q 346 63 336 59 Q 346 55 350 45 Z" fill="#FDE047" />
          </svg>
        );

      case 'study':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="studyBg" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFBEB" />
                <stop offset="1" stopColor="#FEF3C7" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" rx="16" fill="url(#studyBg)" />
            {/* Soft Cozy Mats Floor */}
            <rect x="35" y="168" width="330" height="44" rx="14" fill="#34D399" opacity="0.35" />
            <rect x="50" y="176" width="300" height="28" rx="10" fill="#10B981" />

            {/* Playful Step-by-Step Toy Blocks */}
            <g transform="translate(75, 112)">
              <rect x="0" y="24" width="52" height="52" rx="10" fill="#F43F5E" />
              <text x="26" y="57" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">A</text>
              <rect x="58" y="24" width="52" height="52" rx="10" fill="#3B82F6" />
              <text x="84" y="57" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">B</text>
              <rect x="29" y="-32" width="52" height="52" rx="10" fill="#F59E0B" />
              <text x="55" y="1" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">C</text>
            </g>

            {/* Interactive Steps & Stars */}
            <g transform="translate(225, 55)">
              <rect x="0" y="80" width="28" height="40" rx="6" fill="#A78BFA" />
              <rect x="36" y="55" width="28" height="65" rx="6" fill="#8B5CF6" />
              <rect x="72" y="28" width="28" height="92" rx="6" fill="#6D28D9" />
              {/* Star on top */}
              <polygon points="86,-8 91,4 104,5 94,14 97,26 86,19 75,26 78,14 68,5 81,4" fill="#F59E0B" />
            </g>

            {/* Cozy Smile Cloud */}
            <circle cx="80" cy="48" r="18" fill="#FDE047" />
          </svg>
        );

      case 'action':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="actionBg" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0F766E" />
                <stop offset="1" stopColor="#0D9488" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" rx="16" fill="url(#actionBg)" />
            {/* Motion Rings */}
            <circle cx="200" cy="120" r="90" stroke="#5EEAD4" strokeWidth="2" strokeDasharray="8 6" opacity="0.35" />
            <circle cx="200" cy="120" r="62" stroke="#99F6E4" strokeWidth="2" opacity="0.4" />

            {/* Checklist Card */}
            <g transform="translate(80, 56)">
              <rect x="0" y="0" width="130" height="128" rx="14" fill="#FFFFFF" />
              <circle cx="28" cy="34" r="10" fill="#10B981" />
              <path d="M23 34 L27 38 L34 30" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="46" y="29" width="66" height="10" rx="5" fill="#CBD5E1" />

              <circle cx="28" cy="66" r="10" fill="#10B981" />
              <path d="M23 66 L27 70 L34 62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="46" y="61" width="54" height="10" rx="5" fill="#CBD5E1" />

              <circle cx="28" cy="98" r="10" fill="#F59E0B" />
              <rect x="46" y="93" width="62" height="10" rx="5" fill="#E2E8F0" />
            </g>

            {/* Forward Energy Arrow */}
            <g transform="translate(225, 76)">
              <circle cx="52" cy="48" r="46" fill="#F59E0B" />
              <path d="M32 48 L68 48 M54 32 L70 48 L54 64" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      case 'sports':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sportsBg" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0284C7" />
                <stop offset="1" stopColor="#0369A1" />
              </linearGradient>
              <linearGradient id="matGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#F43F5E" />
                <stop offset="1" stopColor="#FB7185" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" rx="16" fill="url(#sportsBg)" />
            {/* Dynamic Energy Wave Lines */}
            <path d="M-20 60 Q 120 10 240 70 T 420 50" stroke="#38BDF8" strokeWidth="3" opacity="0.4" fill="none" />
            <path d="M-20 90 Q 140 40 260 100 T 420 80" stroke="#7DD3FC" strokeWidth="2" opacity="0.3" fill="none" />

            {/* Gymnastics Floor Mat */}
            <g transform="translate(40, 165)">
              <polygon points="40,25 340,25 310,65 10,65" fill="url(#matGrad)" />
              <polygon points="50,30 330,30 305,60 25,60" stroke="#34D399" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              {/* Center safety landing cross */}
              <circle cx="175" cy="45" r="14" stroke="#A7F3D0" strokeWidth="2" fill="none" />
              <line x1="165" y1="45" x2="185" y2="45" stroke="#A7F3D0" strokeWidth="2" />
              <line x1="175" y1="35" x2="175" y2="55" stroke="#A7F3D0" strokeWidth="2" />
            </g>

            {/* Dynamic Gymnast / Athletic Figure in motion (Handstand / Jump silhouette) */}
            <g transform="translate(160, 45)">
              {/* Head */}
              <circle cx="40" cy="95" r="11" fill="#FEF08A" />
              {/* Torso */}
              <path d="M34 85 L32 45 L48 45 L46 85 Z" fill="#FFFFFF" />
              {/* Arms extended downward supporting on ground / mat */}
              <path d="M32 80 L22 125 L16 125" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
              <path d="M48 80 L58 125 L64 125" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
              {/* Legs split / handstand straight up in air with pointed toes */}
              <path d="M35 46 L20 8 L16 2" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
              <path d="M45 46 L60 8 L64 2" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
              {/* Pointed toes highlight */}
              <circle cx="15" cy="2" r="3.5" fill="#FDE047" />
              <circle cx="65" cy="2" r="3.5" fill="#FDE047" />
            </g>

            {/* Flowing Ribbon of Motion */}
            <path d="M50 140 C 90 90 120 180 180 110 C 230 50 300 130 360 80" stroke="url(#ribbonGrad)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M350 82 L364 80 L358 92" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Motivation Badge: "ENGAGE & LOCK" */}
            <g transform="translate(290, 25)">
              <rect x="0" y="0" width="85" height="26" rx="13" fill="#0C4A6E" opacity="0.8" />
              <text x="42" y="17" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">FORM & FOCUS</text>
            </g>
          </svg>
        );

      case 'travel':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="travelSky" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="planeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#E2E8F0" />
              </linearGradient>
              <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="1" stopColor="#E0F2FE" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="suitcaseGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Background Sky */}
            <rect width="400" height="240" rx="16" fill="url(#travelSky)" />
            {/* Sun */}
            <circle cx="330" cy="50" r="32" fill="#FDE047" opacity="0.9" />
            <circle cx="330" cy="50" r="44" stroke="#FEF08A" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            
            {/* Fluffy Clouds */}
            <path d="M40 180 C40 160 56 145 76 145 C82 145 88 147 93 150 C101 138 116 130 132 130 C155 130 174 147 176 170 C184 172 190 179 190 188 C190 199 181 208 170 208 L48 208 C39 208 40 195 40 180 Z" fill="url(#cloudGrad)" />
            <path d="M260 200 C260 185 272 173 287 173 C292 173 296 175 300 177 C307 167 318 161 330 161 C347 161 362 174 363 192 C370 193 375 199 375 206 C375 215 368 222 360 222 L266 222 C259 222 260 211 260 200 Z" fill="url(#cloudGrad)" opacity="0.8" />

            {/* Jet Contrail Flight path */}
            <path d="M30 110 Q 140 70 270 95" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" opacity="0.8" />

            {/* Modern Jet Airplane */}
            <g transform="translate(230, 60) rotate(-12)">
              <path d="M0 25 C10 15 50 12 75 18 C85 20 90 25 80 28 C55 35 25 36 0 25 Z" fill="url(#planeGrad)" />
              <path d="M32 15 L22 -10 L38 -8 L48 16 Z" fill="#E2E8F0" />
              <path d="M38 27 L25 50 L40 52 L54 28 Z" fill="#CBD5E1" />
              <path d="M2 20 L-10 10 L-6 10 L4 23 Z" fill="#94A3B8" />
              {/* Windows */}
              <circle cx="45" cy="21" r="2" fill="#0284C7" />
              <circle cx="53" cy="22" r="2" fill="#0284C7" />
              <circle cx="61" cy="23" r="2" fill="#0284C7" />
            </g>

            {/* Stylish Suitcase & Luggage in Foreground */}
            <g transform="translate(60, 110)">
              {/* Handle */}
              <path d="M45 25 L45 8 C45 4 51 0 60 0 C69 0 75 4 75 8 L75 25" stroke="#475569" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Bag Body */}
              <rect x="20" y="25" width="80" height="60" rx="10" fill="url(#suitcaseGrad)" />
              {/* Straps & Ribs */}
              <rect x="36" y="25" width="6" height="60" fill="#B45309" opacity="0.7" />
              <rect x="78" y="25" width="6" height="60" fill="#B45309" opacity="0.7" />
              <line x1="20" y1="55" x2="100" y2="55" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
              {/* Wheels */}
              <circle cx="34" cy="88" r="5" fill="#1E293B" />
              <circle cx="86" cy="88" r="5" fill="#1E293B" />
              {/* Luggage Tag */}
              <polygon points="44,45 52,43 55,54 47,56" fill="#F87171" />
            </g>

            {/* Passport & Boarding Pass */}
            <g transform="translate(155, 135) rotate(15)">
              <rect x="0" y="0" width="46" height="62" rx="4" fill="#1E3A8A" />
              <circle cx="23" cy="25" r="12" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
              <line x1="12" y1="46" x2="34" y2="46" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="52" x2="30" y2="52" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'tech':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="techBg" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#312E81" />
                <stop offset="1" stopColor="#4338CA" />
              </linearGradient>
              <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#0F172A" />
                <stop offset="1" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="glowIdea" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#FDE047" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" rx="16" fill="url(#techBg)" />
            {/* Grid dots */}
            <circle cx="50" cy="40" r="1.5" fill="#818CF8" opacity="0.4" />
            <circle cx="100" cy="40" r="1.5" fill="#818CF8" opacity="0.4" />
            <circle cx="150" cy="40" r="1.5" fill="#818CF8" opacity="0.4" />
            <circle cx="200" cy="40" r="1.5" fill="#818CF8" opacity="0.4" />
            <circle cx="250" cy="40" r="1.5" fill="#818CF8" opacity="0.4" />
            <circle cx="300" cy="40" r="1.5" fill="#818CF8" opacity="0.4" />
            <circle cx="350" cy="40" r="1.5" fill="#818CF8" opacity="0.4" />

            {/* Glowing Lightbulb (Idea / Innovation) */}
            <g transform="translate(85, 35)">
              <circle cx="35" cy="35" r="28" fill="url(#glowIdea)" />
              <path d="M22 55 L48 55 L44 68 L26 68 Z" fill="#94A3B8" />
              <line x1="28" y1="73" x2="42" y2="73" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
              {/* Filament rays */}
              <path d="M28 35 Q 35 24 42 35" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
              <line x1="35" y1="-5" x2="35" y2="2" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <line x1="68" y1="12" x2="62" y2="17" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <line x1="2" y1="12" x2="8" y2="17" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Modern Laptop */}
            <g transform="translate(170, 75)">
              {/* Screen outer */}
              <rect x="0" y="0" width="160" height="105" rx="8" fill="#E2E8F0" />
              {/* Screen display */}
              <rect x="8" y="8" width="144" height="89" rx="4" fill="url(#screenGrad)" />
              {/* Code / interface bars */}
              <line x1="20" y1="24" x2="70" y2="24" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
              <line x1="20" y1="36" x2="110" y2="36" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
              <line x1="20" y1="46" x2="90" y2="46" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
              <line x1="35" y1="58" x2="120" y2="58" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
              <line x1="35" y1="68" x2="80" y2="68" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
              {/* Keyboard base */}
              <path d="M-20 105 L180 105 L165 125 L-5 125 Z" fill="#CBD5E1" />
              <rect x="60" y="110" width="40" height="8" rx="2" fill="#94A3B8" />
            </g>

            {/* Floating Circuit Connection */}
            <path d="M120 150 L150 170 L165 170" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="120" cy="150" r="4" fill="#38BDF8" />
          </svg>
        );

      case 'nature':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="natureSky" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#ECFDF5" />
                <stop offset="1" stopColor="#A7F3D0" />
              </linearGradient>
              <linearGradient id="mountainGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#047857" />
                <stop offset="1" stopColor="#065F46" />
              </linearGradient>
              <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" rx="16" fill="url(#natureSky)" />
            {/* Gentle Warm Sun */}
            <circle cx="80" cy="65" r="30" fill="#FBBF24" opacity="0.9" />

            {/* Mountains in background */}
            <polygon points="120,240 220,100 320,240" fill="url(#mountainGrad)" opacity="0.5" />
            <polygon points="200,240 290,120 380,240" fill="url(#mountainGrad)" opacity="0.7" />
            {/* Snow caps */}
            <polygon points="220,100 205,122 215,118 225,124 235,120" fill="#FFFFFF" opacity="0.9" />
            <polygon points="290,120 278,138 286,134 295,140 302,136" fill="#FFFFFF" opacity="0.9" />

            {/* Rolling green hills */}
            <path d="M0 160 Q 110 130 220 170 T 400 165 L 400 240 L 0 240 Z" fill="url(#hillGrad)" />
            <path d="M0 190 Q 140 170 270 200 T 400 195 L 400 240 L 0 240 Z" fill="#047857" opacity="0.8" />

            {/* Stylized Pine Trees */}
            <g transform="translate(60, 140)">
              <rect x="18" y="45" width="4" height="15" fill="#78350F" />
              <polygon points="20,10 5,30 35,30" fill="#065F46" />
              <polygon points="20,25 0,48 40,48" fill="#047857" />
            </g>
            <g transform="translate(100, 150) scale(0.85)">
              <rect x="18" y="45" width="4" height="15" fill="#78350F" />
              <polygon points="20,10 5,30 35,30" fill="#065F46" />
              <polygon points="20,25 0,48 40,48" fill="#047857" />
            </g>

            {/* Cute Fox / Wildlife Element */}
            <g transform="translate(240, 160)">
              {/* Body */}
              <ellipse cx="40" cy="45" rx="22" ry="16" fill="#EA580C" />
              {/* Head */}
              <polygon points="20,22 45,38 25,50" fill="#EA580C" />
              {/* Ears */}
              <polygon points="26,12 32,26 22,24" fill="#C2410C" />
              <polygon points="34,14 40,28 30,26" fill="#C2410C" />
              {/* White muzzle & chest */}
              <polygon points="20,38 32,45 23,49" fill="#FFF7ED" />
              {/* Eye & Nose */}
              <circle cx="28" cy="34" r="2.5" fill="#1C1917" />
              <circle cx="20" cy="40" r="2.5" fill="#1C1917" />
              {/* Fluffy tail with white tip */}
              <path d="M58 45 C75 40 85 25 78 18 C70 12 60 28 55 40 Z" fill="#EA580C" />
              <path d="M78 18 C74 15 68 20 66 26 C72 24 76 20 78 18 Z" fill="#FFF7ED" />
            </g>
          </svg>
        );

      case 'food':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="foodBg" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF7ED" />
                <stop offset="1" stopColor="#FFEDD5" />
              </linearGradient>
              <linearGradient id="croissantGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" rx="16" fill="url(#foodBg)" />
            {/* Table mat / plate */}
            <ellipse cx="200" cy="165" rx="150" ry="50" fill="#FED7AA" opacity="0.6" />
            <ellipse cx="200" cy="160" rx="130" ry="42" fill="#FFFFFF" stroke="#FDBA74" strokeWidth="2" />

            {/* Steaming Coffee Cup */}
            <g transform="translate(90, 85)">
              <ellipse cx="40" cy="65" rx="35" ry="10" fill="#E2E8F0" />
              {/* Mug body */}
              <path d="M12 25 L18 60 C19 65 25 70 40 70 C55 70 61 65 62 60 L68 25 Z" fill="#EA580C" />
              {/* Coffee surface */}
              <ellipse cx="40" cy="25" rx="28" ry="8" fill="#78350F" />
              <ellipse cx="40" cy="25" rx="22" ry="5" fill="#9A3412" />
              {/* Handle */}
              <path d="M65 32 C78 32 78 52 63 56" stroke="#EA580C" strokeWidth="5" fill="none" strokeLinecap="round" />
              {/* Steam waves */}
              <path d="M30 15 Q 35 5 28 -5" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M42 12 Q 47 2 40 -8" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M52 16 Q 57 6 50 -4" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            </g>

            {/* Golden Croissant */}
            <g transform="translate(180, 115)">
              <path d="M10 40 C20 15 50 10 75 12 C100 15 125 35 130 50 C110 50 85 40 65 42 C45 44 25 50 10 40 Z" fill="url(#croissantGrad)" />
              <path d="M35 25 C45 28 55 35 60 42" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M70 20 C80 25 90 32 95 44" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Fresh Ripe Strawberries */}
            <g transform="translate(240, 160)">
              <path d="M15 5 C5 15 10 30 20 32 C30 32 35 18 25 5 Z" fill="#EF4444" />
              {/* Green leaf cap */}
              <polygon points="18,3 12,0 16,-4 20,0 24,-3 22,3" fill="#22C55E" />
              <circle cx="16" cy="12" r="1" fill="#FEF08A" />
              <circle cx="22" cy="18" r="1" fill="#FEF08A" />
              <circle cx="18" cy="24" r="1" fill="#FEF08A" />
            </g>
          </svg>
        );

      case 'emotion':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="emoBg" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDF2F8" />
                <stop offset="1" stopColor="#FCE7F3" />
              </linearGradient>
              <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#F43F5E" />
                <stop offset="1" stopColor="#E11D48" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" rx="16" fill="url(#emoBg)" />
            {/* Soft glowing radiant circles */}
            <circle cx="200" cy="120" r="75" fill="#FDA4AF" opacity="0.25" />
            <circle cx="200" cy="120" r="55" fill="#FB7185" opacity="0.3" />

            {/* Sparkling stars */}
            <path d="M90 60 Q 95 75 110 80 Q 95 85 90 100 Q 85 85 70 80 Q 85 75 90 60 Z" fill="#F59E0B" />
            <path d="M310 70 Q 314 80 325 85 Q 314 90 310 100 Q 306 90 295 85 Q 306 80 310 70 Z" fill="#EC4899" />
            <path d="M280 165 Q 283 172 290 175 Q 283 178 280 185 Q 277 178 270 175 Q 277 172 280 165 Z" fill="#8B5CF6" />

            {/* Central Expressive Heart & Joy Element */}
            <g transform="translate(145, 65)">
              <path d="M55 25 C55 10 40 0 25 0 C10 0 0 12 0 28 C0 52 42 75 55 90 C68 75 110 52 110 28 C110 12 100 0 85 0 C70 0 55 10 55 25 Z" fill="url(#heartGrad)" />
              {/* Highlight */}
              <path d="M22 15 C15 15 10 22 10 30" stroke="#FFE4E6" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Happy smiling eyes */}
              <circle cx="38" cy="38" r="4" fill="#FFFFFF" />
              <circle cx="72" cy="38" r="4" fill="#FFFFFF" />
              <path d="M44 52 Q 55 64 66 52" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        );

      case 'grammar':
      default:
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gramBg" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EEF2FF" />
                <stop offset="1" stopColor="#E0E7FF" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" rx="16" fill="url(#gramBg)" />
            {/* Blueprint Grid Lines */}
            <line x1="40" y1="40" x2="360" y2="40" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="90" x2="360" y2="90" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="140" x2="360" y2="140" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="190" x2="360" y2="190" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="4 4" />

            {/* Puzzle Grammar Connectors */}
            <g transform="translate(60, 70)">
              {/* Block 1: Subject */}
              <rect x="0" y="10" width="80" height="50" rx="8" fill="#4F46E5" />
              <text x="40" y="42" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Subject</text>
              {/* Connector Plus */}
              <text x="95" y="43" fill="#6366F1" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">+</text>
              {/* Block 2: Auxiliary */}
              <rect x="110" y="10" width="80" height="50" rx="8" fill="#06B6D4" />
              <text x="150" y="42" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Verb</text>
              {/* Connector Plus */}
              <text x="205" y="43" fill="#6366F1" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">+</text>
              {/* Block 3: Object */}
              <rect x="220" y="10" width="80" height="50" rx="8" fill="#10B981" />
              <text x="260" y="42" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Object</text>
            </g>

            {/* Sparkle of mastery */}
            <circle cx="330" cy="50" r="16" fill="#F59E0B" />
            <polygon points="330,38 333,46 341,47 335,53 337,61 330,56 323,61 325,53 319,47 327,46" fill="#FFFFFF" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-xs transition-all duration-300 ${className}`}>
      {renderThematicSvg()}
    </div>
  );
};
