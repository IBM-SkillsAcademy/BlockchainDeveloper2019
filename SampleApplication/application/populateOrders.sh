#!/bin/bash
echo " Populate Ledger with Default Orders"

curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"Order1\",\"manufacturer\":\"Honda\",\"model\":\"Civic\",\"color\":\"Black\",\"owner\":\"Tom\"}"

curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"Order2\",\"manufacturer\":\"Toyota\",\"model\":\"Prius\",\"color\":\"Blue\",\"owner\":\"Alan\"}"

curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"Order3\",\"manufacturer\":\"Volklswagen\",\"model\":\"Passat\",\"color\":\"Red\",\"owner\":\"John\"}"

curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"Order4\",\"manufacturer\":\"Toyota\",\"model\":\"Accord\",\"color\":\"Black\",\"owner\":\"Smith\"}"

curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"order5\",\"manufacturer\":\"Hyundai\",\"model\":\"Tucson\",\"color\":\"Blue\",\"owner\":\"cathi\"}"



curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"Order6\",\"manufacturer\":\"Honda\",\"model\":\"Civic\",\"color\":\"Black\",\"owner\":\"Adams\"}"

curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"Order7\",\"manufacturer\":\"Toyota\",\"model\":\"Prius\",\"color\":\"Blue\",\"owner\":\"Henery\"}"

curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"Order8\",\"manufacturer\":\"Volklswagen\",\"model\":\"Passat\",\"color\":\"Red\",\"owner\":\"Julia\"}"

curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"Order9\",\"manufacturer\":\"Toyota\",\"model\":\"Accord\",\"color\":\"Black\",\"owner\":\"Chris\"}"

curl -X POST "http://localhost:6001/api/v1/vehicles/orders" -H  "accept: */*" -H  "enrollment-id: user1" -H  "Content-Type: application/json" -d "{\"orderID\":\"order10\",\"manufacturer\":\"Hyundai\",\"model\":\"Tucson\",\"color\":\"Blue\",\"owner\":\"James\"}"
