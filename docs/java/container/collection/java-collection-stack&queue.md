# Collection - Stack & Queue

## 概述

### 栈

栈（Stack）是限制插入和删除只能在一个位置上进行的表，该位置是表的末端，叫做栈顶（top）。它是**后进先出**（**LIFO**）的。对栈的基本操作只有 push（进栈）和 pop（出栈）两种，前者相当于插入，后者相当于删除最后的元素。

> LIFO： last-in-first-out，即后进先出。

![image-20211021114046977](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211021114046977.png)

### 队列

队列（***Queue***）是一种特殊的线性表，特殊之处在于它只允许在表的前端（front）进行删除操作，而在表的后端（rear）进行插入操作，和栈一样，队列是一种操作受限制的线性表。它是**先进先出**（**FIFO**）集合。进行插入操作的端称为队尾，进行删除操作的端称为队头。

![image-20211021114214138](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211021114214138.png)



---

Java 里有一个叫做 *Stack* 的类，却没有叫做 *Queue* 的类（它是个接口名字）。当需要使用栈时，Java 已不推荐使用 *Stack*，而是推荐使用 Java 1.6 提供的更高效的 *ArrayDeque*；既然 *Queue* 只是一个接口，当需要使用队列时也就首选 *ArrayDeque* 了（次选是 *LinkedList* ）。



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
    elementData[elementCount++] = obj; //这里的elementData继承自java.util.Vector
}
```

1. *Stack* 栈是在 **JDK1.0** 时代时，基于继承 *Vector* 实现的。本身 *Vector* 就是一个不推荐使用的类，主要在于它的一些操作方法锁 `synchronized` 的力度太粗，都是放到方法上；
2. *Stack* 栈底层是使用 *Vector* 内的 `protected Object[] elementData;` 数组实现，在学习 *ArrayList* 时候我们知道，数组结构在元素添加和删除操作时需要通过 `System.arraycopy` 进行扩容操作。而本身栈的特点是首尾元素的操作，也不需要遍历，使用数组结构其实并不太理想；
3. 同时在这个方法的注释上也明确标出来，推荐使用 `Deque<Integer> stack = new ArrayDeque<Integer>();`，虽然这也是数组结构，但是它没有粗粒度的锁，同时可以申请指定空间并且在扩容时操作时也要优于 *Stack* ；并且它还是一个双端队列，使用起来更灵活。



## 双端队列 ArrayDeque

*ArrayDeque* 是基于数组实现的可动态扩容的双端队列，也就是说你可以在队列的头和尾同时插入和弹出元素。当元素数量超过数组初始化长度时，则需要扩容和迁移数据。
数据结构和操作，如下（TODO：图片有误，图中`push()`应是头插，`offerLast()`应是尾插，后面需修正）：

![image-20211021160523199](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211021160523199.png)

1. 双端队列是基于数组实现，所以扩容就是通过 `System.arraycopy` 进行迁移数据操作；
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

- `ArrayDeque()`
- `ArrayDeque(int numElements)`
- `ArrayDeque(Collection<? extends E> c) `

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

- 在初始化的过程中，它通过 `calculateSize()` 找到当前传输值 `numElements` 最小的 2 的幂，作为扩容后的容量。这与 *HashMap* 的初始化过程相似。



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

---

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

---

这部分入栈元素，其实就是给数组赋值，知识点如下：

1. 在 `addFirst()` 中，定位下标， `head = (head - 1) & (elements.length - 1)`，因为我们的数组长度是 `2^n` 的倍数，所以 `2^n-1` 就是一个全是 1 的二进制数，可以用*与运算*得出数组下标；
2. 同样 `addLast()` 中，也使用了相同的方式定位下标，只不过它是从 0 开始，往上增加；
3. 最后，当 头(head) 与 尾(tail) 相等，数组则需要扩大一倍的容量 `doubleCapacity()` 。

使用 `addFirst()` 头插插入第一个元素时计算下标 `head = (head - 1) & (elements.length - 1)` 的过程：

- `(0-1) & (8-1)` = 7	//head=0，elements.length=8
- `(7-1) & (8-1)` = 6
- `(6-1) & (8-1)` = 5
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

    System.out.println(String.format("head(头节点)：%s", head));
    System.out.println(String.format("tail(尾节点)：%s", tail));

    int p = head;
    int n = elements.length;
    int r = n - p; // number of elements to the right of p

    // 输出当前的元素
    System.out.println(String.format("原容器：%s", JSON.toJSONString(elements)));

    // head == tail 扩容
    Object[] a = new Object[8 << 1];
    System.arraycopy(elements, p, a, 0, r);
    System.out.println(String.format("第一次迁移后新容器：%s", JSON.toJSONString(a)));
    System.arraycopy(elements, 0, a, r, p);
    System.out.println(String.format("第二次迁移后新容器：%s", JSON.toJSONString(a)));

    elements = a;
    head = 0;
    tail = n;
}
```

