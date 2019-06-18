'use strict';

const path = require('path');
const fs = require('fs');

exports.getCCP = async () => {
  try {
    const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'gateway', 'org2ConnectionTemplate.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    let ccp = JSON.parse(ccpJSON);

    // update certs
    const org2AdminPKPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org2.example.com',
      'users', 'Admin@org2.example.com', 'msp', 'keystore');
    const org2AdminPKFiles = await fs.readdirSync(org2AdminPKPath);
    org2AdminPKFiles.forEach((filename) => {
      if (filename.includes('_sk')) {
        ccp.organizations.Org2.adminPrivateKey.path = path.resolve(org2AdminPKPath, filename);
      }
    });

    const org2AdminSignPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org2.example.com',
      'users', 'Admin@org2.example.com', 'msp', 'signcerts');
    const org2AdminSignFiles = await fs.readdirSync(org2AdminSignPath);
    org2AdminSignFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.organizations.Org2.signedCert.path = path.resolve(org2AdminSignPath, filename);
      }
    });

    const ordererTLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'ordererOrganizations', 'example.com',
      'orderers', 'orderer.example.com', 'msp', 'tlscacerts');
    const ordererTLSCACertsFiles = await fs.readdirSync(ordererTLSCACertsPath);
    ordererTLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.orderers['orderer.example.com'].tlsCACerts.path = path.resolve(ordererTLSCACertsPath, filename);
      }
    });

    const peer0org2TLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org2.example.com',
      'peers', 'peer0.org2.example.com', 'msp', 'tlscacerts');
    const peer0org2TLSCACertsFiles = await fs.readdirSync(peer0org2TLSCACertsPath);
    peer0org2TLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.peers['peer0.org2.example.com'].tlsCACerts.path = path.resolve(peer0org2TLSCACertsPath, filename);
      }
    });

    const caorg2TLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org2.example.com', 'ca');
    const caorg2TLSCACertsFiles = await fs.readdirSync(caorg2TLSCACertsPath);
    caorg2TLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.certificateAuthorities['ca.org2.example.com'].tlsCACerts.path = path.resolve(caorg2TLSCACertsPath, filename);
      }
    });

    const jsonProfile = JSON.stringify(ccp);
    const profilePath = path.resolve(__dirname, '..', '..', '..', '..', 'gateway', 'org2Connection.json');
    await fs.writeFileSync(profilePath, jsonProfile);
    return ccp;
  } catch (err) {
    console.log(err);
    return err;
  }
};
