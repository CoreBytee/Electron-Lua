rm -r ./Build/
mkdir ./Build/
mkdir ./Build/Temp/

cp -r ./Electron/ ./Build/Temp/
rm -r ./Build/Temp/Electron/node_modules/
rm ./Build/Temp/Electron/package-lock.json
rm ./Build/Temp/Electron/oldindex.js
rm -r ./Build/Temp/Electron/lib/OpenIPC/node_modules/
rm ./Build/Temp/Electron/lib/OpenIPC/package-lock.json
Compress-Archive -Path ./Build/Temp/Electron/* -DestinationPath ./Build/Electron.zip
rm -r ./Build/Temp/

TypeWriter.exe build --input=./Package/src/ --branch=Main
TypeWriter.exe build --input=./Package/src/ --branch=Bootstrap
cp ./.TypeWriter/Build/* ./Build/
rm -r ./.TypeWriter/