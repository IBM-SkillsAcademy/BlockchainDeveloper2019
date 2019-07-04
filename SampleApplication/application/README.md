# Sample Application
Vehicle Manufacture Sample Application used for creating Blockchain Developer Course V2 

## Getting Started (How to Run the Program)

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites (How to set up your machine)

1. After spin up your fabric local network, navigate to the application folder.
2. To run all three applications, run `./start.sh`
3. After all the applications is running and passed all the test, you can access the application swagger on the links below:
    ```bash
        Org1 (Manufacturer): localhost:6001/api-docs
        Org2 (Regulator)   : localhost:6002/api-docs
        Org3 (Insurer)     : localhost:6003/api-docs
    ```
4. To stop all the applications, run `./stop.sh`

### Restarting the app
To restart all application go to `unitTest` folder and run `node_modules/pm2/bin/pm2 restart all`

### Monitoring the app
To monitor the application go to either `org1, org2, org3, or unitTest` folder and run
    ```bash
        node_modules/pm2/bin/pm2 monit 0 (for org1)
        node_modules/pm2/bin/pm2 monit 1 (for org2)
        node_modules/pm2/bin/pm2 monit 2 (for org3)
    ```
    
    
5. To add 10 Orders as default orders to test pagination 
run `populateOrders.sh`
### Running the test
To run the test outside of the start script, you can go to `unitTest` folder and run `npm run test`
