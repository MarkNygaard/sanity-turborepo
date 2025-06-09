# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

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

## Architecture Overview

This is a **Turborepo monorepo** combining a **Sanity CMS Studio** with a **Next.js 15 frontend**:

- **apps/studio**: Sanity Studio v3 with multi-market/language support
- **apps/web**: Next.js 15 app with internationalization (next-intl)
- **packages/**: Shared packages for UI components, Sanity utilities, and React hooks
- **tooling/**: Shared ESLint, Prettier, Tailwind, and TypeScript configurations

## Key Architectural Patterns

### Multi-Market System
The Studio dynamically creates workspaces based on markets and languages defined in Sanity:
- Each market gets its own workspace with filtered content
- Language-specific content with internationalization support
- Market assignment logic in `apps/studio/components/inputs/SmartMarketField.tsx`
- Workspace creation handled in `apps/studio/utils/createMarketWorkspace.ts`

### Shared Package System
- **@repo/ui**: shadcn/ui-based component library
- **@repo/sanity**: Sanity client utilities and image handling  
- **@repo/hooks**: Shared React hooks across apps
- All packages use shared tooling configurations from `tooling/`

### Internationalization
- **Studio**: Uses Sanity's internationalization plugin for multi-language content
- **Web**: Server-side i18n with next-intl, dynamic locale routing (`/da-DK`, `/de-DE`, etc.)
- Default locale is `en-GB` (removed from URL, so `localhost:3000` shows English)
- Locale configuration in `apps/web/src/i18n/`

### Content Structure
- Documents are organized by market and language in the Studio
- Page builder system with reusable blocks (`apps/studio/schemaTypes/objects/blocks/`)
- Custom structure definitions in `apps/studio/structure/` for organized content management

## Technology Stack

- **Package Manager**: pnpm with workspaces
- **Framework**: Next.js 15 (App Router) + Sanity Studio v3
- **Styling**: Tailwind CSS with shadcn/ui components
- **TypeScript**: Comprehensive type safety with shared configurations
- **Internationalization**: next-intl for frontend, Sanity internationalization plugin for CMS
- **Data Fetching**: GraphQL with groqd for GROQ queries

## Development Notes

- Requires Node.js >=20.16.0
- Environment variables needed for Sanity and database connections
- Studio deployment is separate from web app deployment
- Type generation should be run after schema changes (`pnpm sanity:type`)
- GraphQL types should be regenerated after query changes (`pnpm codegen` in web app)