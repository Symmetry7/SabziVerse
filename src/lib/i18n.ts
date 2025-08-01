import { Language } from "@/types";

export const languages: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  bn: "বাংলা",
  ta: "தமிழ்",
  te: "తెలుగు",
  mr: "मराठी",
  gu: "ગુજરાતી",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  or: "ଓଡ଼ିଆ",
  pa: "ਪੰਜਾਬੀ",
  as: "অসমীয়া",
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    "app.name": "SabziVerse",
    "app.tagline": "Connecting Farmers & Sellers Directly",
    "select.language": "Select Language",
    continue: "Continue",
    back: "Back",
    next: "Next",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    yes: "Yes",
    no: "No",

    // User Type Selection
    "user.type.title": "Welcome to SabziVerse",
    "user.type.subtitle": "Choose your role to get started",
    "user.type.farmer": "I am a Farmer",
    "user.type.farmer.desc": "Sell your crops directly to buyers",
    "user.type.seller": "I am a Seller/Buyer",
    "user.type.seller.desc": "Buy fresh crops directly from farmers",

    // Farmer Registration
    "farmer.signup.title": "Create Farmer Account",
    "farmer.signup.subtitle": "Join thousands of farmers selling directly",
    "farmer.name": "Full Name",
    "farmer.village": "Village/Town",
    "farmer.phone": "Phone Number",
    "farmer.language": "Preferred Language",
    "farmer.signup.submit": "Create Account",

    // Farmer Dashboard
    "farmer.dashboard.title": "Farmer Dashboard",
    "farmer.dashboard.welcome": "Welcome back,",
    "farmer.dashboard.add.crop": "Add New Crop",
    "farmer.dashboard.my.crops": "My Crops",
    "farmer.dashboard.explore": "Explore Other Crops",
    "farmer.dashboard.messages": "Messages",

    // Crop Upload
    "crop.upload.title": "Add New Crop",
    "crop.type": "Crop Type",
    "crop.variety": "Variety (Optional)",
    "crop.quantity": "Quantity",
    "crop.unit": "Unit",
    "crop.price": "Price per Unit (₹)",
    "crop.quality": "Quality Grade",
    "crop.description": "Description",
    "crop.harvest.date": "Harvest Date",
    "crop.available.from": "Available From",
    "crop.available.until": "Available Until",
    "crop.organic": "Organic",
    "crop.images": "Upload Images",
    "crop.upload.submit": "List Crop",

    // Quality Grades
    "quality.premium": "Premium",
    "quality.good": "Good",
    "quality.standard": "Standard",

    // Seller Dashboard
    "seller.dashboard.title": "Seller Dashboard",
    "seller.browse.crops": "Browse Crops",
    "seller.filter.crops": "Filter Crops",
    "seller.my.orders": "My Orders",
    "seller.messages": "Messages",

    // Crop Browsing
    "browse.crops.title": "Browse Crops",
    "browse.no.crops": "No crops found matching your criteria",
    "browse.filter.by": "Filter by",
    "browse.sort.by": "Sort by",
    "browse.price.range": "Price Range",
    "browse.region": "Region",
    "browse.organic.only": "Organic Only",

    // Contact & Chat
    "contact.farmer": "Contact Farmer",
    "chat.with.farmer": "Chat with Farmer",
    "send.message": "Send Message",
    "type.message": "Type your message...",

    // Profile
    "profile.title": "Profile",
    "profile.edit": "Edit Profile",
    "profile.logout": "Logout",

    // Messages
    "messages.title": "Messages",
    "messages.no.conversations": "No conversations yet",
    "messages.start.conversation": "Start a conversation by contacting farmers",

    // Error Messages
    "error.required": "This field is required",
    "error.phone.invalid": "Please enter a valid phone number",
    "error.price.invalid": "Please enter a valid price",
    "error.quantity.invalid": "Please enter a valid quantity",
    "error.date.invalid": "Please select a valid date",

    // Success Messages
    "success.account.created": "Account created successfully!",
    "success.crop.added": "Crop added successfully!",
    "success.crop.updated": "Crop updated successfully!",
    "success.message.sent": "Message sent successfully!",
  },
  hi: {
    // Common
    "app.name": "सब्ज़ीवर्स",
    "app.tagline": "किसानों और विक्रेताओं को सीधे जोड़ना",
    "select.language": "भाषा चुनें",
    continue: "आगे बढ़ें",
    back: "वापस",
    next: "अगला",
    submit: "जमा करें",
    cancel: "रद्द करें",
    save: "सहेजें",
    edit: "संपादित करें",
    delete: "हटाएं",
    view: "देखें",
    search: "खोजें",
    filter: "फिल्टर",
    clear: "साफ़ करें",
    yes: "हाँ",
    no: "नहीं",

    // User Type Selection
    "user.type.title": "सब्ज़ीवर्स में आपका स्वागत है",
    "user.type.subtitle": "शुरू करने के लिए अपनी भूमिका चुनें",
    "user.type.farmer": "मैं एक किसान हूँ",
    "user.type.farmer.desc": "अपनी फसल सीधे खरीदारों को बेचें",
    "user.type.seller": "मैं एक विक्रेता/खरीदार हूँ",
    "user.type.seller.desc": "किसानों से सीधे ताज़ी फसल खरीदें",

    // Farmer Registration
    "farmer.signup.title": "किसान खाता बनाएं",
    "farmer.signup.subtitle":
      "हजारों किसानों के साथ जुड़ें जो सीधे बेच रहे हैं",
    "farmer.name": "पूरा नाम",
    "farmer.village": "गांव/शहर",
    "farmer.phone": "फोन नंबर",
    "farmer.language": "पसंदीदा भाषा",
    "farmer.signup.submit": "खाता बनाएं",

    // Farmer Dashboard
    "farmer.dashboard.title": "किसान डैशबोर्ड",
    "farmer.dashboard.welcome": "वापस आपका स्वागत है,",
    "farmer.dashboard.add.crop": "नई फसल जोड़ें",
    "farmer.dashboard.my.crops": "मेरी फसलें",
    "farmer.dashboard.explore": "अन्य फसलें देखें",
    "farmer.dashboard.messages": "संदेश",

    // Crop Upload
    "crop.upload.title": "नई फसल जोड़ें",
    "crop.type": "फसल का प्रकार",
    "crop.variety": "किस्म (वैकल्पिक)",
    "crop.quantity": "मात्रा",
    "crop.unit": "इकाई",
    "crop.price": "प्रति इकाई कीमत (₹)",
    "crop.quality": "गुणवत्ता ग्रेड",
    "crop.description": "विवरण",
    "crop.harvest.date": "कटाई की तारीख",
    "crop.available.from": "उपलब्ध से",
    "crop.available.until": "उपलब्ध तक",
    "crop.organic": "जैविक",
    "crop.images": "तस्वीरें अपलोड करें",
    "crop.upload.submit": "फसल सूची बनाएं",

    // Quality Grades
    "quality.premium": "प्रीमियम",
    "quality.good": "अच��छा",
    "quality.standard": "मानक",

    // Other languages would have similar translations...
    // For brevity, I'm including Hindi as an example
  },
  // Other languages would be added similarly
  bn: {
    "app.name": "��বজিভার্স",
    "user.type.title": "সবজিভার্সে স্বাগতম",
    // ... other Bengali translations
  },
  ta: {
    "app.name": "சப்ஸிவர்ஸ்",
    "user.type.title": "சப்ஸிவர்ஸ்-க்கு வரவேற்கிறோம்",
    // ... other Tamil translations
  },
  te: {
    "app.name": "సబ్జీవర్స్",
    "user.type.title": "సబ్జీవర్స్‌కు స్వాగతం",
    // ... other Telugu translations
  },
  mr: {
    "app.name": "सब्जीव्हर्स",
    "user.type.title": "सब्जीव्हर्स मध्ये आपले स्वागत",
    // ... other Marathi translations
  },
  gu: {
    "app.name": "સબ્જીવર્સ",
    "user.type.title": "સબ્જીવર્સમાં આપનું સ્વાગત છે",
    // ... other Gujarati translations
  },
  kn: {
    "app.name": "ಸಬ್ಜಿವರ್ಸ್",
    "user.type.title": "ಸಬ್ಜಿವರ್ಸ್‌ಗೆ ಸ್ವಾಗತ",
    // ... other Kannada translations
  },
  ml: {
    "app.name": "സബ്ജിവേഴ്സ്",
    "user.type.title": "സബ്ജിവേഴ്സിലേക്ക് സ്വാഗതം",
    // ... other Malayalam translations
  },
  or: {
    "app.name": "ସବଜିଭର୍ସ",
    "user.type.title": "ସବଜିଭର୍ସକୁ ସ୍ୱାଗତ",
    // ... other Odia translations
  },
  pa: {
    "app.name": "ਸਬਜ਼ੀਵਰਸ",
    "user.type.title": "ਸਬਜ਼ੀਵਰਸ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
    // ... other Punjabi translations
  },
  as: {
    "app.name": "চবজিভাৰ্ছ",
    "user.type.title": "চবজিভাৰ্ছলৈ আপোনাক স্বাগতম",
    // ... other Assamese translations
  },
};

