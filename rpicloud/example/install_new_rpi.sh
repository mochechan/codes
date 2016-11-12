#!/bin/bash 
# installation for a new Raspberry PI updated: RASPBIAN JESSIE 20160916 
echo Please manually setup: 1 expand filesystem 2 enable camera 3 enable device tree

cd ~
cat /proc/version
cat /proc/cpuinfo
cat /proc/asound/cards # show all available sound cards 
cat /proc/asound/modules # show all available sound modules
vcgencmd measure_temp # show cpu temperature
vcgencmd get_mem arm && vcgencmd get_mem gpu # show free memory for cpu & gpu

df -k -h /
remainingK=$(($(stat -f --format="%a*%S" .))) 
echo $remainingK
echo please run sudo raspi-config manually before running this script.  Expand Filesystem and reboot
echo please run sudo raspi-config manually before running this script.  Expand Filesystem and reboot
if [ "$remainingK" -lt "9876543210" ]; then
	echo not enough space
	exit;
fi

if [ -d ~/rpicloud ]
then
	echo already installed
fi

tee ~/.profile <<EOF
# to correct Taiwan's timezone
TZ='Asia/Taipei'; export TZ
EOF

tee ~/.vimrc <<EOF
set number
set tabstop=2
EOF

sudo apt -y update
sudo apt -y full-upgrade 
sudo apt-get -y install vim screen lirc rtorrent alsa-utils htop exfat-fuse
git config --global user.email "chan@alumni.ncu.edu.tw"
git config --global user.name "mochechan"
git config --global push.default simple

echo nodejs should be installed manually because nodejs installed by apt-get is very old.
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g grunt http-server 

cd ~
git clone https://github.com/131/h264-live-player.git ~/h264-live-player
exit 99;
cd /tmp
wget https://nodejs.org/dist/v4.4.1/node-v4.4.1-linux-armv6l.tar.gz
tar -zxf node-v4.4.1-linux-armv6l.tar.gz
sudo mv -v node-v4.4.1-linux-armv6l/* /usr/local/
sudo npm install -g node-inspector http-server forever pm2 
exit 99;

#sudo rpi-update # Get the latest firmware, need to reboot


#echo nolirc=yes | sudo tee -a /etc/mplayer/mplayer.conf

echo to install bcm2835 driver http://www.airspayce.com/mikem/bcm2835/
cd /tmp
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.48.tar.gz
tar -zxf bcm2835-1.48.tar.gz
cd bcm2835-1.48
./configure
make
sudo make check
sudo make install


echo installing wiringPi,  driver for rpi gpio 
cd /tmp
git clone git://git.drogon.net/wiringPi
cd wiringPi
git pull origin
./build
gpio -v
gpio readall


echo installing Bluetooth+Airplay Audio Receiver
echo http://www.instructables.com/id/Raspberry-Pi-BluetoothAirplay-Audio-Receiver-combo/?ALLSTEPS
cd /tmp
git clone https://ehsmaes@bitbucket.org/ehsmaes/raspberry-pi-audio-receiver-install.git 
cd raspberry-pi-audio-receiver-install/
./runall.sh


echo camera to webrtc 
echo http://www.rs-online.com/designspark/electronics/blog/building-a-raspberry-pi-2-webrtc-camera
cd /tmp
raspistill -o /tmp/test.jpg
sudo aptitude install libmicrohttpd-dev libjansson-dev libnice-dev libssl-dev libsrtp-dev libsofia-sip-ua-dev libglib2.0-dev libopus-dev libogg-dev libini-config-dev libcollection-dev pkg-config gengetopt libtool automake dh-autoreconf

git clone https://github.com/meetecho/janus-gateway.git
cd janus-gateway
sh autogen.sh
./configure --disable-websockets --disable-data-channels --disable-rabbitmq --disable-docs --prefix=/opt/janus
make
sudo make install
sudo make configs
mv -vi /opt/janus/etc/janus/janus.plugin.streaming.cfg /opt/janus/etc/janus/janus.plugin.streaming.cfg.bak
cp -avi ./example/janus.plugin.streaming.cfg /opt/janus/etc/janus/janus.plugin.streaming.cfg
sudo apt-get -y install gstreamer1.0



echo installing vsftpd
sudo apt-get install vsftpd
echo 'local_enable=YES' | sudo tee -a /etc/vsftpd.conf
echo 'write_enable=YES' | sudo tee -a /etc/vsftpd.conf
sudo service vsftpd restart


exit 0;
# http://www.raywenderlich.com/44918/raspberry-pi-airplay-tutorial
# http://raspberryalphaomega.org.uk/2014/06/11/installing-and-using-node-js-on-raspberry-pi/
# http://node-arm.herokuapp.com/
# version of nodejs installed by apt-get is too old 


# already refactor to *.sh 
#sudo apt-get -y install python-pip 
#sudo pip install pibrella
#sudo apt-get -y install python3-pip
#sudo pip-3.2 install pibrella


# screen -S automatically starts in /etc/rc.local (good)
#su - username -c "/usr/bin/screen -dmS test bash -c '/var/www/path/to/script/script.sh; exec bash'"
/bin/su username -c "/usr/bin/screen -dmS test bash -c '/home/username/test.sh; exec bash'"


echo samba server
sudo apt-get -y install samba samba-common-bin
sudo cp -avi /etc/samba/smb.conf /etc/samba/smb.conf.old




