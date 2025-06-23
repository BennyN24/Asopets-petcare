# ASOPETS - Pet Care Management System

## Overview

ASOPETS is a comprehensive pet care management application built as a full-stack web application with a mobile-first design. The system allows pet owners to manage their pets' medical records, track vaccinations, schedule reminders, and maintain complete health histories. The application uses modern web technologies with a focus on simplicity and user experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Design System**: Mobile-first responsive design with consistent component library

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Replit Auth integration with OIDC
- **File Structure**: Monorepo structure with shared schemas between client and server

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL
- **Data Modeling**: Relational data structure with proper foreign key relationships

## Key Components

### Authentication System
- Replit Auth integration using OpenID Connect (OIDC)
- Session-based authentication with PostgreSQL session storage
- User profile management with automatic user creation
- Secure session handling with HTTP-only cookies

### Pet Management
- Pet registration with category-based classification (dog, cat, bird, rabbit, other)
- Pet profile management with photos and detailed information
- Breed tracking and microchip ID storage
- Birthmark and physical characteristic documentation

### Medical Records System
- Comprehensive medical record tracking with multiple types:
  - Vaccinations with batch numbers and due dates
  - Deworming treatments
  - General treatments and medications
  - Surgical procedures
  - Regular checkups
- Veterinarian and clinic information storage
- Cost tracking for all medical procedures
- Photo documentation for medical records

### Reminder System
- Automated reminder creation for medical procedures
- Overdue reminder tracking
- SMS notification support (configurable)
- Reminder completion tracking

### Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface with intuitive navigation
- Bottom navigation for easy mobile access
- Card-based layout for better mobile readability

## Data Flow

### Authentication Flow
1. User accesses the application
2. If not authenticated, redirects to Replit Auth login
3. OIDC authentication flow with token exchange
4. Session creation and user profile synchronization
5. Redirect to dashboard with authenticated session

### Pet Management Flow
1. User creates pet profile with basic information
2. Pet data validation using Zod schemas
3. Database storage with user association
4. Real-time UI updates via React Query cache invalidation

### Medical Records Flow
1. User selects pet and medical record type
2. Form validation with type-specific fields
3. Optional reminder creation with configurable settings
4. Database storage with pet relationship
5. Automatic reminder scheduling for future dates

### Reminder Processing
1. System checks for due/overdue reminders
2. Reminder status calculation based on dates
3. Notification badge updates in real-time
4. User can mark reminders as completed

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **react**: Frontend library
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **react-hook-form**: Form state management
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Authentication Dependencies
- **openid-client**: OIDC authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- Replit development environment with hot reloading
- Vite dev server for frontend development
- TSX for TypeScript execution in development
- Automatic database migrations during development

### Production Build
- Vite production build for optimized client bundle
- ESBuild for server-side TypeScript compilation
- Static asset serving through Express
- Environment-based configuration management

### Database Management
- Drizzle migrations for schema changes
- Environment variable configuration for database connections
- Session table management for authentication state
- Automatic table creation for new deployments

### Hosting Configuration
- Replit hosting with autoscale deployment
- Port 5000 for development, port 80 for production
- Node.js 20 runtime environment
- PostgreSQL 16 database provisioning

## Changelog

