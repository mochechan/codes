#!/bin/bash
until [ 0 -eq 0];
do
	echo nc_server listening
	nc -l 12345 | tee -a /tmp/nc_server.log
done
