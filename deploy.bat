@echo off
echo 🚀 Pawanhans Website Deployment Script
echo ======================================

echo Step 1: Building project...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors first.
    pause
    exit /b 1
)

echo ✅ Build successful!

echo.
echo Step 2: Choose deployment method:
echo 1. Vercel (Recommended)
echo 2. Netlify
echo 3. Surge
echo 4. Manual upload
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo Deploying to Vercel...
    if not exist "node_modules\.bin\vercel.cmd" (
        echo Installing Vercel CLI...
        npm install -g vercel
    )
    vercel --prod
) else if "%choice%"=="2" (
    echo Deploying to Netlify...
    if not exist "node_modules\.bin\netlify.cmd" (
        echo Installing Netlify CLI...
        npm install -g netlify-cli
    )
    netlify login
    netlify deploy --prod --dir=dist
) else if "%choice%"=="3" (
    echo Deploying to Surge...
    if not exist "node_modules\.bin\surge.cmd" (
        echo Installing Surge...
        npm install -g surge
    )
    surge dist
) else if "%choice%"=="4" (
    echo Manual deployment selected.
    echo Upload the 'dist' folder contents to your web server.
    echo Make sure index.html is in the root directory.
    explorer dist
) else (
    echo Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
echo ✅ Deployment complete!
echo Check the URL provided above to view your live website.
pause