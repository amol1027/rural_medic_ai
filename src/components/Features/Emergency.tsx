import { useEffect, useState } from 'react';
import { ChevronLeft, AlertTriangle, Shield, HeartPulse, ChevronRight, Phone, Siren, Languages, Plus, Trash2, Users } from 'lucide-react';
import { emergencyCategories, EmergencyCategory, getTranslatedCategory } from '../../data/emergencyTree';
import { useAuth } from '../../contexts/AuthContext';

type Language = 'en' | 'hi' | 'mr';

const LANGUAGES = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  mr: 'मराठी (Marathi)'
};

type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relation: string;
};

type ServiceContact = {
  id: string;
  name: string;
  phone: string;
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
    selectLanguage: 'Select response language',
    emergencyContacts: 'Emergency Contact List',
    contactsDescription: 'Save nearby relatives, neighbors, or health workers for one-tap calling.',
    contactName: 'Name',
    contactPhone: 'Phone Number',
    contactRelation: 'Relation (optional)',
    addContact: 'Add Contact',
    noContacts: 'No contacts added yet.',
    callNow: 'Call Now',
    remove: 'Remove',
    contactValidation: 'Please enter both name and phone number.',
    invalidPhoneValidation: 'Please enter a valid phone number (10-15 digits, optional +country code).',
    officialContacts: 'Official Emergency Numbers',
    sendSosSms: 'Send SOS SMS',
    sendSosSmsDescription: 'Send “need help + location” to all saved contacts',
    gettingLocation: 'Getting location...',
    noContactsForSms: 'Please add at least one contact first.'
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
    selectLanguage: 'प्रतिक्रिया भाषा चुनें',
    emergencyContacts: 'आपातकालीन संपर्क सूची',
    contactsDescription: 'एक टैप कॉल के लिए रिश्तेदार, पड़ोसी या स्वास्थ्य कार्यकर्ता का नंबर सेव करें।',
    contactName: 'नाम',
    contactPhone: 'फ़ोन नंबर',
    contactRelation: 'रिश्ता (वैकल्पिक)',
    addContact: 'संपर्क जोड़ें',
    noContacts: 'अभी तक कोई संपर्क नहीं जोड़ा गया है।',
    callNow: 'अभी कॉल करें',
    remove: 'हटाएं',
    contactValidation: 'कृपया नाम और फ़ोन नंबर दोनों दर्ज करें।',
    invalidPhoneValidation: 'कृपया सही फ़ोन नंबर दर्ज करें (10-15 अंक, +देश कोड वैकल्पिक)।',
    officialContacts: 'आधिकारिक आपातकालीन नंबर',
    sendSosSms: 'एसओएस SMS भेजें',
    sendSosSmsDescription: 'सभी सेव किए गए संपर्कों को “मदद चाहिए + लोकेशन” भेजें',
    gettingLocation: 'लोकेशन प्राप्त की जा रही है...',
    noContactsForSms: 'कृपया पहले कम से कम एक संपर्क जोड़ें।'
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
    selectLanguage: 'प्रतिसाद भाषा निवडा',
    emergencyContacts: 'आपत्कालीन संपर्क यादी',
    contactsDescription: 'एका टॅपवर कॉल करण्यासाठी नातेवाईक, शेजारी किंवा आरोग्यसेवकांचे नंबर सेव्ह करा.',
    contactName: 'नाव',
    contactPhone: 'फोन नंबर',
    contactRelation: 'नाते (ऐच्छिक)',
    addContact: 'संपर्क जोडा',
    noContacts: 'अजून कोणताही संपर्क जोडलेला नाही.',
    callNow: 'आता कॉल करा',
    remove: 'काढा',
    contactValidation: 'कृपया नाव आणि फोन नंबर दोन्ही भरा.',
    invalidPhoneValidation: 'कृपया वैध फोन नंबर भरा (10-15 अंक, +देश कोड ऐच्छिक).',
    officialContacts: 'अधिकृत आपत्कालीन क्रमांक',
    sendSosSms: 'SOS SMS पाठवा',
    sendSosSmsDescription: 'जतन केलेल्या सर्व संपर्कांना “मदत हवी + लोकेशन” पाठवा',
    gettingLocation: 'लोकेशन घेत आहे...',
    noContactsForSms: 'कृपया आधी किमान एक संपर्क जोडा.'
  }
};

