#!/bin/bash
ROOT=${PWD}
echo "Update Contract files with Completed EX02"

cp -R ../../code-solutions/ex02/src/. ../../SampleApplication/contract/src/.
cp ../../code-solutions/ex02/package.json ../../SampleApplication/contract/package.json


echo "################## START NETWORK ########################"
cd ../../Vehicle-Network/
./byfn.sh up -V 1.9.2

echo "Update Contract with Ex03 Artifacts "
cd $ROOT
#cd ex03Artifacts
pwd
cp -R ex03Artifacts/assets/. ../../SampleApplication/contract/src/assets/
cp -R ex03Artifacts/utils/. ../../SampleApplication/contract/src/utils/
cp -R ex03Artifacts/lists/. ../../SampleApplication/contract/src/lists/
cp -R ex03Artifacts/ledger-api/. ../../SampleApplication/contract/src/ledger-api/
cp  ex03Artifacts/VehicleContract.ts ../../SampleApplication/contract/src/contracts/VehicleContract.ts
cp  ex03Artifacts/package.json ../../SampleApplication/contract/src/contracts/package.json


