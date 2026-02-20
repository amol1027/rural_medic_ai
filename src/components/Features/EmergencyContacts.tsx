import { useEffect, useState } from 'react';
import { AlertTriangle, Languages, Phone, Plus, Siren, Trash2, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type Language = 'en' | 'hi' | 'mr';

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

const LANGUAGES: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी'
};

const UI_TRANSLATIONS = {
  en: {
    title: 'Emergency Contacts',
    subtitle: 'Save personal contacts and quickly reach official emergency numbers.',
    noticeTitle: 'Emergency Notice',
    noticeDescription: 'For severe emergencies, call official services immediately.',
    language: 'Language / भाषा / भाषा',
    selectLanguage: 'Select response language',
    officialContacts: 'Official Emergency Numbers',
    contactName: 'Name',
    contactPhone: 'Phone Number',
    contactRelation: 'Relation (optional)',
    addContact: 'Add Contact',
    noContacts: 'No contacts added yet.',
    callNow: 'Call Now',
    remove: 'Remove',
    contactValidation: 'Please enter both name and phone number.',
    invalidPhoneValidation: 'Please enter a valid phone number (10-15 digits, optional +country code).',
    sendSosSms: 'Send SOS SMS',
    sendSosSmsDescription: 'Send “need help + location” to all saved contacts',
    gettingLocation: 'Getting location...',
    noContactsForSms: 'Please add at least one contact first.'
  },
  hi: {
    title: 'आपातकालीन संपर्क',
    subtitle: 'व्यक्तिगत संपर्क सेव करें और आधिकारिक आपात नंबर तुरंत उपयोग करें।',
    noticeTitle: 'आपातकालीन सूचना',
    noticeDescription: 'गंभीर आपात स्थिति में तुरंत आधिकारिक सेवाओं को कॉल करें।',
    language: 'Language / भाषा / भाषा',
    selectLanguage: 'प्रतिक्रिया भाषा चुनें',
    officialContacts: 'आधिकारिक आपातकालीन नंबर',
    contactName: 'नाम',
    contactPhone: 'फ़ोन नंबर',
    contactRelation: 'रिश्ता (वैकल्पिक)',
    addContact: 'संपर्क जोड़ें',
    noContacts: 'अभी तक कोई संपर्क नहीं जोड़ा गया है।',
    callNow: 'अभी कॉल करें',
    remove: 'हटाएं',
    contactValidation: 'कृपया नाम और फ़ोन नंबर दोनों दर्ज करें।',
    invalidPhoneValidation: 'कृपया सही फ़ोन नंबर दर्ज करें (10-15 अंक, +देश कोड वैकल्पिक)।',
    sendSosSms: 'एसओएस SMS भेजें',
    sendSosSmsDescription: 'सभी सेव किए गए संपर्कों को “मदद चाहिए + लोकेशन” भेजें',
    gettingLocation: 'लोकेशन प्राप्त की जा रही है...',
    noContactsForSms: 'कृपया पहले कम से कम एक संपर्क जोड़ें।'
  },
  mr: {
    title: 'आपत्कालीन संपर्क',
    subtitle: 'वैयक्तिक संपर्क जतन करा आणि अधिकृत आपत्कालीन क्रमांक त्वरित वापरा.',
    noticeTitle: 'आपत्कालीन सूचना',
    noticeDescription: 'गंभीर आपत्कालीन स्थितीत त्वरित अधिकृत सेवांना कॉल करा.',
    language: 'Language / भाषा / भाषा',
    selectLanguage: 'प्रतिसाद भाषा निवडा',
    officialContacts: 'अधिकृत आपत्कालीन क्रमांक',
    contactName: 'नाव',
    contactPhone: 'फोन नंबर',
    contactRelation: 'नाते (ऐच्छिक)',
    addContact: 'संपर्क जोडा',
    noContacts: 'अजून कोणताही संपर्क जोडलेला नाही.',
    callNow: 'आता कॉल करा',
    remove: 'काढा',
    contactValidation: 'कृपया नाव आणि फोन नंबर दोन्ही भरा.',
    invalidPhoneValidation: 'कृपया वैध फोन नंबर भरा (10-15 अंक, +देश कोड ऐच्छिक).',
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

export default function EmergencyContacts() {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [sharingSms, setSharingSms] = useState(false);

  const contactsStorageKey = user ? `rural_medic_emergency_contacts_${user.id}` : 'rural_medic_emergency_contacts_guest';
  const t = UI_TRANSLATIONS[language];

  useEffect(() => {
    try {
      const storedContacts = localStorage.getItem(contactsStorageKey);
      if (!storedContacts) {
        setContacts([]);
      } else {
        const parsedContacts = JSON.parse(storedContacts);
        setContacts(Array.isArray(parsedContacts) ? parsedContacts : []);
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

    setContacts((prev) => [
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
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
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
      .map((contact) => contact.phone.trim())
      .filter((phone) => phone.length > 0)
      .join(',');

    const sosMessage = `Emergency: I need help. My location: ${locationText}${mapsLink ? ` (${mapsLink})` : ''}`;
    window.location.href = `sms:${recipients}?body=${encodeURIComponent(sosMessage)}`;

    setSharingSms(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-red-50/20 overflow-y-auto">
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-4 md:pb-6 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 md:p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl md:rounded-2xl text-white mb-4 md:mb-6 shadow-lg shadow-emerald-500/30 animate-fade-in">
          <Users className="w-6 md:w-8 h-6 md:h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 md:mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>{t.title}</h1>
        <p className="text-slate-500 text-sm md:text-lg animate-fade-in" style={{ animationDelay: '0.15s' }}>{t.subtitle}</p>
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
            <h3 className="text-xs md:text-sm font-bold text-red-800 uppercase tracking-wide mb-0.5">{t.noticeTitle}</h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{t.noticeDescription}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-4 md:pb-6 w-full animate-fade-in" style={{ animationDelay: '0.22s' }}>
        <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 md:px-5 py-3 md:py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 md:p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <Siren className="w-4 md:w-5 h-4 md:h-5" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-slate-800">{t.officialContacts}</h3>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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

          <div className="p-4 md:p-5 border-b border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-2.5 md:gap-3">
            <input
              type="text"
              value={newContact.name}
              onChange={(event) => setNewContact((prev) => ({ ...prev, name: event.target.value }))}
              placeholder={t.contactName}
              className="md:col-span-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
            />
            <input
              type="tel"
              value={newContact.phone}
              onChange={(event) => setNewContact((prev) => ({ ...prev, phone: event.target.value }))}
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
              onChange={(event) => setNewContact((prev) => ({ ...prev, relation: event.target.value }))}
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
    </div>
  );
}
