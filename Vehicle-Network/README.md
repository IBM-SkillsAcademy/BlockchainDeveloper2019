# Sample Application Smart Contract
Vehicle Manufacture Blockchain Network used for creating Blockchain Developer Course V2 

## Starting the network
1. To start the network, run `./byfn.sh up -l node -s couchdb`

## Upgrading chaincode
1. To upgrade chaincode, run `./upgrade.sh {version}`

## Teardown network
1. To teardown the network, run `./byfn.sh down`
2. Then run `docker rm $(docker ps -aq)` followed by `docker rmi $(docker images dev-peer* -q)`