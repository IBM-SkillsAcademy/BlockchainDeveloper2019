#!/bin/bash
ROOT=${PWD} # save current directory

# stop all applications with pm2
cd ${ROOT}/unitTest/
node_modules/pm2/bin/pm2 delete all