import { useState } from "react";
import { Language } from "@/types";
import { languages } from "@/lib/i18n";
import { Globe, X, Check } from "lucide-react";

interface FloatingLanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const FloatingLanguageSelector = ({
  currentLanguage,
  onLanguageChange,
}: FloatingLanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center min-h-[48px] min-w-[48px]"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
        }}
      >
        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:rotate-12" />

        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 animate-ping"></div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {languages[currentLanguage]}
            <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </button>

      {/* Language Selection Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            style={{ zIndex: 9998 }}
          />

          {/* Modal */}
          <div
            className="fixed bottom-16 right-4 sm:bottom-24 sm:right-6 z-[9999] w-72 sm:w-80 max-h-80 sm:max-h-96 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100"
            style={{
              zIndex: 9999,
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <h3 className="text-white font-semibold text-base sm:text-lg">
                    Select Language
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors duration-200 min-h-[44px] min-w-[44px]"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white opacity-5 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white opacity-10 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>
            </div>

            {/* Language List */}
            <div className="max-h-64 sm:max-h-80 overflow-y-auto">
              <div className="p-2">
                {Object.entries(languages).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageSelect(code as Language)}
                    className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 group min-h-[56px] ${
                      currentLanguage === code
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold transition-colors duration-200 ${
                          currentLanguage === code
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white"
                        }`}
                      >
                        {name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-medium text-sm sm:text-base ${
                            currentLanguage === code
                              ? "text-blue-800"
                              : "text-gray-900"
                          }`}
                        >
                          {name}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">
                          {code}
                        </p>
                      </div>
                    </div>

                    {currentLanguage === code && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-3 sm:p-4 bg-gray-50">
              <p className="text-xs text-gray-600 text-center">
                🌍 SabziVerse supports 12 Indian languages
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingLanguageSelector;
