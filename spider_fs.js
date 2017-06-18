/**
 * author:Mr.Xie
 * date:2017-06-18
 * node.js爬取中国国家地理分类中的图片，可通过此案例了解node.js爬虫和node.js中的文件操作
 */
var http = require('http'),
    cheerio = require('cheerio'),
    fs  = require('fs');

//示例网址：http://www.dili360.com/Gallery/cate/1/1.htm
var url = "http://www.dili360.com/Gallery/cate/1/";
var imgUrls = [];

function filterHtml(url){
    var pageData = "";
    var req = http.get(url,function(res){
        res.setEncoding("utf-8");
        res.on("data",function(chunk){
            pageData += chunk;
        });

        res.on("end",function(){
            var $ = cheerio.load(pageData);
            var imgList = $(".gallery-block-small li");
            if (imgList.length < 0) {
                return false;
            }
            imgList.each(function(item){
                var list = $(this);
                var src = list.find(".img img").attr("src");
                if (src.indexOf("http://img0.dili360.com") > -1) {
                    imgUrls.push(src);
                }
            });

            console.log("图片总数："+imgUrls.length);
            if (imgUrls.length > 0) {
                saveImg(imgUrls.pop());
            }else{
                console.log("图片下载完毕！");
            }
        });
    });
}

function saveImg(imgurl){
    var arr = imgurl.replace("http://img0.dili360.com/rw2/ga/","").split("/");
    http.get(imgurl,function(res){
        var imgData = "";
        //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.setEncoding("binary");
        res.on("data",function(chunk){
            imgData += chunk;
        });

        res.on("end",function(){
            var savePath = "./spider_img/"+arr[3];
            fs.exists('./spider_img/',(exists) => {
                if (exists) {
                    fs.writeFile(savePath,imgData,"binary",function(err){
                        if (err) {
                            console.log("writeFile error:"+err);
                        }else{
                            console.log("文件名："+arr[3]);
                            if (imgUrls.length > 0) {
                                saveImg(imgUrls.pop());
                            }else{
                                console.log("文件下载完毕");
                            }
                        }
                    });
                }else{
                    //文件夹不存在，创建文件夹并写入文件
                    fs.mkdir('./spider_img/',function(err){
                        if (err) {
                            console.log("创建文件夹失败："+err);
                        }else{
                            fs.writeFile(savePath,imgData,"binary",function(err){
                                if (err) {
                                    console.log("writeFile error:"+err);
                                }else{
                                    console.log("文件名："+arr[3]);
                                    if (imgUrls.length > 0) {
                                        saveImg(imgUrls.pop());
                                    }else{
                                        console.log("文件下载完毕");
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
    });
}

function spiderStart(){
    for (var i = 1; i <= 10; i++) {
       filterHtml(url+i+".htm");
    }
}
spiderStart();