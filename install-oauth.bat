@echo off
echo Installing Google OAuth dependencies...
cd server
npm install passport passport-google-oauth20 express-session
echo.
echo OAuth packages installed successfully!
echo.
echo Next steps:
echo 1. Set up Google Cloud Console OAuth credentials
echo 2. Update server/.env with your Google OAuth credentials
echo 3. See GOOGLE_OAUTH_SETUP.md for detailed instructions
echo.
pause
