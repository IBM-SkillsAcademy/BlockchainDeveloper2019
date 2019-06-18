# Sample Application
Vehicle Manufacture Sample Application used for creating Blockchain Developer Course V2 

## Getting Started (How to Run the Program)

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites (How to set up your machine)

1. After spin up your fabric local network, navigate to the application folder.
2. Open up `.env` file and modify it according to your machine
3. Install all its dependencies by running

    ```bash
    npm install
    ```

4. Run the app.
    ```bash
    npm run start
    ```

5. The app is now running! To check that the app is actually running you can go to:

    ```bash
        localhost:3000/api-docs
    ```

6. To start using the app, please invoke `enroll-admin` and `register-user` first from the swagger

## Running the test

1. After running the app you can running a test suite by opening a new terminal and run

    ```bash
    npm run test
    ```

## Notes:
When recreating the network, we need to clear the wallet by running `rm -r wallet`