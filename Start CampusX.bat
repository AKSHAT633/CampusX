@echo off
echo ========================================
echo     Starting CampusX Application
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "CampusX Backend" cmd /k "cd /d C:\Users\Asus\OneDrive\Desktop\proj1\backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "CampusX Frontend" cmd /k "cd /d C:\Users\Asus\OneDrive\Desktop\proj1\frontend && npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo  App is starting! Opening browser...
echo  URL: http://localhost:5173
echo ========================================

start "" "http://localhost:5173"

echo.
echo Both servers are running!
echo Close the terminal windows to stop the app.
pause
