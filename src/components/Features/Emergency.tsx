import { useState } from 'react';
import { ChevronLeft, AlertTriangle, Shield, HeartPulse, ChevronRight, Phone, Siren, Languages } from 'lucide-react';
import { emergencyCategories, EmergencyCategory, getTranslatedCategory } from '../../data/emergencyTree';

type Language = 'en' | 'hi' | 'mr';

const LANGUAGES = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  mr: 'मराठी (Marathi)'
};

const UI_TRANSLATIONS = {
  en: {
    backToDirectory: 'Back to directory',
    back: 'Back',
    emergency: 'Emergency',
    criticalWarnings: 'Critical Warnings',
    firstAidProcedures: 'First Aid Procedures',
    steps: 'Steps',
    noStepsAvailable: 'No specific steps available for this category.',
    whenToSeekHelp: 'When to Seek Medical Help',
    emergencyGuide: 'Emergency First Aid Guide',
    guideDescription: 'Immediate, offline-ready medical guidance for critical situations',
    emergencyNotice: 'Emergency Notice',
    noticeDescription: 'This guide provides first aid information only. For serious medical emergencies, always call professional emergency services immediately.',
    viewProcedures: 'View Procedures',
    language: 'Language / भाषा / भाषा',
    selectLanguage: 'Select response language'
  },
  hi: {
    backToDirectory: 'निर्देशिका पर वापस',
    back: 'वापस',
    emergency: 'आपातकाल',
    criticalWarnings: 'महत्वपूर्ण चेतावनियां',
    firstAidProcedures: 'प्राथमिक उपचार प्रक्रियाएं',
    steps: 'कदम',
    noStepsAvailable: 'इस श्रेणी के लिए कोई विशिष्ट कदम उपलब्ध नहीं हैं।',
    whenToSeekHelp: 'चिकित्सा सहायता कब लें',
    emergencyGuide: 'आपातकालीन प्राथमिक चिकित्सा गाइड',
    guideDescription: 'गंभीर स्थितियों के लिए तत्काल, ऑफ़लाइन-तैयार चिकित्सा मार्गदर्शन',
    emergencyNotice: 'आपातकालीन सूचना',
    noticeDescription: 'यह गाइड केवल प्राथमिक उपचार जानकारी प्रदान करती है। गंभीर चिकित्सा आपात स्थितियों के लिए, हमेशा तुरंत पेशेवर आपातकालीन सेवाओं को कॉल करें।',
    viewProcedures: 'प्रक्रियाएं देखें',
    language: 'Language / भाषा / भाषा',
    selectLanguage: 'प्रतिक्रिया भाषा चुनें'
  },
  mr: {
    backToDirectory: 'निर्देशिकेत परत',
    back: 'परत',
    emergency: 'आपत्कालीन',
    criticalWarnings: 'गंभीर इशारे',
    firstAidProcedures: 'प्रथमोपचार प्रक्रिया',
    steps: 'पायऱ्या',
    noStepsAvailable: 'या श्रेणीसाठी कोणतीही विशिष्ट पायरी उपलब्ध नाही.',
    whenToSeekHelp: 'वैद्यकीय मदत कधी घ्यावी',
    emergencyGuide: 'आपत्कालीन प्रथमोपचार मार्गदर्शक',
    guideDescription: 'गंभीर परिस्थितींसाठी तात्काळ, ऑफलाइन-तयार वैद्यकीय मार्गदर्शन',
    emergencyNotice: 'आपत्कालीन सूचना',
    noticeDescription: 'हे मार्गदर्शक केवळ प्रथमोपचार माहिती प्रदान करते. गंभीर वैद्यकीय आपत्कालीन परिस्थितींसाठी, नेहमी त्वरित व्यावसायिक आपत्कालीन सेवांना कॉल करा.',
    viewProcedures: 'प्रक्रिया पहा',
    language: 'Language / भाषा / भाषा',
    selectLanguage: 'प्रतिसाद भाषा निवडा'
  }
};

