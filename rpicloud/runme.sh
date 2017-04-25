#!/bin/bash

find node_modules -type f -print0 | xargs -0 ls -lt | head

rm -Rf node_modules/ble* node_modules/blshep*
npm install ble-shepherd bshep-plugin-sivann-weatherstation bshep-plugin-sivann-relay bshep-plugin-sivann-remotecontrol 

find node_modules -type f -print0 | xargs -0 ls -lt | head

node test.js


