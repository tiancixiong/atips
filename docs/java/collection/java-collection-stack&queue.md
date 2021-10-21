# Conllection - Stack & Queue

## 概述

### 栈

栈（stack）是限制插入和删除只能在一个位置上进行的表，该位置是表的末端，叫做栈顶（top）。它是**后进先出**（LIFO）的。对栈的基本操作只有 push（进栈）和 pop（出栈）两种，前者相当于插入，后者相当于删除最后的元素。

![image-20211021114046977](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/java/collection/image-20211021114046977.png)

### 队列

队列（Queue）是一种特殊的线性表，特殊之处在于它只允许在表的前端（front）进行删除操作，而在表的后端（rear）进行插入操作，和栈一样，队列是一种操作受限制的线性表。它是**先进先出**（FIFO）集合。进行插入操作的端称为队尾，进行删除操作的端称为队头。

![image-20211021114214138](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/java/collection/image-20211021114214138.png)



---

Java 里有一个叫做 *Stack* 的类，却没有叫做 *Queue* 的类（它是个接口名字）。当需要使用栈时，Java 已不推荐使用 *Stack*，而是推荐使用 Java 1.6 提供的更高效的 *ArrayDeque*；既然 *Queue* 只是一个接口，当需要使用队列时也就首选*ArrayDeque* 了（次选是 *LinkedList* ）。



## 被抛弃的 Stack

抛弃的不是栈这种数据结构，而是 *Stack* 实现类。

下面我们用个例子简单了解下 *Stack* 的使用：

```java
@Test
public void test_stack() {
    Stack<String> s = new Stack<>();
    s.push("aaa");
    s.push("bbb");
    s.push("ccc");
    System.out.println("获取最后一个元素：" + s.peek()); //获取最后一个元素：ccc
    System.out.println("获取最后一个元素：" + s.lastElement()); //获取最后一个元素：ccc
    System.out.println("获取最先放置元素：" + s.firstElement()); //获取最先放置元素：aaa
    System.out.println("弹出一个元素[LIFO]：" + s.pop()); //弹出一个元素[LIFO]：ccc
    System.out.println("弹出一个元素[LIFO]：" + s.pop()); //弹出一个元素[LIFO]：bbb
    System.out.println("弹出一个元素[LIFO]：" + s.pop()); //弹出一个元素[LIFO]：aaa
}
```

- `peek()` 是偷看的意思，就是看一下，不会弹出元素。满足后进先出的规则，它看的是最后放进去的元素；
- `pop()` 是从队列中弹出元素，弹出后也代表着要把属于这个位置都元素清空，删掉。



### 源码分析

我们说 *Stack* 栈，这个实现类已经不推荐使用了，需要从它的源码上看：

```java
package java.util;
/**
 * <p>A more complete and consistent set of LIFO stack operations is
 * provided by the {@link Deque} interface and its implementations, which
 * should be used in preference to this class.  For example:
 * <pre>   {@code
 *   Deque<Integer> stack = new ArrayDeque<Integer>();}</pre>
 *
 * @author  Jonathan Payne
 * @since   JDK1.0
 */
public class Stack<E> extends Vector<E> {}
```

`push()` 源码：

```java{7}
// java.util.Stack
public E push(E item) {
    addElement(item);
    return item;
}

public synchronized void addElement(E obj) {
    modCount++;
    ensureCapacityHelper(elementCount + 1);
    elementData[elementCount++] = obj;
}
```

1. *Stack* 栈是在 **JDK1.0** 时代时，基于继承 *Vector* 实现的。本身 *Vector* 就是一个不推荐使用的类，主要在于它的一些操作方法锁 `synchronized` 的力度太粗，都是放到方法上；
2. *Stack* 栈底层是使用 *Vector* 数组实现，在学习 *ArrayList* 时候我们知道，数组结构在元素添加和擅长需要通过 `System.arraycopy`，进行扩容操作。而本身栈的特点是首尾元素的操作，也不需要遍历，使用数组结构其实并不太理想；
3. 同时在这个方法的注释上也明确标出来，推荐使用 `Deque<Integer> stack = new ArrayDeque<Integer>();`，虽然这也是数组结构，但是它没有粗粒度的锁，同时可以申请指定空间并且在扩容时操作时也要优于 *Stack* ；并且它还是一个双端队列，使用起来更灵活。



