#!/bin/bash

# remove current contract src and replace it by last exercise solution
rm -rf ../../SampleApplication/contract/src
cp -r ../ex05/solution/src ../../SampleApplication/contract/src

# go to Vehicle-Network and start the network
cd ../../Vehicle-Network/
./byfn.sh up -l node -s couchdb

# start application and register user1 for each organizations
cd ../SampleApplication/
./start.sh
curl -X POST "http://localhost:6001/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"
curl -X POST "http://localhost:6002/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"
curl -X POST "http://localhost:6003/api/v1/auth/user/register-enroll" -H "accept: */*" -H "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"

#TODO: register user for cli

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