```
Changelog:
- June 13, 2025. Initial setup with authentication, pet management, and basic medical records
- June 13, 2025. Enhanced with comprehensive features:
  * Health summary dashboard with scoring system
  * Medical timeline with detailed record management
  * Schedule page with reminder categorization and completion tracking
  * Expense tracking with budget monitoring and analytics
  * User profile with statistics and data export
  * Photo upload capability for medical records
  * Improved navigation with bottom tab system
  * Database error handling for date validation
- June 13, 2025. Major system optimization and feature enhancements:
  * Refactored medical record forms with photo upload repositioned below record type
  * Updated reminder settings to 1 day and 1 hour before due date
  * Implemented SMS OTP login system with secure authentication
  * Enhanced offline storage capabilities with automatic sync
  * Added comprehensive QR code generation for pet profiles and records
  * Optimized mobile-responsive design across all components
  * Fixed TypeScript errors and improved form validation
  * Created dual reminder system (1-day notification + 1-hour SMS)
- June 15, 2025. Enhanced medical records interactivity and deployment readiness:
  * Fixed medical history cards to be fully clickable with detailed view dialogs
  * Added comprehensive detailed record view with organized sections
  * Implemented click event handling with proper event propagation
  * Completed full deployment readiness scan with successful production build
  * Verified all core features and database integrity
  * Created cute pet medication reminder system with sound effects and animations
- June 15, 2025. Comprehensive schedule and expenses management enhancements:
  * Fixed schedule page to properly display completed reminders in dedicated tab
  * Enhanced expenses with advanced transaction history and filtering capabilities
  * Added CSV export functionality for expense reporting
  * Implemented comprehensive budget management with per-pet tracking
  * Created smart search and sorting for transaction history
  * Added visual spending alerts and budget progress indicators
  * Integrated advanced analytics with category and pet spending breakdowns
- June 15, 2025. Currency localization and medical records fixes:
  * Changed currency from USD to PHP (₱) throughout the application
  * Made total records count clickable in health summary to navigate to pet profile
  * Fixed medical history panel API query keys to properly fetch and display records
  * Updated all cost displays to show Philippine Peso symbol (₱)
- June 15, 2025. Comprehensive pet owner profile management system:
  * Implemented complete user profile editing with personal information, contact details, and emergency contacts
  * Added database schema updates for comprehensive user profile fields
  * Created comprehensive profile management interface with form validation and state management
  * Enhanced profile display with personal information, statistics, and financial summaries
  * Integrated notification preferences with toggle switches for email, SMS, push, and reminder settings
  * Added data export functionality and account management features
  * Updated all profile-related components to use PHP currency formatting
- June 15, 2025. Dedicated login page with dual authentication methods:
  * Created comprehensive login page with tabbed interface for email and SMS authentication
  * Integrated existing SMS OTP authentication system with new login flow
  * Enhanced user experience with clear authentication method selection
  * Added back navigation and improved visual design with gradient backgrounds
  * Updated routing to show dedicated login page instead of landing page for unauthenticated users
  * Maintained existing Replit Auth email authentication alongside SMS option
- June 15, 2025. Authentication system debugging and refactoring:
  * Fixed OpenID Connect configuration with comprehensive error handling
  * Added localhost domain support for development environment authentication
  * Implemented detailed debug logging for authentication flow troubleshooting
  * Enhanced callback handling with custom error processing and user feedback
  * Fixed TypeScript errors throughout the profile management system
  * Added fallback authentication routes to prevent server crashes
  * Improved session management with PostgreSQL storage optimization
- June 15, 2025. Production readiness optimization and security hardening:
  * Fixed session cookie security configuration for production deployment
  * Optimized authentication domain registration to exclude development domains in production
  * Disabled verbose debug logging in production for improved performance and security
  * Enhanced SMS OTP system with proper production/development mode handling
  * Updated client-side interfaces to remove development-specific messaging
  * Implemented environment-based configuration throughout the authentication system
  * Ready for production deployment with secure session management and optimized logging
- June 16, 2025. Comprehensive feature enhancements and user experience improvements:
  * Fixed budget settings editability in expenses page with proper dialog handling
  * Prevented notification dialog bouncing and repeating with hasPlayed state management
  * Merged QR code functionality into single comprehensive profile and medical records QR code
  * Added new grooming record type to medical records system with dedicated form and routes
  * Fixed schedules moving to completed panel when notifications marked as done
  * Removed all currency labels (₱) from interface for cleaner display
  * Enhanced photo upload functionality with mobile camera capture support
  * Updated all components to support grooming record type with proper icons and colors
  * Completed database schema migration for new grooming medical record type
- June 16, 2025. Major pet management system expansion with new categories and features:
  * Added new pet categories: horses and exotic animals alongside existing categories
  * Implemented pet age tracking system with age field in database and forms (tracked in months)
  * Created comprehensive pet editing functionality with PetEditForm component for all pet data
  * Built complete vet clinics feature with local clinic discovery and user rating system
  * Added vet clinic database tables with location-based search and distance calculations
  * Integrated clinic rating system allowing users to rate clinics after medical records
  * Enhanced pet profile page with edit functionality and vet clinic quick actions
  * Updated add pet form to include age input field and new pet categories
  * Populated database with sample veterinary clinics in Metro Manila area
  * Fixed QR code component TypeScript errors and unified QR generation system
  * Fixed critical pet editing bug by correcting API query to fetch single pet instead of array
  * Added "Vet Clinics Near you" quick action with automatic location-based search
  * Enhanced pet profile with new Vets tab for easy veterinary clinic access
  * Added weight field (kg) to vaccine form for tracking pet weight during vaccinations
  * Restored vaccination quick action while keeping "Find Clinics" feature for comprehensive medical actions
  * Fixed budget settings per pet save functionality with proper state management and confirmation toast
  * Enhanced photo upload on add pet page with camera capture and file upload functionality
  * Implemented proper image preview with remove option for better user experience
  * Added comprehensive photo upload functionality to all medical record forms with camera capture and file selection
  * Created Quick Actions component with modern UI design matching provided specifications
  * Implemented Find Vet Clinics modal overlay in dashboard with seamless user experience
  * Enhanced all medical record forms with professional photo upload interface and image preview
  * Removed duplicate Quick Actions section from dashboard for cleaner user interface
  * Fixed monthly budget per pet persistence using localStorage for proper saving and loading across sessions
  * Added comprehensive vet clinic review system displaying user reviews with ratings, names, comments, and dates
  * Fixed bouncing notifications to only bounce once when first appearing, preventing repetitive animation behavior
  * Fixed Schedule page data display issue by restoring active reminders and ensuring proper data flow from database to UI
  * Fixed completed reminders tab to properly display completed reminders with data integrity filtering for current user's pets
  * Removed bouncing animation from notifications and implemented native push notifications for mobile devices with pet emojis and urgency-based behavior
  * Removed Replit branding and authentication from login page, simplified to SMS-only authentication for cleaner user experience
  * Added comprehensive email/password authentication system with signup page, email confirmation, password hashing, and session management, removing SMS authentication for a unified experience
- June 19, 2025. Fixed critical routing and 404 page issues:
  * Identified and resolved race condition between authentication state and client-side routing
  * Enhanced authentication system with better state management and debugging capabilities
  * Restructured routing logic to properly handle authenticated vs unauthenticated states
  * Fixed pet profile and navigation pages showing 404 errors despite successful authentication
  * Improved useAuth hook with local state management to prevent routing flicker
  * Added comprehensive debugging for authentication flow and route matching
  * Ensured proper rendering of authenticated routes when user session is valid
- June 19, 2025. Enhanced UI and branding improvements:
  * Fixed JSX syntax error in photo-upload component preventing app startup
  * Fixed duplicate photo upload interface in profile editing with compact mode implementation
  * Added official ASOPETS logo to login and signup pages, replacing generic paw print icons
  * Created assets directory and integrated brand logo for consistent visual identity
  * Enhanced profile photo editing with small camera button overlay instead of large upload cards
- June 19, 2025. Enhanced medical records image functionality:
  * Increased image upload size limit from 2MB to 8MB for medical records
  * Implemented aggressive image compression (40-50% quality) for optimal database storage
  * Added image thumbnails to medical timeline with proper preview functionality
  * Integrated lightbox viewer for medical record images with zoom and navigation
  * Enhanced MedicalAttachmentViewer to support both new attachments array and legacy imageUrl
  * Added clickable image previews in both timeline view and detailed record dialogs
  * Server configured with 10MB payload limits to support large image uploads
  * Fixed duplicate veterinarian field in grooming forms by implementing conditional field rendering
  * Enhanced medical record form to use context-appropriate labels (Groomer Name vs Veterinarian/Clinic)
  * Temporarily removed SMS reminder option from medical record forms (to be implemented in future update)
  * Removed test scan button from QR scanner and implemented automatic detection
  * Added "Other Pets" section to dashboard for displaying scanned pet QR codes
  * Enhanced QR scanner to automatically detect and add pets to Other Pets list
  * Implemented persistence of scanned pet data in dashboard with view functionality
  * Fixed password reset token validation issue with improved debugging and error handling
  * Enhanced reset password page with better token detection and user feedback
  * Updated BASE_URL handling for development environment to use localhost properly
  * Fixed QR code scanner compatibility by aligning data format between generator and scanner
  * Changed QR data type from "pet_complete" to "pet_profile" for proper recognition
  * Enhanced QR scanner with detailed logging and better error messages for debugging
  * Updated QR code content to include essential pet data (ID, owner, basic info) for scanning
  * Created comprehensive notification dropdown system integrated with bell icon
  * Added NotificationDropdown component with active reminder display and quick actions
  * Moved MedicationReminderManager from global App to Dashboard with dropdown control
  * Enhanced dashboard with notification bell button showing reminder count badge
  * Fixed notification system to show reminders in proper dropdown when bell is clicked
  * Removed redundant reminder count display element from medication reminder manager
  * Enhanced QR scanner with better detection settings and improved error handling
  * Updated camera resolution settings for better QR code recognition
  * Added comprehensive logging to debug QR code scanning issues
  * Fixed QR scanner to properly detect generated pet profile QR codes
  * Enhanced QR generation with better error correction (Level H) and larger size for improved scanning
  * Added comprehensive debugging logs to QR scanner for better detection troubleshooting
  * Optimized camera resolution and scan interval for more reliable QR code recognition
  * Added petName alias in QR data for better compatibility between generator and scanner
- June 22, 2025. Google Maps integration for enhanced vet clinic finder:
  * Implemented comprehensive Google Maps integration with interactive mapping
  * Added Google Places API integration for discovering nearby veterinary clinics
  * Created GoogleMap component with real-time clinic markers and user location
  * Enhanced vet clinic finder with map/list view toggle functionality
  * Integrated turn-by-turn directions via Google Maps with direct navigation links
  * Added high-accuracy geolocation with fallback to Manila coordinates
  * Implemented clinic selection with detailed info cards and distance calculations
  * Enhanced user experience with interactive map markers and clinic information overlay
  * Added refresh button for location-based clinic updates with loading states
  * Implemented comprehensive map debugging panel with status indicators
  * Enhanced Google Maps loading with timeout handling and error recovery
  * Added fallback mechanisms and duplicate filtering for Google Places results
  * Integrated real-time network status monitoring and API key validation
- June 22, 2025. Enhanced medical records management with filtering and sorting:
  * Added comprehensive filtering system for medical records by type (vaccine, treatment, etc.)
  * Implemented multi-criteria sorting options (date, type, cost) with ascending/descending order
  * Created collapsible filter controls with visual indicators showing filtered vs total records
  * Enhanced user experience with smart result summaries and empty state handling
  * Added quick filter reset options and improved record type display formatting
  * Converted vet clinics from dialog to standalone mobile-responsive page
  * Enhanced vet clinics page with improved mobile layout and touch-friendly controls
  * Added proper navigation flow from pet profile to dedicated vet clinics page
  * Removed debug controls from vet clinics page for cleaner user interface
  * Fixed back navigation on vet clinics page to properly return to dashboard
  * Moved QR scanner from header to main dashboard grid beside Add Pet button
  * Enhanced QR code scanner with improved data normalization and persistent storage
  * Fixed scanned pet data persistence using localStorage for cross-session availability
  * Removed currency symbol from yearly expenses display for cleaner formatting
  * Added proper icons for Horse (horse emoji) and Exotic (lizard emoji) pet categories in Add Pet and Edit Pet forms
  * Made all pet category icons consistent by converting to emoji-based visual style across all categories
  * Added Upload QR Image button to QR scanner allowing users to upload and analyze QR code images alongside camera scanning
  * Moved Quick Actions below Other Pets section for better layout organization
  * Fixed Other Pets section data structure compatibility with ScannedPetViewer component
  * Added medical records display functionality to scanned pet viewer with recent records preview
  * Optimized QR scanner with enhanced data normalization, processing states, and error handling
  * Enhanced QR code generation with larger modules and higher error correction for better mobile scanning
  * Improved QR scanner performance with processing indicators and better image handling
  * Fixed date parsing errors in scanned pet viewer with proper null checks
  * Added pet owner information display in both scanned pet cards and viewer
  * Implemented delete functionality for scanned pets with localStorage management
  * Made scanned pet cards fully clickable instead of requiring separate view button
- June 18, 2025. Enhanced schedule management and comprehensive bug fixes:
  * Added advanced sorting and filtering to schedule page with type, pet, and date options
  * Fixed completed reminders to display completion dates with proper formatting
  * Implemented multi-photo upload system for medical records with up to 3 images per record
  * Fixed medical record form to use MultiPhotoUpload component instead of duplicated inputs
  * Enhanced vet clinic system with proper location services and fallback for Manila coordinates
  * Fixed all TypeScript errors in database queries and component interactions
  * Optimized reminder notification timing to show exactly 1 day before due dates
  * Added comprehensive filtering controls in schedule header with professional UI design
  * Removed Notes field from medical record forms for cleaner interface
  * Added profile photo upload functionality for user profiles with camera and gallery options
  * Fixed profile photo upload date validation error by filtering empty values in database updates
  * Moved schedule sort/filter controls above the Upcoming/Completed tabs for better UX
  * Fixed schedule filtering logic to properly filter reminders by type and pet
  * Fixed duplicate CardContent issue in photo-upload component with redundant click handlers
- June 16, 2025. Comprehensive pre-launch optimization and app store preparation:
  * Renamed application to "My PetBB" with updated branding throughout
- June 17, 2025. Complete application rebranding to ASOPETS:
  * Updated all branding from "My PetBB" to "ASOPETS" throughout application
  * Modified PWA manifest, HTML metadata, and app titles
  * Updated email templates for confirmation and password reset
  * Changed service worker cache names and all user-facing text
  * Updated Terms of Service and Privacy Policy documentation
  * Completed comprehensive rebrand across all components and files
  * Implemented PWA functionality with service worker, manifest, and app icons
  * Created comprehensive error boundaries and loading states for crash prevention
  * Added Privacy Policy and Terms of Service pages for app store compliance
  * Implemented offline indicator and network status monitoring
  * Created user onboarding flow with welcome screens and feature introduction
  * Enhanced authentication system with proper error handling and session management
  * Added comprehensive loading spinners and page loaders with branding
  * Implemented SEO optimization with meta tags and app description
  * Created detailed pre-launch optimization report with actionable recommendations
  * Prepared application for app store publishing with proper metadata and compliance pages
  * Completed SendGrid email integration with verified sender (support@asopets.com)
  * Fixed email authentication system with reliable delivery for confirmation and password reset
  * Added comprehensive error logging and monitoring for email system reliability
  * Successfully tested complete authentication flow including email verification and password reset
  * Added resend confirmation email feature to login page with user-friendly notification system
  * Fixed email confirmation link issues with proper URL encoding and token handling
  * Disabled SendGrid click tracking to prevent URL corruption in production emails
  * Enhanced email templates with improved styling and security messaging
  * Created comprehensive password reset page with React form and validation
  * Fixed offline data sync storage keys from old "vetbb" branding to "asopets"
  * Enhanced offline sync with proper authentication headers and credentials
  * Confirmed email confirmation and password reset systems working correctly
  * Updated all remaining "My PetBB" branding references to "ASOPETS" in loading screens and legal pages
  * Added show/hide password toggle with eye icons to login page for better UX
  * Fixed email link endpoints to ensure proper routing and functionality
  * Verified complete authentication flow: signup → email confirmation → password reset → login working perfectly
  * Fixed Entity Too Large error for mobile pet uploads by increasing server payload limits to 10MB
  * Enhanced photo upload with automatic compression (800x600 max, 70% quality) for mobile compatibility
  * Added QR code scanner feature to dashboard for exchanging pet profile data
  * Created comprehensive scanned pet viewer with owner contact information display
  * Implemented mobile-optimized QR scanning with camera access and demo functionality
  * Created dedicated email confirmation page with proper routing and user feedback
  * Fixed email confirmation links to route to React page instead of API endpoint
  * Optimized component performance with React.memo for PetCard, BottomNavigation, and LoadingSpinner
  * Replaced custom loading states with reusable PageLoader component across all pages
  * Fixed TypeScript errors and improved code organization with proper imports
  * Fixed mobile overflow issues with proper CSS overflow handling and mobile-safe containers
  * Enhanced profile page with inline editing capability - no more dialog modals
  * Added PWA installation button to login page with automatic detection and manual fallback
  * Improved mobile viewport handling and responsive design across all pages
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Future Feature Roadmap

```
- SMS reminder notifications for medical records (1 hour before due date)
- Enhanced notification system with SMS integration
- Advanced reminder customization options
```