# 集合类体系

程序开发中数据结构可以分为这八类：数组(Array)、链表(Linked)、栈(Stack)、队列(Queue)、散列表(Hash)、树(Tree)、堆(Heap)、图(Graph)。

![image-20211021102338258](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211021102338258.png)

其中，数组、链表、散列表、树是程序开发直接或者间接用到的最多的。相关的对应实现类可以包括如下：

| 类型   | 实现           |
| ------ | -------------- |
| 数组   | ArrayList      |
| 链表   | LinkedList     |
| 树     | 2-3 树、红黑树 |
| 散列表 | HashMap        |
| 栈     | Stack          |
| 队列   | Queue、Deque   |

---

`java.util` 库提供了一套相当完整的集合类（collection classes）来实现这些结构，其中基本的类
型有 List 、Set 、Queue 和 Map。这些类型也被称作容器类（container classes）。

![java_collections_overview](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/java_collections_overview.png)

![collection-classes](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/collection-classes.jpg)

容器主要包括 *Collection* 和 *Map* 两种，*Collection* 存储着对象的集合，而 *Map* 存储着键值对(两个对象)的映射表。

1. 集合(*Collection*)：一个独立元素的序列，这些元素都服从一条或多条规则。*List* 必须以插入
的顺序保存元素，*Set* 不能包含重复元素，*Queue* 按照排队规则来确定对象产生的顺序（通常与
它们被插入的顺序相同）；
2. 映射(*Map*)：一组成对的 **键值对** 对象，允许使用键来查找值。*ArrayList* 使用数字来查找对
象，因此在某种意义上讲，它是将数字和对象关联在一起。*Map* 允许我们使用一个对象来查找另
一个对象，它也被称作关联数组（associative array），因为它将对象和其它对象关联在一起；或
者称作字典（dictionary），因为可以使用一个键对象来查找值对象，就像在字典中使用单词查找
定义一样。



## Collection

![java-collection-hierarchy](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/java-collection-hierarchy.jpeg)

### Set

#### HashSet

基于哈希表实现，支持快速查找，但不支持有序性操作。并且失去了元素的插入顺序信息，也就是说使用 Iterator 遍历 HashSet 得到的结果是不确定的。

#### LinkedHashSet

具有 HashSet 的查找效率，且内部使用双向链表维护元素的插入顺序。

#### TreeSet

基于红黑树实现，支持有序性操作，例如根据一个范围查找元素的操作。但是查找效率不如 HashSet，HashSet 查找的时间复杂度为 O(1)，TreeSet 则为 O(logN)。

> 关于算法时间复杂度查看：[算法复杂度](https://blog.csdn.net/dazhaoDai/article/details/81631195)



### List

#### ArrayList

基于动态数组实现，支持随机访问。

#### Vector

和 ArrayList 类似，但它是线程安全的。

#### LinkedList

基于双向链表实现，只能顺序访问，但是可以快速地在链表中间插入和删除元素。不仅如此，LinkedList 还可以用作栈、队列和双向队列。



### Queue

#### LinkedList

可以用它来实现双向队列。

#### PriorityQueue

基于堆结构实现，可以用它来实现优先队列。



## Map

![map-class-hierarchy](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/map-class-hierarchy.jpg)

### TreeMap

基于红黑树实现。

### HashMap

基于哈希表实现。

### HashTable

和 HashMap 类似，但它是线程安全的，这意味着同一时刻多个线程可以同时写入 HashTable 并且不会导致数据不一致。它是遗留类，不应该去使用它。现在可以使用 `ConcurrentHashMap` 来支持线程安全，并且 ConcurrentHashMap 的效率会更高，因为 ConcurrentHashMap 引入了分段锁。

### LinkedHashMap

使用双向链表来维护元素的顺序，顺序为插入顺序或者最近最少使用(LRU)顺序。



## 参考资料

- [JCFInternals](https://github.com/CarpenterLee/JCFInternals) - GitHub@CarpenterLee

