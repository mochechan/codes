#!/bin/bash
date
docker build --file Dockerfile.rpi2 --build-arg USER=$USER --tag jessie .
date
docker run -it --rm --volume /home/pi:/home/pi --workdir /home/pi --user $USER jessie /bin/bash

exit;
# This script deletes all docker images.
docker images
docker --log-level="debug" stop  $(docker ps -a -q)
docker --log-level="debug" rm -f $(docker ps -a -q)
docker --log-level="debug" rmi -f $(docker images -a -q)
docker --log-level="debug" volume ls -qf dangling=true | xargs -r docker volume rm 
docker images

