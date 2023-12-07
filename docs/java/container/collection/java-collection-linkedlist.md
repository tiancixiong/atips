# Collection - LinkedList

## 概述

*LinkedList* 同时实现了 *List* 接口和 *Deque* 接口，也就是说它既可以看作一个顺序容器，又可以看作一个队列(*Queue*)，同时又可以看作一个栈(*Stack*)。这样看来，*LinkedList* 简直就是个全能冠军。当你需要使用栈或者队列时，可以考虑使用 *LinkedList*，一方面是因为 Java 官方已经声明不建议使用 *Stack* 类，更遗憾的是，Java 里根本没有一个叫做 *Queue* 的类（它是个接口名字）。关于栈或队列，现在的首选是 *ArrayDeque*，它有着比 *LinkedList* （当作栈或队列使用时）有着更好的性能。



## 数据结构

![image-20211020193901436](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211020193901436.png)

*LinkedList* 底层**通过双向链表实现**。由双向链条 **next**、**prev**，把数据节点穿插起来。所以，在插入数据时，是不需要像我们上一章节介绍的 *ArrayList* 那样，扩容数组。

双向链表的每个节点用内部类 ***Node*** 表示。*LinkedList* 通过 `first` 和 `last` 引用分别指向链表的第一个和最后一个元素。注意这里没有所谓的哑元，当链表为空的时候 `first` 和 `last` 都指向 `null`。


```java
package java.util;
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable
{
    //... 
    transient Node<E> first;
    transient Node<E> last;

    // Node 是私有的内部类
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }
    // ...
}
```
 ![image-20211020193139419](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/linkedlist-base.png)



## 构造函数

与 ArrayList 不同，*LinkedList* 初始化不需要创建数组，因为它是一个链表结构。而且也没有提供设置初始长度的构造器。*LinkedList* 只提供了 2 种构造函数：

- `LinkedList()`
- `LinkedList(Collection<? extends E> c)`



## 插入

*LinkedList* 的插入方法比较多，List 中接口中默认提供的是 `add()`，也可以指定位置插入。但在 *LinkedList* 中还提供了头插 `addFirst()` 和尾插 `addLast()`（`add()` 和 `addLast()` 作用相同） 。



### 头插

先来看一张数据结构对比图，回顾下 ArrayList 的插入也和 LinkedList 插入做下对比，如下：

![image-20211020200627443](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211020200627443.png)

- ***ArrayList*** 头插时，需要把数组元素通过 `Arrays.copyOf` 的方式把数组元素移位，如果容量不足还需要扩容；
- ***LinkedList*** 头插时，则不需要考虑扩容以及移位问题，直接把元素定位到首位，接点链条链接上即可。

*LinkedList* 中 `addFirst()` 方法调用了 `linkFirst()` 方法实现头插，源码：

```java
// java.util.LinkedList
transient Node<E> first;
transient Node<E> last;

public void addFirst(E e) {
    linkFirst(e);
}

private void linkFirst(E e) {
    final Node<E> f = first;
    final Node<E> newNode = new Node<>(null, e, f);
    first = newNode;
    if (f == null)
        last = newNode; //first == last == null
    else
        f.prev = newNode;
    size++;
    modCount++;
}
```

- `first`  首节点会一直被记录，这样就非常方便头插；
- 插入时候会创建新的节点元素 `new Node<>(null, e, f)`，紧接着把新的头元素赋值给 `first`；
- 之后判断 `f` 节点（标记的 old first 节点）是否存在：
  - 不存在（`f == null`）则把头插节点 newNode 即作为第一个节点又作为最后一个节点；这种情况就是插入第一个元素时 first 和 last 都指向这个元素；
  - 存在则用 `f` 节点的上一个链条 `f.prev` 链接 newNode；
- 最后记录 `size` 大小，和元素数量 `modCount` 。 `modCount` 用在遍历时做校验 `modCount != expectedModCount`。



### 尾插

先来看一张数据结构对比图，回顾下 ArrayList 的插入也和 LinkedList 插入做下对比，如下：

![image-20211020201922021](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211020201922021.png)

- *ArrayList* 尾插时，是不需要数据位移的，比较耗时的是数据的扩容时，需要拷贝迁移；
- *LinkedList* 尾插时，与头插相比耗时点会在对象的实例化上。

*LinkedList* 中 `add()` 和 `addLast()` 都是调用了 `linkLast()` 方法实现尾插，源码：

```java
// java.util.LinkedList
public boolean add(E e) {
    linkLast(e);
    return true;
}
public void addLast(E e) {
    linkLast(e);
}

void linkLast(E e) {
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}
```

- 与头插代码相比几乎没有什么区别，只是 `first` 换成 `last`；
- 耗时点只是在创建节点上 `new Node<E>`。



### 中间插

先来看一张数据结构对比图，回顾下 ArrayList 的插入也和 LinkedList 插入做下对比，如下：

![image-20211020203555056](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211020203555056.png)

- *ArrayList* 中间插入，首先我们知道他的定位时间复杂度是 O(1)，比较耗时的点在于数据迁移和容量不足的时候扩容；
- `LinkedList` 中间插入，链表的数据实际插入时候并不会怎么耗时，但是它定位元素的时间复杂度是 O(n) ，所以这部分以及元素的实例化比较耗时。

---

看下 `LinkedList` 指定位置插入的源码：

使用 `add(索引, 元素)` 方法插入：

