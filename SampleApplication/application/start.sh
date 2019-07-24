#!/bin/bash
ROOT=${PWD} # save current directory

# check if node_modules exist for every org
if [ ! -d "${ROOT}/manufacturer/node_modules" ]; then
  cd ${ROOT}/manufacturer/
  npm install
fi
if [ ! -d "${ROOT}/regulator/node_modules" ]; then
  cd ${ROOT}/regulator/
  npm install
fi
if [ ! -d "${ROOT}/insurer/node_modules" ]; then
  cd ${ROOT}/insurer/
  npm install
fi
if [ ! -d "${ROOT}/unitTest/node_modules" ]; then
  cd ${ROOT}/unitTest/
  npm install
fi

# start all applications with pm2
cd ${ROOT}/manufacturer/
node_modules/pm2/bin/pm2 start ${ROOT}/manufacturer/index.js
cd ${ROOT}/regulator/
node_modules/pm2/bin/pm2 start ${ROOT}/regulator/index.js
cd ${ROOT}/insurer/
node_modules/pm2/bin/pm2 start ${ROOT}/insurer/index.js

# run unit tests


cd ${ROOT}/unitTest/
echo "running tests"
npm run test


echo ''
echo '    The applications are ready. Please follow the links below to open swagger api'
echo '    Manufacturer: http://localhost:6001/api-docs'
echo '    Regulator: http://localhost:6002/api-docs'
echo '    Insurer: http://localhost:6003/api-docs'
echo ''
