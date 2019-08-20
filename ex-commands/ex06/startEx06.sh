#!/bin/bash

# set project's root folder
cd ../../
ROOT=`pwd`

# apply last exercise solution
rm -rf ${ROOT}/SampleApplication/contract/src
rm -f ${ROOT}/SampleApplication/contract/collections_config.json
rm -f ${ROOT}/SampleApplication/contract/package.json
cp -r ${ROOT}/code-solutions/ex05/src ${ROOT}/SampleApplication/contract
cp ${ROOT}/code-solutions/ex05/collections_config.json ${ROOT}/SampleApplication/contract
cp ${ROOT}/code-solutions/ex05/package.json ${ROOT}/SampleApplication/contract

# start the network
cd ${ROOT}/Vehicle-Network/
./byfn.sh up -V 1.9.4

# start application
cd ${ROOT}/SampleApplication/application
./start.sh

# enroll admin
sleep 5;
curl -X GET "http://localhost:6001/api/v1/auth/registrar/enroll" -H "accept: */*"; printf "\n";
curl -X GET "http://localhost:6002/api/v1/auth/registrar/enroll" -H "accept: */*"; printf "\n";
curl -X GET "http://localhost:6003/api/v1/auth/registrar/enroll" -H "accept: */*"; printf "\n";

# create org3 affiliation
sleep 3;
curl -X GET "http://localhost:6003/api/v1/auth/create-affiliation" -H "accept: */*"; printf "\n";

# register user for cli
sleep 3;
cd ${ROOT}/ex-commands/ex05/
./enrollUser.sh CLI-Manu-User org1 department1 Manufacturer
./enrollUser.sh CLI-Regu-User org2 department1 Regulator
./enrollUser.sh CLI-Insu-User org3 department1 Insurer

# register user for app
sleep 3;
curl -X POST "http://localhost:6001/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"App-Manu-User\"}"; printf "\n";
curl -X POST "http://localhost:6002/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"App-Regu-User\"}"; printf "\n";
curl -X POST "http://localhost:6003/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"App-Insu-User\"}"; printf "\n";

# after the networks and applications are up, copy all the required file for ex06
cd ${ROOT}
if [ ! -d "SampleApplication/contract/META-INF/statedb/couchdb/collections" ]; then
  mkdir SampleApplication/contract/META-INF/statedb/couchdb/collections
fi
if [ ! -d "SampleApplication/contract/META-INF/statedb/couchdb/collections/collectionVehiclePriceDetails" ]; then
  mkdir SampleApplication/contract/META-INF/statedb/couchdb/collections/collectionVehiclePriceDetails
fi
if [ ! -d "SampleApplication/contract/META-INF/statedb/couchdb/collections/collectionVehiclePriceDetails/indexes" ]; then
  mkdir SampleApplication/contract/META-INF/statedb/couchdb/collections/collectionVehiclePriceDetails/indexes
fi
cp -f ex-commands/ex06/artifacts/priceIndex.json SampleApplication/contract/META-INF/statedb/couchdb/collections/collectionVehiclePriceDetails/indexes/priceIndex.json
cp -f ex-commands/ex06/artifacts/vehicleContext.ts SampleApplication/contract/src/utils/vehicleContext.ts
cp -f ex-commands/ex06/artifacts/statelist.ts SampleApplication/contract/src/ledger-api/statelist.ts
cp -f ex-commands/ex06/artifacts/price.ts SampleApplication/contract/src/assets/price.ts
cp -f ex-commands/ex06/artifacts/priceList.ts SampleApplication/contract/src/lists/priceList.ts
cp -f ex-commands/ex06/artifacts/VehicleContract.ts SampleApplication/contract/src/contracts/VehicleContract.ts
cp -f ex-commands/ex06/artifacts/collections_config.json SampleApplication/contract/collections_config.json
