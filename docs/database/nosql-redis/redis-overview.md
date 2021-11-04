# Reids - Overview

## 知识体系

### Redis入门 - 概念和基础

Redis 是一种支持 `key-value` 等多种数据结构的存储系统。可用于缓存，事件发布或订阅，高速队列等场景。支持网络，提供字符串，哈希，列表，队列，集合结构直接存取，基于内存，可持久化。

![img](img/20200713105627.png)



### Redis入门 - 数据类型

- Redis入门 - 数据类型：5 种基础数据类型
  - Redis 所有的 **key**（键）都是字符串。我们在谈基础数据结构时，讨论的是存储**值**的数据类型，主要包括常见的5种数据类型，分别是：String、List、Set、Zset、Hash。

![Redis 数据类型](img/20200226113813.png)

- Redis入门 - 数据类型：3 种特殊类型
  - Redis 除了上文中 5 种基础数据类型，还有三种特殊的数据类型，分别是 *HyperLogLogs*（基数统计）， *Bitmaps* (位图) 和 *geospatial* （地理位置）。



### Redis进阶 - 持久化

为了防止数据丢失以及服务重启时能够恢复数据，Redis 支持数据的持久化，主要分为两种方式，分别是 *RDB* 和 *AOF*；当然实际场景下还会使用这两种的混合模式。

![img](img/20200224214047.png)



### Redis进阶 - 消息传递：发布订阅模式



### Redis进阶 - 事件：Redis事件机制



### Redis进阶 - 事务：Redis事务



### Redis进阶 - 高可用：集群

> 关键词：`CLUSTER MEET`、`Hash slot`、`MOVED`、`ASK`、`SLAVEOF no one`、`redis-trib`

![img](img/20200713100613.png)



### Redis进阶 - 高可用：主从复制

> 关键词：`SLAVEOF`、`SYNC`、`PSYNC`、`REPLCONF ACK`

我们知道要避免单点故障，即保证高可用，便需要冗余（副本）方式提供集群服务。而 Redis 提供了主从库模式，以保证数据副本的一致，主从库之间采用的是读写分离的方式。本文主要阐述 Redis 的主从复制。

![img](img/20200712182603.png)



### Redis进阶 - 高可用：哨兵机制(Redis Sentinel)

> Redis 哨兵（Sentinel）是 Redis 的高可用性（Hight Availability）解决方案。
>
> Redis 哨兵是 Raft 算法 的具体实现。
>
> 关键词：`Sentinel`、`PING`、`INFO`、`Raft`

在上文主从复制的基础上，如果注节点出现故障该怎么办呢？ 在 Redis 主从集群中，哨兵机制是实现主从库自动切换的关键机制，它有效地解决了主从复制模式下故障转移的问题。

![img](img/20200713072747.png)



### Redis进阶 - 高可拓展：分片技术(Redis Cluster)



### Redis进阶 - 缓存问题：一致性, 穿击, 穿透, 雪崩, 污染等



### Redis进阶 - 版本特性: 4.0、5.0、6.0特性整理



### Redis进阶 - 运维监控



### Redis进阶 - 性能调优



## 学习资料

- 官网
  - [Redis 官网](http://redis.io)
  - [Redis github](https://github.com/antirez/redis)
- 文档
  - Redis 官方文档：[http://redis.io/documentation](http://redis.io/documentation)
  - 中文文档：[http://www.redis.cn/documentation.html](http://www.redis.cn/documentation.html)

- 其他资源
  - Redis 教程：[https://dunwu.github.io/db-tutorial/nosql/redis/](https://dunwu.github.io/db-tutorial/nosql/redis/)
  - Redis 命令参考：[http://redisdoc.com/](http://redisdoc.com/)

