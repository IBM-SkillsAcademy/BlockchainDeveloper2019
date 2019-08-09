#!/bin/bash
ROOT=${PWD}
echo "Update Contract files with Completed EX06"

cd /home/blockchain/Desktop/BlockchainDeveloper2019/ex-commands/ex06/solution
./applySolution.sh


echo "################## START NETWORK ########################"
cd /home/blockchain/BlockchainDeveloper2019/Vehicle-Network


./byfn.sh down
./byfn.sh up -V 1.9.2

echo "Update Contract with Ex07 Artifacts "
cd $ROOT

pwd
cp -R ex07Artifacts/application/insurer/api/v1/vehicles/controller.js ../../SampleApplication/application/insurer/api/v1/vehicles/controller.js
cp -R ex07Artifacts/application/manufacturer/api/v1/vehicles/controller.js ../../SampleApplication/application/manufacturer/api/v1/vehicles/controller.js


