# guping

[![Build Status via Travis CI](https://api.travis-ci.org/sincerefly/guping.svg?branch=master)](https://travis-ci.org/sincerefly/guping)

一个Node.js写的评价荐股准确程度的小工具

![](http://ishell-imgs.b0.upaiyun.com/blog/1452578233/01.png)

这是一个用来练习的程序，从最初的Node.js爬虫，异步，到使用React，gulp等逐步得到完善，从应用角度来讲几乎没用，不过却依旧是我今后练习的一个好工具，可以持续优化

已知问题： 

- 后端实现了排名，先端没有实现
- 更新数据时有一定几率会导致sh300End字段为NaN
- 界面没有响应式，因为Ant.design UI不支持，设计的目的也是主要作为后台产品
- 也许添加Socket.io会更加理想，不过意义不是很大
- 配置文件等，代码有待进一步优化


**测试Demo的方法**

**先决条件**

- 已安装好MongoDB
- 已安装好nodejs与npm(建议使用nvm进行管理node版本)
- 建议在Linux下测试，windows须自己建立public软链接或在server下新建一个public目录，并将client下内容复制到public下

1，获取

```shell
git clone https://github.com/sincerefly/guping.git
```

2，安装依赖

分别进入client和server运行

```shell
npm install 
```

3，全局安装gulp并运行

```bash
sudo npm install gulp -g
```

分别在两个目录键入gulp运行

4，打开浏览器

```text
http://127.0.0.1:3000/
```

演示视频等更多详情，请访问：

Go: [http://blog.ishell.me/a/guping-four.html](http://blog.ishell.me/a/guping-four.html)
