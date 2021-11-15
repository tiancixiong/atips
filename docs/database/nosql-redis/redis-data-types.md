# Redis入门 - 数据类型：5种基础数据类型

## Redis数据结构简介

在 Redis 中所有的 `key`（键）都是字符串。我们在谈基础数据结构时，讨论的是存储 `value`（值）的数据类型，主要包括常见的 5 种数据类型，分别是：String、List、Set、Zset、Hash。

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-redis/db-redis-ds-1.jpeg)

| 结构类型          | 结构存储的值                               | 结构的读写能力                                               |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------ |
| **String** 字符串 | 字符串、整数或浮点数                       | 对整个字符串或字符串的一部分进行操作；对整数或浮点数进行自增或自减操作 |
| **List** 列表     | 一个链表，链表上的每个节点都包含一个字符串 | 对链表的两端进行 `push` 和 `pop` 操作，读取单个或多个元素；根据值查找或删除元素 |
| **Set** 集合      | 包含字符串的无序集合                       | 字符串的集合，包含基础的方法有看是否存在添加、获取、删除；还包含计算交集、并集、差集等 |
| **Hash** 散列     | 包含键值对的无序散列表                     | 包含方法有添加、获取、删除单个元素                           |
| **Zset** 有序集合 | 和散列一样，用于存储键值对                 | 字符串成员与浮点数分数之间的有序映射；元素的排列顺序由分数的大小决定；包含方法有添加、获取、删除单个元素以及根据分值范围或成员来获取元素 |



### String字符串

> String 是 redis 中最基本的数据类型，一个 key 对应一个 value。

String 类型是二进制安全的，意思是 redis 的 String 可以包含任何数据。如数字，字符串，jpg图片或者序列化的对象。

- 下图是一个 String 类型的实例，其中键为 hello，值为 world：

![](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-redis/redis-datatype-string.png)

- **命令使用**

| 命令   | 简述                   | 使用              |
| ------ | ---------------------- | ----------------- |
| get | 获取存储在给定键中的值 | get name      |
| set | 设置存储在给定键中的值 | set name value |
| del | 删除存储在给定键中的值 | del name      |
| incr | 将键存储的值加1        | incr key     |
| decr | 将键存储的值减1        | decr key     |
| incrby | 将键存储的值加上整数   | incrby key amount |
| decrby | 将键存储的值减去整数   | decrby key amount |

- **适用场景**：缓存、计数器、共享 Session
  - **缓存**： 经典使用场景，把常用信息，字符串，图片或者视频等信息放到 redis 中，redis 作为缓存层，mysql 做持久化层，降低 mysql 的读写压力。
  - **计数器**：redis 是单线程模型，一个命令执行完才会执行下一个，同时数据可以一步落地到其他的数据源。
  - **session**：常见方案 spring session + redis 实现 session 共享。



### List列表

> Redis 中的 List 其实就是链表（Redis用双端链表实现List）。

使用 List 结构，我们可以轻松地实现最新消息排队功能（比如新浪微博的 TimeLine）。List 的另一个应用就是消息队列，可以利用 List 的 `PUSH` 操作，将任务存放在 List 中，然后工作线程再用 `POP` 操作将任务取出进行执行。

- 图例

![list](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-redis/redis-datatype-list.png)

- **命令使用**

| 命令   | 简述                                                         | 使用                                          |
| ------ | ------------------------------------------------------------ | --------------------------------------------- |
| rpush  | 将给定值推入到列表*右端*                                     | RPUSH key value                               |
| lpush  | 将给定值推入到列表*左端*                                     | LPUSH key value                               |
| rpop   | 从列表的右端弹出一个值，并返回被弹出的值                     | RPOP key                                      |
| lpop   | 从列表的左端弹出一个值，并返回被弹出的值                     | LPOP key                                      |
| lrange | 获取列表在给定的索引范围内的值                               | lrange key 0 -1<br />结束索引为 -1 时查询所有 |
| lindex | 通过索引获取列表中的元素。你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。 | LINEX key index                               |