const SERVICE_CONTACTS: Record<Language, ServiceContact[]> = {
  en: [
    { id: 'ambulance', name: 'Ambulance', phone: '108' },
    { id: 'national-emergency', name: 'National Emergency', phone: '112' },
    { id: 'police', name: 'Police', phone: '100' },
    { id: 'fire', name: 'Fire Brigade', phone: '101' },
    { id: 'women-helpline', name: 'Women Helpline', phone: '1091' },
  ],
  hi: [
    { id: 'ambulance', name: 'एम्बुलेंस', phone: '108' },
    { id: 'national-emergency', name: 'राष्ट्रीय आपातकालीन सेवा', phone: '112' },
    { id: 'police', name: 'पुलिस', phone: '100' },
    { id: 'fire', name: 'फायर ब्रिगेड', phone: '101' },
    { id: 'women-helpline', name: 'महिला हेल्पलाइन', phone: '1091' },
  ],
  mr: [
    { id: 'ambulance', name: 'ॲम्बुलन्स', phone: '108' },
    { id: 'national-emergency', name: 'राष्ट्रीय आपत्कालीन सेवा', phone: '112' },
    { id: 'police', name: 'पोलीस', phone: '100' },
    { id: 'fire', name: 'अग्निशमन दल', phone: '101' },
    { id: 'women-helpline', name: 'महिला हेल्पलाइन', phone: '1091' },
  ]
};

