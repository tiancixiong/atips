# Redis入门 - 数据类型：3种特殊类型

Redis除了上文中 5 种基础数据类型，还有 3 种特殊的数据类型，分别是 **HyperLogLogs**（基数统计）， **Bitmaps** (位图) 和 **geospatial** （地理位置）。



## HyperLogLog 基数统计

> 可用版本： >= 2.8.9

HyperLogLog 是用于计算唯一事物的概率数据结构（从技术上讲，这被称为估计集合的基数）。如果统计唯一项，项目越多，需要的内存就越多。因为需要记住过去已经看过的项，从而避免多次统计这些项。

- **什么是基数？**

举个例子，A = {1, 2, 3, 4, 5}， B = {3, 5, 6, 7, 9}；那么基数（不重复的元素）= 1, 2, 4, 6, 7, 9； （允许容错，即可以接受一定误差）。

- **HyperLogLogs 基数统计用来解决什么问题**？

这个结构可以非常省内存的去统计各种计数，比如注册 IP 数、每日访问 IP 数、页面实时UV、在线用户数，共同好友数等。

- **它的优势体现在哪**？

一个大型的网站，每天 IP 比如有 100 万，粗算一个 IP 消耗 15 字节，那么 100 万个 IP 就是 15M。而 HyperLogLog 在 Redis 中每个键占用的内容都是 12K，理论存储近似接近 2^64 个值，不管存储的内容是什么，它一个基于基数估算的算法，只能比较准确的估算出基数，可以使用少量固定的内存去存储并识别集合中的唯一元素。而且这个估算的基数并不一定准确，是一个带有 0.81% 标准错误的近似值（对于可以接受一定容错的业务场景，比如IP数统计，UV等，是可以忽略不计的）。



### HyperLogLog 命令

