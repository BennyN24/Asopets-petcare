# ASOPETS - Pet Care Management System

## Overview
ASOPETS is a comprehensive, mobile-first pet care management application. It allows pet owners to manage medical records, track vaccinations, schedule reminders, and maintain complete health histories for their pets. The project aims to provide a simple, user-friendly experience using modern web technologies. Key capabilities include authentication, detailed pet profiles, comprehensive medical record tracking, and an automated reminder system. The business vision is to provide a robust solution for pet owners to efficiently manage their pets' health and well-being.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI**: Tailwind CSS with shadcn/ui, mobile-first responsive design
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API**: RESTful API
- **Authentication**: Replit Auth (OIDC), session-based with PostgreSQL storage
- **File Structure**: Monorepo with shared client/server schemas

### Database
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon Database serverless PostgreSQL
- **Data Modeling**: Relational with foreign key relationships

### Key Features & Design Decisions
- **Authentication**: Secure OIDC integration, session management, user profile sync.
- **Pet Management**: Pet registration (various categories), detailed profiles, breed/microchip tracking.
- **Medical Records**: Comprehensive tracking (vaccinations, deworming, treatments, surgeries, checkups), vet/clinic info, cost tracking, photo documentation. New grooming record type added.
- **Reminder System**: Automated reminders, overdue tracking, SMS notification support (configurable).
- **Mobile-First Design**: Responsive, touch-friendly UI, bottom navigation, card-based layouts.
- **Data Flow**: Defined flows for authentication, pet management, medical records, and reminder processing.
- **UI/UX**: Consistent design system, integrated Google Maps for vet clinic finder with interactive mapping and Google Places API, unified QR code generation and scanning for pet profiles, integrated push notifications for reminders, and a comprehensive contact support system with attachment uploads. Enhanced user profile management with personal info, statistics, and notification preferences. The app has undergone a full rebranding to "ASOPETS". Biometric authentication (WebAuthn) and account deletion with cascading data removal are implemented for security.

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **react**: Frontend library
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **openid-client**: OIDC authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store
- **Google Maps API / Google Places API**: For vet clinic finder
- **SendGrid**: For email services (confirmation, password reset, contact support)
- **Sharp**: For image compression