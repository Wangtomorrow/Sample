<script src="assets/bootstrap/js/jquery/2.0.0/jquery.min.js"></script>
<script type="text/javascript" src="assets/js/fileinput.js" ></script>
<script type="text/javascript" src="assets/js/spark-md5.js"></script>
var k_search;
function calculate(){ 
	clear();
    var fileReader = new FileReader(),  
    k=document.getElementById('k'); 
    blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,  
    file = document.getElementById("file").files[0],  
    chunkSize = 2097152,  
    // read in chunks of 2MB  
    chunks = Math.ceil(file.size / chunkSize),  
    currentChunk = 0,  
    spark = new SparkMD5();  
	
    fileReader.onload = function(e) {  
        console.log("read chunk nr", currentChunk + 1, "of", chunks);  
        spark.appendBinary(e.target.result); // append binary string  
        currentChunk++;  

        if (currentChunk < chunks) {  
            loadNext();  
        }  
        else {  
            console.log("finished loading");  
			var flag = spark.end();
            k.innerText="文件的hash值为："+flag;
			k_search=flag;
            console.info("computed hash", spark.end()); // compute hash  
        }  
    };  

    function loadNext() {  
        var start = currentChunk * chunkSize,  
            end = start + chunkSize >= file.size ? file.size : start + chunkSize;  

        fileReader.readAsBinaryString(blobSlice.call(file, start, end));  
    };  

    loadNext();  
}  

	function clear(){
			$("#table tbody").html("");
		}
	function search(){
		clear();
		//var a = document.getElementById('k').value;
		$.ajax({
		url:"/sign?hash="+k_search,    //请求的url地址
		dataType:"text",   //返回格式为json
		async:true,//请求是否异步，默认为异步，这也是ajax重要特性
		type:"GET",   //请求方式
		success:function(req){
			var st = req.substring(14);
			if(st[1]!="]"){
					var table=document.getElementById("table");
					var tr = "<tr><td>"  + "hash值" + "</td><td>" +"组织名称"+"</td><td>"+"法人"+"</td><td>"+"备注"+"</td><td>"+"修改时间"+"</td></tr>";
					$("table").append(tr);
					var jsonArray=eval(st);  
					for(var i=0; i<jsonArray.length; i++) {   
						var json = eval(jsonArray[i]);
						var key = json.Key;  //主键
						var record = json.Record;
						var hash=record.hash;	//hash
						var keys=record.keys;	//keys
						var filename_td = keys.filename;
						var oname_td = keys.oname;
						var pname_td = keys.pname;
						var oth_td = keys.oth;
						var time=record.time;	//time
						time = time*1000;
							var date = new Date(time);
							Y = date.getFullYear() + '-';
							M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
							D = date.getDate() + ' ';
							h = date.getHours() + ':';
							m = date.getMinutes() + ':';
							s = date.getSeconds(); 
							var time_bj=Y+M+D+h+m+s;
						var tr = $("<tr><td>" + hash + "</td><td>" +oname_td+"</td><td>"+pname_td+"</td><td>"+oth_td+"</td><td>"+time_bj+"</td></tr>");
						//动态生成列表
						$("table").append(tr);

					}
				}
			else{
				alert("未查询到信息！");
			}

		}
	});
	}