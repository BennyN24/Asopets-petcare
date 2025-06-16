# VetBB - Pet Care Management System

## Overview

VetBB is a comprehensive pet care management application built as a full-stack web application with a mobile-first design. The system allows pet owners to manage their pets' medical records, track vaccinations, schedule reminders, and maintain complete health histories. The application uses modern web technologies with a focus on simplicity and user experience.

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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```