#!/bin/bash
ROOT=${PWD} # save current directory

# check if wallet exist for every org
if [ -d "${ROOT}/org1/" ]; then
  cd ${ROOT}/org1/
  rm -f -R  wallet
fi
if [ -d "${ROOT}/org2/wallet" ]; then
  cd ${ROOT}/org2/
  rm -f -R  wallet
fi
if [ -d "${ROOT}/org3/wallet" ]; then
  cd ${ROOT}/org3/
  rm -f -R  wallet
fi

