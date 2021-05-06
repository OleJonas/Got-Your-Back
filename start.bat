cd backend
start waitress-serve --port 60066 "server:app"
cd ..
start frontend\dist\win-unpacked\"Got Your Back.exe"

#taskkill /FI "WINDOWTITLE eq SERVER" /F