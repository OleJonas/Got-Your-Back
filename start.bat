
set FLASK_APP=backend\server.py && START "SERVER" python -m flask run 
start /b /WAIT frontend\dist\win-unpacked\GotYourBack.exe
taskkill /FI "WINDOWTITLE eq SERVER" /F