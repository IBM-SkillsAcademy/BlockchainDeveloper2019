#!/bin/bash
echo "################## STOP NETWORK ########################"
cd ../../Vehicle-Network/
./byfn.sh down
docker rm -f $(docker ps -aq) 
docker volume rm -f $(docker volume ls -q)
echo "stopping the applications " 
cd /home/blockchain/BlockchainDeveloper2019/SampleApplication/application
./stop.sh



