# SabziVerse - Direct Farmer-Seller Connection Platform

SabziVerse is a revolutionary web application that connects farmers directly with sellers across India, eliminating middlemen and ensuring fair pricing for farmers. Built with modern web technologies, it provides a seamless platform for agricultural commerce in multiple Indian languages.

## 🌱 Features

### For Farmers

- **Easy Registration**: Simple signup with name, village, phone, and preferred language
- **Crop Listing**: Upload crop details including quantity, quality, price, and images
- **Direct Communication**: Chat directly with potential buyers
- **Market Insights**: Explore what other farmers are selling across India
- **Fair Pricing**: Set your own prices without middleman interference
- **Multi-language Support**: Available in 12 Indian languages

### For Sellers/Buyers

- **Comprehensive Search**: Find crops by type, location, price, and quality
- **Advanced Filtering**: Filter by organic, price range, region, and availability
- **Direct Contact**: Connect directly with farmers for negotiations
- **Real-time Updates**: Get latest crop listings from farmers nationwide
- **Quality Assurance**: View crop grades and farmer profiles

## 🚀 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router 6
- **Styling**: TailwindCSS 3 with utility-first approach
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: Local storage with custom services
- **Build Tool**: Vite for fast development and building
- **Icons**: Lucide React for consistent iconography

## 🗂️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, cards, etc.)
│   ├── LanguageSelector.tsx
│   └── CropCard.tsx
├── pages/               # Route components
│   ├── farmer/          # Farmer-specific pages
│   │   ├── FarmerSignup.tsx
│   │   ├── FarmerDashboard.tsx
│   │   ├── CropUpload.tsx
│   │   ├── ExploreCrops.tsx
│   │   └── Messages.tsx
│   ├── seller/          # Seller-specific pages
│   │   └── SellerDashboard.tsx
│   ├── UserTypeSelection.tsx
│   ├── Index.tsx
│   └── NotFound.tsx
├── lib/                 # Utility functions and services
│   ├── auth.ts          # Authentication service
│   ├── storage.ts       # Data storage service
│   ├── i18n.ts          # Internationalization
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
│   └── index.ts
└── hooks/               # Custom React hooks
```

## 🌍 Supported Languages

- English (en)
- Hindi (hi) - हिंदी
- Bengali (bn) - বাংলা
- Tamil (ta) - தமிழ்
- Telugu (te) - తెలుగు
- Marathi (mr) - मराठी
- Gujarati (gu) - ગુજરાતી
- Kannada (kn) - ಕನ್ನಡ
- Malayalam (ml) - മലയാളം
- Odia (or) - ଓଡ଼ିଆ
- Punjabi (pa) - ਪੰਜਾਬੀ
- Assamese (as) - অসমীয়া

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd sabziverse
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run format.fix` - Format code with Prettier

## 📱 User Flows

### Farmer Journey

1. **Landing Page**: Choose "I am a Farmer"
2. **Registration**: Enter name, village, phone, and preferred language
3. **Dashboard**: View stats, manage crops, explore market
4. **Add Crops**: Upload crop details with photos and pricing
5. **Messages**: Communicate with interested buyers
6. **Explore**: See what other farmers are selling

### Seller/Buyer Journey

1. **Landing Page**: Choose "I am a Seller/Buyer"
2. **Browse Crops**: Explore available crops with filters
3. **Search & Filter**: Find specific crops by various criteria
4. **Contact Farmers**: Send direct messages to farmers
5. **Negotiate**: Discuss pricing and delivery terms

## 🔧 Key Features Implementation

### Authentication System

- Simple local storage-based authentication
- User session management
- Role-based access (farmer/seller)

### Data Storage

- Local storage for demo purposes
- Crops service for managing listings
- Messages service for chat functionality
- Sample data generation for demonstration

### Internationalization

- Translation system supporting 12 languages
- Dynamic language switching
- Crop type translations in local languages

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces

## 🎨 Design Principles

### User Experience

- Clean, intuitive interface
- Accessibility-first components
- Fast loading times
- Smooth animations and transitions

### Visual Design

- Green theme representing agriculture
- Consistent color palette
- Modern typography
- Professional card-based layouts

### Accessibility

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility

## 🔄 Data Flow

### Farmer Data Flow

```
Registration → Profile Creation → Crop Upload → Listing Display → Buyer Contact → Message Exchange
```

### Seller Data Flow

```
Browse Crops → Filter/Search → View Details → Contact Farmer → Negotiate → Purchase
```

## 🔒 Security Considerations

- Input validation on all forms
- Phone number format validation
- XSS prevention through proper data handling
- CSRF protection through form validation

## 🌟 Future Enhancements

### Phase 2 Features

- Real-time chat with WebSocket
- Image upload and cloud storage
- Payment integration
- GPS-based location services
- Push notifications

### Phase 3 Features

- Machine learning for price predictions
- Weather integration
- Logistics and delivery tracking
- Review and rating system
- Mobile app development

## 🤝 Contributing

We welcome contributions to SabziVerse! Please read our contributing guidelines and follow the established code style.

### Development Guidelines

- Use TypeScript for type safety
- Follow the existing component structure
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Farmers across India who inspired this platform
- Open source community for the amazing tools and libraries
- Radix UI for accessible component primitives
- TailwindCSS for the utility-first styling approach

## 📞 Support

For support, please contact us at support@sabziverse.com or create an issue in the repository.

---

**SabziVerse** - Empowering farmers, connecting communities, eliminating middlemen. 🌱
