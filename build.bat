@echo off
setlocal
set "PATH=%APPDATA%\npm;C:\Users\toira\AppData\Local\Android\Sdk\build-tools\30.0.3;%PATH%"
rem Build Android app for release
set AppName=kitab
set AppId=com.pvg.kitab
set KeystoreFile=
set KeystorePassword=
set DNameOU=
set DNameO=
set DNameL=
set DNameS=
set DNameC=
set UnalignApk=D:\laragon\www\kitabapps\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk
set AlignApk=D:\laragon\www\kitabapps\kitab.apk
set UnalignAab=D:\laragon\www\kitabapps\platforms\android\app\build\outputs\bundle\release\app-release.aab
set AlignAab=D:\laragon\www\kitabapps\kitab.aab
if not exist "%KeystoreFile%" (
	keytool -genkeypair -v -keystore "%KeystoreFile%" -alias "%AppName%" -keyalg "RSA" -keysize 2048 -dname "CN=%AppId%, OU=%DNameOU%, O=%DNameO%, L=%DNameL%, S=%DNameS%, C=%DNameC%" -validity 10000 -keypass "%KeystorePassword%" -storepass "%KeystorePassword%"
)
if not exist "%KeystoreFile%" exit /b
call ionic cordova build android --prod --release
cd platforms/android
call gradlew bundle
cd ../..
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "%KeystoreFile%" -storepass "%KeystorePassword%" -keypass "%KeystorePassword%" "%UnalignAab%" "%AppName%"
jarsigner -verify -verbose -certs "%UnalignAab%"
if exist "%AlignAab%" del "%AlignAab%"
zipalign -v 4 "%UnalignAab%" "%AlignAab%"