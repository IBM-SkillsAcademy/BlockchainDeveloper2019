#!/bin/bash
count=`cat /etc/resolv.conf | sed -n "/options/p" | wc -l`
if [ "${count}" -gt 0 ]
then
  echo blockchain | sudo -S sed -i "/options /c\ " /etc/resolv.conf
fi

# apply last exercise solution
rm -rf ../../SampleApplication/contract/src
rm -f ../../SampleApplication/contract/package.json
cp -r ex04Artifacts/src/ ../../SampleApplication/contract/src
cp  ex04Artifacts/package.json ../../SampleApplication/contract/package.json


