@echo off
setlocal enabledelayedexpansion
title TMS Startup Manager
echo ==========================================
echo    Property Management System (TMS)
echo    Developer Startup Script
echo ==========================================
echo.

:: 0. Ensure PostgreSQL is running
echo [STEP 0] Ensuring PostgreSQL is running...
set "PG_BIN_DIR=C:\Program Files\PostgreSQL\18\bin"
set "PG_DATA=C:\Program Files\PostgreSQL\18\data"

:: Check if PostgreSQL is responding
"%PG_BIN_DIR%\pg_isready.exe" -h 127.0.0.1 -p 5432 >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo [INFO] PostgreSQL is not responding. Attempting clean start...

    :: Kill any zombie processes
    taskkill /F /IM postgres.exe /T >nul 2>&1

    :: Clean up stale locks
    if exist "%PG_DATA%\postmaster.pid" (
        echo [INFO] Removing stale lock file...
        del /q "%PG_DATA%\postmaster.pid" >nul 2>&1
    )

    echo [INFO] Starting PostgreSQL server...
    "%PG_BIN_DIR%\pg_ctl.exe" start -D "%PG_DATA%" -w

    :: Wait and verify
    timeout /t 3 >nul
    "%PG_BIN_DIR%\pg_isready.exe" -h 127.0.0.1 -p 5432 >nul 2>&1
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] PostgreSQL failed to start.
        echo [HINT] Check logs in: %PG_DATA%\log
        pause
        exit /b 1
    )
    echo [SUCCESS] PostgreSQL started.
) else (
    echo [INFO] PostgreSQL is already up and running.
)

:: 1. Verify Database Connection
echo [STEP 1] Verifying Database Connection...
cmd /c "npx tsx prisma/db-check.ts"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Database check failed.
    pause
    exit /b %ERRORLEVEL%
)

:: 2. Check if seeding is needed
echo [STEP 2] Database is connected and verified.
set /p SEED="Do you want to seed the database with initial data? (y/n): "
if /I "!SEED!"=="y" (
    echo Seeding database...
    cmd /c "npx prisma db push && npx tsx prisma/seed.ts"
)

:: 3. Launch Services
echo.
echo [STEP 3] Launching Services...

:: Check for Windows Terminal
where wt >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Detected Windows Terminal. Opening tabs...
    wt nt -d "%CD%" --title "Frontend/Server" -- cmd /k "npm run dev" ; ^
       nt -d "%CD%" --title "Prisma Studio" -- cmd /k "npx prisma studio" ; ^
       nt -d "%CD%" --title "System Logs" -- cmd /k "echo System is running. Check other tabs. && echo."
) else (
    echo [INFO] Windows Terminal not found. Opening separate windows...
    start "TMS: Frontend" cmd /k "npm run dev"
    start "TMS: Prisma" cmd /k "npx prisma studio"
)

echo.
echo [SUCCESS] Startup sequence completed.
echo You can close this manager window.
timeout /t 10
