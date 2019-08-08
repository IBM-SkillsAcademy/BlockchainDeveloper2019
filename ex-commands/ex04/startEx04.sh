#!/bin/bash

# apply last exercise solution
rm -rf ../../SampleApplication/contract/src
rm -f ../../SampleApplication/contract/package.json
cp -r ex04Artifacts/src/ ../../SampleApplication/contract/src
cp  ex04Artifacts/package.json ../../SampleApplication/contract/package.json


