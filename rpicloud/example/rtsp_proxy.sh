#!/bin/bash
#cvlc rtsp://192.168.0.103/live1.sdp --sout "#rtp{sdp=rtsp://:8554/live123.sdp}" :sout-keep
cvlc rtsp://192.168.0.103/live1.sdp --sout "#rtp{sdp=rtsp://:8554/live123.sdp}" :demux=h264

