#!/bin/bash
$1 $2 $3 $4
echo "Register and Enrolling User " echo $1 

CA_IP=`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ca.$3.example.com`
echo "IP of CA ( ca.$3.example.com ) server "
count=`cat /etc/hosts | sed -n "/ca.$3.example.com/p" | wc -l`
echo "-------START -----Adding CA server IP to hosts file"
if [ "${count}" -gt 0 ]
then
 echo "CA exists in hosts file Replace"
   sed -i "/ca.$3.example.com/c\ ${CA_IP}  ca.$3.example.com" /etc/hosts
else
    echo " CA doesn't exist in Hosts"
   sed -i "1i ${CA_IP} ca.$3.example.com" /etc/hosts    
fi
echo "------- END  -----Adding CA server IP to hosts file"
echo "-------START adding client ----- "
rm -f -R $HOME/fabric-ca/client/
export FABRIC_CA_CLIENT_HOME=$HOME/fabric-ca/client
mkdir  $HOME/fabric-ca/client/
echo "Copy Fabric CA Certificate to Client Folder "

cp ../../Vehicle-Network/crypto-config/peerOrganizations/org1.example.com/ca/ca.$3.example.com-cert.pem  $HOME/fabric-ca/client/
chmod +777 -R $HOME/fabric-ca/client/

fabric-ca-client enroll -u https://admin:adminpw@ca.$3.example.com:7054  --tls.certfiles ca.$3.example.com-cert.pem

fabric-ca-client register --id.type client --id.name $1 --id.affiliation $2 --id.attrs 'role=$4:ecert' --tls.certfiles ca.$3.example.com-cert.pem