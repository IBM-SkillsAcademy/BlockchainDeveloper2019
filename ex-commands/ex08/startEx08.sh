#!/bin/bash
ROOT=${PWD}
echo "Update Contract files with Completed smart Contract"

cp -R ex08Artifacts/contract/. ../../SampleApplication/contract/.


echo "################## START NETWORK ########################"
cd /home/blockchain/BlockchainDeveloper2019/Vehicle-Network


./byfn.sh down
./byfn.sh up -V 1.9.2

echo "Update Contract with Ex07 Artifacts "
cd $ROOT

pwd
cp -R ex08Artifacts/application/insurer/api/v1/vehicles/controller.js ../../SampleApplication/application/insurer/api/v1/vehicles/controller.js
cp -R ex08Artifacts/application/manufacturer/api/v1/vehicles/controller.js ../../SampleApplication/application/manufacturer/api/v1/vehicles/controller.js
cp -R ex08Artifacts/application/regulator/api/v1/vehicles/controller.js ../../SampleApplication/application/regulator/api/v1/vehicles/controller.js


echo "################## enroll Admin and users in applications ########################"

cd /home/blockchain/BlockchainDeveloper2019/SampleApplication/application
ls
./start.sh

