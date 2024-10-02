#!/usr/bin/env bash

#cp -r ./build/ ../nodeeweb-server/theme &&
rm -rf ../server/front/* && cp -r ./build/ ../server/front && rm -rf ../server/packages/server/front/* && cp -r ./build/ ../server/packages/server/front/
