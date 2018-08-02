#version:trans_version_1.1
#datafrom:https://www.godic.net/
#author:wzy
#for:lvjing
#time:2018.07.27
#contact:914606466@qq.com
import urllib.request
import urllib.parse
import json
from bs4 import BeautifulSoup
import html5lib
import re
import io
import sys
import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='gb18030') #改变标准输出的默认编码

#读取文件
f_read = open("read.txt")
content = f_read.readline()
#创建文件
nowtime = datetime.datetime.now().strftime("%Y-%m-%d-%H_%M_%S") #获取当前时间
f = open("%s.txt"%(nowtime),"w",encoding='utf-8')

while content:
    content = content.strip('\n')
    url = 'https://www.godic.net/'
    data = {}       #创建一个data字典
    data['type'] = 'AUTO'
    data['inputword']= content
    data['platform']='desktop'
    data['searchtype']='search_dict'
    data['platform']='desktop'
    data['recordid']=''
    data['forcecg']='false'
    data['cgformidx']='0'
    data = urllib.parse.urlencode(data).encode('utf-8')

    req = urllib.request.Request(url, data)
    req.add_header('User-Agent',
                   'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36')

    response = urllib.request.urlopen(req)
    html = response.read()  #整个网页

    soup = BeautifulSoup(html, 'html5lib')

    #正则
    pattern = re.compile(">(.*)<")
    pattern_1 = re.compile("(?<=<br/>).+?(?=<)")
    pattern_2 = re.compile("(?<=<i>).+?(?=</i>)")
    pattern_3 = re.compile('(?<=<p class="line">).+?(?=<span class="key">)')
    pattern_4 = re.compile('(?<=<span class="key">).+?(?=</span>)')
    pattern_5 = re.compile('(?<=</span>).+?(?=</p>)')
    pattern_6 = re.compile('(?<=n>).+?(?=<b)')
    pattern_7 = re.compile('(?<=>").+?(?=")')
    #标记字符串
    str_com = '</i>'
    str_br = '<br'
    str_eg = 'class="eg"'
    str_exp = 'class="exp"'

    f.write("".join(content))
    print(file=f)

    #音标
    print("音标：",file=f)
    phonitic = soup.find_all("span", class_="Phonitic")
    if phonitic:
        f.write("".join(pattern.findall(repr(phonitic))))
        print(file=f)
    else:
        print('NONE',file=f)


    #词义和例句
    flag_1 = 0
    print("词义和例句：",file=f)
    for d in soup.find_all('div',id=re.compile("ExpFCChild")):  #先id匹配外部div
        flag_1 = 1
        flag_1_1 = 0
        if repr(d).find(str_eg) > -1 or repr(d).find(str_exp) > -1:
            flag_1_1 = 1
        if d:
            for x in d.find_all('span',class_=re.compile("exp|eg|cara")):   #根据class匹配div下span
                x_step1 = pattern.findall(repr(x))
                #print(repr(x).find(str_com))
                if repr(x).find(str_com)>-1:    #判断是否有</i> 由于缺少</span>标记 函数会自动查找到下一个</span>标记 这其中就会包括</i>
                    x_del_i = pattern_2.search(repr(x_step1)).group()
                    x_del_i_list = x_del_i.strip('+').split('+')
                    f.write("".join(x_del_i_list))
                    print(file=f)
                else:
                    f.write("".join(x_step1))  #print(x.get_text())
                    print(file=f)
            if flag_1_1 == 0:
                # str_expfcchild = pattern_6.search(repr(d)).group()
                # str_expfcchild_list = str_expfcchild.strip('+').split('+')
                f.write("结果特殊，请手动查询")
                print(file=f)
        else:
            print("NONE",file=f)
    if flag_1 == 0:
        print("NONE",file=f)


    #德语专业词典
    print("德语专业词典：",file=f)
    expspec = soup.find_all('div',id=re.compile("ExpSPECChild"))   #同理，确定外部div
    if expspec: #非空
        expspec_del_br = pattern_1.search(repr(expspec)).group()
        expspec_list = expspec_del_br.strip('+').split('+')
        f.write("".join(expspec_list))
        print(file=f)
    else:
        print('NONE',file=f)


    #德语例句库
    flag_2 = 0
    print("德语例句库：",file=f)
    for expljc in soup.find_all('div',id=re.compile("ExpLJChild")):   #确定外部div
        #print(repr(expljc))
        flag_2 = 1
        if expljc:
            for x in expljc.find_all('div', class_=re.compile("content")): #找到内部div
                for y in x.find_all('p', class_=re.compile("line")):
                    if len(y.find_all('span', class_="key")) > 1:
                        stac = 1
                    else:
                        expljc_str = ''
                        if pattern_3.search(repr(y)):
                            expljc_str = expljc_str + pattern_3.search(repr(y)).group()
                        if pattern_4.search(repr(y)):
                            expljc_str = expljc_str + pattern_4.search(repr(y)).group()
                        if pattern_5.search(repr(y)):
                            expljc_str = expljc_str + pattern_5.search(repr(y)).group()
                        expljc_str_list = expljc_str.strip('+').split('+')
                        f.write("".join(expljc_str_list))
                        print(file=f)
                        for z in x.find_all('p', class_=re.compile("exp")):
                            expljc_str_1 = ''
                            expljc_str_1 = pattern.findall(repr(z))
                            f.write("".join(expljc_str_1))
                            print(file=f)
        else:
            print("NONE",file=f)
    if flag_2 == 0:
        print("NONE",file=f)


    content = f_read.readline()

# 从文档中找到所有文字内容
# print(soup.get_text())
#保存到文件
# fp = open("test_1.htm","w+b")
# fp.write(html)
# fp.close()

f.close()
f_read.close()