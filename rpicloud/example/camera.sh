#!/bin/bash
echo You should $ sudo raspi-config 
echo Choose 'Enable Camera' and press return

raspistill -o /tmp/test.jpg

sudo aptitude install libmicrohttpd-dev libjansson-dev libnice-dev libssl-dev libsrtp-dev libsofia-sip-ua-dev libglib2.0-dev libopus-dev libogg-dev libini-config-dev libcollection-dev pkg-config gengetopt libtool automake dh-autoreconf


git clone https://github.com/meetecho/janus-gateway.git
cd janus-gateway
sh autogen.sh
./configure --disable-websockets --disable-data-channels --disable-rabbitmq --disable-docs --prefix=/opt/janus
make
sudo make install
sudo make configs
sudo apt-get install gstreamer1.0

