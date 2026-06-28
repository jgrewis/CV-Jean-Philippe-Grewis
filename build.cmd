@echo off
REM Build de production FIABLE malgre iCloud : on copie le projet dans un dossier
REM temporaire LOCAL (hors iCloud), on installe + build la, puis on recopie dist/.
REM iCloud corrompt node_modules en continu => impossible de builder en place.
setlocal
set "PROJ=%~dp0"
set "TMP=%TEMP%\siteCV-build"

echo [1/4] Preparation du dossier de build local : %TMP%
if exist "%TMP%" rmdir /s /q "%TMP%"
mkdir "%TMP%"
copy /y "%PROJ%index.html"        "%TMP%\" >nul
copy /y "%PROJ%vite.config.js"    "%TMP%\" >nul
copy /y "%PROJ%package.json"      "%TMP%\" >nul
copy /y "%PROJ%package-lock.json" "%TMP%\" >nul
xcopy /e /i /q /y "%PROJ%src"    "%TMP%\src"    >nul
xcopy /e /i /q /y "%PROJ%public" "%TMP%\public" >nul

echo [2/4] npm install (local)
pushd "%TMP%"
call npm install --no-audit --no-fund
if errorlevel 1 ( echo ERREUR npm install & popd & exit /b 1 )

echo [3/4] vite build
call node "node_modules\vite\bin\vite.js" build
if errorlevel 1 ( echo ERREUR build & popd & exit /b 1 )
popd

echo [4/4] Copie de dist vers le projet
if exist "%PROJ%dist" rmdir /s /q "%PROJ%dist"
xcopy /e /i /q /y "%TMP%\dist" "%PROJ%dist" >nul

echo.
echo Termine. Lance preview.cmd puis ouvre http://localhost:5173
endlocal
