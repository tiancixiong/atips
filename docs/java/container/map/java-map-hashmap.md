# Map - HashMap

*HashMap* 最早出现在 *JDK 1.2* 中，底层基于散列算法实现，**以散列方式存储键值对**。HashMap 实现了 Map 接口，**允许 null 键和 null 值**，在计算哈键的哈希值时，*null* 键哈希值为 0。HashMap 是无序的，并不保证键值对的顺序，这意味着在进行某些操作后，键值对的顺序可能会发生变化。另外，需要注意的是，HashMap 是非线程安全类，在多线程环境下可能会存在问题。

HashMap 有两个影响其性能的参数：初始容量和负载因子：

- 容量是哈希表中桶的数量，初始容量就是哈希表创建时的容量；
- 加载因子是散列表在其容量自动扩容之前被允许的最大饱和量。当哈希表中的 entry 数量超过负载因子和当前容量的乘积时，散列表就会被重新映射（即重建内部数据结构），一般散列表大约是存储桶数量的两倍。



## 重要概念

我们先通过一个简单的案例来模拟一下 HashMap 进行散列数据存放的逻辑。

**问题**：假设我们有一组 7 个字符串，需要存放到数组中，但要求在获取每个元素的时候时间复杂度是 O(1) 。也就是说你不能通过循环遍历的方式进行获取，而是要定位到数组ID直接获取相应的元素。

**方案**： 如果说我们需要通过ID从数组中获取元素，那么就需要把每个字符串都计算出一个在数组中的*位置ID*。字符串获取ID你能想到什么方式？ 一个字符串最直接的获取跟数字相关的信息就是 HashCode，可 HashCode 的取值范围太大了 `[-2147483648, 2147483647]` ，不可能直接使用。那么就需要使用 HashCode 与数组长度做与运算，得到一个可以在数组中出现的位置。如果说有两个元素得到同样的ID，那么这个数组ID下就存放两个字符串。这其实就是把字符串散列到数组中的一个基本思路

**实现**：

```java
// 需存放的字符串
List<String> list = new ArrayList<>();
list.add("jlkk");
list.add("lopi");
list.add("yolo");
list.add("e4we");
list.add("alpo");
list.add("yhjk");
list.add("plop");

// 定义存放字符串的数组
String[] tab = new String[8];
for (String key : list) {
    int idx = key.hashCode() & (tab.length - 1); // 计算索引位置
    System.out.println(String.format("key值=%s Idx=%d", key, idx));
    if (null == tab[idx]) {
        tab[idx] = key; // 此位置没有元素则直接存入
        continue;
    }
    tab[idx] = tab[idx] + "->" + key; // 此位置已经有元素，则追加
}
// 输出测试结果
System.out.println(JSON.toJSONString(tab));
```

步骤：

1. 初始化一组字符串集合，这里初始化了 7 个；
2. 定义一个数组用于存放字符串，注意这里的长度是 8，也就是 2 的指数。这样的数组长度减去一后才会出现一个除高位以外都是 1 的特征（如：8的二进制是`1000`，而7的二进制是`0111`），也是为了散列；
3. 接下来就是循环存放数据，计算出每个字符串在数组中的位置：`key.hashCode() & (tab.length - 1)`；这里计算公式中无论左侧是多少，计算的结果最后都是小于等于右侧值的，也就是计算得到的存放位置永远是在数组长度范围内；
4. 在字符串存放到数组的过程，如果遇到相同的元素，进行连接操作模拟链表的过程（上面第20行）；
5. 最后输出存放结果。

输出结果：

```
key值=jlkk Idx=2
key值=lopi Idx=4
key值=yolo Idx=1
key值=e4we Idx=5
key值=alpo Idx=2
key值=yhjk Idx=0
key值=plop Idx=5
["yhjk","yolo","jlkk->alpo",null,"lopi","e4we->plop",null,null]
```

通过上面的结果可以发现：不同字符串(key)计算得到的位置(Idx)有可能相同；最后数组中 4、7、8 位置是空的，而 3、6 位置上存放了 2 个元素。

---

上面模拟的散列数据存放的逻辑，在实际使用中，会有哪些问题呢？

1. 这里所有的元素存放都需要获取一个索引位置，而如果元素的位置不够散列碰撞严重，那么就失去了散列表存放的意义，没有达到预期的性能。
2. 在获取索引ID的计算公式中，需要数组长度是2的倍数，那么怎么进行初始化这个数组大小。
3. 数组越小碰撞的越大，数组越大碰撞的越小，时间与空间如何取舍。
4. 目前存放7个元素，已经有两个位置都存放了2个字符串，那么链表越来越长怎么优化。
5. 随着元素的不断添加，数组长度不足扩容时，怎么把原有的元素，拆分到新的位置上去。

