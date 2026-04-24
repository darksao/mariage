@echo off
echo ◆ Wedoria Studio — Démarrage...

:: Lance le serveur local en arrière-plan sur le port 3003
start "" /B npx serve . --listen 3003 --no-clipboard

:: Attend 2 secondes que le serveur démarre
timeout /t 2 /nobreak >nul

:: Ouvre le formulaire client et le studio dans le navigateur
start "" "http://localhost:3003/onboarding/"
start "" "http://localhost:3003/studio/"

echo Serveur démarré sur http://localhost:3003
echo Ferme cette fenêtre pour arrêter le serveur.
pause
