#!/bin/bash
echo "Register and Enrolling User $1 $2 $3 $4" 

CA_IP=`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ca.$2.example.com`
echo "IP of CA ( ca.$2.example.com ) server ${CA_IP}"
count=`cat /etc/hosts | sed -n "/ca.$2.example.com/p" | wc -l`
echo "-------START -----Adding CA server IP to hosts file"
if [ "${count}" -gt 0 ]
then
   echo "CA exists in hosts file Replace"
   echo blockchain | sudo -S sed -i "/ca.$2.example.com/c\ ${CA_IP}  ca.$2.example.com" /etc/hosts
else
   echo "CA doesn't exist in Hosts"
   echo blockchain | sudo -S sed -i "1i ${CA_IP} ca.$2.example.com" /etc/hosts    
fi
echo "------- END  -----Adding CA server IP to hosts file"
echo "-------START adding client ----- "
rm -f -R $HOME/fabric-ca/client/
export FABRIC_CA_CLIENT_HOME=$HOME/fabric-ca/client
mkdir  $HOME/fabric-ca/client/
echo "Copy Fabric CA Certificate to Client Folder "

cp ../../Vehicle-Network/crypto-config/peerOrganizations/$2.example.com/ca/ca.$2.example.com-cert.pem  $HOME/fabric-ca/client/
chmod +777 -R $HOME/fabric-ca/client/

fabric-ca-client enroll -u https://admin:adminpw@ca.$2.example.com:7054  --tls.certfiles ca.$2.example.com-cert.pem

ATTRS=role=$4:ecert
OUTPUT=$(fabric-ca-client register --id.type client --id.name $1 --id.affiliation $2.$3 --id.attrs ${ATTRS} --tls.certfiles ca.$2.example.com-cert.pem | tail -1)
PASSWORD=$(echo $OUTPUT | awk -F" " '{print $2}')

fabric-ca-client enroll -u https://$1:${PASSWORD}@ca.$2.example.com:7054  --tls.certfiles ca.$2.example.com-cert.pem
cp -r $HOME/fabric-ca/client/msp/signcerts $HOME/fabric-ca/client/msp/admincerts