export default function Emergency() {
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const t = UI_TRANSLATIONS[language];
  const translatedCategory = selectedCategory ? getTranslatedCategory(selectedCategory.id, language) : null;

  if (selectedCategory) {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-white">
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3 md:py-4 sticky top-0 z-10 flex items-center justify-between">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center space-x-2 text-slate-500 hover:text-sky-600 text-sm font-medium group transition-all px-3 py-2 rounded-xl hover:bg-sky-50 active:bg-sky-100"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">{t.backToDirectory}</span>
            <span className="sm:hidden">{t.back}</span>
          </button>

          <div className="flex items-center space-x-1.5 md:space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full border border-red-100 shadow-sm">
            <Siren className="w-3 md:w-4 h-3 md:h-4" />
            <span>{t.emergency}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in">
          <div className="flex items-start space-x-3 md:space-x-5">
            <div className="p-3 md:p-5 bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 text-3xl md:text-5xl">
              {selectedCategory.icon}
            </div>
            <div className="pt-1">
              <h1 className="text-xl md:text-3xl font-bold text-slate-800 mb-1 md:mb-2">{translatedCategory?.title || selectedCategory.title}</h1>
              <p className="text-slate-500 text-sm md:text-lg leading-relaxed">{translatedCategory?.description || selectedCategory.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-5">
            {(translatedCategory?.warnings || selectedCategory.warnings) && (translatedCategory?.warnings || selectedCategory.warnings).length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200/80 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="p-2 md:p-2.5 bg-red-100 rounded-lg md:rounded-xl text-red-600 flex-shrink-0">
                    <AlertTriangle className="w-4 md:w-5 h-4 md:h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-red-800 mb-2">{t.criticalWarnings}</h3>
                    <ul className="space-y-1.5 md:space-y-2">
                      {(translatedCategory?.warnings || selectedCategory.warnings).map((warning, index) => (
                        <li key={index} className="flex items-start space-x-2 text-red-700 text-xs md:text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200/80 rounded-xl md:rounded-2xl shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-700 flex items-center space-x-2 text-sm md:text-base">
                  <div className="p-1.5 bg-sky-100 rounded-lg">
                    <Shield className="w-3 md:w-4 h-3 md:h-4 text-sky-600" />
                  </div>
                  <span>{t.firstAidProcedures}</span>
                </h3>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.steps}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {(translatedCategory?.steps || selectedCategory.steps) && (translatedCategory?.steps || selectedCategory.steps).length > 0 ? (
                  (translatedCategory?.steps || selectedCategory.steps).map((step, index) => (
                    <div key={index} className="p-4 md:p-5 hover:bg-sky-50/40 transition-colors group">
                      <div className="flex items-start space-x-3 md:space-x-4">
                        <span className="w-7 md:w-8 h-7 md:h-8 rounded-lg md:rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-sm">
                          {index + 1}
                        </span>
                        <p className="text-slate-700 leading-relaxed pt-0.5 md:pt-1 text-sm md:text-base">{step}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 md:p-8 text-center text-slate-500 italic text-sm md:text-base">{t.noStepsAvailable}</div>
                )}
              </div>
            </div>

            {(translatedCategory?.whenToSeekHelp || selectedCategory.whenToSeekHelp) && (translatedCategory?.whenToSeekHelp || selectedCategory.whenToSeekHelp).length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="p-2 md:p-2.5 bg-amber-100 rounded-lg md:rounded-xl text-amber-600 flex-shrink-0">
                    <Phone className="w-4 md:w-5 h-4 md:h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-amber-800 mb-2">{t.whenToSeekHelp}</h3>
                    <ul className="space-y-1.5 md:space-y-2">
                      {(translatedCategory?.whenToSeekHelp || selectedCategory.whenToSeekHelp).map((item, index) => (
                        <li key={index} className="flex items-start space-x-2 text-amber-700 text-xs md:text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-red-50/20 overflow-y-auto">
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-4 md:pb-6 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 md:p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl md:rounded-2xl text-white mb-4 md:mb-6 shadow-lg shadow-red-500/30 animate-fade-in">
          <HeartPulse className="w-6 md:w-8 h-6 md:h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 md:mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>{t.emergencyGuide}</h1>
        <p className="text-slate-500 text-sm md:text-lg animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {t.guideDescription}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-4 md:pb-6 w-full animate-fade-in" style={{ animationDelay: '0.18s' }}>
        <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-1.5 md:p-2 bg-red-100 rounded-lg">
                <Languages className="w-4 md:w-5 h-4 md:h-5 text-red-600" />
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
                    language === code ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
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

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-4 md:pb-6 w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start space-x-3 md:space-x-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border border-red-100 shadow-sm">
          <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-red-50 text-red-600 flex-shrink-0">
            <AlertTriangle className="w-4 md:w-5 h-4 md:h-5" />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-bold text-red-800 uppercase tracking-wide mb-0.5">{t.emergencyNotice}</h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              {t.noticeDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-8 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {emergencyCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="opacity-0 animate-fade-in group relative bg-white hover:bg-gradient-to-br hover:from-white hover:to-sky-50/50 rounded-xl md:rounded-2xl border border-slate-200 hover:border-sky-200 p-4 md:p-5 text-left transition-all duration-300 hover:shadow-xl hover:shadow-sky-100/50 active:scale-[0.98] md:hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${0.25 + index * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <div className="absolute top-0 right-0 p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ChevronRight className="w-4 md:w-5 h-4 md:h-5 text-sky-400" />
              </div>

              <div className="text-3xl md:text-4xl mb-2 md:mb-3 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                {category.icon}
              </div>

              <h3 className="text-sm md:text-base font-bold text-slate-800 mb-1 md:mb-1.5 group-hover:text-sky-700 transition-colors">
                {getTranslatedCategory(category.id, language)?.title || category.title}
              </h3>

              <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-2">
                {getTranslatedCategory(category.id, language)?.description || category.description}
              </p>

              <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-slate-100 flex items-center text-[10px] md:text-[11px] font-bold text-slate-400 group-hover:text-sky-600 uppercase tracking-wider transition-colors">
                <span>{t.viewProcedures}</span>
                <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
