# DILLING Studio Deployment Manager

A professional Sanity App SDK application for managing multi-market studio deployments with visual interface and automation capabilities.

## 🚀 Features

### Visual Deployment Interface

- **Real-time market data** from your Sanity CMS
- **One-click deployments** for individual markets or all at once
- **Live deployment status** tracking with visual feedback
- **Studio health monitoring** and quick access links
- **Team collaboration** through Sanity Dashboard integration

### Automation & CLI

- **Command-line deployment** for CI/CD pipelines
- **Bulk operations** for managing multiple studios
- **Configuration generation** from CMS data
- **Studio cleanup** and management utilities

### Enterprise Features

- **Type-safe** TypeScript throughout
- **Error handling** and validation
- **Deployment history** and analytics
- **Market validation** and health checks
- **Scalable architecture** for growing businesses

## 📁 Project Structure

```
apps/studio-deployer/
├── src/                    # App SDK React application
├── api/                    # REST API endpoints
├── scripts/                # CLI automation tools
├── hooks/                  # Custom React hooks
├── services/               # Business logic services
└── types/                  # TypeScript definitions
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+ and pnpm
- Sanity account with admin permissions
- DILLING studio project already configured

### Installation

1. **Clone and setup:**

   ```bash
   cd apps/studio-deployer
   pnpm install
   ```

2. **Environment configuration:**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Required environment variables:**
   ```bash
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production
   SANITY_ORGANIZATION_ID=your_org_id
   ```

## 🎯 Usage

### Visual Interface (Recommended)

1. **Development:**

   ```bash
   pnpm run dev
   # Opens at localhost:3333
   ```

2. **Deploy to Sanity Dashboard:**

   ```bash
   pnpm run deploy
   # Deploys app to your organization dashboard
   ```

3. **Access:**
   - Visit your Sanity Dashboard
   - Look for "DILLING Studio Deployer" in your apps

### Command Line Interface

```bash
# Deploy all markets
pnpm run deploy:all

# Deploy specific market
pnpm run deploy:market US

# List deployed studios
pnpm run list:studios

# Generate fresh configs
pnpm run generate:configs

# Delete a studio
pnpm run delete:studio dilling-us
```

## 🔧 API Endpoints

The app provides REST API endpoints for integration:

- `POST /api/deploy-market` - Deploy specific market
- `POST /api/deploy-global` - Deploy global management studio
- `GET /api/list-studios` - List all deployed studios
- `GET /api/studio-status/[hostname]` - Check studio health
- `DELETE /api/delete-studio` - Remove deployed studio
- `POST /api/generate-configs` - Generate market configs

## 🏗️ Architecture

### React App SDK Application

- **SanityApp provider** for authentication and real-time data
- **Custom hooks** for deployment logic and market management
- **Sanity UI components** for consistent design
- **Real-time synchronization** with your CMS

### API Layer

- **REST endpoints** for deployment operations
- **Error handling** and validation
- **Integration** with Sanity CLI commands
- **Status monitoring** and health checks

### Type Safety

- **TypeScript** throughout the application
- **Generated types** from Sanity schema
- **API contracts** for reliable integration
- **Custom hooks** with proper typing

## 📊 Market Configuration

The deployment manager automatically reads your market configuration from Sanity:

```typescript
// Expected market document structure
{
  _type: "market",
  code: "US",
  title: "United States",
  flag: "🇺🇸",
  languages: [
    { code: "en", title: "English" },
    { code: "es", title: "Spanish" }
  ]
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"No markets found"**

   - Ensure you have market documents in your Sanity dataset
   - Check the market schema matches expected structure

2. **"Deployment failed"**

   - Verify Sanity CLI is installed: `pnpm add -g sanity`
   - Check deployment permissions in Sanity dashboard
   - Ensure studio configs are generated: `pnpm run generate:configs`

3. **"App won't load"**
   - Verify environment variables in `.env`
   - Check organization ID is correct
   - Ensure project ID and dataset are accessible

### Debug Mode

```bash
# Enable verbose logging
DEBUG=dilling:* pnpm run dev

# Check API endpoints
curl http://localhost:3333/api/list-studios
```

## 🔐 Security

- **Environment variables** for sensitive configuration
- **Sanity authentication** built into App SDK
- **No browser storage** of sensitive data
- **API endpoint validation** and error handling

## 🚀 Deployment

### Development

```bash
pnpm run dev    # Local development at localhost:3333
```

### Production

```bash
pnpm run build  # Build for production
pnpm run deploy # Deploy to Sanity Dashboard
```

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Deploy Studios
  run: |
    cd apps/studio-deployer
    pnpm run deploy:all
  env:
    SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
    SANITY_API_TOKEN: ${{ secrets.SANITY_API_TOKEN }}
```

## 🤝 Team Collaboration

The visual interface in Sanity Dashboard enables:

- **Non-technical team members** to deploy studios
- **Real-time deployment status** visible to all
- **Centralized management** of all market studios
- **Deployment history** and audit trail

## 📈 Scaling

As DILLING expands to new markets:

1. Add market documents in Sanity CMS
2. Deployment manager automatically detects new markets
3. Generate configs and deploy with one click
4. New studios are ready for content teams

## 🛟 Support

- **Documentation:** Check Sanity App SDK docs
- **Issues:** Use project issue tracker
- **Team:** Contact DILLING IT team

---

Built with ❤️ for DILLING's global expansion
