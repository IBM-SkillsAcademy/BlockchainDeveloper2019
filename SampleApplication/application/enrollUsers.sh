#!/bin/bash
echo " enroll Admin and users"
sleep 10

curl -X GET "http://localhost:6001/api/v1/auth/registrar/enroll" -H  "accept: */*"

curl -X GET "http://localhost:6002/api/v1/auth/registrar/enroll" -H  "accept: */*"

curl -X GET "http://localhost:6003/api/v1/auth/registrar/enroll" -H  "accept: */*"
sleep 5
curl -X GET "http://localhost:6003/api/v1/auth/create-affiliation" -H  "accept: */*"
sleep 5
curl -X POST "http://localhost:6001/api/v1/auth/user/register-enroll" -H  "accept: */*" -H  "Content-Type: application/json" -d "{\"enrollmentID\":\"Manu-User\"}"

curl -X POST "http://localhost:6002/api/v1/auth/user/register-enroll" -H  "accept: */*" -H  "Content-Type: application/json" -d "{\"enrollmentID\":\"Regu-User\"}"

curl -X POST "http://localhost:6003/api/v1/auth/user/register-enroll" -H  "accept: */*" -H  "Content-Type: application/json" -d "{\"enrollmentID\":\"Insu-User\"}"

echo "Admins and Users are enrolled in the 3 applications"



