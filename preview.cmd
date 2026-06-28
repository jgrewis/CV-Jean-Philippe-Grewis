@echo off
REM Lance un serveur local qui sert le dossier dist/ (build de production).
REM Ouvre ensuite http://localhost:5173 dans ton navigateur.
REM Laisse cette fenetre ouverte tant que tu veux consulter le site.
cd /d "%~dp0"
echo Serveur de previsualisation sur http://localhost:5173  (Ctrl+C pour arreter)
node ".claude\static-server.mjs"
