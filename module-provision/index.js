var childProcess = require('child_process');
var request = require('request');
var async = require('async');
var fs = require('fs');
var crypt = require('../module-crypt/index.js');

function provision() {
	request({
		method: 'POST',
		url: 'http://164.67.61.172:4646/provision',
		data: {
			key: crypt.generateAuth()
		}
	}, function(err, response, body) {
		var info = JSON.parse(body);
		console.log(info);
		fs.writeFileSync('/etc/machine-info', 'PRETTY_HOSTNAME=GLPI-'+info.name);
		childProcess.exec('sudo service bluetooth restart');
		console.log("Provisioning complete");
	});
}
