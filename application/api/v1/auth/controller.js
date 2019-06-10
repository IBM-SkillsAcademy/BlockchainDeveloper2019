'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'gateway', 'basicConnection.json'); // TODO: make it modular
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Create a new CA client for interacting with the CA.
const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
const ca = new FabricCAServices(caURL);

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

exports.enrollAdmin = async (req, res) => {
  try {
    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (adminExists) {
      return res.status(409).send({
        message: 'An identity for the admin user "admin" already exists in the wallet'
      });
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    wallet.import('admin', identity);

    return res.send({
      message: 'Successfully enrolled admin user "admin" and imported it into the wallet'
    });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).send(err.message);
  }
};

exports.registerUser = async (req, res) => {
  try {
    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(req.body.enrollmentID);
    if (userExists) {
      return res.status(409).send({
        message: `An identity for the user ${req.body.enrollmentID} already exists in the wallet`
      });
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
      return res.status(401).send({
        message: `An identity for the admin user "admin" does not exist in the wallet. Please run admin enrollment before retrying`
      });
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: req.body.enrollmentID, role: 'client' }, adminIdentity);
    const enrollment = await ca.enroll({ enrollmentID: req.body.enrollmentID, enrollmentSecret: secret });
    const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    wallet.import(req.body.enrollmentID, userIdentity);
    return res.send({
      message: `Successfully registered and enrolled admin user ${req.body.enrollmentID} and imported it into the wallet`
    });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).send(err.message);
  }
};
