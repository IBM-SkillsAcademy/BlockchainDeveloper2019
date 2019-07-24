#!/bin/bash
ROOT=${PWD}
echo "Update Contract files with Completed EX03"

# cp -R ../ex02/solution/contract/src/. ../../SampleApplication/contract/src/.
# cp ../ex02/solution/contract/package.json ../../SampleApplication/contract/package.json


echo "################## START NETWORK ########################"
cd ../../Vehicle-Network/
./byfn.sh up -V 1.9.3

echo "Update Contract with Ex03 Artifacts "
cd $ROOT
#cd ex05Artifacts
pwd