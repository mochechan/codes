#!/bin/bash

while [  1 -lt 10 ]; do
	echo starting...
	$*
	sleep 3
done


exit 0;

in /etc/rc.local
/bin/su root -c "/usr/bin/screen -dmS rpicloud bash -c 'cd /home/pi/codes/rpicloud; ./forever.sh node test.js; exec bash'"


