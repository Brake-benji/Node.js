/*
 * author:Mr.Xie
 * date:2017-06-28
 * Node.js表单提交，通过此案例可以学习node.js表单处理方面的知识
 */

var http = require('http');
var querystring = require('querystring');

var sendData = querystring.stringify({
	'content':'这个课程非常值得学习~',  //评论内容，参数一
	'mid':11548  //课程视频地址,参数二
});

var options = {
	hostname:"www.imooc.com",
	port:80,
	path:'/course/docomment',
	method:"POST",
	headers:{
		"Accept":"application/json, text/javascript, */*; q=0.01",	
		"Accept-Encoding":"gzip, deflate",
		"Accept-Language":"zh-CN,zh;q=0.8",
		"Connection":"keep-alive",
		"Content-Length":sendData.length,
		"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
		"Cookie":"imooc_uuid=eb16f53b-99d5-4086-b20e-691f9f63579e; imooc_isnew_ct=1468063750; loginstate=1; apsid=E4ZGE4NGJkNjFkMjcyZjFhZjQzZjM2MWI2N2VkN2IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMzQwMTU4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGMxNTM5MWM2NDQ5ZGY0YmIzYzU4MWIxNWYzM2FhZGFh6cIZWenCGVk%3DMz; PHPSESSID=5a5hpi0a8i0rt9d8nt4fia3u44; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1494859816,1495265170,1495454764; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1495454971; Hm_lvt_f5127c6793d40d199f68042b8a63e725=1494859817,1495265171,1495454765; Hm_lpvt_f5127c6793d40d199f68042b8a63e725=1495454972; imooc_isnew=2; cvde=5922d3b88fac6-49",
		"Host":"www.imooc.com",
		"Origin":"http://www.imooc.com",
		"Referer":"http://www.imooc.com/video/11548",
		"User-Agent":"Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
		"X-Requested-With":"XMLHttpRequest"
	}
};

var request = http.request(options,function(res){
	console.log("Status:"+res.statusCode);
	console.log("headers:"+JSON.stringify(res.headers));

	res.on("data",function(chunk){
		console.log(Buffer.isBuffer(chunk));
		console.log(typeof chunk);
	});

	res.on("end",function(){
		console.log("评论发表成功！");
	});

});

request.on('error',function(err){
	console.log("Error:"+err.message);
});

request.write(sendData);
request.end();