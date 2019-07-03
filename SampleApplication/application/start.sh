#!/bin/bash
ROOT=${PWD} # save current directory

# check if node_modules exist for every org
if [ ! -d "${ROOT}/org1/node_modules" ]; then
  cd ${ROOT}/org1/
  npm install
fi
if [ ! -d "${ROOT}/org2/node_modules" ]; then
  cd ${ROOT}/org2/
  npm install
fi
if [ ! -d "${ROOT}/org3/node_modules" ]; then
  cd ${ROOT}/org3/
  npm install
fi
if [ ! -d "${ROOT}/unitTest/node_modules" ]; then
  cd ${ROOT}/unitTest/
  npm install
fi

# start all applications with pm2
cd ${ROOT}/org1/
node_modules/pm2/bin/pm2 start ${ROOT}/org1/index.js
cd ${ROOT}/org2/
node_modules/pm2/bin/pm2 start ${ROOT}/org2/index.js
cd ${ROOT}/org3/
node_modules/pm2/bin/pm2 start ${ROOT}/org3/index.js

# run unit tests
cd ${ROOT}/unitTest/
npm run test
