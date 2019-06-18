'use strict';

const path = require('path');
const fs = require('fs');

exports.getCCP = async () => {
  try {
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'gateway', 'org1Connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    let ccp = JSON.parse(ccpJSON);

    // update certs
    const org1AdminPKPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org1.example.com',
      'users', 'Admin@org1.example.com', 'msp', 'keystore');
    const org1AdminPKFiles = await fs.readdirSync(org1AdminPKPath);
    ccp.organizations.Org1.adminPrivateKey.path = path.resolve(org1AdminPKPath, org1AdminPKFiles[0]);

    const org1AdminSignPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org1.example.com',
      'users', 'Admin@org1.example.com', 'msp', 'signcerts');
    const org1AdminSignFiles = await fs.readdirSync(org1AdminSignPath);
    ccp.organizations.Org1.signedCert.path = path.resolve(org1AdminSignPath, org1AdminSignFiles[0]);

    const ordererTLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'ordererOrganizations', 'example.com',
      'orderers', 'orderer.example.com', 'msp', 'tlscacerts');
    const ordererTLSCACertsFiles = await fs.readdirSync(ordererTLSCACertsPath);
    ccp.orderers['orderer.example.com'].tlsCACerts.path = path.resolve(ordererTLSCACertsPath, ordererTLSCACertsFiles[0]);

    const peer0org1TLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org1.example.com',
      'peers', 'peer0.org1.example.com', 'msp', 'tlscacerts');
    const peer0org1TLSCACertsFiles = await fs.readdirSync(peer0org1TLSCACertsPath);
    ccp.peers['peer0.org1.example.com'].tlsCACerts.path = path.resolve(peer0org1TLSCACertsPath, peer0org1TLSCACertsFiles[0]);

    const caorg1TLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org1.example.com', 'ca');
    const caorg1TLSCACertsFiles = await fs.readdirSync(caorg1TLSCACertsPath);
    ccp.certificateAuthorities['ca.org1.example.com'].tlsCACerts.path = path.resolve(caorg1TLSCACertsPath, caorg1TLSCACertsFiles[0]);

    return ccp;
  } catch (err) {
    console.log(err);
    return err;
  }
};
