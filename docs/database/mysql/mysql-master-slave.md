# MySQL - 主从复制

## 什么是主从复制？

主从复制是指将主数据库的 DDL 和 DML 操作通过二进制日志传到从数据库上，然后在从数据库上对这些日志进行重新执行，从而使从数据库和主数据库的数据保持一致。



## 主从复制的原理

主要涉及三个线程: binlog 线程、I/O 线程和 SQL 线程。

- **binlog 线程** : 负责将主服务器上的数据更改写入二进制日志中。
- **I/O 线程** : 负责从主服务器上读取二进制日志，并写入从服务器的中继日志中。
- **SQL 线程** : 负责读取中继日志并重放其中的 SQL 语句。

![image-20211102202215019](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/mysql/image-20211102202215019.png)

---

具体步骤：

- MySql主库在事务提交时会把数据变更作为事件记录在二进制日志Binlog中；
- 主库推送二进制日志文件Binlog中的事件到从库的中继日志Relay Log中，之后从库根据中继日志重做数据变更操作，通过逻辑复制来达到主库和从库的数据一致性；
- MySql通过三个线程来完成主从库间的数据复制，其中Binlog Dump线程跑在主库上，I/O线程和SQL线程跑着从库上；
- 当在从库上启动复制时，首先创建I/O线程连接主库，主库随后创建Binlog Dump线程读取数据库事件并发送给I/O线程，I/O线程获取到事件数据后更新到从库的中继日志Relay Log中去，之后从库上的SQL线程读取中继日志Relay Log中更新的数据库事件并应用，如下图所示。

![](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/mysql/mysql_master_slave_06.png)



## 基于Docker搭建

以下内容是基于 Docker 容器搭建 MySQL 主从的案例

### 主实例搭建

- 运行mysql主实例：

```bash
docker run -p 3307:3306 --name mysql-master \
-v /mydata/mysql-master/log:/var/log/mysql \
-v /mydata/mysql-master/data:/var/lib/mysql \
-v /mydata/mysql-master/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root  \
-d mysql:5.7
```

- 在mysql的配置文件夹 `/mydata/mysql-master/conf` 中创建一个配置文件`my.cnf`：

```bash
touch /mydata/mysql-master/conf/my.cnf
```

- 修改配置文件my.cnf，配置信息如下：

```bash
[mysqld]
## 设置server_id，同一局域网中需要唯一
server_id=101 
## 指定不需要同步的数据库名称
binlog-ignore-db=mysql  
## 开启二进制日志功能
log-bin=mall-mysql-bin  
## 设置二进制日志使用内存大小（事务）
binlog_cache_size=1M  
## 设置使用的二进制日志格式（mixed,statement,row）
binlog_format=mixed  
## 二进制日志过期清理时间。默认值为0，表示不自动清理。
expire_logs_days=7  
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062  
```

- 修改完配置后重启实例：

```bash
docker restart mysql-master
```

- 进入 `mysql-master` 容器中：

```bash
docker exec -it mysql-master /bin/bash
```

- 在容器中使用mysql的登录命令连接到客户端：

```bash
mysql> mysql -uroot -proot
```

- 创建数据同步用户：

```bash
mysql> create user 'slave'@'%' identified by '123456';
mysql> grant replication slave, replication client on *.* to 'slave'@'%';
```



### 从实例搭建

- 运行 mysql 从实例：

```bash
docker run -p 3308:3306 --name mysql-slave \
-v /mydata/mysql-slave/log:/var/log/mysql \
-v /mydata/mysql-slave/data:/var/lib/mysql \
-v /mydata/mysql-slave/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root  \
-d mysql:5.7
```

- 在 mysql 的配置文件夹 `/mydata/mysql-slave/conf` 中创建一个配置文件 `my.cnf`：

```bash
touch /mydata/mysql-slave/conf/my.cnf
```

- 修改配置文件my.cnf：

```bash
[mysqld]
## 设置server_id，同一局域网中需要唯一
server_id=102
## 指定不需要同步的数据库名称
binlog-ignore-db=mysql  
## 开启二进制日志功能，以备Slave作为其它数据库实例的Master时使用
log-bin=mall-mysql-slave1-bin  
## 设置二进制日志使用内存大小（事务）
binlog_cache_size=1M  
## 设置使用的二进制日志格式（mixed,statement,row）
binlog_format=mixed  
## 二进制日志过期清理时间。默认值为0，表示不自动清理。
expire_logs_days=7  
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062  
## relay_log配置中继日志
relay_log=mall-mysql-relay-bin  
## log_slave_updates表示slave将复制事件写进自己的二进制日志
log_slave_updates=1  
## slave设置为只读（具有super权限的用户除外）
read_only=1  
```

- 修改完配置后重启实例：

```bash
docker restart mysql-slave
```



### 将主从数据库进行连接

- 连接到主数据库的mysql客户端，查看**主**数据库状态：

```bash
# 在主节点中执行
mysql> show master status;
```

- 主数据库状态显示如下：

![](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/mysql/mysql_master_slave_01.png)

记住表中的 File 和 Position，后面配置从节点时需用到

- 进入`mysql-slave`容器中：

```bash
docker exec -it mysql-slave /bin/bash
```

- 在容器中使用mysql的登录命令连接到客户端：

```bash
mysql> mysql -uroot -proot
```

- 在从数据库中配置主从复制：

```bash
# 在从节点中执行
mysql> change master to master_host='192.168.6.132', master_user='slave', master_password='123456', master_port=3307, master_log_file='mall-mysql-bin.000001', master_log_pos=617, master_connect_retry=30;  
```

这里的 `master_host`、`master_log_file`、`master_log_pos` 分别改成 主节点的ip、主节点的File、主节点的Position

- 主从复制命令参数说明：
  - master_host：主数据库的IP地址；
  - master_port：主数据库的运行端口；
  - master_user：在主数据库创建的用于同步数据的用户账号；
  - master_password：在主数据库创建的用于同步数据的用户密码；
  - master_log_file：指定从数据库要复制数据的日志文件，通过查看主数据的状态，获取File参数；
  - master_log_pos：指定从数据库从哪个位置开始复制数据，通过查看主数据的状态，获取Position参数；
  - master_connect_retry：连接失败重试的时间间隔，单位为秒。
- 查看从节点的主从同步状态：

```bash
# 在从节点中执行
mysql> show slave status \G;
```

- 从数据库状态显示如下：

![](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/mysql/mysql_master_slave_02.png)

- 开启主从同步：

```bash
# 在从节点中执行
mysql> start slave;
```

- 查看从数据库状态发现已经同步：

![](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/mysql/mysql_master_slave_03.png)



### 主从复制测试

> 主从复制的测试方法有很多，可以在主实例中创建一个数据库，看看从实例中是否有该数据库，如果有，表示主从复制已经搭建成功。

- 在主实例中创建一个数据库`mall`；

![](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/mysql/mysql_master_slave_04.png)

- 在从实例中查看数据库，发现也有一个`mall`数据库，可以判断主从复制已经搭建成功。

![](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/mysql/mysql_master_slave_05.png)



## 参考资料

- http://www.macrozheng.com/#/reference/mysql_master_slave

