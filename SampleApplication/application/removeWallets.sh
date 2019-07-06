#!/bin/bash
ROOT=${PWD} # save current directory

# check if wallet exist for every org
if [ -d "${ROOT}/manufacturer/wallet" ]; then
  cd ${ROOT}/manufacturer/
  rm -f -R  wallet
fi
if [ -d "${ROOT}/regulator/wallet" ]; then
  cd ${ROOT}/regulator/
  rm -f -R  wallet
fi
if [ -d "${ROOT}/insurer/wallet" ]; then
  cd ${ROOT}/insurer/
  rm -f -R  wallet
fi

