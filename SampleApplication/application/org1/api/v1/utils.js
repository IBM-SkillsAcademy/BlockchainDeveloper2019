'use strict';

const path = require('path');
const fs = require('fs');

exports.getCCP = async () => {
  try {
    const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'gateway', 'connection-org1-template.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    let ccp = JSON.parse(ccpJSON);

    // update certs
    const ordererTLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'ordererOrganizations', 'example.com',
      'orderers', 'orderer.example.com', 'msp', 'tlscacerts');
    const ordererTLSCACertsFiles = await fs.readdirSync(ordererTLSCACertsPath);
    ordererTLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.orderers['orderer.example.com'].tlsCACerts.path = path.resolve(ordererTLSCACertsPath, filename);
      }
    });

    const peer0org1TLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org1.example.com',
      'peers', 'peer0.org1.example.com', 'msp', 'tlscacerts');
    const peer0org1TLSCACertsFiles = await fs.readdirSync(peer0org1TLSCACertsPath);
    peer0org1TLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.peers['peer0.org1.example.com'].tlsCACerts.path = path.resolve(peer0org1TLSCACertsPath, filename);
      }
    });

    const peer1org1TLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org1.example.com',
      'peers', 'peer1.org1.example.com', 'msp', 'tlscacerts');
    const peer1org1TLSCACertsFiles = await fs.readdirSync(peer1org1TLSCACertsPath);
    peer1org1TLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.peers['peer1.org1.example.com'].tlsCACerts.path = path.resolve(peer1org1TLSCACertsPath, filename);
      }
    });

    const caorg1TLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'crypto-config', 'peerOrganizations', 'org1.example.com', 'ca');
    const caorg1TLSCACertsFiles = await fs.readdirSync(caorg1TLSCACertsPath);
    caorg1TLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.certificateAuthorities['ca.org1.example.com'].tlsCACerts.path = path.resolve(caorg1TLSCACertsPath, filename);
      }
    });

    const jsonProfile = JSON.stringify(ccp);
    const profilePath = path.resolve(__dirname, '..', '..', '..', '..', 'gateway', 'connection-org1.json');
    await fs.writeFileSync(profilePath, jsonProfile);
    return ccp;
  } catch (err) {
    console.log(err);
    return err;
  }
};
