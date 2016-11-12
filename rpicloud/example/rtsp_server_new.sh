#!/bin/bash

# http://www.ics.com/blog/raspberry-pi-camera-module#.VJFhbyvF-b8
sudo modprobe bcm2835-v4l2
cvlc v4l2:///dev/video0 --v4l2-width 1920 --v4l2-height 1080 --v4l2-chroma h264 --sout '#rtp{sdp=rtsp://:12345/live1.sdp}' :demux=h264
