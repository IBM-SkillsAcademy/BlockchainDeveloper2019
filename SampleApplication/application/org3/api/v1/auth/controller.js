'use strict';

const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const utils = require('../utils');

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);

const fixtures = path.resolve(process.env.FABRIC_SAMPLES_PATH, 'first-network', 'org3-artifacts');

exports.enrollAdmin = async (req, res, next) => {
  try {
    // update ccp
    await utils.getCCP();

    // Identity to credentials to be stored in the wallet
    const credPath = path.join(fixtures, '/crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com');
    const cert = fs.readFileSync(path.join(credPath, '/msp/signcerts/Admin@org3.example.com-cert.pem')).toString();

    const keystorePath = path.resolve(credPath, 'msp', 'keystore');
    const keystoreFiles = await fs.readdirSync(keystorePath);

    let key;
    keystoreFiles.forEach((filename) => {
      if (filename.includes('_sk')) {
        key = fs.readFileSync(path.resolve(keystorePath, filename));
      }
    });

    // Load credentials into wallet
    const identityLabel = 'admin';
    const identity = X509WalletMixin.createIdentity('Org3MSP', cert, key);

    await wallet.import(identityLabel, identity);
    return res.send({
      message: 'Successfully enrolled admin user "admin" and imported it into the wallet'
    });
} catch (err) {
    console.log(err);
    next(err);
  }
};

exports.enrollUser = async (req, res, next) => {
  try {
    // update ccp
    await utils.getCCP();

    // Identity to credentials to be stored in the wallet
    const credPath = path.join(fixtures, '/crypto-config/peerOrganizations/org3.example.com/users/User1@org3.example.com');
    const cert = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@org3.example.com-cert.pem')).toString();

    const keystorePath = path.resolve(credPath, 'msp', 'keystore');
    const keystoreFiles = await fs.readdirSync(keystorePath);

    let key;
    keystoreFiles.forEach((filename) => {
      if (filename.includes('_sk')) {
        key = fs.readFileSync(path.resolve(keystorePath, filename));
      }
    });

    // Load credentials into wallet
    const identityLabel = 'user1';
    const identity = X509WalletMixin.createIdentity('Org3MSP', cert, key);

    await wallet.import(identityLabel, identity);
    return res.send({
      message: `Successfully enrolled user ${identityLabel} and imported it into the wallet`
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
