#!/bin/bash

docker kill $(docker ps --quiet)

docker run --rm --name mongodb -p 27017:27017 --volume /data/ipcams/mongodbdata:/data/db -itd mongo
# TODO: mongodb does not work currently
#docker run --rm -itd -p 8008:80 -e "MONGO_SERVER=localhost" --link mongodb:db --name rockmongo webts/rockmongo

#docker run -it --volume /data/ipcams/gethRoot:/root ethereum/client-go init /root/mobileherogenesis.json

docker run --cpuset-cpus="0" -itd -p 30303:30303 -p 8545:8545 -p 8546:8546 --volume /data/ipcams/gethRoot:/root  ethereum/client-go --identity "mobilehero_blockchain"   --port 30303 --nodiscover --maxpeers 9 --rpc --rpcaddr 0.0.0.0 --rpccorsdomain "*" --rpcport 8545 --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --networkid 543 --nat "any" --verbosity 6 console
sleep 5

docker exec -it $(docker ps --filter expose=30303 --quiet) geth attach --exec "personal.unlockAccount(eth.accounts[0],'',9999999); miner.start()"


# docker run -it --volume /data/ipcams/rinkeby:/root/.ethereum ethereum/client-go init /root/.ethereum/rinkeby.json
#docker run -it -p 8545:8545 -p 30303:30303 --volume /data/ipcams/rinkeby:/root/.ethereum  ethereum/client-go --rpc --rpcaddr "0.0.0.0" --networkid=4 --cache=512 --bootnodes=enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303 --rpcapi="personal,eth,network"
# docker exec -it xxxx /bin/sh

#find node_modules -type f -print0 | xargs -0 ls -lt | head

#rm -Rf node_modules/ble* node_modules/blshep*
#npm install ble-shepherd bshep-plugin-sivann-weatherstation bshep-plugin-sivann-relay bshep-plugin-sivann-remotecontrol

#find node_modules -type f -print0 | xargs -0 ls -lt | head

node test.js


exit


###############################################
https://ethereum.github.io/go-ethereum/downloads/
download: the last stable and all tools
