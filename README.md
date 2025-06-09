# Turborepo starter using Next.js 15 with Sanity CMS, shadcn/ui and next-intl

This is a modern monorepo setup combining a **Sanity Studio** with a **Next.js 15 frontend**, featuring internationalization and shared configurations.

## Getting Started

### Step 1: Environment Setup

Copy the environment example files:

```bash
# For the web app
cp apps/web/.env.example apps/web/.env

# For the studio
cp apps/studio/.env.example apps/studio/.env
```

Set up your Sanity project variables in both environment files.

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Start Development

```bash
# Start all apps (studio + web)
pnpm dev

# Or start individually
pnpm dev --filter=studio    # Sanity Studio
pnpm dev --filter=web       # Next.js frontend
```

Your sites will be running on:
- **Studio**: [http://localhost:3333](http://localhost:3333)
- **Web**: [http://localhost:3000](http://localhost:3000)

## Architecture Overview

This is a **Turborepo monorepo** combining a **Sanity CMS Studio** with a **Next.js 15 frontend**:

- **apps/studio**: Sanity Studio v3 with multi-market/language support
- **apps/web**: Next.js 15 app with internationalization (next-intl)
- **packages/**: Shared packages for UI components, Sanity utilities, and React hooks
- **tooling/**: Shared ESLint, Prettier, Tailwind, and TypeScript configurations

### Key Features

#### Multi-Market System
The Studio dynamically creates workspaces based on markets and languages defined in Sanity:
- Each market gets its own workspace with filtered content
- Language-specific content with internationalization support
- Market assignment logic and workspace creation utilities

#### Internationalization
- **Studio**: Uses Sanity's internationalization plugin for multi-language content
- **Web**: Server-side i18n with next-intl, dynamic locale routing (`/da-DK`, `/de-DE`, etc.)
- Default locale is `en-GB` (removed from URL, so `localhost:3000` shows English)

#### Shared Package System
- **@repo/ui**: shadcn/ui-based component library
- **@repo/sanity**: Sanity client utilities and image handling  
- **@repo/hooks**: Shared React hooks across apps
- All packages use shared tooling configurations

### Project Structure

```text
apps
  ├─ studio
  │   ├─ Sanity Studio v3
  │   ├─ Multi-market workspaces
  │   └─ Internationalization plugin
  └─ web
      ├─ Next.js 15
      ├─ React 19
      ├─ next-intl i18n
      └─ Tailwind CSS
packages
  ├─ sanity
  │   └─ Sanity client utilities and image handling
  ├─ hooks
  │   └─ Shared React hooks
  └─ ui
      └─ shadcn/ui component library
tooling
  ├─ eslint
  │   └─ Shared ESLint configurations
  ├─ prettier
  │   └─ Shared Prettier configuration
  ├─ tailwind
  │   └─ Shared Tailwind configuration
  └─ typescript
      └─ Shared TypeScript configurations
```

## Available Commands

### Essential Development Commands
```bash
# Start development environment
pnpm dev                    # Start all apps (studio + web)
pnpm dev:web               # Start web app with dependencies only

# Build and type checking
pnpm build                 # Build all packages and apps
pnpm typecheck             # Type check all packages
pnpm sanity:type           # Generate Sanity schema types

# Code quality
pnpm lint                  # Lint all packages
pnpm lint:fix              # Fix linting issues
pnpm format:fix            # Fix formatting issues
```

### App-Specific Commands
```bash
# Studio (Sanity CMS)
pnpm dev --filter=studio          # Start Studio development
pnpm deploy --filter=studio       # Deploy Studio to Sanity

# Web (Next.js frontend)  
pnpm dev --filter=web             # Start Next.js development
pnpm codegen --filter=web         # Generate GraphQL types
```

## Technology Stack

- **Package Manager**: pnpm with workspaces
- **Framework**: Next.js 15 (App Router) + Sanity Studio v3
- **Styling**: Tailwind CSS with shadcn/ui components
- **TypeScript**: Comprehensive type safety with shared configurations
- **Internationalization**: next-intl for frontend, Sanity internationalization plugin for CMS
- **Data Fetching**: GROQ queries with typed responses

## Development Notes

- Requires Node.js >=20.16.0
- Environment variables needed for Sanity project configuration
- Studio deployment is separate from web app deployment
- Type generation should be run after schema changes (`pnpm sanity:type`)
- Uses Volta for Node.js version management