export const useTranslation = (language: Language) => {
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return { t };
};

export const cropTypes: Record<Language, Record<string, string>> = {
  en: {
    wheat: "Wheat",
    rice: "Rice",
    sugarcane: "Sugarcane",
    cotton: "Cotton",
    maize: "Maize",
    barley: "Barley",
    bajra: "Bajra",
    jowar: "Jowar",
    potato: "Potato",
    onion: "Onion",
    tomato: "Tomato",
    cabbage: "Cabbage",
    cauliflower: "Cauliflower",
    carrot: "Carrot",
    peas: "Peas",
    mango: "Mango",
    banana: "Banana",
    apple: "Apple",
    grapes: "Grapes",
    orange: "Orange",
    pomegranate: "Pomegranate",
    turmeric: "Turmeric",
    coriander: "Coriander",
    cumin: "Cumin",
    fenugreek: "Fenugreek",
    mustard: "Mustard",
  },
  hi: {
    wheat: "गेहूं",
    rice: "चावल",
    sugarcane: "गन्ना",
    cotton: "कपास",
    maize: "मक्का",
    barley: "जौ",
    bajra: "बाजरा",
    jowar: "ज्वार",
    potato: "आलू",
    onion: "प्याज",
    tomato: "टमाटर",
    cabbage: "पत्ता गोभी",
    cauliflower: "फूल गोभी",
    carrot: "गाजर",
    peas: "मटर",
    mango: "आम",
    banana: "केला",
    apple: "सेब",
    grapes: "अंगूर",
    orange: "संतरा",
    pomegranate: "अनार",
    turmeric: "हल्दी",
    coriander: "धनिया",
    cumin: "जीरा",
    fenugreek: "मेथी",
    mustard: "सरसों",
  },
  // Other languages would have similar crop type translations
  bn: {},
  ta: {},
  te: {},
  mr: {},
  gu: {},
  kn: {},
  ml: {},
  or: {},
  pa: {},
  as: {},
};
