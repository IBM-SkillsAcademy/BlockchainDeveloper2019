#!/bin/bash
echo "Configure CA Container $1" 

CA_IP=`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ca.$1.example.com`
echo "IP of CA ( ca.$1.example.com ) server ${CA_IP}"
count=`cat /etc/hosts | sed -n "/ca.$1.example.com/p" | wc -l`
echo "-------START -----Adding CA server IP to hosts file"
if [ "${count}" -gt 0 ]
then
   echo "CA exists in hosts file Replace"
   echo blockchain | sudo -S sed -i "/ca.$1.example.com/c\ ${CA_IP}  ca.$1.example.com" /etc/hosts
else
   echo "CA doesn't exist in Hosts"
   echo blockchain | sudo -S sed -i "1i ${CA_IP} ca.$1.example.com" /etc/hosts    
fi
echo "------- END  -----Adding CA server IP to hosts file"
