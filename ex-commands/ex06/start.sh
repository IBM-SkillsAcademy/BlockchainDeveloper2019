#!/bin/bash

# apply last exercise solution
rm -rf ../../SampleApplication/contract/src
rm -f ../../SampleApplication/contract/collection_config.json
rm -f ../../SampleApplication/contract/package.json
cp -r ../ex05/solution/src ../../SampleApplication/contract/src
cp ../ex05/solution/collection_config.json ../../SampleApplication/contract/collection_config.json
cp ../ex05/solution/package.json ../../SampleApplication/contract/package.json

# go to Vehicle-Network and start the network
cd ../../Vehicle-Network/
./byfn.sh up -V 1.9.4

# start application and register user1 for each organizations
cd ../SampleApplication/application
./start.sh
curl -X GET "http://localhost:6001/api/v1/auth/registrar/enroll" -H "accept: */*"
curl -X POST "http://localhost:6001/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"
curl -X POST "http://localhost:6002/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"
curl -X POST "http://localhost:6003/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"

# after the networks and applications are up, copy all the required file for ex06
cd ../
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
