import { useState } from "react";
import { Language } from "@/types";
import { languages } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

export const LanguageSelector = ({
  selectedLanguage,
  onLanguageChange,
  className,
}: LanguageSelectorProps) => {
  return (
    <div className={className} style={{ zIndex: 9999, position: "relative" }}>
      <Select
        value={selectedLanguage}
        onValueChange={(value: Language) => onLanguageChange(value)}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <SelectValue placeholder="Select Language" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{name}</span>
                <span className="text-xs text-muted-foreground">
                  ({code.toUpperCase()})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSwitcher = ({
  currentLanguage,
  onLanguageChange,
}: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{languages[currentLanguage]}</span>
        <span className="sm:hidden">{currentLanguage.toUpperCase()}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border z-[9999] max-h-60 overflow-y-auto shadow-2xl border-2">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                  currentLanguage === code ? "bg-gray-100 font-medium" : ""
                }`}
                onClick={() => {
                  onLanguageChange(code as Language);
                  setIsOpen(false);
                }}
              >
                <span>{name}</span>
                <span className="text-xs text-gray-500">
                  {code.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