## 双端队列 ArrayDeque

*ArrayDeque* 是基于数组实现的可动态扩容的双端队列，也就是说你可以在队列的头和尾同时插入和弹出元素。当元素数量超过数组初始化长度时，则需要扩容和迁移数据。
数据结构和操作，如下（TODO：图片有误，后面需修正）：

![image-20211021160523199](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/java/collection/image-20211021160523199.png)

1. 双端队列是基于数组实现，所以扩容迁移数据操作；
2. `push()` 向头部插入、`add()` 向结尾插入；这样两端都满足后进先出；
3. 整体来看，双端队列，就是一个环形。所以扩容后继续插入元素也满足后进先出。

使用一个案例了解一下：

```java
@Test
public void test_ArrayDeque() {
    Deque<String> deque = new ArrayDeque<>(1);
    deque.push("a");
    deque.push("b");
    deque.push("c");
    deque.push("d");

    deque.offerLast("e");
    deque.offerLast("f");
    deque.offerLast("g");
    deque.offerLast("h"); //这时候扩容了

    deque.push("i");
    deque.offerLast("j");

    System.out.println("数据出栈：");
    while (!deque.isEmpty()) {
        System.out.print(deque.pop() + " "); //i d c b a e f g h j
    }
}
```



### 源码分析

#### 初始化

- `ArrayDeque()` - 
- `ArrayDeque(int numElements)` - 
- `ArrayDeque(Collection<? extends E> c) ` - 



```java
// java.util.ArrayDeque
public ArrayDeque(Collection<? extends E> c) {
    allocateElements(c.size());
    addAll(c);
}

private void allocateElements(int numElements) {
    elements = new Object[calculateSize(numElements)];
}

private static int calculateSize(int numElements) {
    int initialCapacity = MIN_INITIAL_CAPACITY;
    // Find the best power of two to hold elements.
    // Tests "<=" because arrays aren't kept full.
    if (numElements >= initialCapacity) {
        initialCapacity = numElements;
        initialCapacity |= (initialCapacity >>>  1);
        initialCapacity |= (initialCapacity >>>  2);
        initialCapacity |= (initialCapacity >>>  4);
        initialCapacity |= (initialCapacity >>>  8);
        initialCapacity |= (initialCapacity >>> 16);
        initialCapacity++;

        if (initialCapacity < 0)   // Too many elements, must back off
            initialCapacity >>>= 1;// Good luck allocating 2 ^ 30 elements
    }
    return initialCapacity;
}
```

- 在初始化的过程中，它通过 `calculateSize()` 找到当前传输值 `numElements` 最小的 2的幂，作为扩容后的容量。这与 *HashMap* 的初始化过程相似。



#### 数据入栈

**头插**：*ArrayDeque* 提供了一个 `push()` 方法，这个方法与 `offerFirst()` 一致，作用都是在头部插入元素。它们的底层源码是一样的，都是使用 `addFirst()` 方法进行操作。如下：

```java
// java.util.ArrayDeque
public void push(E e) {
    addFirst(e);
}

public boolean offerFirst(E e) {
    addFirst(e);
    return true;
}

public void addFirst(E e) {
    if (e == null)
        throw new NullPointerException();
    elements[head = (head - 1) & (elements.length - 1)] = e;
    if (head == tail)
        doubleCapacity();
}
```



**尾插**：*ArrayDeque* 提供的尾插方法是 `add()` 与 `offerLast()` ，都是在尾部插入元素。它们的底层源码是一样的，都是使用 `addLast()` 方法进行操作。如下：

```java
// java.util.ArrayDeque
public boolean add(E e) {
    addLast(e);
    return true;
}

public boolean offerLast(E e) {
    addLast(e);
    return true;
}

public void addLast(E e) {
    if (e == null)
        throw new NullPointerException();
    elements[tail] = e;
    if ( (tail = (tail + 1) & (elements.length - 1)) == head)
        doubleCapacity();
}
```