以上这些问题可以归纳为：扰动函数、初始化容量、负载因子、扩容方法以及链表和红黑树转换的使用等。



### 扰动函数

在 HashMap 存放元素时候有这样一段代码来处理哈希值，这是 *Java 1.8* 的散列值扰动函数，用于优化散列效果：

```java
// java.util.HashMap
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```



#### 为什么使用扰动函数

理论上来说字符串的 hashCode 是一个 int 类型值，那可以直接作为数组下标了，且不会出现碰撞。但是这个 hashCode 的取值范围是 `[-2147483648, 2147483647]` ，有将近 40 亿的长度，谁也不能把数组初始化的这么大，内存也是放不下的。

```java
// java.util.HashMap
/** The default initial capacity - MUST be a power of two. */
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;
```

我们默认初始化的 Map 大小是 16 个长度 `DEFAULT_INITIAL_CAPACITY = 1 << 4`，所以获取的 Hash 值并不能直接作为下标使用，需要与数组长度进行取模运算得到一个下标值，也就是我们上面做的散列案例。

其实，HashMap 源码这里不只是直接获取哈希值，还进行了一次扰动计算，`(h = key.hashCode()) ^ (h >>> 16)`。把哈希值右移 16 位，也就正好是自己长度的一半，之后与原哈希值做异或运算，这样就混合了原哈希值中的高位和低位，增大了随机性。计算方式如下图：

![image-20211024122233554](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/map/image-20211024122233554.png)

- 使用扰动函数就是为了增加随机性，让数据元素更加均衡的散列，减少碰撞。



### 初始化容量

HashMap 初始化长度时，长度始终都是 2 的幂，因为散列数组需要一个 2 的幂的长度，因为只有 2 的幂在减 1 的时候，才会出现 `01111` 这样的值。

那么这里就有一个问题，我们在初始化 HashMap 的时候，如果传一个 17 个的值 `new HashMap<>(17);`，它会怎么处理呢？

#### 寻找2的最小幂

在 HashMap 的初始化中，有这样一段方法：

```java
// java.util.HashMap
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}
```

阀值 `threshold`，通过方法 `tableSizeFor()` 进行计算，是根据传入的初始容量(initialCapacity)来计算的；这个方法也就是要计算出比传入初始值(initialCapacity)大，满足条件的最小的 2的幂。比如传了 17，最后找到的是 32。

计算阀值大小的方法：

```java
// java.util.HashMap
static final int MAXIMUM_CAPACITY = 1 << 30;
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

- `MAXIMUM_CAPACITY = 1 << 30`，这个是 HashMap 的最大容量；
- 乍一看可能有点晕，怎么都在向右移位1、2、4、8、16。这主要是为了把二进制的各个位置都填上1，当二进制的各个位置都是 1 以后，就是一个标准的 2 的幂减 1 了，最后把结果加 1 再返回即可。

那这里我们把 17 这样一个初始化计算阀值的过程，用图展示出来，方便理解：

![image-20211024160058887](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/map/image-20211024160058887.png)

1. 二进制数有个规则，1、10、100、1000，...,1000...0，像这种高位为1，其他位全为 0 的二进制数，其十进制数都是 2 的幂；
2. 先将入参的初始容量 17 减去1，得到 n=16，16 二进制为 `10000`；
3. 再将所有位换成 1，得到二进制 `11111` 即十进制数 n=31；
4. 返回的 `n+1` 就是得到了二进制 `100000` 即十进制数 32。



### 负载因子

**负载因子**(load factor)：通常表现为 `元素个数 / 容量`，是自动扩容之前被允许的最大饱和量。当负载因子大小为 0 的时候表示为一个空表；当负载因子大小为 0.5 表示为一个半满表(half-full table)。轻负载的表几乎没有冲突，因此是插入和查找的最佳选择（但会减慢使用迭代器进行遍历的过程）。

HashMap 和 HashSet 有可以让你指定负载因子的构造器。当表内容量达到了负载因子，集合就会自动扩充为原始容量（桶的数量）的**两倍**，并且会将原始的对象存储在新的桶集合中（也被称为 rehashing）。

HashMap 中负载因子的默认大小为 **0.75**（当表内容量大小不足四分之三的时候，不会发生 rehashing 现象）。这看起来是一个非常好的同时考虑到时间和空间消耗的平衡策略。更高的负载因子会减少空间的消耗，但是会增加查询的耗时。

```java
// java.util.HashMap
/**
 * The load factor used when none specified in constructor.
 */
