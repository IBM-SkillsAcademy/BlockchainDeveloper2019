#!/bin/bash
cd ../SampleApplication/contract
npm run build

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
-e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" \
-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
-e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
cli peer chaincode install -n vehicle-manufacture -v $1 -p /opt/gopath/src/github.com/chaincode -l node

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" \
-e "CORE_PEER_ADDRESS=peer0.org2.example.com:9051" \
-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
-e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
cli peer chaincode install -n vehicle-manufacture -v $1 -p /opt/gopath/src/github.com/chaincode -l node

docker exec -e "CORE_PEER_LOCALMSPID=Org3MSP" \
-e "CORE_PEER_ADDRESS=peer0.org3.example.com:11051" \
-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp" \
-e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt" \
cli peer chaincode install -n vehicle-manufacture -v $1 -p /opt/gopath/src/github.com/chaincode -l node

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
-e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" \
-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
-e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
cli bash -c "peer chaincode upgrade -o orderer.example.com:7050 --tls \
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
-C mychannel -n vehicle-manufacture -l node -v $1 -c '{\"Args\":[]}' -P \"AND ('Org1MSP.member','Org2MSP.member', 'Org3MSP.member')\" \
--collections-config \$GOPATH/src/github.com/chaincode/collections_config.json"