# Docker使用 - 在Linux环境中部署

> 此案例使用的环境：centos-release-7-3.1611.el7.centos.x86_64

> 尽量使用 CentOS 7 进行安装

## Docker环境安装

- 安装yum-utils：

```shell
yum install -y yum-utils device-mapper-persistent-data lvm2
```

- 为yum源添加docker仓库位置：

```shell
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

- 安装docker：

```shell
yum install docker-ce
```

- 启动docker：

```shell
systemctl start docker
```



## Mysql安装

- 下载mysql5.7的docker镜像：

```shell
docker pull mysql:5.7
```

- 使用docker命令启动：

```shell
docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7
```

- 参数说明

  - -p 3306:3306：将容器的3306端口映射到主机的3306端口

  - -v /mydata/mysql/conf:/etc/mysql：将配置文件夹挂在到主机
  - -v /mydata/mysql/log:/var/log/mysql：将日志文件夹挂载到主机
  - -v /mydata/mysql/data:/var/lib/mysql/：将数据文件夹挂载到主机
  - -e MYSQLROOTPASSWORD=root：初始化root用户的密码

- 进入运行mysql的docker容器：

```
docker exec -it mysql /bin/bash
```

- 使用mysql命令打开客户端：

```shell
mysql -uroot -proot --default-character-set=utf8mb4
```

- 创建mall数据库：

```shell
mysql> create database mall character set utf8mb4;
```

- 安装上传下载插件，并将docment/sql/mall.sql上传到Linux服务器上：

  lrzsz是一款程序，在linux中可以代替ftp的上传和下载

  ```shell
  yum -y install lrzsz
  ```

  - 本地文件上传到服务器：`rz`
  - 服务器文件发送到本地，文件会默认下载到系统的Downloads目录 C:Users[用户名]\Downloads：`sz 文件名` 

- 将mall.sql文件拷贝到mysql容器的/目录下：

```shell
docker cp /mydata/mall.sql mysql:/
```

- 将sql文件导入到数据库：

```shell
mysql> use mall;
mysql> source /mall.sql;
```

- 创建一个reader帐号并修改权限，使得任何ip都能访问：

```shell
mysql> grant all privileges on *.* to 'reader' @'%' identified by '123456';
```



## Redis安装

- 下载redis3.2的docker镜像：

```shell
docker pull redis:3.2
```

- 使用docker命令启动：

```shell
docker run -p 6379:6379 --name redis \
-v /mydata/redis/data:/data \
-d redis:3.2 redis-server --appendonly yes
```

- 进入redis容器使用redis-cli命令进行连接：

```shell
docker exec -it redis redis-cli
```



## Nginx安装

### 下载nginx1.10的docker镜像

```shell
docker pull nginx:1.10
```

### 从容器中拷贝nginx配置

- 先运行一次容器（为了拷贝配置文件）：

```shell
docker run -p 80:80 --name nginx \
-v /mydata/nginx/html:/usr/share/nginx/html \
-v /mydata/nginx/logs:/var/log/nginx \
-d nginx:1.10
```

- 将容器内的配置文件拷贝到指定目录：

```shell
docker container cp nginx:/etc/nginx /mydata/nginx/
```

- 修改文件名称：

```shell
mv nginx conf
```

- 终止并删除容器：

```shell
docker stop nginx
docker rm nginx
```

### 使用docker命令启动：

```shell
docker run -p 80:80 --name nginx \
-v /mydata/nginx/html:/usr/share/nginx/html \
-v /mydata/nginx/logs:/var/log/nginx \
-v /mydata/nginx/conf:/etc/nginx \
-d nginx:1.10
```



## RabbitMQ安装

- 下载rabbitmq3.7.15的docker镜像：

```shell
docker pull rabbitmq:3.7.15
```

- 使用docker命令启动：

```shell
docker run -d --name rabbitmq \
--publish 5671:5671 --publish 5672:5672 --publish 4369:4369 \
--publish 25672:25672 --publish 15671:15671 --publish 15672:15672 \
rabbitmq:3.7.15
```

- 进入容器并开启管理功能：

```shell
docker exec -it rabbitmq /bin/bash
rabbitmq-plugins enable rabbitmq_management
```

- 开启防火墙：

```
firewall-cmd --zone=public --add-port=15672/tcp --permanent
firewall-cmd --reload
```

- 访问地址查看是否安装成功：http://ip:15672/ 

- 输入账号密码并登录：guest guest



## Elasticsearch安装

- 下载elasticsearch6.4.0的docker镜像：

```shell
docker pull elasticsearch:6.4.0
```

- 修改虚拟内存区域大小，否则会因为过小而无法启动:

```shell
sysctl -w vm.max_map_count=262144
```

- 使用docker命令启动：

```shell
docker run -p 9200:9200 -p 9300:9300 --name elasticsearch \
-e "discovery.type=single-node" \-e "cluster.name=elasticsearch" \
-v /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-v /mydata/elasticsearch/data:/usr/share/elasticsearch/data \
-d elasticsearch:6.4.0
```

- 启动时会发现 `/usr/share/elasticsearch/data` 目录没有访问权限，只需要修改 `/mydata/elasticsearch/data` 目录的权限，再重新启动。

```shell
chmod 777 /mydata/elasticsearch/data/
```

- ik 分词器插件

  下载地址：[Releases · medcl/elasticsearch-analysis-ik](https://github.com/medcl/elasticsearch-analysis-ik/releases)

  安装中文分词器IKAnalyzer，并重新启动：

  ```shell
  docker exec -it elasticsearch /bin/bash
  # 此命令需要在容器中运行
  elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.4.0/elasticsearch-analysis-ik-6.4.0.zip
  
  exit
  docker restart elasticsearch
  ```

- 开启防火墙：

```shell
firewall-cmd --zone=public --add-port=9200/tcp --permanent
firewall-cmd --reload
```

- 访问会返回版本信息：http://ip:9200/



## kibana安装

- 下载kibana6.4.0的docker镜像：

```shell
docker pull kibana:6.4.0
```

- 使用docker命令启动：

```shell
docker run --name kibana -p 5601:5601 \
--link elasticsearch:es \
-e "elasticsearch.hosts=http://es:9200" \
-d kibana:6.4.0
```

- 开启防火墙：

```shell
firewall-cmd --zone=public --add-port=5601/tcp --permanent
firewall-cmd --reload
```

- 访问地址进行测试：http://ip:5601



## Mongodb安装

- 下载mongo3.2的docker镜像：

```shell
docker pull mongo:3.2
```

- 使用docker命令启动：

```shell
docker run -p 27017:27017 --name mongo \
-v /mydata/mongo/db:/data/db \
-d mongo:3.2
```



## 部署SpringBoot应用

### 构建所有Docker镜像并上传

- 打开pom.xml中使用docker插件的注释

  ![image-20211102114733160](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/devops/docker/image-20211102114733160.png)

- 修改dockerHost为你自己的docker服务器地址 ip:2375

- Docker 开启2375端口：

  - [https://www.cnblogs.com/djlsunshine/p/13368127.html](https://www.cnblogs.com/djlsunshine/p/13368127.html)
  - https://blog.csdn.net/u013658328/article/details/108054149

- 构建镜像并上传：

  ![image-20211102114805916](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/devops/docker/image-20211102114805916.png)

  ```bash
  REPOSITORY            TAG                 IMAGE ID            CREATED              SIZE
  mall/mall-portal      1.0-SNAPSHOT        70e0f76416a0        21 seconds ago       705MB
  mall/mall-search      1.0-SNAPSHOT        f3290bd1d0c7        41 seconds ago       725MB
  mall/mall-admin       1.0-SNAPSHOT        26557b93a106        About a minute ago   705MB
  ```




## 参考资料

- http://www.macrozheng.com/#/deploy/mall_deploy_docker
- https://www.thisfaner.com/p/docker-deploy-dev-env/