以上的测试过程主要模拟了8个长度的空间的数组，在进行双端队列操作时数组扩容，数据迁移操作，可以单独运行，测试结果如下：

```
head(头节点)：4
tail(尾节点)：4
原容器：["e","f","g","h","d","c","b","a"]
第一次迁移后新容器：["d","c","b","a",null,null,null,null,null,null,null,null,null,null,null,null]
第二次迁移后新容器：["d","c","b","a","e","f","g","h",null,null,null,null,null,null,null,null]
```

从测试结果可以看到；
1. 当 head 与 tail 相等时，进行扩容操作；
2. 第一次数据迁移 `System.arraycopy(elements, p, a, 0, r);`，将 elements(原容器) 从其 p节点(head头节点) 开始复制至 a(新容器) 的 0节点，复制长度是 r(p节点右侧所有元素)；d 、c 、 b 、 a ，落入新数组；
3. 第二次数据迁移 `System.arraycopy(elements, 0, a, r, p);` ，e 、f 、 g 、 h ，落入新数组。



## 双端队列 LinkedList

*[LinkedList](https://blog.xiongtianci.com/atips/java/container/collection/java-collection-linkedlist.html)* 天生就可以支持双端队列，而且从头尾取数据也是它时间复杂度 *O(1)* 的。同时数据的插入和删除也不需要像数组队列那样拷贝数据，虽然 *Linkedlist* 有这些优点，但不能说 *ArrayDeque* 因为有数组复制性能比它低。
*LinkedList* 数据结构：

![image-20211022123909718](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211022123909718.png)

*LinkedList* 也提供了 `push()`、`add()` 等一组头尾插入元素的函数，与使用 *ArrayDeque* 是一样的，功能上没有差异。



### 源码分析

**压栈(头插)**：`push()`、`offerFirst()` 和 `addFirst()`，底层都是调用了 `linkFirst()` 进行操作。

```java
// java.util.LinkedList
private void linkFirst(E e) {
    final Node<E> f = first;
    final Node<E> newNode = new Node<>(null, e, f);
    first = newNode;
    if (f == null)
        last = newNode;
    else
        f.prev = newNode;
    size++;
    modCount++;
}
```

**压栈(尾插)**：`add()`、`offerLast()` 和 `addLast()`，底层都是调用 `linkLast()` 实现操作。

```java
// java.util.LinkedList
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

- `linkFirst()` 、 `linkLast()`，两个方法分别是给链表的首尾节点插入元素，因为这是链表结构，所以也不存在扩容，只需要把双向链路链接上即可。



## 延时队列 DelayQueue

有个场景，是需要把一些数据存起来，***倒计时*** 到某个时刻在使用。在 Java 的队列数据结构中，还有一种队列是**延时队列**，可以通过设定存放时间，依次轮询获取。 

*DelayQueue* 是一个支持延时获取元素的无界阻塞队列。队列使用 *PriorityQueue* 来实现。队列中的元素必须实现 *Delayed* 接口，在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟期满时才能从队列中提取元素。我们可以将 *DelayQueue* 运用在以下应用场景：

1. 缓存系统的设计：可以用 *DelayQueue* 保存缓存元素的有效期，使用一个线程循环查询 *DelayQueue*，一旦能从 *DelayQueue* 中获取元素时，表示缓存有效期到了；
2. 定时任务调度：使用 *DelayQueue* 保存当天将会执行的任务和执行时间，一旦从 *DelayQueue* 中获取到任务就开始执行；比如 *TimerQueue* 就是使用 *DelayQueue* 实现的。



### 基本使用

先写一个 Delayed 的实现类：

```java
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

public class TestDelayed implements Delayed {
    private String str;
    private long time;

    @Override
    public long getDelay(TimeUnit unit) {
        return time - System.currentTimeMillis();
    }

    @Override
    public int compareTo(Delayed o) {
        TestDelayed work = (TestDelayed) o;
        long diff = this.time - work.time;
        if (diff <= 0)
            return -1;
        else
            return 1;
    }

    public String getStr() {
        return str;
    }

    public TestDelayed(String str, long time, TimeUnit unit) {
        this.str = str;
        this.time = System.currentTimeMillis() + (time > 0 ? unit.toMillis(time) : 0);
    }
}
```

- 这个相当于延时队列的一个固定模版方法，通过这种方式来控制延时。

下面通过一个案例简单使用一下：

```java
public class DelayedDemo {
    private final static Logger logger = LoggerFactory.getLogger(DelayedDemo.class);
    @Test
    public void test_DelayQueue() throws InterruptedException {
        DelayQueue<TestDelayed> delayQueue = new DelayQueue<TestDelayed>();
        delayQueue.offer(new TestDelayed("aaa", 5, TimeUnit.SECONDS)); //休眠5s
        delayQueue.offer(new TestDelayed("ccc", 1, TimeUnit.SECONDS)); //休眠1s
        delayQueue.offer(new TestDelayed("bbb", 3, TimeUnit.SECONDS)); //休眠3s
        
        logger.info("开始执行");
        logger.info(((TestDelayed) delayQueue.take()).getStr());
        logger.info(((TestDelayed) delayQueue.take()).getStr());
        logger.info(((TestDelayed) delayQueue.take()).getStr());
    }
}
```

结果：

```
13:19:27.614 [main] INFO com.example.demo.DelayedDemo - 开始执行
13:19:28.616 [main] INFO com.example.demo.DelayedDemo - ccc
13:19:30.612 [main] INFO com.example.demo.DelayedDemo - bbb
13:19:32.612 [main] INFO com.example.demo.DelayedDemo - aaa
```

- 队列中的元素不会因为存放的先后顺序而导致输出顺序，它们是依赖于休眠时长决定。



### 源码分析

#### 元素入栈

**入栈**：

- `offer(E e, long timeout, TimeUnit unit)`

```java
// java.util.concurrent.DelayQueue
private final PriorityQueue<E> q = new PriorityQueue<E>();
public boolean offer(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        q.offer(e);
        if (q.peek() == e) {
            leader = null;
            available.signal();
        }
        return true;
    } finally {
        lock.unlock();
    }
}

