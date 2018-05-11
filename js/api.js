var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var neb = new Neb();


var nebHost_test = 'https://testnet.nebulas.io' //测试环境域名
var nebHost = 'https://mainnet.nebulas.io' //线上环境域名

neb.setRequest(new HttpRequest(nebHost));

var chainid = 1; //链id
var keyfile = null; //钱包文件

var config = {
	userAddress:"n1LEa5fbHz9jWZcSL79vUMd3dUy57KsXbK6",
	contractAdress : "n1jdBJ9ayrVf8uBN9jJX6L54mBzQkGwRDGd",
	value:0,
	nonce:0,
	func:'clockRecord',
	args:"[]"
}


function webGetNonce(config){ //获取nonoce
	return neb.api.getAccountState({
		address: config.userAddress
	})
}


function webCall(config){  //查询
	return neb.api.call( {
		chainID:chainid,
		from: config.userAddress,
		to: config.contractAdress,
		value: config.value,
		nonce:  config.nonce,
		gasPrice: 1000000,
		gasLimit: 2000000,
		contract: {
			function: config.func,
			args: config.args
		}
	})
}



function webTransaction(config){ //交易
	try{
		var tx = new Transaction({
			chainID:chainid,
			from:account,
			to: config.contractAdress,
			value: config.value,
			nonce: config.nonce,
			gasPrice: 1000000,
			gasLimit: 2000000,
			contract: {
				function:config.func,
				args: config.args
			}
		});
		console.log('-----------------查询tx----------------')
		console.log(tx)
		console.log('-----------------查询tx----------------')
	}
	catch(err){
		console.log(err)
	}
	tx.signTransaction();
	console.log(tx)
	try{
		return neb.api.sendRawTransaction({
			data: tx.toProtoString()
		})
	}
	catch(err){
		alert(err)
	}
}


function getKeyFile(ctx,event){ //获取选择的钱包文件
	return new Promise(function(resolve,reject){
		var $this = $(ctx),
			file = event.target.files[0],
			fr = new FileReader();
		fr.onload = onload;
		fr.readAsText(file);
		function onload(e) {
			try {
				keyfile = JSON.parse(e.target.result);
				$('#test-address').text('已选择钱包')
			} catch (e) {
				resolve({  //获取选择的钱包文件返回错误信息
					ret:1,
					msg:e
				});
			}
			resolve({ //获取选择的钱包文件返回 keyfile
				ret:0,
				msg:'获取钱包成功',
				keyfile : keyfile
			}) 
		}
	})
}

function validateWallet(keyfile,password){//校验选择的钱包文件账户和密码
	return new Promise(function(resolve,reject){
		account = new Account();
		try {
			account.fromKey(keyfile,password);
		} catch (e) {
			resolve({  //校验失败返回错误信息
				ret:1,
				msg:e
			});
		}
		resolve({   //校验成功返回 userAddress,account
			ret:0,
			msg:'登录成功',
			userAddress : account.getAddressString(),
			account : account
		}) 
	})
	
}





