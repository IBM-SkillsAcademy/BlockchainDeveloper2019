#!/bin/bash
ROOT=${PWD}
echo "Update Contract files with Completed EX06"

cp -R ex07Artifacts/contract/. ../../SampleApplication/contract/


echo "################## START NETWORK ########################"
cd ../../Vehicle-Network/
./byfn.sh up -V 1.9.2

echo "Update Contract with Ex07 Artifacts "
cd $ROOT
#cd ex03Artifacts
pwd
cp -R ex07Artifacts/application/insurer/. ../../SampleApplication/application/insurer/
cp -R ex07Artifacts/application/manufacturer/. ../../SampleApplication/manufacturer/


