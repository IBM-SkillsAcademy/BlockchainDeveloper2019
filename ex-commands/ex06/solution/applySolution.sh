#!/bin/bash

# copy solution file
cp -rf ./src ../../../SampleApplication/contract
cp -f ./collections_config.json ../../../SampleApplication/contract
cp -f ./package.json ../../../SampleApplication/contract

# upgrade the network
cd ../../../Vehicle-Network
export EPOCH=`date +%s`
./upgrade.sh 1.9.5-${EPOCH}