export default function Emergency() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [sharingSms, setSharingSms] = useState(false);

  const contactsStorageKey = user ? `rural_medic_emergency_contacts_${user.id}` : 'rural_medic_emergency_contacts_guest';
  
  const t = UI_TRANSLATIONS[language];
  const translatedCategory = selectedCategory ? getTranslatedCategory(selectedCategory.id, language) : null;

  useEffect(() => {
    try {
      const storedContacts = localStorage.getItem(contactsStorageKey);
      if (!storedContacts) {
        setContacts([]);
      } else {
        const parsedContacts = JSON.parse(storedContacts);
        if (Array.isArray(parsedContacts)) {
          setContacts(parsedContacts);
        } else {
          setContacts([]);
        }
      }
    } catch {
      setContacts([]);
    } finally {
      setContactsLoaded(true);
    }
  }, [contactsStorageKey]);

  useEffect(() => {
    if (!contactsLoaded) return;
    localStorage.setItem(contactsStorageKey, JSON.stringify(contacts));
  }, [contacts, contactsStorageKey, contactsLoaded]);

  const handleAddContact = () => {
    const trimmedName = newContact.name.trim();
    const trimmedPhone = newContact.phone.trim();
    const trimmedRelation = newContact.relation.trim();
    const normalizedPhone = trimmedPhone.replace(/[^\d+]/g, '');
    const isValidPhone = /^\+?\d{10,15}$/.test(normalizedPhone);

    if (!trimmedName || !trimmedPhone) {
      alert(t.contactValidation);
      return;
    }

    if (!isValidPhone) {
      alert(t.invalidPhoneValidation);
      return;
    }

    setContacts(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: trimmedName,
        phone: normalizedPhone,
        relation: trimmedRelation,
      },
    ]);

    setNewContact({ name: '', phone: '', relation: '' });
  };

  const handleRemoveContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const handleShareEmergencySms = async () => {
    if (contacts.length === 0) {
      alert(t.noContactsForSms);
      return;
    }

    setSharingSms(true);

    let locationText = 'Location unavailable';
    let mapsLink = '';

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      } catch {
        locationText = 'Location unavailable';
      }
    }

    const recipients = contacts
      .map(contact => contact.phone.trim())
      .filter(phone => phone.length > 0)
      .join(',');

    const sosMessage = `Emergency: I need help. My location: ${locationText}${mapsLink ? ` (${mapsLink})` : ''}`;
    window.location.href = `sms:${recipients}?body=${encodeURIComponent(sosMessage)}`;

    setSharingSms(false);
  };

  if (selectedCategory) {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-white">
        {/* Header */}
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
          {/* Main Title Section */}
          <div className="flex items-start space-x-3 md:space-x-5">
            <div className="p-3 md:p-5 bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 text-3xl md:text-5xl">
                {selectedCategory.icon}
            </div>
            <div className="pt-1">
                <h1 className="text-xl md:text-3xl font-bold text-slate-800 mb-1 md:mb-2">{translatedCategory?.title || selectedCategory.title}</h1>
                <p className="text-slate-500 text-sm md:text-lg leading-relaxed">{translatedCategory?.description || selectedCategory.description}</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 gap-4 md:gap-5">
            {/* Warning Card */}
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

            {/* Steps Card */}
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

            {/* When to Seek Help Card */}
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
      {/* Hero Section */}
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-4 md:pb-6 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 md:p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl md:rounded-2xl text-white mb-4 md:mb-6 shadow-lg shadow-red-500/30 animate-fade-in">
            <HeartPulse className="w-6 md:w-8 h-6 md:h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 md:mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>{t.emergencyGuide}</h1>
        <p className="text-slate-500 text-sm md:text-lg animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {t.guideDescription}
        </p>
      </div>

      {/* Language Selector */}
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
                    language === code
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
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

      {/* Alert */}
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

      {/* Emergency Contacts */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-4 md:pb-6 w-full animate-fade-in" style={{ animationDelay: '0.22s' }}>
        <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 md:px-5 py-3 md:py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 md:p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <Users className="w-4 md:w-5 h-4 md:h-5" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-slate-800">{t.emergencyContacts}</h3>
                <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">{t.contactsDescription}</p>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-5 border-b border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-2.5 md:gap-3">
            <div className="md:col-span-4">
              <p className="text-[11px] md:text-xs font-bold uppercase tracking-wide text-slate-500 mb-2.5">{t.officialContacts}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {SERVICE_CONTACTS[language].map((service) => (
                  <div key={service.id} className="px-3 py-2.5 rounded-lg border border-emerald-100 bg-emerald-50/70 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-semibold text-slate-800 truncate">{service.name}</p>
                      <p className="text-xs text-slate-500">{service.phone}</p>
                    </div>
                    <a
                      href={`tel:${service.phone}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t.callNow}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={newContact.name}
              onChange={(event) => setNewContact(prev => ({ ...prev, name: event.target.value }))}
              placeholder={t.contactName}
              className="md:col-span-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
            />
            <input
              type="tel"
              value={newContact.phone}
              onChange={(event) => setNewContact(prev => ({ ...prev, phone: event.target.value }))}
              placeholder={t.contactPhone}
              inputMode="tel"
              autoComplete="tel"
              maxLength={16}
              pattern="^\\+?[0-9]{10,15}$"
              className="md:col-span-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
            />
            <input
              type="text"
              value={newContact.relation}
              onChange={(event) => setNewContact(prev => ({ ...prev, relation: event.target.value }))}
              placeholder={t.contactRelation}
              className="md:col-span-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
            />
            <button
              onClick={handleAddContact}
              className="md:col-span-1 inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addContact}</span>
            </button>

            <button
              onClick={handleShareEmergencySms}
              disabled={sharingSms || contacts.length === 0}
              className="md:col-span-4 inline-flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
            >
              <Siren className="w-4 h-4" />
              <span>{sharingSms ? t.gettingLocation : t.sendSosSms}</span>
            </button>
            <p className="md:col-span-4 text-[11px] md:text-xs text-slate-500 text-center">{t.sendSosSmsDescription}</p>
          </div>

          <div className="divide-y divide-slate-100">
            {contacts.length === 0 ? (
              <div className="px-4 md:px-5 py-6 text-center text-slate-500 text-sm italic">{t.noContacts}</div>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="px-4 md:px-5 py-3.5 md:py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm md:text-base truncate">{contact.name}</p>
                    <div className="text-xs md:text-sm text-slate-500 flex items-center gap-2">
                      <span className="truncate">{contact.phone}</span>
                      {contact.relation && (
                        <>
                          <span>•</span>
                          <span className="truncate">{contact.relation}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs md:text-sm font-semibold border border-emerald-100"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t.callNow}</span>
                    </a>
                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs md:text-sm font-semibold border border-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.remove}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
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
