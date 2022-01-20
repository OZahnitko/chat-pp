#!/bin/bash
rm -rf ./chat-message/build
cp {package.json,tsconfig.json} ./chat-message
cd chat-message
yarn install
yarn build
rm -rf node_modules package.json tsconfig.json yarn.lock