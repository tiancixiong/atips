# MongoDB入门 - 基础概念

## 什么是NoSQL？

NoSQL 是一种非关系型DMS，不需要固定的架构，可以避免 joins 链接，并且易于扩展。NoSQL 数据库用于具有庞大数据存储需求的分布式数据存储。NoSQL 用于大数据和实时 Web 应用程序。例如，像Twitter，Facebook，Google 这样的大型公司，每天可能产生 TB 级的用户数据。

NoSQL 数据库代表“**不仅仅是SQL**”或“不是SQL”。虽然 NoRELNoSQL 会是一个更好的名词。Carl Strozz 在 1998 年引入了 NoSQL 概念。

传统的 RDBMS 使用 SQL 语法来存储和查询数据。相反，NoSQL 数据库系统包含可存储结构化，半结构化，非结构化和多态数据的多种数据库技术。

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-mongodb/mongo-x-basic-1.png)



### 为什么使用NoSQL？

NoSQL 数据库的概念在处理大量数据的互联网巨头（例如 Google，Facebook，Amazon 等）中变得很流行。使用 RDBMS 处理海量数据时，系统响应时间变慢。

为了解决此问题，当然可以通过升级现有硬件来“横向扩展”我们的系统。但这个成本很高。

这个问题的替代方案是在负载增加时将数据库负载分配到多个主机上。这种方法称为“横向扩展”。

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-mongodb/mongo-x-basic-2.png)

NoSQL 数据库是非关系数据库，因此在设计时考虑到 Web 应用程序，比关系数据库更好地扩展。



### NoSQL数据库的简要历史

- 1998年 - Carlo Strozzi在他的轻量级开源关系数据库中使用术语NoSQL
- 2000年 - 图形数据库Neo4j启动
- 2004年 - 推出Google BigTable
- 2005年 - 启动CouchDB
- 2007年 - 发布有关Amazon Dynamo的研究论文
- 2008年 - Facebook开源Cassandra项目
- 2009年 - 重新引入NoSQL术语



### NoSQL的功能

- **非关系**
  - NoSQL 数据库从不遵循关系模型
  - 切勿为 tables 提供固定的固定列记录
  - 使用自包含的聚合或 BLOB
  - 不需要对象关系映射和数据规范化
  - 没有复杂的功能，例如查询语言，查询计划者，
  - 参照完整性联接，ACID
- **动态架构**
  - NoSQL 数据库是无模式的或具有宽松模式的数据库
  - 不需要对数据架构进行任何形式的定义
  - 提供同一域中的异构数据结构

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-mongodb/mongo-x-basic-3.png)

- **简单的API**
  - 提供易于使用的界面，用于存储和查询提供的数据
  - API允许进行低级数据操作和选择方法
  - 基于文本的协议，通常与带有JSON的HTTP REST一起使用
  - 多数不使用基于标准的查询语言
  - 支持Web的数据库作为面向互联网的服务运行
- **分布式**
  - 可以以分布式方式执行多个NoSQL数据库
  - 提供自动缩放和故障转移功能
  - 通常可牺牲ACID概念来实现可伸缩性和吞吐量
  - 分布式节点之间几乎没有同步复制，多为异步多主复制，对等，HDFS复制
  - 仅提供最终的一致性
  - 无共享架构。这样可以减少协调并提高分布。

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-mongodb/mongo-x-basic-4.png)



## 什么是MongoDB

MongoDB 是面向文档的 NoSQL 数据库，是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。。MongoDB是一个在2000年代中期问世的数据库。属于NoSQL数据库的类别。

MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。



### 为什么使用MongoDB

以下是一些为什么应该开始使用MongoDB的原因：

