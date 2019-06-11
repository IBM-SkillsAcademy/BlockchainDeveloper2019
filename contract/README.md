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