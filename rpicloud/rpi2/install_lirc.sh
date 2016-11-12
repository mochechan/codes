#!/bin/bash
echo installing lirc for raspberry pi 2
# http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/
# https://github.com/OpenELEC/OpenELEC.tv/issues/3908
sudo apt-get -y install lirc 
echo 'dtoverlay=lirc-rpi,gpio_in_pin=18,gpio_out_pin=22' | sudo tee -a /boot/config.txt
#sudo modprobe lirc_rpi
echo lirc_dev | sudo tee -a /etc/modules
echo lirc_rpi gpio_in_pin=18 gpio_out_pin=22 | sudo tee -a /etc/modules

sudo mv -vi /etc/lirc/lircd.conf /etc/lirc/lircd.conf.bak
tee /etc/lirc/hardware.conf <<EOF
# /etc/lirc/hardware.conf
#
# Arguments which will be used when launching lircd
LIRCD_ARGS="--uinput"

#Don't start lircmd even if there seems to be a good config file
#START_LIRCMD=false

#Don't start irexec, even if a good config file seems to exist.
#START_IREXEC=false

#Try to load appropriate kernel modules
LOAD_MODULES=true

# Run "lircd --driver=help" for a list of supported drivers.
DRIVER="default"
# usually /dev/lirc0 is the correct setting for systems using udev 
DEVICE="/dev/lirc0"
MODULES="lirc_rpi"

# Default configuration files for your hardware if any
LIRCD_CONF=""
LIRCMD_CONF=""
EOF


exit 99;
#sudo /etc/init.d/lirc stop 
#mode2 -d /dev/lirc0
#sudo /etc/init.d/lirc restart 
#irrecord --disable-namespace --force --device=/dev/lirc0 apple_remote
#irw 
#irsend SEND_ONCE apple_remote up

