#!/bin/bash
ROOT=${PWD}



echo "################## populate Data ########################"

cd /home/blockchain/BlockchainDeveloper2019/SampleApplication/application
ls
./enrollUsers.sh
./populateOrders.sh

curl -X POST "http://localhost:6001/api/v1/vehicles" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"Order1\",\"manufacturer\":\"Honda\",\"model\":\"Accord\",\"color\":\"Black\",\"owner\":\"Tom\"}"


curl -X POST "http://localhost:6001/api/v1/vehicles/policies/request" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"id\":\"policy1\",\"vehicleNumber\":\"Order1:Accord\",\"insurerId\":\"insurer1\",\"holderId\":\"holder1\",\"policyType\":\"THIRD_PARTY\",\"startDate\":\"12122019\",\"endDate\":\"31122019\"}"



