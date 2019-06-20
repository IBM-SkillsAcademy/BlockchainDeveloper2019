# Sample Application Smart Contract
Vehicle Manufacture Sample Application Smart Contract used for creating Blockchain Developer Course V2 

## Deploying Smart Contract on Visual Code IBP Extension Local Fabric
based on: https://github.com/IBM/fabcar-blockchain-sample/blob/master/docs/run-local.md
### Package the smart contract
1. Open Visual Studio code and open the contract folder from this repository that was cloned earlier.
2. Press the F1 key to see the different VS code options. Choose IBM Blockchain Platform: Package a Smart Contract Project.
3. Click the IBM Blockchain Platform extension button on the left. This will show the packaged contracts on top and the blockchain connections on the bottom.
4. Next, right click on the packaged contract to export it and choose Export Package
5. Choose a location on your machine and save .cds file. We will use this packages smart contract later to deploy on our work.
### Setup network locally and deploy the smart contract
1. Click on the overflow menu for LOCAL FABRIC OPS, and choose Start Fabric Runtime to start a network. This will download the Docker images required for a local Fabric setup, and start the network. Once setup is complete, you should see under LOCAL FABRIC OPS, options to install and instantiate smart contract, your Channels information, your peer under Nodes and the organization msp under Organizations. You are now ready to install the smart contract.
2. Click on +Install under Installed dropdown in the LOCAL FABRIC OPS console. Choose the peer: peer0.org1.example.com. Choose the fabcar@1.0.0 contract. You should see a notification for successful install of the smart contract, and the smart contract listed under Installed in your LOCAL FABRIC OPS console. You are now ready to instantiate the smart contract.
3. Click on +Instantiate under Instantiated dropdown in the LOCAL FABRIC OPS console. Choose the channel: mychannel. Choose the fabcar@1.0.0 contract. Type in initLedger for the function. You can press Enter for optional arguments. Once this is successfully instantiated, you should see a successful notification in the output view, and the smart contract listed under Instantiated in your LOCAL FABRIC OPS console.
4. Follow the instruction on application folder to run the application

## Deploying Smart Contract on Local Hyperledger Network
based on: https://hyperledger-fabric.readthedocs.io/en/release-1.4/build_network.html
### Starting the Hyperledger Fabric Network Sample
1. If you haven't done it already, clone the Hyperledger Fabric Samples from [hyperledger/fabric-samples](https://github.com/hyperledger/fabric-samples) repository
2. Go to {path-to-fabric-samples}/fabric-samples/first-network directory and run `./byfn.sh generate`. This command will generates all of the certificates and keys for our various network entities
3. Next, you can bring up the network up by running `./byfn.sh up -l node -s couchdb`. This command will bring up a hyperledger fabric network with 2 organization and 2 peers for each organization, it will also use couchdb as the state database and node.js as chaincode runtime
4. To add the third organization, we need to run `./eyfn.sh up -l node -s couchdb`
5. For this course we will need a fabric-ca server container, which can be bring up by running `docker-compose -f docker-compose-e2e.yaml up -d` command.
6. Copy our contract folder file to the docker cli container by running `docker cp {path-to-contract}/contract cli:/opt/gopath/src/github.com/chaincode/`
7. Run the command below to install the chaincode to Peer0 of Organization 1
```
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
-e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" \
-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
-e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
cli peer chaincode install -n vehicle-manufacture -v 1.0.0 -p /opt/gopath/src/github.com/chaincode/contract -l node
```
8. Run the command below to install the chaincode to Peer0 of Organization 2
```
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" \
-e "CORE_PEER_ADDRESS=peer0.org2.example.com:9051" \
-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
-e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
cli peer chaincode install -n vehicle-manufacture -v 1.0.0 -p /opt/gopath/src/github.com/chaincode/contract -l node
```
9. Run the command below to instantiate the chaincode in the network
```
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
-e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" \
-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
-e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
cli bash -c "peer chaincode instantiate -o orderer.example.com:7050 --tls \
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
-C mychannel -n vehicle-manufacture -l node -v 1.0.0 -c '{\"Args\":[]}' -P \"OR ('Org1MSP.member','Org2MSP.member')\" \
--collections-config \$GOPATH/src/github.com/chaincode/contract/collections_config.json"
```