- [pfadd](http://redisdoc.com/hyperloglog/pfadd.html) - 将任意数量的元素添加到指定的 HyperLogLog 里面。
- [pfcount](http://redisdoc.com/hyperloglog/pfcount.html) - 返回给定 HyperLogLog 的基数估算值。
- [pfmerge](http://redisdoc.com/hyperloglog/pfmerge.html) - 将多个 HyperLogLog 合并（merge）为一个 HyperLogLog ， 合并后的 HyperLogLog 的基数接近于所有输入 HyperLogLog 的可见集合（observed set）的并集。合并得出的 HyperLogLog 会被储存在 `destkey` 键里面， 如果该键并不存在， 那么命令在执行之前， 会先为该键创建一个空的 HyperLogLog 。

示例

```shell
127.0.0.1:6379> pfadd key1 a b c d		# 创建第一组元素
(integer) 0
127.0.0.1:6379> pfcount key1			# 统计元素的基数数量
(integer) 9
127.0.0.1:6379> pfadd key2 c d e f g	# 创建第二组元素
(integer) 0
127.0.0.1:6379> pfcount key2
(integer) 10
127.0.0.1:6379> pfmerge key3 key1 key2	# 合并两组：key1 key2 -> key3 并集
OK
127.0.0.1:6379> pfcount key3
(integer) 13
```



## BitMap 位图

> 可用版本： >= 2.2.0

> Bitmap 即位图数据结构，都是操作二进制位来进行记录，只有 0 和 1 两个状态。

BitMap 即位图。BitMap 不是一个真实的数据结构。而是 String 类型上的一组面向 bit 操作的集合。由于 String 是二进制安全的 blob，并且它们的最大长度是 512m，所以 BitMap 能最大设置 $$2^{32}$$ 个不同的 bit。

BitMap 的最大优点就是存储信息时可以节省大量的空间。例如在一个系统中，不同的用户被一个增长的用户 ID 表示。40 亿（$$2^{32}$$ = $$4*1024*1024*1024$$ ≈ 40 亿）用户只需要 512M 内存就能记住某种信息，例如用户是否登录过。

- **用来解决什么问题**？

比如：统计用户信息，活跃，不活跃！ 登录，未登录！ 打卡，不打卡！ **两个状态的，都可以使用 Bitmaps**！

如果存储一年的打卡状态需要多少内存呢？ *365 天 = 365 bit 1字节 = 8bit*，需要 46 个字节左右！



### BitMap 命令

- [setbit](http://redisdoc.com/bitmap/setbit.html) - 对 `key` 所储存的字符串值，设置或清除指定偏移量上的位(bit)。
- [getbit](http://redisdoc.com/bitmap/getbit.html) - 对 `key` 所储存的字符串值，获取指定偏移量上的位(bit)。
- [bitcount](http://redisdoc.com/bitmap/bitcount.html) - 计算给定字符串中，被设置为 `1` 的比特位的数量。
- [BITPOS](http://redisdoc.com/bitmap/bitpos.html)
- [BITOP](http://redisdoc.com/bitmap/bitop.html)
- [BITFIELD](http://redisdoc.com/bitmap/bitfield.html)

示例：

使用 bitmap 来记录 周一到周日的打卡！ 周一：1 周二：0 周三：0 周四：1 ......

```shell
127.0.0.1:6379> setbit sign 0 1
(integer) 0
127.0.0.1:6379> setbit sign 1 1
(integer) 0
127.0.0.1:6379> setbit sign 2 0
(integer) 0
127.0.0.1:6379> setbit sign 3 1
(integer) 0
127.0.0.1:6379> setbit sign 4 0
(integer) 0
127.0.0.1:6379> setbit sign 5 0
(integer) 0
127.0.0.1:6379> setbit sign 6 1
(integer) 0
```

查看某一天是否有打卡：

```shell
127.0.0.1:6379> getbit sign 3
(integer) 1
127.0.0.1:6379> getbit sign 5
(integer) 0
```

统计操作，统计打卡的天数：

```shell
127.0.0.1:6379> bitcount sign # 统计这周的打卡记录，就可以看到是否有全勤
(integer) 4
```



## Geospatial 地理位置

> 可用版本： >= 3.2.0

Redis 的 Geo 可以将用户给定的地理位置（经度和纬度）信息储存起来，并对这些信息进行操作。 这个功能可以推算地理位置的信息：两地之间的距离，方圆几里的人。

我们日常生活中的定位、查看附近的人、朋友的定位、打车距离计算等等，基本上都是使用Geospatial 。

| 命令                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [geoadd](http://redisdoc.com/geo/geoadd.html)                | 将指定的地理空间位置（纬度、经度、名称）添加到指定的 key 中  |
| [geopos](http://redisdoc.com/geo/geopos.html)                | 从 key 里返回所有给定位置元素的位置（经度和纬度）            |
| [geodist](http://redisdoc.com/geo/geodist.html)              | 返回两个给定位置之间的距离                                   |
| [geohash](http://redisdoc.com/geo/geohash.html)              | 回一个或多个位置元素的标准 Geohash 值，它可以在 [http://geohash.org/](http://geohash.org/) 使用 |
| [georadius](http://redisdoc.com/geo/georadius.html)          |                                                              |
| [georadiusbymember](http://redisdoc.com/geo/georadiusbymember.html) |                                                              |

### geoadd

添加地理位置。

```shell
127.0.0.1:6379> geoadd china:city 118.76 32.04 manjing 112.55 37.86 taiyuan 123.43 41.80 shenyang
(integer) 3
127.0.0.1:6379> geoadd china:city 144.05 22.52 shengzhen 120.16 30.24 hangzhou 108.96 34.26 xian
(integer) 3
```

**规则**

两级无法直接添加，我们一般会下载城市数据（这个网址可以查询 GEO： [http://www.jsons.cn/lngcode](http://www.jsons.cn/lngcode)）

- 有效的经度从 `-180` 度到 `180` 度。
- 有效的纬度从 `-85.05112878` 度到 `85.05112878` 度。

```bash
# 当坐标位置超出上述指定范围时，该命令将会返回一个错误。
127.0.0.1:6379> geoadd china:city 39.90 116.40 beijin
(error) ERR invalid longitude,latitude pair 39.900000,116.400000
```

### geopos

获取指定的成员的经度和纬度。

```shell
127.0.0.1:6379> geopos china:city taiyuan manjing
1) 1) "112.54999905824661255"
   1) "37.86000073876942196"
2) 1) "118.75999957323074341"
   1) "32.03999960287850968"
```

获得当前定位, 一定是一个坐标值!

### geodist

如果不存在，返回空。

单位如下：

- m
- km
- mi 英里
- ft 英尺

```shell
127.0.0.1:6379> geodist china:city taiyuan shenyang m
"1026439.1070"
127.0.0.1:6379> geodist china:city taiyuan shenyang km
"1026.4391"
```

### georadius

附近的人 ==> 获得所有附近的人的地址, 定位, 通过半径来查询

```shell
127.0.0.1:6379> georadius china:city 110 30 1000 km  #以 100,30 这个坐标为中心, 寻找半径为1000km的城市
1) "xian"
2) "hangzhou"
3) "manjing"
4) "taiyuan"
127.0.0.1:6379> georadius china:city 110 30 500 km
1) "xian"
127.0.0.1:6379> georadius china:city 110 30 500 km withdist
1) 1) "xian"
   2) "483.8340"
127.0.0.1:6379> georadius china:city 110 30 1000 km withcoord withdist count 2
1) 1) "xian"
   2) "483.8340"
   3) 1) "108.96000176668167114"
      2) "34.25999964418929977"
2) 1) "manjing"
   2) "864.9816"
   3) 1) "118.75999957323074341"
      2) "32.03999960287850968"
```

参数格式：`key 经度 纬度 半径 单位 [显示结果的经度和纬度] [显示结果的距离] [显示的结果的数量]`

### georadiusbymember

显示与指定成员一定半径范围内的其他成员。

```shell
127.0.0.1:6379> georadiusbymember china:city taiyuan 1000 km
1) "manjing"
2) "taiyuan"
3) "xian"
127.0.0.1:6379> georadiusbymember china:city taiyuan 1000 km withcoord withdist count 2
1) 1) "taiyuan"
   2) "0.0000"
   3) 1) "112.54999905824661255"
      2) "37.86000073876942196"
2) 1) "xian"
   2) "514.2264"
   3) 1) "108.96000176668167114"
      2) "34.25999964418929977"
```

参数与 georadius 一样

### geohash(较少使用)

该命令返回11个字符的hash字符串。

```shell
127.0.0.1:6379> geohash china:city taiyuan shenyang
1) "ww8p3hhqmp0"
2) "wxrvb9qyxk0"
```

### 底层

geo 底层的实现原理实际上就是 Zset，我们可以通过 Zset 命令来操作 geo。

```shell
127.0.0.1:6379> type china:city
zset
```

查看全部元素 删除指定的元素

```shell
127.0.0.1:6379> zrange china:city 0 -1 withscores
 1) "xian"
 2) "4040115445396757"
 3) "hangzhou"
 4) "4054133997236782"
 5) "manjing"
 6) "4066006694128997"
 7) "taiyuan"
 8) "4068216047500484"
 9) "shenyang"
1)  "4072519231994779"
2)  "shengzhen"
3)  "4154606886655324"
127.0.0.1:6379> zrem china:city manjing
(integer) 1
127.0.0.1:6379> zrange china:city 0 -1
1) "xian"
2) "hangzhou"
3) "taiyuan"
4) "shenyang"
5) "shengzhen"
```



## 参考资料

- https://www.pdai.tech/md/db/nosql-redis/db-redis-data-type-special.html