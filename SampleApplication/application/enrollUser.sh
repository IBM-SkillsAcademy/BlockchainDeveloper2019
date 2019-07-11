#!/bin/bash
$1
echo "Register and Enrolling User " echo $1 

CA_IP=`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ca.org1.example.com`
ech "IP of CA ( ca.org1.example.com ) server "
count=`cat /etc/hosts | sed -n "/ca.org1.example.com/p" | wc -l`
echo "-------START -----Adding CA server IP to hosts file"
if [ "${count}" -gt 0 ]
then
 echo "CA exists in hosts file Replace"
   sed -i "/ca.org1.example.com/c\ ${CA_IP}  ca.org1.example.com" /etc/hosts
else
    echo " CA doesn't exist in Hosts"
   sed -i "1i ${CA_IP} ca.org1.example.com" /etc/hosts    
fi
echo "------- END  -----Adding CA server IP to hosts file"
echo "-------START adding client ----- "
export FABRIC_CA_CLIENT_HOME=$HOME/fabric-ca/client
echo "Copy Fabric CA Certificate to Client Folder "
cp ../../Vehicle-Network/crypto-config/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem  $HOME/fabric-ca/client/
chmod +777 -R $HOME/fabric-ca/client/

fabric-ca-client enroll -u https://admin:adminpw@ca.org1.example.com:7054  --tls.certfiles ca.org1.example.com-cert.pem

fabric-ca-client register --id.type client --id.name $1 --id.affiliation org1.department1 --id.attrs 'role=Manufacturer' --id.attrs 'hf.Revoker=true,admin=true:ecert' --tls.certfiles ca.org1.example.com-cert.pem 
