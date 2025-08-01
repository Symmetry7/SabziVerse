import { Heart, Leaf, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 via-emerald-700 to-teal-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">SabziVerse</h3>
                <p className="text-green-200">
                  Connecting Farmers & Sellers Directly
                </p>
              </div>
            </div>
            <p className="text-green-100 mb-4 leading-relaxed">
              Empowering farmers across India by providing a direct platform to
              connect with buyers, eliminating middlemen and ensuring fair
              prices for quality produce.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-green-100">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/farmer/signup"
                  className="hover:text-white transition-colors"
                >
                  Farmer Signup
                </a>
              </li>
              <li>
                <a
                  href="/seller/signup"
                  className="hover:text-white transition-colors"
                >
                  Buyer Signup
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-green-100">
              <li>
                <a href="/help" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="border-t border-green-600 mt-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-sm text-green-200">Active Farmers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-green-200">Registered Buyers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">25+</div>
              <div className="text-sm text-green-200">Crop Varieties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-sm text-green-200">Languages</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-green-200 text-sm mb-4 md:mb-0">
            © 2024 SabziVerse. All rights reserved.
          </div>

          {/* Made with Love */}
          <div className="flex items-center gap-2 text-green-200 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 animate-pulse" />
            <span>by</span>
            <span className="font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Symmetry
            </span>
          </div>
        </div>

        {/* Language Support */}
        <div className="mt-4 text-center">
          <p className="text-xs text-green-300">
            Available in 12 Indian languages: English, हिंदी, বাংলা, தமிழ்,
            తెలుగు, मराठी, ગુજરાતી, ಕನ್ನಡ, മലയാളം, ଓଡ଼ିଆ, ਪੰਜਾਬੀ, অসমীয়া
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
