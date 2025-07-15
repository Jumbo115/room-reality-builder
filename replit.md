# SpaceDesign Application

## Overview

SpaceDesign is a modern full-stack web application built for an AI-powered furniture discovery platform. The application features a sophisticated React frontend with a Node.js Express backend, designed to showcase furniture using AI curation, 3D visualization, and augmented reality technology.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Library**: Shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with a custom design system featuring luxury tech aesthetics
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: React Router for client-side navigation
- **Build Tool**: Vite with development optimizations and Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Prepared for PostgreSQL-based sessions with connect-pg-simple
- **API Structure**: RESTful API design with `/api` prefix

### Development Environment
- **Monorepo Structure**: Single repository containing both client and server code
- **Shared Code**: Common schemas and types in the `/shared` directory
- **Development Server**: Vite dev server with HMR and Express backend proxy
- **Build Process**: Separate builds for frontend (Vite) and backend (esbuild)

## Key Components

### Database Schema
- **Users Table**: Basic user authentication with username and password
- **ORM**: Drizzle ORM with Zod schema validation
- **Migrations**: Managed through Drizzle Kit with PostgreSQL dialect

### UI Component System
- **Design System**: Custom color palette with HSL variables for dark theme
- **Component Library**: Comprehensive Shadcn/ui components including buttons, cards, forms, navigation
- **Styling Approach**: Utility-first with custom CSS variables and gradient definitions
- **Responsive Design**: Mobile-first approach with custom breakpoints

### Authentication & Storage
- **Storage Interface**: Abstracted storage layer with PostgreSQL database implementation
- **Database**: Live PostgreSQL database using Neon serverless with Drizzle ORM
- **User Management**: Full CRUD operations for user entities with database persistence
- **Session Handling**: Infrastructure in place for PostgreSQL-based sessions

## Data Flow

1. **Client Requests**: React frontend makes API calls to Express backend
2. **API Processing**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Handling**: TanStack Query manages caching and state synchronization
5. **UI Updates**: React components update based on query results

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Forms**: React Hook Form with Hookform Resolvers
- **Icons**: Lucide React icon library
- **Utilities**: clsx for conditional styling, date-fns for date manipulation

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build Tools**: Vite for frontend, esbuild for backend
- **TypeScript**: Full type coverage across the application
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Environment**: Production mode uses built assets with Express static serving

### Development Mode
- **Hot Reload**: Vite dev server with HMR for frontend changes
- **Backend Restart**: tsx for automatic TypeScript compilation and restart
- **Database**: Live connection to Neon PostgreSQL instance

### Configuration
- **Environment Variables**: DATABASE_URL for PostgreSQL connection (configured and active)
- **Path Aliases**: Configured for clean imports across client, server, and shared code
- **Asset Handling**: Vite handles static assets with proper bundling and optimization

## Recent Changes
- **January 15, 2025**: Successfully migrated from Lovable to Replit environment
  - Replaced React Router with Wouter routing system for Replit compatibility
  - Integrated PostgreSQL database with Neon serverless provider
  - Replaced MemStorage with DatabaseStorage for persistent data
  - Added custom CSS animations and styling for luxury tech aesthetic
  - Established TanStack Query client for API state management
  - All dependencies resolved and application fully functional

The application is structured to scale with additional features like AI-powered recommendations, 3D model integration, and AR visualization capabilities while maintaining clean separation of concerns and type safety throughout the stack.