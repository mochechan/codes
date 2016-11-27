/* UTF-8.UNIX

raspberry pi 2 
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

11/18 晚間於 sivann 取得二顆 relay+pir 並開始試用 

目前(心得/疑問/建議)記錄於以下原始碼中


*/


// https://github.com/bluetoother/ble-shepherd
// https://github.com/EasonChangOP/sivann-module-introduction/blob/master/Power-Meter-Relay%20.md  11/21 取得


// 建議: 能否讓 debug messages 為 option, 而不要 require 這些套件就顯示一堆 debug messages
// 疑問: 能否 sudo 即可使用這些套件，有什麼做法？ 


var BleShepherd = require('ble-shepherd');
var sivannRelayPlugin = require('bshep-plugin-sivann-relay'); 
var central = new BleShepherd('noble');
central.support('sivannRelay', sivannRelayPlugin);

["ready", "error", "permitJoin"].forEach((ev) => {
	central.on(ev, () => {
		console.log("on " + ev);
		//console.log(arguments);
	});
});


var relaypir = [{mac: "0x20c38ff1bb96"}, {mac: "0xd05fb820a6dd"}];


central.on('ind', (msg) => {
	console.log('on ind');
	console.log("msg.type: " + msg.type);
	console.log("msg.data: " + msg.data);
	//console.log("msg.periph");
	//console.log(msg.periph);
	console.log("msg.periph.addr: " + msg.periph.addr);

	console.log("msg.periph._original.services");
	for(var i in msg.periph._original.services){
		if(msg.periph._original.services[i].startHandle){
			var char = [];
			for(var j in msg.periph._original.services[i].charList){
				char.push(msg.periph._original.services[i].charList[j].uuid);
			}
			console.log("startHandle: " +
				msg.periph._original.services[i].startHandle + " endHandle: " +
				msg.periph._original.services[i].endHandle + " uuid: " +
				msg.periph._original.services[i].uuid + " charList: " + char.join(",")
			);
		}
	};

	var dev = msg.periph;

	switch(msg.type){
	case 'devIncoming':
		//疑問: 為什麼 event ind 被觸發二次，當連接一個裝置時。因為若會觸發多次，表示使用者的程式要處理這個問題。 
		console.log('Device Name: '	   + dev.dump('0x1800', '0x2a00').value.name);
		console.log('Manufacturer Name: ' + dev.dump('0x180a', '0x2a29').value.manufacturerName);
		console.log('Model Number: '	  + dev.dump('0x180a', '0x2a24').value.modelNum);
		console.log('Firmware Revision: ' + dev.dump('0x180a', '0x2a26').value.firmwareRev);
		console.log('Hardware Revision: ' + dev.dump('0x180a', '0x2a27').value.hardwareRev);
		console.log('Software Revision: ' + dev.dump('0x180a', '0x2a28').value.softwareRev);


		console.log(dev.name); //疑問: 不知道為什麼沒有資料 
//		if(dev.name === 'sivannRelay'){		} 
	break;

	case 'devLeaving': //疑問: 沒有看它觸發過
	break;
	case 'devStatus': //疑問: 沒有看它觸發過
	break;
	case 'devNeedPasskey':
	break;
	case 'attNotify': //疑問: PIR 變動並不會觸發
	break;
	case 'attChange': //疑問: PIR 變動並不會觸發
	break;
	default:
	break;
	}

});

central.blocker.enable('white');

console.log("central.starting");
central.start((err) => {
	if(err){
		console.log(err);
	} else {
		console.log("central started");
	}

	central.permitJoin(60);

	for(var i in relaypir){
		central.blocker.unblock(relaypir[i].mac);
		relaypir[i].found = central.find(relaypir[i].mac);
		//console.log(relaypir[i].mac);
		//console.log(relaypir[i].found);
		if(relaypir[i].found){
			relaypir[i].found.connect((err) => {
				if(err){ 
					console.log(err);
				} else {
					console.log("connected: " + relaypir[i].mac);
					relaypir[i].found.periph.configNotify("0xbb90", "0xcc06", true);
					relaypir[i].found.periph.onNotified("0xbb90", "0xcc06", function(err, data){
						if(err){
							throw err;
						} else {
							console.log(data);
						}
					});
				}
			});
		};
	};
});




