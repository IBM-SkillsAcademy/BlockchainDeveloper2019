#!/bin/bash
ROOT=${PWD}
echo "Update Contract files with initial EX02"

cd $ROOT
#cd ex02Artifacts
pwd
cp -R ex02Artifacts/src/. ../../SampleApplication/contract/src
cp  ex02Artifacts/package.json ../../SampleApplication/contract/package.json


