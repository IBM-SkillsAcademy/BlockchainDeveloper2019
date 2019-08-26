#!/bin/bash
ROOT=${PWD}
echo "Update Contract files with Completed EX03"

cp -R ../../code-solutions/ex03/src/. ../../SampleApplication/contract/src/.
cp ../../code-solutions/ex03/package.json ../../SampleApplication/contract/package.json


echo "################## START NETWORK ########################"
cd ../../Vehicle-Network/
./byfn.sh up -V 1.9.3

echo "Update Contract with Ex05 Artifacts "
cd $ROOT
#cd ex05Artifacts
pwd
cp -R ex05Artifacts/src/contracts/VehicleContract.ts ../../SampleApplication/contract/src/contracts/VehicleContract.ts
