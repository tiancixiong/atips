# ES安装 - ElasticSearch和Kibana安装

## 官网相关教程

- [官方网站  (opens new window)](https://www.elastic.co/cn/)
- [官方2.x中文教程中安装教程  (opens new window)](https://www.elastic.co/guide/cn/elasticsearch/guide/current/running-elasticsearch.html)
- [官方ElasticSearch下载地址  (opens new window)](https://www.elastic.co/cn/downloads/elasticsearch)
- [官方Kibana下载地址  (opens new window)](https://www.elastic.co/cn/downloads/kibana)

本系列文章内容基于 Centos 7 + ElasticSearch 7.x 版本。



## 安装ElasticSearch

> ElasticSearch 是基于 Java 平台的，所以先要安装 Java，注意要保证环境变量 `JAVA_HOME` 正确设置。

### 安装

- **下载ElasticSearch**

安装完 Java，就可以跟着[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/zip-targz.html)安装 Elastic。从[这里](https://www.elastic.co/cn/downloads/elasticsearch)下载ElasticSearch。直接下载压缩包比较简单：

```shell
$ wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.12.0-linux-x86_64.tar.gz
```

- **解压**

```shell
$ tar zxvf elasticsearch-7.12.0-linux-x86_64.tar.gz
```

- **增加elasticSearch用户**

必须创建一个**非root**用户来运行 ElasticSearch（ElasticSearch5及以上版本，基于安全考虑，强制规定不能以root身份运行）。

如果你使用 root 用户来启动 ElasticSearch，则会有如下错误信息：

```shell
[root@localhost elasticsearch-7.12.0]# ./bin/elasticsearch
[2021-11-05T16:16:03,174][ERROR][o.e.b.ElasticsearchUncaughtExceptionHandler] [localhost.localdomain] uncaught exception in thread [main]
org.elasticsearch.bootstrap.StartupException: java.lang.RuntimeException: can not run elasticsearch as root
	at org.elasticsearch.bootstrap.Elasticsearch.init(Elasticsearch.java:163) ~[elasticsearch-7.12.0.jar:7.12.0]
	at org.elasticsearch.bootstrap.Elasticsearch.execute(Elasticsearch.java:150) ~[elasticsearch-7.12.0.jar:7.12.0]
	at org.elasticsearch.cli.EnvironmentAwareCommand.execute(EnvironmentAwareCommand.java:75) ~[elasticsearch-7.12.0.jar:7.12.0]
	at org.elasticsearch.cli.Command.mainWithoutErrorHandling(Command.java:116) ~[elasticsearch-cli-7.12.0.jar:7.12.0]
	at org.elasticsearch.cli.Command.main(Command.java:79) ~[elasticsearch-cli-7.12.0.jar:7.12.0]
	at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:115) ~[elasticsearch-7.12.0.jar:7.12.0]
	at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:81) ~[elasticsearch-7.12.0.jar:7.12.0]
Caused by: java.lang.RuntimeException: can not run elasticsearch as root
	at org.elasticsearch.bootstrap.Bootstrap.initializeNatives(Bootstrap.java:101) ~[elasticsearch-7.12.0.jar:7.12.0]
	at org.elasticsearch.bootstrap.Bootstrap.setup(Bootstrap.java:168) ~[elasticsearch-7.12.0.jar:7.12.0]
	at org.elasticsearch.bootstrap.Bootstrap.init(Bootstrap.java:397) ~[elasticsearch-7.12.0.jar:7.12.0]
	at org.elasticsearch.bootstrap.Elasticsearch.init(Elasticsearch.java:159) ~[elasticsearch-7.12.0.jar:7.12.0]
	... 6 more
uncaught exception in thread [main]
java.lang.RuntimeException: can not run elasticsearch as root
	at org.elasticsearch.bootstrap.Bootstrap.initializeNatives(Bootstrap.java:101)
	at org.elasticsearch.bootstrap.Bootstrap.setup(Bootstrap.java:168)
	at org.elasticsearch.bootstrap.Bootstrap.init(Bootstrap.java:397)
	at org.elasticsearch.bootstrap.Elasticsearch.init(Elasticsearch.java:159)
	at org.elasticsearch.bootstrap.Elasticsearch.execute(Elasticsearch.java:150)
	at org.elasticsearch.cli.EnvironmentAwareCommand.execute(EnvironmentAwareCommand.java:75)
	at org.elasticsearch.cli.Command.mainWithoutErrorHandling(Command.java:116)
	at org.elasticsearch.cli.Command.main(Command.java:79)
	at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:115)
	at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:81)
For complete error details, refer to the log at /mydata/elasticsearch-7.12.0/logs/elasticsearch.log
2021-11-05 08:16:03,579190 UTC [2841] INFO  Main.cc@106 Parent process died - ML controller exiting
```

所以我们增加一个独立的elasticsearch用户来运行：

```shell
# 增加elasticsearch用户
[root@localhost elasticsearch-7.12.0]# useradd elasticsearch
[root@localhost elasticsearch-7.12.0]# passwd elasticsearch
更改用户 elasticsearch 的密码 。
新的 密码：
无效的密码： 密码少于 8 个字符
重新输入新的 密码：
passwd：所有的身份验证令牌已经成功更新。

# 修改目录权限至新增的elasticsearch用户
[root@localhost elasticsearch-7.12.0]# chown -R elasticsearch /mydata/elasticsearch-7.12.0

# 增加data和log存放区，并赋予elasticsearch用户权限
[root@localhost elasticsearch-7.12.0]# mkdir -p /data/es
[root@localhost elasticsearch-7.12.0]# chown -R elasticsearch /data/es/
[root@localhost elasticsearch-7.12.0]# mkdir -p /var/log/es
[root@localhost elasticsearch-7.12.0]# chown -R elasticsearch /var/log/es/
```

然后将上述的 data 和 log 路径配置到es中，使用 `vi /mydata/elasticsearch-7.12.0/config/elasticsearch.yml ` 命令修改es配置文件：

```yml

# ----------------------------------- Paths ------------------------------------
#
# Path to directory where to store the data (separate multiple locations by comma):
#
path.data: /data/es
#
# Path to log files:
#
path.logs: /var/log/es
```

- **修改Linux系统的限制配置**

1. 修改系统中允许应用最多创建多少文件等的限制权限。Linux默认来说，一般限制应用最多创建的文件是65535个。但是ES至少需要65536的文件创建权限。
2. 修改系统中允许用户启动的进程开启多少个线程。默认的Linux限制root用户开启的进程可以开启任意数量的线程，其他用户开启的进程可以开启1024个线程。必须修改限制数为4096+。因为ES至少需要4096的线程池预备。ES在5.x版本之后，强制要求在linux中不能使用root用户启动ES进程。所以必须使用其他用户启动ES进程才可以。
3. Linux低版本内核为线程分配的内存是128K。4.x版本的内核分配的内存更大。如果虚拟机的内存是1G，最多只能开启3000+个线程数。至少为虚拟机分配1.5G以上的内存。

修改如下配置：

```
$ vi /etc/security/limits.conf

# 在文件末尾添加下面几行配置
elasticsearch soft nofile 65536
elasticsearch hard nofile 65536
elasticsearch soft nproc 4096
elasticsearch hard nproc 4096
```



### 启动

- **启动ElasticSearch**

接着，切换到非root用户，进入解压后的目录，运行下面的命令，启动 Elastic：

```shell
$ su elasticsearch
$ cd /mydata/elasticsearch-7.12.0
$ ./bin/elasticsearch
```

- **查看启动是否成功**

如果一切正常，Elastic 就会在默认的 **9200** 端口运行。这时，打开另一个命令行窗口，请求该端口，会得到说明信息：

```shell
$ curl localhost:9200

{
  "name" : "localhost.localdomain",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "zrjRDKbqTjaUOTStAudyKQ",
  "version" : {
    "number" : "7.12.0",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "78722783c38caa25a70982b5b042074cde5d3b3a",
    "build_date" : "2021-03-18T06:17:15.410153305Z",
    "build_snapshot" : false,
    "lucene_version" : "8.8.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

上面代码中，请求9200端口，Elastic 返回一个 JSON 对象，包含当前节点、集群、版本等信息。

按下 `Ctrl + C`，Elastic 就会停止运行。可以通过 `./bin/elasticsearch -d` 命令后台启动。

默认情况下，Elastic 只允许本机访问，如果需要远程访问，可以修改 Elastic 安装目录的`config/elasticsearch.yml` 文件，去掉 `network.host` 的注释，将它的值改成`0.0.0.0`，然后重新启动 Elastic。

```
network.host: 0.0.0.0
```

::: tip 提醒
上面代码中，设成 `0.0.0.0` 会让任何人都可以访问。线上服务不要这样设置，要设成具体的 IP。
:::



#### 错误

- 错误1：如果这时[报错](https://github.com/spujadas/elk-docker/issues/92) `max virtual memory areas vm.max*map*count [65530] is too low`，要运行下面的命令：

```shell
$ sudo sysctl -w vm.max_map_count=262144
```

- 错误2：

```shell
the default discovery settings are unsuitable for production use; at least one of [discovery.seed_hosts, discovery.seed_providers, cluster.initial_master_nodes] must be configured
```

解决：https://blog.csdn.net/weixin_44874132/article/details/120455954



## 安装Kibana

> Kibana 是界面化的查询数据的工具，下载时尽量下载与 ElasicSearch 一致的版本。

Kibana 是一个基于 Node.js 的 Elasticsearch 索引库数据统计工具，可以利用 Elasticsearch 的聚合功能，生成各种图表，如柱形图，线状图，饼图等。

而且还提供了操作 Elasticsearch 索引数据的控制台，并且提供了一定的 API 提示，非常有利于我们学习 Elasticsearch 的语法。



### 安装

因为 Kibana 依赖于 node，我的虚拟机没有安装 node，而 windows 中安装过。所以我选择在 windows 下使用kibana。

与 elasticsearch 保持一致，也是 7.12.0

- **下载Kibana**

从[这里](https://www.elastic.co/cn/downloads/kibana)下载 Kibana，下载地址：

```
https://artifacts.elastic.co/downloads/kibana/kibana-7.12.0-windows-x86_64.zip
```



### 配置运行

- **配置**

进入安装目录下的 `config` 目录，修改 `kibana.yml` 文件：

修改 elasticsearch 服务器的地址：

```yml
# ip需替换
elasticsearch.url: "http://192.168.220.132:9200"
elasticsearch.hosts: ["http://192.168.220.132:9200"]
```

- **运行**

进入安装目录下的 `bin` 目录，双击 `kibana.bat` 文件运行。kibana 的监听端口是 **5601**。

访问：[http://127.0.0.1:5601](http://127.0.0.1:5601)



### 控制台

选择 *DevTools* 菜单，即可进入控制台页面：

![image-20211105180705406](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-elasticsearch/image-20211105180705406.png)

![image-20211105180753465](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-elasticsearch/image-20211105180753465.png)

可以导入simple data：

![image-20211105181104298](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-elasticsearch/image-20211105181104298.png)



控制台

需要切换至elasticsearch用户：

```shell

```

也可以使用后台启动：

```shell

```

- **界面访问**

访问地址：，ip需要修改。
