// JavaScript Document
<script src="assets/bootstrap/js/jquery/2.0.0/jquery.min.js"></script>
<script type="text/javascript" src="assets/js/fileinput.js" ></script>
<script type="text/javascript" src="assets/js/spark-md5.js"></script>
function calculate(){  
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
           // k.innerText="文件的hash值为："+spark.end();
			var k_search=spark.end();
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

	function analysis(){
	var data = new FormData();
	jQuery.each(jQuery('#file')[0].files,function(i,file){
		data.append('file-'+i,file);
	});
	//var a = document.getElementById('k').value;
	$.ajax({
    url:"/upload",    //请求的url地址
    dataType:"text",   //返回格式为json
	data:new FormData($('#form_post')[0]),
	processData:false,
	mimeType:"multipart/form-data",
	contentType:false,
	cache:false,
    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
    type:"POST",   //请求方式
    success:function(req){
		file_name.value=req.substring(0,14);
		var st = req.substring(30);
		
				  
		var jsonArray=eval(st);  
		for(var i=0; i<jsonArray.length; i++)   
        {   
			var json = eval(jsonArray[i]);
			var key = json.Key;  //主键
			var record = json.Record;
			var hash=record.hash;	//hash
			var keys=record.keys;	//keys
			var time=record.time;	//time
			
			var table=document.getElementById("table");
			var tr = "<tr><td>"  +"组织名称"+"</td><td>"+"法人"+"</td><td>"+"备注"+"</td></tr>";
			$("table").append(tr);

			var jsonArray=eval(st);  
			for(var i=0; i<jsonArray.length; i++)   
			{   
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
				//alert(time_bj);
				var tr = $("<tr><td>" +oname_td+"</td><td>"+pname_td+"</td><td>"+oth_td+"</td></tr>");
					//动态生成列表

				$("table").append(tr);
				
				var put_string = '{\\"filename\\":\\"'+filename_td+'\\",\\"oname\\":\\"'+oname_td+'\\",\\"pname\\":\\"'+pname_td+'\\",\\"oth\\":\\"'+oth_td+'\\"}';
				key_put=document.getElementById('key_put'); 
				key_put.value=put_string;
        }
		}
		
	}
    
});
}	
		 
	function judge(){
		
	var file_name=document.getElementById('file_name').value;
	var key_put=document.getElementById('key_put').value;
	var pk=document.getElementById('pk').value;
	$.ajax({
    url:"/put?filename="+file_name+"&keys="+key_put+"&pk="+pk,    //请求的url地址
    dataType:"text",   //返回格式为json
    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
    type:"GET",   //请求方式
    success:function(req){
		newData=req.replace(/\s/g,''); 
		var st = newData.substring(0);
		if(st[0]=="5")
		{
		
			alert("校验码错误！");
        }
			
		else{
			alert("提交成功！");

			}
		}
});
	}
			
	