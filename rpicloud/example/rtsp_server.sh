#!/bin/bash

#raspivid -o - -t 0 -hf -w 640 -h 360 -fps 10 | cvlc -vvv stream:///dev/stdin --sout '#rtp{sdp=rtsp://:8554/live}' :demux=h264

raspivid --output - --timeout 0 -hf --width 640 --height 360 --framerate 15 --verbose --bitrate 12345678 | cvlc --file-caching --live-caching --network-caching -vvv - --sout '#rtp{sdp=rtsp://:8554/live1.sdp}' :demux=h264


