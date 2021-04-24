cd backend && waitress-serve --port 60066 "server:app"
start /b /WAIT frontend\dist\win-unpacked\GotYourBack.exe
taskkill /FI "WINDOWTITLE eq SERVER" /F