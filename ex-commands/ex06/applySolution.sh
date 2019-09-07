#!/bin/bash

# copy solution file
cp -rf ../../code-solutions/ex06/src ../../SampleApplication/contract
cp -f ../../code-solutions/ex06/collections_config.json ../../SampleApplication/contract
cp -f ../../code-solutions/ex06/package.json ../../SampleApplication/contract

# upgrade the network
cd ../../Vehicle-Network
export EPOCH=`date +%s`
./upgrade.sh 1.9.5-${EPOCH}
