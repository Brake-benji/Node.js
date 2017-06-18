/**
 * author:Mr.Xie
 * date:2017-06-03
 * node.js爬取慕课网课程信息demo，可通过此案例了解node.js爬虫和node.js中mysql的操作
 */
var http = require('http');
var cheerio = require('cheerio');
var mysql	= require('mysql');
var iconv = require('iconv-lite');

var connection = mysql.createConnection({
	host:'127.0.0.1',
	port:'3306',
	user:'root',
	password:'',
	database:'test'
});

connection.connect(function(err){
	if (err) {
		console.log('连接数据库失败，请重试');
		return;
	}
	console.log('数据库连接成功');
});

/*connection.query("select * from pdo where user = 'lisi'",function(err,rows,fields){
	if (err) {
		console.log('query err'+err);
	}
	console.log('结果如下：'+JSON.stringify(rows[0]));
});*/



var url = "http://www.imooc.com/learn/694";
http.get(url,function(res){
	var html = '';
	res.on('data',function(data){
		html += data;
	});

	res.on('end',function(){
		var courseData = filterChapters(html);
		insertCourseInfo(courseData);
	});
}).on('error',function(){
	console.log('获取数据失败');
});

function filterChapters(html){
	var $ = cheerio.load(html,{decodeEntities: false});
	var chapter = $('.chapter');
	var courseData = [];
	chapter.each(function(item){
		var chapter = $(this);
		var chapterTitle = chapter.find("strong").text();
		var videos = chapter.find(".video").children("li");
		var chapterData = {
			chapterTitle:chapterTitle,
			videos:[]
		}

		videos.each(function(item){
			var video = $(this).find(".J-media-item");
			var videoTitle = video.text();
			//console.log('title:'+videoTitle);
			var id = $(this).attr("data-media-id");
			var href = video.attr('href');
			chapterData.videos.push({
				title:videoTitle,
				id:id,
				href:href
			});
		});

		courseData.push(chapterData);
	});
	return courseData;

}

function insertCourseInfo(courseData){
	courseData.forEach(function(item){
		var sql = "INSERT INTO nodejs(vid,vtitle,vhref) VALUES(?,?,?)";
		item.videos.forEach(function(video){
			var params = [video.id,video.title,video.href];
			connection.query(sql,params,function(err,result){
				if (err) {
					console.log("INSERT INTO err"+err.message);
					return;
				}
				console.log(result);
			});
		});
	});
}
