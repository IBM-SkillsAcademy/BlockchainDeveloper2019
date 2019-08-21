#!/bin/bash

# apply last exercise solution
echo "removing old admin identity"
rm -rf /home/blockchain/.fabric-vscode/local_fabric_wallet/admin


if [ ! -d "/home/blockchain/Desktop/local_fabric_wallet" ]; then
echo "Please export admin identiy to /home/blockchain/Desktop with folder name (local_fabric_wallet)"
exit
fi
echo "check if admin identity exits in Desktop"

echo "copy new identity"
cp -r /home/blockchain/Desktop/local_fabric_wallet/.  /home/blockchain/.fabric-vscode/local_fabric_wallet/ 
