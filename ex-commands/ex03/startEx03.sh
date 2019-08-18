#!/bin/bash
ROOT=${PWD}
echo "Update Contract files with Completed EX02"

cp -R ../ex02/solution/contract/src/. ../../SampleApplication/contract/src/.
cp ../ex02/solution/contract/package.json ../../SampleApplication/contract/package.json


echo "################## START NETWORK ########################"
cd ../../Vehicle-Network/
./byfn.sh up -V 1.9.2

echo "Update Contract with Ex03 Artifacts "
cd $ROOT
#cd ex03Artifacts
pwd
cp -R ex03Artifacts/src/. ../../SampleApplication/contract/src
cp  ex03Artifacts/package.json ../../SampleApplication/contract/package.json


