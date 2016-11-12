#!/bin/bash

until [ 10 -lt 9 ]; 
do
	ping  -c 3 google.com
	el=$?
	echo errorlevel=$el
	if [ "$el" == "0" ]; then
		echo connection is good.
	else
		sudo poff -a
		sudo killall pppd
		sudo poff -a
		sleep 15
		sudo pon dsl-provider
		sleep 15
	fi
done