```java
// java.util.LinkedList
public void add(int index, E element) {
    checkPositionIndex(index);

    if (index == size)
        linkLast(element);
    else
        linkBefore(element, node(index));
}
```

其中，使用 `node(index)` 进行位置定位：

```java
// java.util.LinkedList
Node<E> node(int index) {
    // assert isElementIndex(index);

    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}
```

- `size >> 1` ，这部分的代码判断元素位置在左半区间，还是右半区间，在进行循环查找。

通过 `linkLast()` 和 `linkBefore()` 执行插入的操作：

```java
// java.util.LinkedList
void linkBefore(E e, Node<E> succ) {
    // assert succ != null;
    final Node<E> pred = succ.prev;
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```

- 找到指定位置后插入的过程就比较简单了，与头插、尾插，相差不大；
- 整个过程可以看到，插入中比较耗时的点会在遍历寻找插入位置上。



## 删除

*ArrayList* 不同，*LinkedList* 删除不需要拷贝元素，它是找到元素位置，把元素前后链连接上。基本如下图；

![image-20211020204657478](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211020204657478.png)

- 确定出要删除的元素 `x` ，把前后的链接进行替换；
- 如果是删除首尾元素，操作起来会更加容易，这也就是为什么说插入和删除快。但中间位置删除，需要遍历找到对应位置。



### 删除操作方法

*LinkedList* 提供了丰富的删除操作，具体如下：

| 方法                                      | 描述                                         |
| ----------------------------------------- | -------------------------------------------- |
| `E remove()`                              | 与 `removeFirst()` 一致                      |
| `E remove(int index)`                     | 删除指定位置元素节点，需要遍历定位元素位置   |
| `boolean remove(Object o)`                | 删除第一个与 o 匹配上的节点，需要遍历定位    |
| `E removeFirst()`                         | 删除首位节点                                 |
| `E removeLast()`                          | 删除结尾节点                                 |
| `boolean removeFirstOccurrence(Object o)` | 删除第一个匹配上的元素（从头到尾遍历列表）   |
| `boolean removeLastOccurrence(Object o)`  | 删除最后一个匹配上的元素（从头到尾遍历列表） |

还有继承自父类（*AbstractCollection*）的方法：`boolean removeAll(Collection<?> c)`，按照集合批量删除，底层是 *Iterator* 删除。



### 源码

删除操作的源码都差不多，分为删除首尾节点与其他节点时候，对节点的解链操作。这里我们举一个如 `list.remove("a");` 删除其他位置的源码进行学习，如下：

```java
// java.util.LinkedList
public boolean remove(Object o) {
    if (o == null) {
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null) {
                unlink(x);
                return true;
            }
        }
    } else {
        for (Node<E> x = first; x != null; x = x.next) {
            if (o.equals(x.item)) {
                unlink(x);
                return true;
            }
        }
    }
    return false;
}
```

这一部分是元素定位，和 `unlink(x)` 解链；循环查找对应的元素。

`unlink(x)` 解链：

```java
// java.util.LinkedList
E unlink(Node<E> x) {
    // assert x != null;
    final E element = x.item;
    final Node<E> next = x.next;
    final Node<E> prev = x.prev;

    if (prev == null) {
        first = next;
    } else {
        prev.next = next;
        x.prev = null;
    }

    if (next == null) {
        last = prev;
    } else {
        next.prev = prev;
        x.next = null;
    }

    x.item = null;
    size--;
    modCount++;
    return element;
}
```

1. 获取待删除元素节点 `item` 的信息；元素下一个节点 `next` 、元素上一个节点 `prev`；
2. 如果 `prev` 节点为空（说明待删除元素为头元素）则把待删除元素 `x` 的下一个节点 `next` 赋值给首节点 `first`；否则把待删除节点的下一个节点 `next`，赋值给待删除节点的上一个节点的子节点 `prev.next`。并将 `x` 节点的向前指向置为空：`x.prev = null`；
3. 如果 `next` 节点为空（说明但删除元素为尾元素）则把把待删除元素 `x` 的上一个节点 `prev` 赋值给尾节点 `last`；否则把待删除节点的上一个节点 `prev`，赋值给待删除节点的下一个节点的子节点 `next.prev`。并将 `x` 节点的向后指向置为空：`x.next = null`；
4. 通过步骤2和步骤3后，就将待删除节点 `x` 从链表中分离出来了，`x` 节点和链表上的其他节点已经没有了关联关系；
5. 最后就是把删除节点 `x` 置空：`x.item = null;` ，并扣减 `size` 和增加 `modeCount` 数量。



## 查询

```java
// java.util.LinkedList
public E get(int index) {
    checkElementIndex(index);
    return node(index).item;
}

Node<E> node(int index) {
    // assert isElementIndex(index);

    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}
```

上述代码，利用了双向链表的特性，如果 `index` 离链表头比较近，就从节点头部遍历。否则就从节点尾部开始遍历。使用空间（双向链表）来换取时间。

- `node()` 会以 O(n/2) 的性能去获取一个结点
- 如果索引值大于链表大小的一半，那么将从尾结点开始遍历

这样的效率是非常低的，特别是当 index 越接近 size 的中间值时。



## 参考资料

- 《Java 面经手册》- 小傅哥
- [Java LinkedList源码剖析](https://www.cnblogs.com/CarpenterLee/p/5457150.html)