static final float DEFAULT_LOAD_FACTOR = 0.75f;
```



## 插入

### Java 8

源码：

```java
// java.util.HashMap
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    // 初始化桶数组 table，table 被延迟到插入新数据时再进行初始化
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    // 如果桶中不包含键值对节点引用，则将新键值对节点的引用存入桶中即可
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        // 如果键的值以及节点 hash 等于链表中的第一个键值对节点时，则将 e 指向该键值对
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        // 如果桶中的引用类型为 TreeNode，则调用红黑树的插入方法
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            // 对链表进行遍历，并统计链表长度
            for (int binCount = 0; ; ++binCount) {
                // 链表中不包含要插入的键值对节点时，则将该节点接在链表的最后
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    // 如果链表长度大于或等于树化阈值，则进行树化操作
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                // 条件为 true，表示当前链表包含要插入的键值对，终止遍历
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        // 判断要插入的键值对是否存在 HashMap 中
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            // onlyIfAbsent 表示是否仅在 oldValue 为 null 的情况下更新键值对的值
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    // 键值对数量超过阈值时，则进行扩容
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

HashMap 插入数据流程图：

![image-20211024202419003](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/map/image-20211024202419003.png)

以上就是 HashMap 中一个数据插入的整体流程，包括了计算下标、何时扩容、何时链表转红黑树等，具体如下：

1. 首先进行哈希值的扰动，获取一个新的哈希值：`(key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16)`；

2. 判断 tab 是否位空或者长度为0，如果是则进行扩容操作：

  ```java
  // java.util.HashMap#putVal()
  if ((tab = table) == null || (n = tab.length) == 0)
      n = (tab = resize()).length;
  ```

3. 根据哈希值计算下标，如果对应位置正好没有存放数据，则直接插入即可否则需要覆盖：`(p = tab[i = (n - 1) & hash]) == null`

4. 判断 tab[i] 是否为树节点，是则向树中插入节点，否则向链表中插入数据。

5. 如果链表中插入节点的时候，链表长度大于等于8，则需要把链表转换为红黑树。`treeifyBin(tab, hash);`

6. 最后所有元素处理完成后，判断是否超过阈值；`++size > threshold`，超过则扩容。

7. `treeifyBin()`，是一个链表转树的方法，但不是所有的链表长度为 8 后都会转成树，还需要判断存放 key 值的数组桶长度是否小于 `MIN_TREEIFY_CAPACITY=64`。如果小于则需要扩容，扩容后链表上的数据会被拆分散列的相应的桶节点上，也就把链表长度缩短了。



## 查找

源码：

```java
// java.util.HashMap
public V get(Object key) {
    Node<K,V> e;
    // 同样需要经过扰动函数计算哈希值
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    // 判断桶数组的是否为空和长度值
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) { //计算下标，哈希值与数组长度-1
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        if ((e = first.next) != null) {
            // TreeNode 节点直接调用红黑树的查找方法，时间复杂度O(logn)
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            // 如果是链表就依次遍历查找
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```



## 删除

源码：

```java
// java.util.HashMap
public V remove(Object key) {
    Node<K,V> e;
    return (e = removeNode(hash(key), key, null, false, true)) == null ?
        null : e.value;
}

final Node<K,V> removeNode(int hash, Object key, Object value,
                           boolean matchValue, boolean movable) {
    Node<K,V>[] tab; Node<K,V> p; int n, index;
    // 定位桶数组中的下标位置，index = (n - 1) & hash
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (p = tab[index = (n - 1) & hash]) != null) {
        Node<K,V> node = null, e; K k; V v;
        // 如果键的值与链表第一个节点相等，则将 node 指向该节点
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            node = p;
        else if ((e = p.next) != null) {
            // 树节点，调用红黑树的查找方法，定位节点
            if (p instanceof TreeNode)
                node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
            else {
                // 遍历链表，找到待删除节点
                do {
                    if (e.hash == hash &&
                        ((k = e.key) == key ||
                         (key != null && key.equals(k)))) {
                        node = e;
                        break;
                    }
                    p = e;
                } while ((e = e.next) != null);
            }
        }
        // 删除节点，以及红黑树需要修复，因为删除后会破坏平衡性。链表的删除更加简单
        if (node != null && (!matchValue || (v = node.value) == value ||
                             (value != null && value.equals(v)))) {
            if (node instanceof TreeNode)
                ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
            else if (node == p)
                tab[index] = node.next;
            else
                p.next = node.next;
            ++modCount;
            --size;
            afterNodeRemoval(node);
            return node;
        }
    }
    return null;
}
```



## 遍历

**KeySet**：

```java
// java.util.HashMap
public Set<K> keySet() {
    Set<K> ks = keySet;
    if (ks == null) {
        ks = new KeySet();
        keySet = ks;
    }
    return ks;
}
```

**EntrySet**：

```java
// java.util.HashMap
public Set<Map.Entry<K,V>> entrySet() {
    Set<Map.Entry<K,V>> es;
    return (es = entrySet) == null ? (entrySet = new EntrySet()) : es;
}
```



## 参考文献

- 《Java 面经手册》- 小傅哥