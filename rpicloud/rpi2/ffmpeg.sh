#!/bin/bash
# http://raspberrypi.stackexchange.com/questions/7446/how-can-i-stream-h-264-video-from-the-raspberry-pi-camera-module-via-a-web-serve
cd ~
git clone git://source.ffmpeg.org/ffmpeg.git
cd ffmpeg
./configure
make 
sudo make install 