> 更多命令请参考：[Redis 命令中心](http://www.redis.cn/commands.html)

- **适用场景**：用于存储列表型数据。如：粉丝列表、商品列表等
  - **微博 TimeLine**: 有人发布微博，用 `lpush` 加入时间轴，展示新的列表信息。
  - **消息队列**



### Set集合

Redis 的 *Set* 是 String 类型的**无序**集合。**集合成员是唯一的**，这就意味着集合中不能出现重复的数据。

Redis 中集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。

- **图例**

![set](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-redis/redis-datatype-set.png)

- **命令使用**

| 命令      | 简述                                  | 使用                 |
| --------- | ------------------------------------- | -------------------- |
| sadd | 向集合添加一个或多个成员              | SADD key value       |
| scard | 获取集合的成员数                      | SCARD key            |
| smembers | 返回集合中的所有成员                  | smembers key member |
| sismember | 判断 member 元素是否是集合 key 的成员 | SISMEMBER key member |

> 更多操作命令：[Redis Set 集合 - 菜鸟教程](https://www.runoob.com/redis/redis-sets.html)

- **适用场景**：用于存储去重的列表型数据
  - **标签**（tag）,给用户添加标签，或者用户给消息添加标签，这样有同一标签或者类似标签的可以给推荐关注的事或者关注的人。
  - **点赞，或点踩，收藏等**，可以放到 set 中实现



### Hash散列

Redis hash 是一个 *String* 类型的 field（字段） 和 value（值） 的映射表，hash 特别适合用于存储结构化数据，如一个对象：用户信息、产品信息等。

- 图例

![hash](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-redis/redis-datatype-hash.png)

- **命令使用**

| 命令    | 简述                                     | 使用                          |
| ------- | ---------------------------------------- | ----------------------------- |
| hset    | 添加键值对                               | hset hash-key sub-key1 value1 |
| hget    | 获取指定散列键的值                       | hget hash-key key1            |
| hgetall | 获取散列中包含的所有键值对               | hgetall hash-key              |
| hdel    | 如果给定键存在于散列中，那么就移除这个键 | hdel hash-key sub-key1        |

- **适用场景**：存储结构化数据
  - **缓存**： 能直观，相比 String 更节省空间的维护缓存信息，如用户信息，视频信息等。



### Zset有序集合

Redis 有序集合 Zset 和集合 Set 一样也是 String 类型元素的集合，且**不允许重复**的成员。不同的是每个元素都会关联一个 double 类型的分数。Redis 正是通过分数来为集合中的成员进行*从小到大*的排序。

有序集合的成员是唯一的，但分数(score)却可以重复。集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。

- **图例**

![zset](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-redis/redis-datatype-zset.png)

- **命令使用**

| 命令   | 简述                                                     | 语法                                                 | 使用                           |
| ------ | -------------------------------------------------------- | ------------------------------ | ------------------------------ |
| zadd   | 将一个带有给定分值的成员添加到哦有序集合里面             | ZADD key score member [[score member] [score member] …]<br />`score` 值可以是整数值或双精度浮点数 | zadd zset-key 178 member1 |
| zrange | 根据元素在有序集合中所处的位置，从有序集合中获取多个元素 | ZRANGE key start stop [WITHSCORES]<br />start和stop是下标索引，从0开始；-1是最后一个元素，-2是倒数第二个 | zrange zset-key 0 -1 withscores |
| zrem   | 如果给定元素成员存在于有序集合中，那么就移除这个元素     | ZREM key member [member …] | zrem zset-key member1      |

- **适用场景**：适合用于存储各种排行数据
  - **排行榜**：有序集合经典使用场景。例如小说视频等网站需要对用户上传的小说视频做排行榜，榜单可以按照用户关注数，更新时间，字数等打分，做排行。



## 参考文献

- Redis 官网：[https://redis.io/topics/data-types](https://redis.io/topics/data-types)
- https://www.pdai.tech/md/db/nosql-redis/db-redis-data-types.html

