var NodeRSA = require('node-rsa');
var fs = require('fs');

function Crypto(keyPath) {
	this.rsa = new NodeRSA(fs.readFileSync(keyPath, {encoding: 'utf8'}));
	this.encrypt = function(str) {
		return this.rsa.encrypt(str, 'base64');
	}
	this.decrypt = function(str) {
		return this.rsa.decrypt(str, 'utf8');
	}
	return this;
}

var crypto = new Crypto('./key.pem');
function authValid(str) {
	try {
		str = crypto.decrypt(str);
		var time = parseInt(str.substr(0, 13));
		var pass = str.substr(13);
		if (Date.now() - time < 10000 && pass === "fad87b8e06f1c8f6c181b9b6af8feee3925d92cf053e291530d82ef4d3890bb8") {
			return true;
		}
	} catch (e) {
		return false;
	}

	return false;
}

function generateAuth() {
	try {
		return crypto.encrypt((Date.now().toString()) + "fad87b8e06f1c8f6c181b9b6af8feee3925d92cf053e291530d82ef4d3890bb8");
	} catch (e) {
		return "";
	}
	return "";
}

module.exports = {
	authValid: authValid,
	generateAuth: generateAuth,
	Crypto: Crypto,
};
