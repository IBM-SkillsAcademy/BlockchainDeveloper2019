#!/bin/bash

#TODO: copy file from last exercise artifact

# go to Vehicle-Network and start the network
cd ../../Vehicle-Network/
./byfn.sh up -l node -s couchdb

# after the networks up, copy all the required file for ex06
cd ../../
cp -f ex-commands/ex06/artifacts/priceIndex.json SampleApplication/contract/META-INF/statedb/couchdb/collections/collectionVehiclePriceDetails/indexes
cp -f ex-commands/ex06/artifacts/vehicleContext.ts SampleApplication/contract/src/utils/vehicleContext.ts
cp -f ex-commands/ex06/artifacts/statelist.ts SampleApplication/contract/src/ledger-api/statelist.ts
cp -f ex-commands/ex06/artifacts/price.ts SampleApplication/contract/src/assets/price.ts
cp -f ex-commands/ex06/artifacts/priceList.ts SampleApplication/contract/src/lists/priceList.ts
cp -f ex-commands/ex06/artifacts/vehicleContext.ts SampleApplication/contract/src/contracts/VehicleContract.ts
