import { useState } from 'react';
import { Languages, MapPin, Navigation, Phone } from 'lucide-react';

type Language = 'en' | 'hi' | 'mr';

type CarePoint = {
  id: string;
  name: string;
  type: string;
  phone: string;
  latitude: number;
  longitude: number;
};

const LANGUAGES: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी'
};

const UI_TRANSLATIONS = {
  en: {
    title: 'Nearby Care Locator',
    subtitle: 'Quickly find PHC, hospital, and ambulance support near your village.',
    language: 'Language / भाषा / भाषा',
    selectLanguage: 'Select response language',
    callFacility: 'Call',
    routeNow: 'Route'
  },
  hi: {
    title: 'नज़दीकी उपचार केंद्र',
    subtitle: 'अपने आसपास PHC, अस्पताल और एम्बुलेंस सहायता जल्दी खोजें।',
    language: 'Language / भाषा / भाषा',
    selectLanguage: 'प्रतिक्रिया भाषा चुनें',
    callFacility: 'कॉल',
    routeNow: 'रूट'
  },
  mr: {
    title: 'जवळची आरोग्य सेवा केंद्रे',
    subtitle: 'तुमच्या आसपास PHC, रुग्णालय आणि ॲम्बुलन्स सेवा पटकन शोधा.',
    language: 'Language / भाषा / भाषा',
    selectLanguage: 'प्रतिसाद भाषा निवडा',
    callFacility: 'कॉल',
    routeNow: 'मार्ग'
  }
};

const NEARBY_CARE_POINTS: Record<Language, CarePoint[]> = {
  en: [
    { id: 'phc-1', name: 'Primary Health Centre - Village Hub', type: 'PHC', phone: '108', latitude: 18.5204, longitude: 73.8567 },
    { id: 'hospital-1', name: 'Taluka Rural Hospital', type: 'Hospital', phone: '112', latitude: 18.5316, longitude: 73.8446 },
    { id: 'ambulance-1', name: '108 Ambulance Dispatch Point', type: 'Ambulance', phone: '108', latitude: 18.5093, longitude: 73.8657 },
  ],
  hi: [
    { id: 'phc-1', name: 'प्राथमिक स्वास्थ्य केंद्र - गाँव केंद्र', type: 'PHC', phone: '108', latitude: 18.5204, longitude: 73.8567 },
    { id: 'hospital-1', name: 'तालुका ग्रामीण अस्पताल', type: 'अस्पताल', phone: '112', latitude: 18.5316, longitude: 73.8446 },
    { id: 'ambulance-1', name: '108 एम्बुलेंस डिस्पैच पॉइंट', type: 'एम्बुलेंस', phone: '108', latitude: 18.5093, longitude: 73.8657 },
  ],
  mr: [
    { id: 'phc-1', name: 'प्राथमिक आरोग्य केंद्र - गाव केंद्र', type: 'PHC', phone: '108', latitude: 18.5204, longitude: 73.8567 },
    { id: 'hospital-1', name: 'तालुका ग्रामीण रुग्णालय', type: 'रुग्णालय', phone: '112', latitude: 18.5316, longitude: 73.8446 },
    { id: 'ambulance-1', name: '108 ॲम्बुलन्स डिस्पॅच पॉइंट', type: 'ॲम्बुलन्स', phone: '108', latitude: 18.5093, longitude: 73.8657 },
  ]
};

export default function NearbyCare() {
  const [language, setLanguage] = useState<Language>('en');
  const t = UI_TRANSLATIONS[language];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-sky-50/20 overflow-y-auto">
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-4 md:pb-6 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 md:p-4 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl md:rounded-2xl text-white mb-4 md:mb-6 shadow-lg shadow-sky-500/30 animate-fade-in">
          <MapPin className="w-6 md:w-8 h-6 md:h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 md:mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>{t.title}</h1>
        <p className="text-slate-500 text-sm md:text-lg animate-fade-in" style={{ animationDelay: '0.15s' }}>{t.subtitle}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-4 md:pb-6 w-full animate-fade-in" style={{ animationDelay: '0.18s' }}>
        <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-1.5 md:p-2 bg-sky-100 rounded-lg">
                <Languages className="w-4 md:w-5 h-4 md:h-5 text-sky-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xs md:text-sm">{t.language}</h3>
                <p className="text-slate-500 text-[10px] md:text-xs">{t.selectLanguage}</p>
              </div>
            </div>
            <div className="flex gap-1.5 md:gap-2 p-1 bg-slate-100 rounded-lg">
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code as Language)}
                  className={`px-2.5 md:px-3 py-1.5 md:py-2 rounded-md font-semibold text-[10px] md:text-xs transition-all ${
                    language === code ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                  title={name}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-6 md:pb-8 w-full animate-fade-in" style={{ animationDelay: '0.22s' }}>
        <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
          {NEARBY_CARE_POINTS[language].map((point) => (
            <div key={point.id} className="px-4 md:px-5 py-3.5 md:py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm md:text-base truncate">{point.name}</p>
                <div className="text-xs md:text-sm text-slate-500 flex items-center gap-2">
                  <span>{point.type}</span>
                  <span>•</span>
                  <span className="truncate">{point.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`tel:${point.phone}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs md:text-sm font-semibold border border-emerald-100"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.callFacility}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs md:text-sm font-semibold border border-sky-100"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t.routeNow}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