// java.util.PriorityQueue
public boolean offer(E e) {
    if (e == null)
        throw new NullPointerException();
    modCount++;
    int i = size;
    if (i >= queue.length)
        grow(i + 1);
    size = i + 1;
    if (i == 0)
        queue[0] = e;
    else
        siftUp(i, e);
    return true;
}
private void siftUp(int k, E x) {
    if (comparator != null)
        siftUpUsingComparator(k, x);
    else
        siftUpComparable(k, x);
}
private void siftUpUsingComparator(int k, E x) {
    while (k > 0) {
        int parent = (k - 1) >>> 1;
        Object e = queue[parent];
        if (comparator.compare(x, (E) e) >= 0)
            break;
        queue[k] = e;
        k = parent;
    }
    queue[k] = x;
}
```

- 关于数据存放还涉及到 `ReentrantLock` 可重入锁；
- `DelayQueue` 是基于数组实现的，所以可以动态扩容，另外它插入元素的顺序并不影响最终的输出顺序；
- 而元素的排序依赖于 `compareTo` 方法进行排序，也就是休眠的时间长短决定的；
- 同时只有实现了 `Delayed` 接口，才能存放元素。



#### 元素出栈

**出栈**：

- `take()`

```java
// java.util.concurrent.DelayQueue
public E take() throws InterruptedException {
    final ReentrantLock lock = this.lock;
    lock.lockInterruptibly();
    try {
        for (;;) {
            E first = q.peek(); //获取队首元素
            if (first == null)
                available.await(); //如果队首元素为空，则无限期等待唤醒
            else {
                long delay = first.getDelay(NANOSECONDS);
                if (delay <= 0)
                    return q.poll(); //超时时间已到，直接从队列中出队并返回元素
                first = null; // don't retain ref while waiting；等待时不要持有引用
                // 如果leader不为null,说明有其他线程在操作，则等待唤醒
                if (leader != null)
                    available.await();
                else {
                    Thread thisThread = Thread.currentThread();
                    // 超时时间未到，且leader为空，则leader设置为当前线程
                    leader = thisThread;
                    try {
                        // 超时等待
                        available.awaitNanos(delay);
                    } finally {
                        if (leader == thisThread)
                            leader = null; //释放leader
                    }
                }
            }
        }
    } finally {
        // 队列不为空，且leader为空，则需要唤醒其它可能等待的消费线程，
        // 重新竞争锁，然后从挂起处继续执行
        if (leader == null && q.peek() != null)
            available.signal();
        lock.unlock(); //最后释放锁
    }
}
```

- 这部分的代码主要是元素的获取。 *DelayQueue* 是 *Leader-Followr* 模式的变种，消费者线程处于等待 *await* 时，总是等待最先休眠完成的元素；
- 这里会最小化的空等时间，提高线程利用率。



---

参考：[从DelayQueue到 Leader-follower线程模型](https://crrrrrw.github.io/java-concurrency/delayqueue-leaderfollower/)、[Java同步数据结构之DelayQueue/DelayedWorkQueue](https://www.cnblogs.com/txmfz/p/10338334.html)



## 其他队列

### 队列类结构

![image-20211022153714538](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/java/container/collection/image-20211022153714538.png)

| 类型  | 实现                  | 描述                                   |
| ----- | --------------------- | -------------------------------------- |
| Queue | LinkedBlockingQueue   | 由链表结构组成的有界阻塞队列           |
| Queue | ArrayBlockingQueue    | 由数组结构组成的有界阻塞队列           |
| Queue | PriorityBlockingQueue | 支持优先级排序的无界阻塞队列           |
| Queue | SynchronousQueue      | 不存储元素的阻塞队列                   |
| Queue | LinkedTransferQueue   | 由链表结构组成的无界阻塞队列           |
| Deque | LinkedBlockingDeque   | 由链表结构组成的双向阻塞队列           |
| Deque | ConcurrentLinkedDeque | 由链表结构组成的线程安全的双向阻塞队列 |



### 基本使用



```java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

