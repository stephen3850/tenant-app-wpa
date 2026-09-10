@echo off
:: This script must be run as Administrator
echo Checking for Administrator privileges...
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] This script MUST be run as Administrator.
    echo Right-click this file and select "Run as administrator".
    pause
    exit /b 1
)

set "PG_BIN=C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe"
set "PG_DATA=C:\Program Files\PostgreSQL\18\data"
set "SERVICE_NAME=postgresql-18"

echo.
echo [INFO] Registering PostgreSQL as a Windows Service...
"%PG_BIN%" register -N "%SERVICE_NAME%" -D "%PG_DATA%"

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Service registered successfully.
    echo [INFO] Setting service to start automatically...
    sc config "%SERVICE_NAME%" start= auto
    echo [INFO] Starting the service...
    net start "%SERVICE_NAME%"
    echo.
    echo ==================================================
    echo DONE! PostgreSQL will now start automatically.
    echo ==================================================
) else (
    echo [ERROR] Failed to register service. It might already exist.
    echo Attempting to set existing service to automatic...
    sc config "%SERVICE_NAME%" start= auto
    net start "%SERVICE_NAME%"
)

pause
