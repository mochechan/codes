#!/bin/bash
echo This script installs some necessary packages for my raspberry pi 2.

echo Installing docker
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker pi

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt -y install nodejs

cd ~

echo This rpi2 has a rpi camera.
git clone https://github.com/131/h264-live-player.git ~/h264-live-player
cd ~/h264-live-player


# https://learn.adafruit.com/dht-humidity-sensing-on-raspberry-pi-with-gdocs-logging?view=all
cd ~
echo This rpi2 has a dht11 sensor.
git clone https://github.com/adafruit/Adafruit_Python_DHT.git
sudo apt-get -y install build-essential python-dev python-openssl
cd ~/Adafruit_Python_DHT
sudo python setup.py install
echo Just execute sudo ~/Adafruit_Python_DHT/examples/AdafruitDHT.py 11 12

echo This rpi2 has a lirc receiver.


echo This rpi2 has a lirc emitter.

