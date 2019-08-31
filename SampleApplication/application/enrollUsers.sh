
#!/bin/bash
echo " enroll Admin and users"

curl -X GET "http://localhost:6001/api/v1/auth/registrar/enroll" -H  "accept: */*"

curl -X GET "http://localhost:6002/api/v1/auth/registrar/enroll" -H  "accept: */*"

curl -X GET "http://localhost:6003/api/v1/auth/registrar/enroll" -H  "accept: */*"

curl -X GET "http://localhost:6003/api/v1/auth/create-affiliation" -H  "accept: */*"
curl -X POST "http://localhost:6001/api/v1/auth/user/register-enroll" -H  "accept: */*" -H  "Content-Type: application/json" -d "{\"enrollmentID\":\"user1\"}"

curl -X POST "http://localhost:6002/api/v1/auth/user/register-enroll" -H  "accept: */*" -H  "Content-Type: application/json" -d "{\"enrollmentID\":\"user2\"}"

curl -X POST "http://localhost:6003/api/v1/auth/user/register-enroll" -H  "accept: */*" -H  "Content-Type: application/json" -d "{\"enrollmentID\":\"user3\"}"

echo "Admins and Users are enrolled in the 3 applications"



