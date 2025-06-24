@echo off
setlocal enabledelayedexpansion

echo 🚀 Setting up DILLING Studio Deployment Manager...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the studio-deployer directory
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1 delims=." %%a in ('node --version') do set NODE_MAJOR=%%a
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% LSS 18 (
    echo ❌ Node.js 18+ required. Current version: 
    node --version
    exit /b 1
)

echo ✅ Node.js version check passed

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Check for environment file
if not exist ".env" (
    echo ⚠️  No .env file found. Creating from example...
    copy .env.example .env
    echo.
    echo 🔧 Please edit .env file with your actual Sanity configuration:
    echo    - SANITY_PROJECT_ID
    echo    - SANITY_DATASET
    echo    - SANITY_ORGANIZATION_ID
    echo.
    echo 💡 You can find these values in your Sanity dashboard
    echo.
)

REM Check if Sanity CLI is available
where sanity >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Sanity CLI not found globally. Installing locally...
    pnpm add sanity
)

echo ✅ Sanity CLI available

REM Validate environment variables (basic check)
echo 🔍 Validating environment configuration...

findstr "your_project_id_here" .env >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ❌ Please set SANITY_PROJECT_ID in .env file
    set SETUP_INCOMPLETE=true
)

findstr "your_organization_id_here" .env >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ❌ Please set SANITY_ORGANIZATION_ID in .env file
    set SETUP_INCOMPLETE=true
)

if defined SETUP_INCOMPLETE (
    echo.
    echo 🔧 Please complete your .env configuration and run setup again
    echo.
    echo Find your values at:
    echo    Project ID ^& Dataset: https://sanity.io/manage
    echo    Organization ID: https://sanity.io/organizations
    exit /b 1
)

echo ✅ Environment configuration validated

REM Test connection to Sanity
echo 🔌 Testing Sanity connection...
pnpm run test-connection >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Could not test Sanity connection. This is normal if markets aren't set up yet.
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo.
echo 1. Start development server:
echo    pnpm run dev
echo.
echo 2. Open http://localhost:3333 in your browser
echo.
echo 3. Deploy to Sanity Dashboard:
echo    pnpm run deploy
echo.
echo 🔧 Available commands:
echo    pnpm run dev              # Development server
echo    pnpm run deploy           # Deploy to Sanity Dashboard
echo    pnpm run deploy:all       # Deploy all market studios
echo    pnpm run deploy:market US # Deploy specific market
echo    pnpm run list:studios     # List deployed studios
echo.
echo 📚 Read README.md for detailed usage instructions
echo.
echo 🎯 Happy deploying!