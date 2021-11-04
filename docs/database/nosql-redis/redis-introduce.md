# Redis入门 - 概念和基础

## 介绍

Redis 是一款内存高速缓存数据库。Redis 全称为：**Remote Dictionary Server**（远程数据服务），使用 C 语言编写，Redi s是一个 `key-value` 存储系统（键值存储系统）。

Redis 是一种支持 key-value 等多种数据结构的存储系统。支持丰富的数据类型，如：String、list、set、zset、hash。。可用于缓存，事件发布或订阅，高速队列等场景。支持网络，提供字符串，哈希，列表，队列，集合结构直接存取，基于内存，可持久化。



### 资料

- Redis 官网：[http://redis.io](http://redis.io)
- Redis 官方文档：[http://redis.io/documentation](http://redis.io/documentation)
- Redis 教程：[http://www.w3cschool.cn/redis/redis-intro.html](http://www.w3cschool.cn/redis/redis-intro.html)
- Redis 下载：[http://redis.io/download](http://redis.io/download)



## 为什么要使用Redis？

- **读写性能优异**：Redis 能读的速度是 110000 次/s，写的速度是 81000 次/s；

- **丰富的数据类型**：Redis 支持二进制案例的 Strings, Lists, Hashes, Sets 及 Ordered Sets 数据类型操作；
- **原子性**：Redis 的所有操作都是原子性的，同时 Redis 还支持对几个操作合并后的原子性执行；

- **丰富的特性**：Redis支持支持发布/订阅模式，通知，key 过期等特性；

- **持久化**：Redis 支持 RDB, AOF 等持久化方式



## Redis的使用场景

### 热点数据的缓存

缓存是 Redis 最常见的应用场景，之所有这么使用，主要是因为 Redis 读写性能优异。而且逐渐有取代memcached，成为首选服务端缓存的组件。而且，Redis 内部是支持事务的，在使用时候能有效保证数据的一致性。

作为缓存使用时，一般有两种方式保存数据：

- 读取前，先去读 Redis，如果没有数据，读取数据库，将数据拉入 Redis。
- 插入数据时，同时写入 Redis。

方案一：实施起来简单，但是有两个需要注意的地方：

- 避免缓存击穿（数据库没有请求的目标数据，导致 Redis 一直没有数据，而一直命中数据库）
- 数据的实时性相对会差一点

方案二：数据实时性强，但是开发时不便于统一处理。

当然，两种方式根据实际情况来适用。如：方案一适用于对于数据实时性要求不是特别高的场景。方案二适用于字典表、数据量不大的数据存储。



### 限时业务的运用

Redis 中可以使用 *expire* 命令设置一个键的生存时间，到时间后 Redis 会删除它。利用这一特性可以运用在限时的优惠活动信息、手机验证码等业务场景。



