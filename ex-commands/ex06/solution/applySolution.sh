#!/bin/bash

# copy solution file
cp -rf ./src ../../../SampleApplication/contract/src
cp -f ./collections_config.json ../../../SampleApplication/contract/collections_config.json
cp -f ./package.json ../../../SampleApplication/contract/package.json

# upgrade the network
cd ../../../Vehicle-Network
export EPOCH=`date +%s`
./upgrade.sh 1.9.5-${EPOCH}