# Collection - Set

## Set 简介

*Set* 注重独一无二的性质，该体系集合用于存储无序（存入和取出的顺序不一定相同）元素，**不允许有重复的元素**。对象的相等性本质是对象的 **hashCode** 值（Java 是依据对象的内存地址计算出的此序号）判断的，如果想要让两个不同的对象视为相等的，就必须覆盖 *Object* 的 `hashCode()` 方法和 `equals()` 方法。

![image-20211023214554753](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211023214554753.png)

- ***Set*** 继承了 Collection 的接口。实际上，Set 就是一个 Collection，只是行为不同（这是继承和多态思想的典型应用，表现不同的行为）；
- ***SortedSet*** 继承了 *Set* 的接口。*SortedSet* 中的内容是排序的唯一值，排序的方法是通过比较器(Comparator)；
- ***NavigableSet*** 继承了 SortedSet 的接口。它提供了丰富的查找方法：如"获取大于/等于某值的元素"、“获取小于/等于某值的元素”等等；
- ***AbstractSet*** 是一个抽象类，它继承于 AbstractCollection，AbstractCollection 实现了 *Set* 中的绝大部分方法，为实现 *Set* 的实例类提供了便利；
- ***HashSet*** 类依赖于 HashMap，它实际上是通过 *HashMap* 实现的。*HashSet* 使用散列函数存储元素，元素是无序的、散列的；
- ***TreeSet*** 类依赖于 TreeMap，它实际上是通过 TreeMap 实现的。TreeSet 将元素存储在红-黑树数据结构中，元素是有序的，它是按自然排序或者用户指定比较器排序的 *Set*；
- ***LinkedHashSet*** 是按插入顺序排序的 Set；
- ***EnumSet*** 是只能存放 Emum 枚举类型的 Set。

---

![img](img/20200221190717.png)



## HashSet

*HashSet* 是对 *HashMap* 的简单包装，对 *HashSet* 的函数调用都会转换成合适的 *HashMap* 方法。

```java
package java.util;

public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable
{
	......
	private transient HashMap<E,Object> map; //HashSet里面有一个HashMap
    // PRESENT 是用于关联 map 中当前操作元素的一个虚拟值
    private static final Object PRESENT = new Object();
    
    public HashSet() {
        map = new HashMap<>();
    }
    
    ......
    public boolean add(E e) { //转换成 map 方法
        return map.put(e, PRESENT)==null;
    }
    ......
}
```

- HashSet 中维护了一个 HashMap 对象 `map`，HashSet 的重要方法，如 `add()`、`remove()`、`iterator()`、`clear()`、`size()` 等都是围绕 map 实现的。
- HashSet 类中通过定义 `writeObject()` 和 `readObject()` 方法确定了其序列化和反序列化的机制。
- `PRESENT` 是用于关联 map 中当前操作元素的一个虚拟值。

哈希表边存放的是哈希值。HashSet 存储元素的顺序并不是按照存入时的顺序（和 List 显然不同） 而是按照**哈希值**来存的，所以取数据也是按照哈希值取的。元素的哈希值是通过元素的 `hashCode()` 方法来获取的，HashSet 首先判断两个元素的哈希值，如果哈希值一样，接着会比较 `equals()` 方法。如果 `equls()` 结果为 true ，HashSet 就视为同一个元素；如果 `equals()` 为 false 就不是同一个元素。 

哈希值相同 `equals()` 为 false 的元素是怎么存储呢，就是在同样的哈希值下顺延（可以认为哈希值相同的元素放在一个哈希桶中）。也就是哈希一样的存在一列中。

> HashSet 通过 hashCode 值来确定元素在内存中的位置。一个 hashCode 位置上可以存放多个元素。



## LinkedHashSet

*LinkedHashSet* 是按插入顺序排序的 *Set*。

```java
package java.util;
public class LinkedHashSet<E>
    extends HashSet<E>
    implements Set<E>, Cloneable, java.io.Serializable {
    
    ...
    public LinkedHashSet(int initialCapacity, float loadFactor) {
        super(initialCapacity, loadFactor, true);
    }
    
    public LinkedHashSet(int initialCapacity) {
        super(initialCapacity, .75f, true);
    }
    
    public LinkedHashSet() {
        super(16, .75f, true);
    }
    ...
}
```

`LinkedHashSet` 内的个构造方法都是调用父类 `HashSet` 的构造方法。需要强调的是：**LinkedHashSet 构造方法实际上调用的是父类 HashSet 的非 public 构造方法。**

```java
// java.util.HashSet
HashSet(int initialCapacity, float loadFactor, boolean dummy) {
    map = new LinkedHashMap<>(initialCapacity, loadFactor);
}

public HashSet(int initialCapacity, float loadFactor) {
    map = new HashMap<>(initialCapacity, loadFactor);
}
```

不同于 `HashSet` 内 `public` 构造方法中初始化的 `HashMap` 实例，这个构造方法中，初始化了 `LinkedHashMap` 实例。

也就是说，实际上，`LinkedHashSet` 维护了一个双链表。由双链表的特性可以知道，它是按照元素的插入顺序保存的。所以，这就是 `LinkedHashSet` 中存储的元素是按照插入顺序保存的原理。



## 参考资料

- https://dunwu.github.io/javacore/container/java-container-set.html