- **面向文档的**–由于MongoDB是NoSQL类型的数据库，它不是以关系类型的格式存储数据，而是将数据存储在文档中。这使得MongoDB非常灵活，可以适应实际的业务环境和需求。
- **临时查询**-MongoDB支持按字段，范围查询和正则表达式搜索。可以查询返回文档中的特定字段。
- **索引**-可以创建索引以提高MongoDB中的搜索性能。MongoDB文档中的任何字段都可以建立索引。
- **复制**-MongoDB可以提供副本集的高可用性。副本集由两个或多个mongo数据库实例组成。每个副本集成员可以随时充当主副本或辅助副本的角色。主副本是与客户端交互并执行所有读/写操作的主服务器。辅助副本使用内置复制维护主数据的副本。当主副本发生故障时，副本集将自动切换到辅助副本，然后它将成为主服务器。
- **负载平衡**-MongoDB使用分片的概念，通过在多个MongoDB实例之间拆分数据来水平扩展。MongoDB可以在多台服务器上运行，以平衡负载或复制数据，以便在硬件出现故障时保持系统正常运行。



### MongoDB 发展

- 1.x - 支持复制和分片
- 2.x - 更丰富的数据库功能
- 3.x - WiredTiger 和周边生态
- 4.x - 支持分布式事务



### MongoDB 特性

- 数据是 JSON 结构
  - 支持结构化、半结构化数据模型
  - 可以动态响应结构变化
- 通过副本机制提供高可用
- 通过分片提供扩容能力



### MongoDB 功能

每个数据库都包含集合，而集合又包含文档。每个文档可以具有不同数量的字段。每个文档的大小和内容可以互不相同。 文档结构更符合开发人员如何使用各自的编程语言构造其类和对象。开发人员经常会说他们的类不是行和列，而是具有键值对的清晰结构。 从NoSQL数据库的简介中可以看出，行（或在MongoDB中调用的文档）不需要预先定义架构。相反，可以动态创建字段。 MongoDB中可用的数据模型使我们可以更轻松地表示层次结构关系，存储数组和其他更复杂的结构。 可伸缩性– MongoDB环境具有很高的可伸缩性。全球各地的公司已经定义了自己的集群，其中一些集群运行着100多个节点，数据库中包含大约数百万个文档。



### MongoDB 概念

下表将帮助您更容易理解Mongo中的一些概念：

| SQL 术语/概念 | MongoDB 术语/概念 | 解释/说明                                |
| ------------- | ----------------- | ---------------------------------------- |
| database      | database          | 数据库                                   |
| table         | collection        | 数据库表/集合                            |
| row           | document          | 数据记录行/文档                          |
| column        | field             | 数据字段/域                              |
| index         | index             | 索引                                     |
| table joins   |                   | 表连接，MongoDB不支持                    |
| primary key   | primary key       | 主键，MongoDB自动将 `_id` 字段设置为主键 |

**常用术语**：

- **_id** – 这是每个MongoDB文档中必填的字段。_id字段表示MongoDB文档中的唯一值。_id字段类似于文档的主键。如果创建的新文档中没有_id字段，MongoDB将自动创建该字段。
- **集合** – 这是MongoDB文档的分组。集合等效于在任何其他RDMS（例如Oracle或MS SQL）中创建的表。集合存在于单个数据库中。从介绍中可以看出，集合不强制执行任何结构。
- **游标** – 这是指向查询结果集的指针。客户可以遍历游标以检索结果。
- **数据库** – 这是像RDMS中那样的集合容器，其中是表的容器。每个数据库在文件系统上都有其自己的文件集。MongoDB服务器可以存储多个数据库。
- **文档** - MongoDB集合中的记录基本上称为文档。文档包含字段名称和值。
- **字段** - 文档中的名称/值对。一个文档具有零个或多个字段。字段类似于关系数据库中的列。

下图显示了带有键值对的字段的示例。如下的例子中，`OrderID: 111` 是文档中定义的键值对之一。

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/database/nosql-mongodb/mongo-x-basic-5.png)



## MongoDB与RDBMS区别

| 特性      | MongoDB                                          | RDBMS    |
| --------- | ------------------------------------------------ | -------- |
| 数据模型  | 文档模型                                         | 关系型   |
| CRUD 操作 | MQL/SQL                                          | SQL      |
| 高可用    | 复制集                                           | 集群模式 |
| 扩展性    | 支持分片                                         | 数据分区 |
| 扩繁方式  | 垂直扩展+水平扩展                                | 垂直扩展 |
| 索引类型  | B 树、全文索引、地理位置索引、多键索引、TTL 索引 | B 树     |
| 数据容量  | 没有理论上限                                     | 千万、亿 |