public class DataQueueStack<T> {
    private BlockingQueue<T> dataQueue = null;

    public DataQueueStack() {
        //实例化队列
        dataQueue = new LinkedBlockingQueue<T>(100);
    }

    /**
     * 添加数据到队列
     * @param dataBean
     * @return
     */
    public boolean doOfferData(T dataBean) {
        try {
            return dataQueue.offer(dataBean, 2, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 弹出队列数据
     * @return
     */
    public T doPollData() {
        try {
            return dataQueue.poll(2, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 获得队列数据个数
     * @return
     */
    public int doGetQueueCount() {
        return dataQueue.size();
    }

}
```



```java
@Test
public void test_DataQueueStack() {
    DataQueueStack<String> dataQueueStack = new DataQueueStack<>();
    dataQueueStack.doOfferData("a");
    dataQueueStack.doOfferData("b");
    dataQueueStack.doOfferData("c");

    System.out.println("元素个数：" + dataQueueStack.doGetQueueCount());
    System.out.println("弹出元素：" + dataQueueStack.doPollData());
    System.out.println("弹出元素：" + dataQueueStack.doPollData());
    System.out.println("弹出元素：" + dataQueueStack.doPollData());
}
```

- 这是一个 LinkedBlockingQueue 队列使用案例，一方面存储数据，一方面从队列中获取进行消费；
- 因为这是一个阻塞队列，所以在获取元素的时候，如果队列为空，会进行阻塞；
- LinkedBlockingQueue 是一个阻塞队列，内部由两个 ReentrantLock 来实现出入队列的线程安全，由各自的 Condition 对象的 await 和 signal 来实现等待和唤醒功能。



## 参考资料

- 《Java 面经手册》- 小傅哥