这部分入栈元素，其实就是给数组赋值，知识点如下：

1. 在 `addFirst()` 中，定位下标， `head = (head - 1) & (elements.length - 1)`，因为我们的数组长度是 `2^n` 的倍数，所以 `2^n-1` 就是一个全是 1 的二进制数，可以用于与运算得出数组下标；
2. 同样 `addLast()` 中，也使用了相同的方式定位下标，只不过它是从 0 开始，往上增加；
3. 最后，当 头(head) 与 尾(tail) 相等，数组则需要扩大一倍的容量 `doubleCapacity` 。

头插中计算下标 `head = (head - 1) & (elements.length - 1)`：

- (0-1) & (8-1) = 7
- (7-1) & (8-1) = 6
- (6-1) & (8-1) = 5
- ...



#### 容量翻倍，数据迁移

```java
// java.util.ArrayDeque
private void doubleCapacity() {
    assert head == tail;
    int p = head;
    int n = elements.length;
    int r = n - p; // number of elements to the right of p
    int newCapacity = n << 1;
    if (newCapacity < 0)
        throw new IllegalStateException("Sorry, deque too big");
    Object[] a = new Object[newCapacity];
    System.arraycopy(elements, p, a, 0, r);
    System.arraycopy(elements, 0, a, r, p);
    elements = a;
    head = 0;
    tail = n;
}
```

上面就是进行两倍扩容 `n << 1`，同时把两端数据迁移进新的数组的部分。下面通过一个例子来模拟一下这个过程。

```java
@Test
public void test_arraycopy() {
    int head = 0, tail = 0;
    Object[] elements = new Object[8];
    elements[head = (head - 1) & (elements.length - 1)] = "a";
    elements[head = (head - 1) & (elements.length - 1)] = "b";
    elements[head = (head - 1) & (elements.length - 1)] = "c";
    elements[head = (head - 1) & (elements.length - 1)] = "d";

    elements[tail] = "e";
    tail = (tail + 1) & (elements.length - 1);
    elements[tail] = "f";
    tail = (tail + 1) & (elements.length - 1);
    elements[tail] = "g";
    tail = (tail + 1) & (elements.length - 1);
    elements[tail] = "h";
    tail = (tail + 1) & (elements.length - 1);

    System.out.println("head：" + head);
    System.out.println("tail：" + tail);

    int p = head;
    int n = elements.length;
    int r = n - p; // number of elements to the right of p

    // 输出当前的元素
    System.out.println(JSON.toJSONString(elements));

    // head == tail 扩容
    Object[] a = new Object[8 << 1];
    System.arraycopy(elements, p, a, 0, r);
    System.out.println(JSON.toJSONString(a));
    System.arraycopy(elements, 0, a, r, p);
    System.out.println(JSON.toJSONString(a));

    elements = a;
    head = 0;
    tail = n;
    a[head = (head - 1) & (a.length - 1)] = "i";
    System.out.println(JSON.toJSONString(a));
}
```

以上的测试过程主要模拟了8个长度的空间的数组，在进行双端队列操作时数组扩容，数据迁移操作，可以单独运行，测试结果如下：

```
head：4
tail：4
["e","f","g","h","d","c","b","a"]
["d","c","b","a",null,null,null,null,null,null,null,null,null,null,null,null]
["d","c","b","a","e","f","g","h",null,null,null,null,null,null,null,null]
["d","c","b","a","e","f","g","h",null,null,null,null,null,null,null,"i"]
```

从测试结果可以看到；
1. 当 head 与 tail 相等时，进行扩容操作；
2. 第一次数据迁移 `System.arraycopy(elements, p, a, 0, r);`，d 、c 、 b 、 a ，落入新数组；
3. 第二次数据迁移 `System.arraycopy(elements, 0, a, r, p);`，e 、f 、 g 、 h ，落入新数组；
4. 最后再尝试添加新的元素， i 和 j 。每一次的输出结果都可以看到整个双端链路的变化。





## 参考文献

- 《Java 面经手册》- 小傅哥