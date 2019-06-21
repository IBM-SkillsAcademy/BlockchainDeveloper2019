'use strict';

const path = require('path');
const fs = require('fs');

exports.getCCP = async () => {
  try {
    const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'gateway', 'connection-org3-template.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    let ccp = JSON.parse(ccpJSON);

    // update certs
    const ordererTLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'org3-artifacts', 'crypto-config', 'ordererOrganizations',
      'example.com', 'orderers', 'orderer.example.com', 'msp', 'tlscacerts');
    const ordererTLSCACertsFiles = await fs.readdirSync(ordererTLSCACertsPath);
    ordererTLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.orderers['orderer.example.com'].tlsCACerts.path = path.resolve(ordererTLSCACertsPath, filename);
      }
    });

    const peer0org3TLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'org3-artifacts', 'crypto-config', 'peerOrganizations',
      'org3.example.com', 'peers', 'peer0.org3.example.com', 'msp', 'tlscacerts');
    const peer0org3TLSCACertsFiles = await fs.readdirSync(peer0org3TLSCACertsPath);
    peer0org3TLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.peers['peer0.org3.example.com'].tlsCACerts.path = path.resolve(peer0org3TLSCACertsPath, filename);
      }
    });

    const peer1org3TLSCACertsPath = path.resolve(process.env.FABRIC_SAMPLES_PATH,
      'first-network', 'org3-artifacts', 'crypto-config', 'peerOrganizations',
      'org3.example.com', 'peers', 'peer1.org3.example.com', 'msp', 'tlscacerts');
    const peer1org3TLSCACertsFiles = await fs.readdirSync(peer1org3TLSCACertsPath);
    peer1org3TLSCACertsFiles.forEach((filename) => {
      if (filename.includes('.pem')) {
        ccp.peers['peer1.org3.example.com'].tlsCACerts.path = path.resolve(peer1org3TLSCACertsPath, filename);
      }
    });

    const jsonProfile = JSON.stringify(ccp);
    const profilePath = path.resolve(__dirname, '..', '..', '..', '..', 'gateway', 'connection-org3.json');
    await fs.writeFileSync(profilePath, jsonProfile);
    return ccp;
  } catch (err) {
    console.log(err);
    return err;
  }
};
