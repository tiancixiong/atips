"use strict";(self.webpackChunkatips=self.webpackChunkatips||[]).push([[8572],{7496:(e,i,d)=>{d.r(i),d.d(i,{data:()=>r});const r={key:"v-3067c0c2",path:"/database/nosql-redis/redis-overview.html",title:"Reids - Overview",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"知识体系",slug:"知识体系",children:[{level:3,title:"Redis入门 - 概念和基础",slug:"redis入门-概念和基础",children:[]},{level:3,title:"Redis入门 - 数据类型",slug:"redis入门-数据类型",children:[]},{level:3,title:"Redis进阶 - 持久化",slug:"redis进阶-持久化",children:[]},{level:3,title:"Redis进阶 - 消息传递：发布订阅模式",slug:"redis进阶-消息传递-发布订阅模式",children:[]},{level:3,title:"Redis进阶 - 事件：Redis事件机制",slug:"redis进阶-事件-redis事件机制",children:[]},{level:3,title:"Redis进阶 - 事务：Redis事务",slug:"redis进阶-事务-redis事务",children:[]},{level:3,title:"Redis进阶 - 高可用：集群",slug:"redis进阶-高可用-集群",children:[]},{level:3,title:"Redis进阶 - 高可用：主从复制",slug:"redis进阶-高可用-主从复制",children:[]},{level:3,title:"Redis进阶 - 高可用：哨兵机制(Redis Sentinel)",slug:"redis进阶-高可用-哨兵机制-redis-sentinel",children:[]},{level:3,title:"Redis进阶 - 高可拓展：分片技术(Redis Cluster)",slug:"redis进阶-高可拓展-分片技术-redis-cluster",children:[]},{level:3,title:"Redis进阶 - 缓存问题：一致性, 穿击, 穿透, 雪崩, 污染等",slug:"redis进阶-缓存问题-一致性-穿击-穿透-雪崩-污染等",children:[]},{level:3,title:"Redis进阶 - 版本特性: 4.0、5.0、6.0特性整理",slug:"redis进阶-版本特性-4-0、5-0、6-0特性整理",children:[]},{level:3,title:"Redis进阶 - 运维监控",slug:"redis进阶-运维监控",children:[]},{level:3,title:"Redis进阶 - 性能调优",slug:"redis进阶-性能调优",children:[]}]},{level:2,title:"学习资料",slug:"学习资料",children:[]}],filePathRelative:"database/nosql-redis/redis-overview.md",git:{updatedTime:1719836412e3,contributors:[{name:"TianCi.Xiong",email:"tiancixiong@163.com",commits:2},{name:"Tianci.Xiong",email:"tiancixiong@163.com",commits:2}]}}},6266:(e,i,d)=>{d.r(i),d.d(i,{default:()=>S});var r=d(6252);const s=(0,r.uE)('<h1 id="reids-overview" tabindex="-1"><a class="header-anchor" href="#reids-overview" aria-hidden="true">#</a> Reids - Overview</h1><h2 id="知识体系" tabindex="-1"><a class="header-anchor" href="#知识体系" aria-hidden="true">#</a> 知识体系</h2><h3 id="redis入门-概念和基础" tabindex="-1"><a class="header-anchor" href="#redis入门-概念和基础" aria-hidden="true">#</a> Redis入门 - 概念和基础</h3><p>Redis 是一种支持 <code>key-value</code> 等多种数据结构的存储系统。可用于缓存，事件发布或订阅，高速队列等场景。支持网络，提供字符串，哈希，列表，队列，集合结构直接存取，基于内存，可持久化。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/nosql-redis/20200713105627.png" alt="img"></p><h3 id="redis入门-数据类型" tabindex="-1"><a class="header-anchor" href="#redis入门-数据类型" aria-hidden="true">#</a> Redis入门 - 数据类型</h3><ul><li>Redis入门 - 数据类型：5 种基础数据类型 <ul><li>Redis 所有的 <strong>key</strong>（键）都是字符串。我们在谈基础数据结构时，讨论的是存储<strong>值</strong>的数据类型，主要包括常见的5种数据类型，分别是：String、List、Set、Zset、Hash。</li></ul></li></ul><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/nosql-redis/20200226113813.png" alt="Redis 数据类型"></p><ul><li>Redis入门 - 数据类型：3 种特殊类型 <ul><li>Redis 除了上文中 5 种基础数据类型，还有三种特殊的数据类型，分别是 <em>HyperLogLogs</em>（基数统计）， <em>Bitmaps</em> (位图) 和 <em>geospatial</em> （地理位置）。</li></ul></li></ul><h3 id="redis进阶-持久化" tabindex="-1"><a class="header-anchor" href="#redis进阶-持久化" aria-hidden="true">#</a> Redis进阶 - 持久化</h3><p>为了防止数据丢失以及服务重启时能够恢复数据，Redis 支持数据的持久化，主要分为两种方式，分别是 <em>RDB</em> 和 <em>AOF</em>；当然实际场景下还会使用这两种的混合模式。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/nosql-redis/20200224214047.png" alt="img"></p><h3 id="redis进阶-消息传递-发布订阅模式" tabindex="-1"><a class="header-anchor" href="#redis进阶-消息传递-发布订阅模式" aria-hidden="true">#</a> Redis进阶 - 消息传递：发布订阅模式</h3><h3 id="redis进阶-事件-redis事件机制" tabindex="-1"><a class="header-anchor" href="#redis进阶-事件-redis事件机制" aria-hidden="true">#</a> Redis进阶 - 事件：Redis事件机制</h3><h3 id="redis进阶-事务-redis事务" tabindex="-1"><a class="header-anchor" href="#redis进阶-事务-redis事务" aria-hidden="true">#</a> Redis进阶 - 事务：Redis事务</h3><h3 id="redis进阶-高可用-集群" tabindex="-1"><a class="header-anchor" href="#redis进阶-高可用-集群" aria-hidden="true">#</a> Redis进阶 - 高可用：集群</h3><blockquote><p>关键词：<code>CLUSTER MEET</code>、<code>Hash slot</code>、<code>MOVED</code>、<code>ASK</code>、<code>SLAVEOF no one</code>、<code>redis-trib</code></p></blockquote><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/nosql-redis/20200713100613.png" alt="img"></p><h3 id="redis进阶-高可用-主从复制" tabindex="-1"><a class="header-anchor" href="#redis进阶-高可用-主从复制" aria-hidden="true">#</a> Redis进阶 - 高可用：主从复制</h3><blockquote><p>关键词：<code>SLAVEOF</code>、<code>SYNC</code>、<code>PSYNC</code>、<code>REPLCONF ACK</code></p></blockquote><p>我们知道要避免单点故障，即保证高可用，便需要冗余（副本）方式提供集群服务。而 Redis 提供了主从库模式，以保证数据副本的一致，主从库之间采用的是读写分离的方式。本文主要阐述 Redis 的主从复制。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/nosql-redis/20200712182603.png" alt="img"></p><h3 id="redis进阶-高可用-哨兵机制-redis-sentinel" tabindex="-1"><a class="header-anchor" href="#redis进阶-高可用-哨兵机制-redis-sentinel" aria-hidden="true">#</a> Redis进阶 - 高可用：哨兵机制(Redis Sentinel)</h3><blockquote><p>Redis 哨兵（Sentinel）是 Redis 的高可用性（Hight Availability）解决方案。</p><p>Redis 哨兵是 Raft 算法 的具体实现。</p><p>关键词：<code>Sentinel</code>、<code>PING</code>、<code>INFO</code>、<code>Raft</code></p></blockquote><p>在上文主从复制的基础上，如果注节点出现故障该怎么办呢？ 在 Redis 主从集群中，哨兵机制是实现主从库自动切换的关键机制，它有效地解决了主从复制模式下故障转移的问题。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/database/nosql-redis/20200713072747.png" alt="img"></p><h3 id="redis进阶-高可拓展-分片技术-redis-cluster" tabindex="-1"><a class="header-anchor" href="#redis进阶-高可拓展-分片技术-redis-cluster" aria-hidden="true">#</a> Redis进阶 - 高可拓展：分片技术(Redis Cluster)</h3><h3 id="redis进阶-缓存问题-一致性-穿击-穿透-雪崩-污染等" tabindex="-1"><a class="header-anchor" href="#redis进阶-缓存问题-一致性-穿击-穿透-雪崩-污染等" aria-hidden="true">#</a> Redis进阶 - 缓存问题：一致性, 穿击, 穿透, 雪崩, 污染等</h3><h3 id="redis进阶-版本特性-4-0、5-0、6-0特性整理" tabindex="-1"><a class="header-anchor" href="#redis进阶-版本特性-4-0、5-0、6-0特性整理" aria-hidden="true">#</a> Redis进阶 - 版本特性: 4.0、5.0、6.0特性整理</h3><h3 id="redis进阶-运维监控" tabindex="-1"><a class="header-anchor" href="#redis进阶-运维监控" aria-hidden="true">#</a> Redis进阶 - 运维监控</h3><h3 id="redis进阶-性能调优" tabindex="-1"><a class="header-anchor" href="#redis进阶-性能调优" aria-hidden="true">#</a> Redis进阶 - 性能调优</h3><h2 id="学习资料" tabindex="-1"><a class="header-anchor" href="#学习资料" aria-hidden="true">#</a> 学习资料</h2>',32),a=(0,r._)("p",null,"官网",-1),l={href:"http://redis.io",target:"_blank",rel:"noopener noreferrer"},t=(0,r.Uk)("Redis 官网"),n={href:"https://github.com/antirez/redis",target:"_blank",rel:"noopener noreferrer"},h=(0,r.Uk)("Redis github"),o=(0,r._)("p",null,"文档",-1),c=(0,r.Uk)("Redis 官方文档："),u={href:"http://redis.io/documentation",target:"_blank",rel:"noopener noreferrer"},g=(0,r.Uk)("http://redis.io/documentation"),p=(0,r.Uk)("中文文档："),m={href:"http://www.redis.cn/documentation.html",target:"_blank",rel:"noopener noreferrer"},R=(0,r.Uk)("http://www.redis.cn/documentation.html"),b=(0,r._)("p",null,"其他资源",-1),f=(0,r.Uk)("Redis 教程："),v={href:"https://dunwu.github.io/db-tutorial/nosql/redis/",target:"_blank",rel:"noopener noreferrer"},k=(0,r.Uk)("https://dunwu.github.io/db-tutorial/nosql/redis/"),_=(0,r.Uk)("Redis 命令参考："),x={href:"http://redisdoc.com/",target:"_blank",rel:"noopener noreferrer"},w=(0,r.Uk)("http://redisdoc.com/"),q={},S=(0,d(3744).Z)(q,[["render",function(e,i){const d=(0,r.up)("OutboundLink");return(0,r.wg)(),(0,r.iD)(r.HY,null,[s,(0,r._)("ul",null,[(0,r._)("li",null,[a,(0,r._)("ul",null,[(0,r._)("li",null,[(0,r._)("a",l,[t,(0,r.Wm)(d)])]),(0,r._)("li",null,[(0,r._)("a",n,[h,(0,r.Wm)(d)])])])]),(0,r._)("li",null,[o,(0,r._)("ul",null,[(0,r._)("li",null,[c,(0,r._)("a",u,[g,(0,r.Wm)(d)])]),(0,r._)("li",null,[p,(0,r._)("a",m,[R,(0,r.Wm)(d)])])])]),(0,r._)("li",null,[b,(0,r._)("ul",null,[(0,r._)("li",null,[f,(0,r._)("a",v,[k,(0,r.Wm)(d)])]),(0,r._)("li",null,[_,(0,r._)("a",x,[w,(0,r.Wm)(d)])])])])])],64)}]])},3744:(e,i)=>{i.Z=(e,i)=>{for(const[d,r]of i)e[d]=r;return e}}}]);