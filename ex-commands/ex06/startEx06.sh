#!/bin/bash

# apply last exercise solution
rm -rf ../../SampleApplication/contract/src
rm -f ../../SampleApplication/contract/collections_config.json
rm -f ../../SampleApplication/contract/package.json
cp -r ../ex05/solution/src ../../SampleApplication/contract/src
cp ../ex05/solution/collections_config.json ../../SampleApplication/contract/collections_config.json
cp ../ex05/solution/package.json ../../SampleApplication/contract/package.json

# go to Vehicle-Network and start the network
cd ../../Vehicle-Network/
./byfn.sh up -V 1.9.4

# start application and register user1 for each organizations
cd ../SampleApplication/application
./start.sh
sleep 5
curl -X GET "http://localhost:6001/api/v1/auth/registrar/enroll" -H "accept: */*"; printf "\n";
curl -X GET "http://localhost:6002/api/v1/auth/registrar/enroll" -H "accept: */*"; printf "\n";
curl -X GET "http://localhost:6003/api/v1/auth/registrar/enroll" -H "accept: */*"; printf "\n";
sleep 3;
curl -X GET "http://localhost:6003/api/v1/auth/create-affiliation" -H "accept: */*"; printf "\n";
sleep 3;
curl -X POST "http://localhost:6001/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"; printf "\n";
curl -X POST "http://localhost:6002/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"; printf "\n";
curl -X POST "http://localhost:6003/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"; printf "\n";

# register user for cli
cd ../../ex-commands/ex05/
./enrollUser.sh User1 org1 department1 Manufacturer
./enrollUser.sh User1 org2 department1 Regulator
./enrollUser.sh User1 org3 department1 Insurer

# after the networks and applications are up, copy all the required file for ex06
cd ../../
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
