@echo off
echo ==============================================
echo       ToolStore Pro - Starting Project
echo ==============================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running or not installed.
    echo Please start Docker Desktop and try again.
    pause
    exit /b
)

echo Starting Docker containers (Database, Backend, Frontend)...
docker-compose up --build -d

echo.
echo ==============================================
echo Project is starting in the background!
echo.
echo  - Frontend (Website): 
echo  - Backend (API):      http://localhost:3000
echo  - Database:           localhost:5432
echo.
echo Note: It might take a few moments for all services to become fully available.
echo To view live logs, run: docker-compose logs -f
echo To stop the project, run: docker-compose down
echo ==============================================
pause
