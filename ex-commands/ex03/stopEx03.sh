#!/bin/bash
echo "################## STOP NETWORK ########################"
cd ../../Vehicle-Network/
./byfn.sh down
docker rm -f $(docker ps -aq) 
docker volume rm -f $(docker volume ls -q)
echo "################## STOP APPLICATIONS ########################"
cd ../SampleApplication/application
./stop.sh
