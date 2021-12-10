# JUC原子类

## CAS

前面我们说到，线程安全的实现方法包含:

- 互斥同步: synchronized 和 ReentrantLock
- 非阻塞同步: CAS, AtomicXXXX
- 无同步方案: 栈封闭，Thread Local，可重入代码

---



### 什么是CAS？

**CAS** 的全称为 **Compare And Swap**，直译就是对比交换。是一条 CPU 的原子指令，其作用是让 CPU 先进行比较两个值是否相等，然后原子地更新某个位置的值，经过调查发现，其实现方式是基于硬件平台的汇编指令，就是说CAS 是靠硬件实现的，JVM 只是封装了汇编调用，那些 `AtomicInteger` 类便是使用了这些封装后的接口。  简单解释：CAS 操作需要输入两个数值，一个旧值（期望操作前的值）和一个新值，在操作期间先比较下在旧值有没有发生变化，如果没有发生变化，才交换成新值，发生了变化则不交换。

CAS 操作是原子性的，所以多线程并发使用 CAS 更新数据时，可以不使用锁。JDK 中大量使用了 CAS 来更新数据而防止加锁（synchronized 重量级锁）来保持原子更新。

相信 sql 大家都熟悉，类似 sql 中的条件更新一样：`update set name=new_name from table where id=2`。因为单条 sql 执行具有原子性，如果有多个线程同时执行此 sql 语句，只有一条能更新成功。



### CAS 的要点

互斥同步是最常见的并发正确性保障手段。

**互斥同步最主要的问题是线程阻塞和唤醒所带来的性能问题**，因此互斥同步也被称为阻塞同步。互斥同步属于一种***悲观***的并发策略，总是认为只要不去做正确的同步措施，那就肯定会出现问题。无论共享数据是否真的会出现竞争，它都要进行加锁（这里讨论的是概念模型，实际上虚拟机会优化掉很大一部分不必要的加锁）、用户态核心态转换、维护锁计数器和检查是否有被阻塞的线程需要唤醒等操作。

随着硬件指令集的发展，我们可以使用基于冲突检测的*乐观并发策略*：先进行操作，如果没有其它线程争用共享数据，那操作就成功了，否则采取补偿措施（不断地重试，直到成功为止）。这种乐观的并发策略的许多实现都不需要将线程阻塞，因此这种同步操作称为非阻塞同步。

为什么说乐观锁需要 **硬件指令集的发展** 才能进行？因为需要操作和冲突检测这两个步骤具备原子性。而这点是由硬件来完成，如果再使用互斥同步来保证就失去意义了。硬件支持的原子性操作最典型的是：CAS。

**CAS 有 3 个操作数，分别是：内存值 M，期望值 E，更新值 U。当且仅当内存值 M 和期望值 E 相等时，将内存值 M 修改为 U，否则什么都不做**。



### CAS 的问题

`CAS` 方式为**乐观锁**，`synchronized` 为**悲观锁**。一般情况下，CAS 比锁性能更高。因为 CAS 是一种非阻塞算法，所以其避免了线程阻塞和唤醒的等待时间。

但是，事物总会有利有弊，CAS 也存在三大问题：

- ABA 问题
- 循环时间长开销大
- 只能保证一个共享变量的原子性



#### ABA问题

描述：**如果一个变量初次读取的时候是 A 值，它的值被改成了 B，后来又被改回为 A，那 CAS 操作就会误认为它从来没有被改变过**。

ABA 问题的解决思路就是使用版本号。在变量前面追加上版本号，每次变量更新的时候把版本号加1，那么 `A->B->A` 就会变成 `1A->2B->3A`。

从 Java 1.5开始，J.U.C 包里提供了一个带有标记的**原子引用类** `AtomicStampedReference` 来解决 ABA 问题，它可以通过控制变量值的版本来保证 CAS 的正确性。这个类的 `compareAndSet()` 方法的作用是首先检查当前引用是否等于预期引用，并且检查当前标志是否等于预期标志，如果全部相等，则以原子方式将该引用和该标志的值设置为给定的更新值。

大部分情况下 ABA 问题不会影响程序并发的正确性，如果需要解决 ABA 问题，改用**传统的互斥同步可能会比原子类更高效**。



#### 循环时间长开销大

描述：**自旋 CAS（不断尝试，直到成功为止）如果长时间不成功，会给 CPU 带来非常大的执行开销**。

如果 JVM 能支持处理器提供的`pause` 指令，那么效率会有一定的提升。pause 指令有两个作用：

- 第一，它可以延迟流水线执行命令（de-pipeline），使 CPU 不会消耗过多的执行资源，延迟的时间取决于具体实现的版本，在一些处理器上延迟时间是零；
- 第二，它可以避免在退出循环的时候因内存顺序冲突（Memory Order Violation）而引起 CPU 流水线被清空（CPU Pipeline Flush），从而提高 CPU 的执行效率。



#### 只能保证一个共享变量的原子操作

当对一个共享变量执行操作时，我们可以使用循环 CAS 的方式来保证原子操作，但是对多个共享变量操作时，循环 CAS 就无法保证操作的原子性，这个时候就可以用锁。

还有一个取巧的办法，就是把多个共享变量合并成一个共享变量来操作。比如，有两个共享变量`i = 2`，`j = a`，合并一下`ij = 2a`，然后用 CAS 来操作 `ij`。

从 Java 1.5 开始，JDK提供了 `AtomicReference` 类来保证引用对象之间的原子性，就可以把多个变量放在一个对象里来进行 CAS 操作。



### CAS 的应用

**CAS 只适用于线程冲突较少的情况**。

CAS 的典型应用场景是：

- 原子类
- 自旋锁



#### 原子类

> 原子类是 CAS 在 Java 中最典型的应用。

如果不使用 CAS，在高并发下，多线程同时修改一个变量的值我们需要 `synchronized` 加锁（可能有人说可以用 *Lock* 加锁，*Lock* 底层的 *AQS* 也是基于 *CAS* 进行获取锁的）：

```java{19}
public class Test {
    private static int i = 0;
    public static void main(String[] args) throws InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 10000; i++) {
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    add();
                }
            });
        }

        executorService.shutdown();
        executorService.awaitTermination(3, TimeUnit.SECONDS);
        System.out.println("Final Count is : " + i);
    }

    public static synchronized int add() {
        return i++;
    }
}
```

Java 中为我们提供了 `AtomicInteger` 原子类（底层基于CAS进行更新数据的），不需要加锁就在多线程并发场景下实现数据的一致性，最经典方式是应用原子类的 `incrementAndGet()` 方法：

```java{9}
public class AtomicIntegerDemo {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        final AtomicInteger count = new AtomicInteger(0);
        for (int i = 0; i < 10; i++) {
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    count.incrementAndGet();
                }
            });
        }

        executorService.shutdown();
        executorService.awaitTermination(3, TimeUnit.SECONDS);
        System.out.println("Final Count is : " + count.get());
    }
}
```

---

J.U.C 包中提供了 `AtomicBoolean`、`AtomicInteger`、`AtomicLong` 分别针对 `Boolean`、`Integer`、`Long` 执行原子操作，操作和上面的示例大体相似，不做赘述。



#### 自旋锁

利用原子类（本质上是 CAS），可以实现自旋锁。

所谓自旋锁，是指线程反复检查锁变量是否可用，直到成功为止。由于线程在这一过程中保持执行，因此是一种忙等待。一旦获取了自旋锁，线程会一直保持该锁，直至显式释放自旋锁。

示例：

- **非线程安全示例**：

  ```java
  import java.util.concurrent.ExecutorService;
  import java.util.concurrent.Executors;
  
  public class AtomicReferenceDemo {
      private static int ticket = 10;
  
      public static void main(String[] args) {
          ExecutorService executorService = Executors.newFixedThreadPool(3);
          for (int i = 0; i < 5; i++) {
              executorService.execute(new MyThread());
          }
          executorService.shutdown();
      }
  
      static class MyThread implements Runnable {
          @Override
          public void run() {
              while (ticket > 0) {
                  System.out.println(Thread.currentThread().getName() + " 卖出了第 " + ticket + " 张票");
                  ticket--;
              }
          }
  
      }
  }
  ```

  输出结果：

  ```
  pool-1-thread-2 卖出了第 10 张票
  pool-1-thread-2 卖出了第 9 张票
  pool-1-thread-2 卖出了第 8 张票
  pool-1-thread-2 卖出了第 7 张票
  pool-1-thread-2 卖出了第 6 张票
  pool-1-thread-2 卖出了第 5 张票
  pool-1-thread-2 卖出了第 4 张票
  pool-1-thread-2 卖出了第 3 张票
  pool-1-thread-2 卖出了第 2 张票
  pool-1-thread-2 卖出了第 1 张票
  pool-1-thread-3 卖出了第 10 张票
  ```

  很明显，出现了重复售票的情况。

- **使用自旋锁来保证线程安全**：

  可以通过自旋锁这种非阻塞同步来保证线程安全，下面使用 `AtomicReference` 来实现一个自旋锁

  ```java
  import java.util.concurrent.ExecutorService;
  import java.util.concurrent.Executors;
  import java.util.concurrent.atomic.AtomicReference;
  
  public class AtomicReferenceDemo2 {
      private static int ticket = 10;
      
      public static void main(String[] args) {
          threadSafeDemo();
      }
      private static void threadSafeDemo() {
          SpinLock lock = new SpinLock();
          ExecutorService executorService = Executors.newFixedThreadPool(3);
          for (int i = 0; i < 5; i++) {
              executorService.execute(new MyThread(lock));
          }
          executorService.shutdown();
      }
  
      static class SpinLock {
          private AtomicReference<Thread> atomicReference = new AtomicReference<>();
          public void lock() {
              Thread current = Thread.currentThread();
              while (!atomicReference.compareAndSet(null, current)) {
              }
          }
          public void unlock() {
              Thread current = Thread.currentThread();
              atomicReference.compareAndSet(current, null);
          }
      }
  
      static class MyThread implements Runnable {
          private SpinLock lock;
          public MyThread(SpinLock lock) {
              this.lock = lock;
          }
          @Override
          public void run() {
              while (ticket > 0) {
                  lock.lock();
                  if (ticket > 0) {
                      System.out.println(Thread.currentThread().getName() + " 卖出了第 " + ticket + " 张票");
                      ticket--;
                  }
                  lock.unlock();
              }
          }
      }
  }
  ```

  运行结果：

  ```
  pool-1-thread-1 卖出了第 10 张票
  pool-1-thread-1 卖出了第 9 张票
  pool-1-thread-2 卖出了第 8 张票
  pool-1-thread-2 卖出了第 7 张票
  pool-1-thread-2 卖出了第 6 张票
  pool-1-thread-2 卖出了第 5 张票
  pool-1-thread-2 卖出了第 4 张票
  pool-1-thread-2 卖出了第 3 张票
  pool-1-thread-2 卖出了第 2 张票
  pool-1-thread-2 卖出了第 1 张票
  ```

  


### CAS 的原理

Java 主要利用 `Unsafe` 这个类提供的 CAS 操作。`Unsafe` 的 CAS 依赖的是 JVM 针对不同的操作系统实现的硬件指令 **`Atomic::cmpxchg`**。`Atomic::cmpxchg` 的实现使用了汇编的 CAS 操作，并使用 CPU 提供的 `lock` 信号保证其原子性。



## UnSafe 类详解

Unsafe 是位于 `sun.misc` 包下的一个类，主要提供一些用于执行低级别、不安全操作的方法，如直接访问系统内存资源、自主管理内存资源等，这些方法在提升 Java 运行效率、增强 Java 语言底层资源操作能力方面起到了很大的作用。但由于 Unsafe 类使 Java 语言拥有了类似 C 语言指针一样操作内存空间的能力，这无疑也增加了程序发生相关指针问题的风险。在程序中过度、不正确使用 Unsafe 类会使得程序出错的概率变大，使得 Java 这种安全的语言变得不再“安全”，因此对 Unsafe 的使用一定要慎重。

这个类尽管里面的方法都是 `public` 的，但是并没有办法使用它们，JDK API 文档也没有提供任何关于这个类的方法的解释。总而言之，对于 Unsafe 类的使用都是受限制的，只有授信的代码才能获得该类的实例，当然 JDK 库里面的类是可以随意使用的。

先来看下这张图，对 UnSafe 类总体功能：

![img](img/java-thread-x-atomicinteger-unsafe.png)

如上图所示，Unsafe 提供的 API 大致可分为内存操作、CAS、Class相关、对象操作、线程调度、系统信息获取、内存屏障、数组操作等几类，下面将对其相关方法和应用场景进行详细介绍。



### Unsafe与CAS

反编译出来的代码：

```java
public final int getAndAddInt(Object paramObject, long paramLong, int paramInt)
  {
    int i;
    do
      i = getIntVolatile(paramObject, paramLong);
    while (!compareAndSwapInt(paramObject, paramLong, i, i + paramInt));
    return i;
  }

  public final long getAndAddLong(Object paramObject, long paramLong1, long paramLong2)
  {
    long l;
    do
      l = getLongVolatile(paramObject, paramLong1);
    while (!compareAndSwapLong(paramObject, paramLong1, l, l + paramLong2));
    return l;
  }

  public final int getAndSetInt(Object paramObject, long paramLong, int paramInt)
  {
    int i;
    do
      i = getIntVolatile(paramObject, paramLong);
    while (!compareAndSwapInt(paramObject, paramLong, i, paramInt));
    return i;
  }

  public final long getAndSetLong(Object paramObject, long paramLong1, long paramLong2)
  {
    long l;
    do
      l = getLongVolatile(paramObject, paramLong1);
    while (!compareAndSwapLong(paramObject, paramLong1, l, paramLong2));
    return l;
  }

  public final Object getAndSetObject(Object paramObject1, long paramLong, Object paramObject2)
  {
    Object localObject;
    do
      localObject = getObjectVolatile(paramObject1, paramLong);
    while (!compareAndSwapObject(paramObject1, paramLong, localObject, paramObject2));
    return localObject;
  }
```

从源码中发现，内部使用自旋的方式进行 CAS 更新（while 循环进行 CAS 更新，如果更新失败，则循环再次重试）。

又从 Unsafe 类中发现，原子操作其实只支持下面三个方法：

```java
public final native boolean compareAndSwapObject(Object paramObject1, long paramLong, Object paramObject2, Object paramObject3);

public final native boolean compareAndSwapInt(Object paramObject, long paramLong, int paramInt1, int paramInt2);

public final native boolean compareAndSwapLong(Object paramObject, long paramLong1, long paramLong2, long paramLong3);
```



### Unsafe底层

不妨再看看 Unsafe 的 compareAndSwap* 方法来实现 CAS 操作，它是一个本地方法(native)，实现位于unsafe.cpp 中。

```c
UNSAFE_ENTRY(jboolean, Unsafe_CompareAndSwapInt(JNIEnv *env, jobject unsafe, jobject obj, jlong offset, jint e, jint x))
  UnsafeWrapper("Unsafe_CompareAndSwapInt");
  oop p = JNIHandles::resolve(obj);
  jint* addr = (jint *) index_oop_from_field_offset_long(p, offset);
  return (jint)(Atomic::cmpxchg(x, addr, e)) == e;
UNSAFE_END
```

可以看到它通过 `Atomic::cmpxchg` 来实现比较和替换操作。其中参数 x 是即将更新的值，参数 e 是原内存的值。

如果是 Linux 的 x86，`Atomic::cmpxchg` 方法的实现如下：

```c
inline jint Atomic::cmpxchg (jint exchange_value, volatile jint* dest, jint compare_value) {
  int mp = os::is_MP();
  __asm__ volatile (LOCK_IF_MP(%4) "cmpxchgl %1,(%3)"
                    : "=a" (exchange_value)
                    : "r" (exchange_value), "a" (compare_value), "r" (dest), "r" (mp)
                    : "cc", "memory");
  return exchange_value;
}
```

而 Window s的 x86 的实现如下：

```c
inline jint Atomic::cmpxchg (jint exchange_value, volatile jint* dest, jint compare_value) {
    int mp = os::isMP(); //判断是否是多处理器
    _asm {
        mov edx, dest
        mov ecx, exchange_value
        mov eax, compare_value
        LOCK_IF_MP(mp)
        cmpxchg dword ptr [edx], ecx
    }
}

// Adding a lock prefix to an instruction on MP machine
// VC++ doesn't like the lock prefix to be on a single line
// so we can't insert a label after the lock prefix.
// By emitting a lock prefix, we can define a label after it.
#define LOCK_IF_MP(mp) __asm cmp mp, 0  \
                       __asm je L0      \
                       __asm _emit 0xF0 \
                       __asm L0:
```

如果是多处理器，为 cmpxchg 指令添加 lock 前缀。反之，就省略 lock 前缀（单处理器会不需要lock前缀提供的内存屏障效果）。这里的 lock 前缀就是使用了处理器的总线锁（最新的处理器都使用缓存锁代替总线锁来提高性能）。

> cmpxchg(void* ptr, int old, int new)，如果ptr和old的值一样，则把new写到ptr内存，否则返回ptr的值，整个操作是原子的。在Intel平台下，会用lock cmpxchg来实现，使用lock触发缓存锁，这样另一个线程想访问ptr的内存，就会被block住。



### Unsafe其它功能

Unsafe 提供了硬件级别的操作，比如说获取某个属性在内存中的位置，比如说修改对象的字段值，即使它是私有的。不过 Java 本身就是为了屏蔽底层的差异，对于一般的开发而言也很少会有这样的需求。

举两个例子，比方说：

```java
public native long staticFieldOffset(Field paramField);
```

这个方法可以用来获取给定的 paramField 的内存地址偏移量，这个值对于给定的 field 是唯一的且是固定不变的。

再比如说：

```java
public native int arrayBaseOffset(Class paramClass);
public native int arrayIndexScale(Class paramClass);
```

前一个方法是用来获取数组第一个元素的偏移地址，后一个方法是用来获取数组的转换因子即数组中元素的增量地址的。

最后看三个方法：

```java
public native long allocateMemory(long paramLong);
public native long reallocateMemory(long paramLong1, long paramLong2);
public native void freeMemory(long paramLong);
```

分别用来分配内存，扩充内存和释放内存的。

> 更多相关功能，推荐你看下这篇文章：来自美团技术团队：[Java魔法类：Unsafe应用解析](https://tech.meituan.com/2019/02/14/talk-about-java-magic-class-unsafe.html)



## Atomic原子变量类

在 `java.util.concurrent.atomic` 包下提供了

原子变量类可以分为 4 组：

- 基本类型
  - `AtomicBoolean` - 布尔类型原子类
  - `AtomicInteger` - 整型原子类
  - `AtomicLong` - 长整型原子类
- 引用类型
  - `AtomicReference` - 引用类型原子类
  - `AtomicMarkableReference` - 带有标记位的引用类型原子类
  - `AtomicStampedReference` - 带有版本号的引用类型原子类
- 数组类型
  - `AtomicIntegerArray` - 整形数组原子类
  - `AtomicLongArray` - 长整型数组原子类
  - `AtomicReferenceArray` - 引用类型数组原子类
- 属性更新器类型
  - `AtomicIntegerFieldUpdater` - 整型字段的原子更新器。
  - `AtomicLongFieldUpdater` - 长整型字段的原子更新器。
  - `AtomicReferenceFieldUpdater` - 原子更新引用类型里的字段。



### 基本类型

这一类型的原子类是针对 Java 基本类型进行操作。

- `AtomicBoolean` - 布尔类型原子类
- `AtomicInteger` - 整型原子类
- `AtomicLong` - 长整型原子类

以上类都支持 CAS（compare-and-swap）技术。此外，`AtomicInteger`、`AtomicLong` 还支持算术运算。



#### 使用举例

由于 AtomicBoolean、AtomicInteger、AtomicLong 实现方式、使用方式都相近，所以只仅针对 **AtomicInteger** 进行介绍。以 AtomicInteger 为例，常用 API：

```java
public final int get() //获取当前的值
public final int getAndSet(int newValue) //获取当前的值，并设置新的值
public final int getAndIncrement() //先获取当前的值，后自增
public final int incrementAndGet() //先自增，后获取当前的值
public final int getAndDecrement() //获取当前的值，并自减
public final int decrementAndGet() //先自减，后获取当前的值
public final int getAndAdd(int delta) //获取当前的值，并加上预期的值

// 如果输入值（update）等于预期值，将该值设置为输入值
public final boolean compareAndSet(int expect, int update)
// 最终会设置成newValue，使用lazySet设置值后，可能导致其他线程在之后的一小段时间内还是可以读到旧的值
public final void lazySet(int newValue)
```



#### 源码解析



```java
public class AtomicInteger extends Number implements java.io.Serializable {
    private static final Unsafe unsafe = Unsafe.getUnsafe();
    private static final long valueOffset;
    static {
        try {
            // 用于获取value字段相对当前对象的“起始地址”的偏移量
            valueOffset = unsafe.objectFieldOffset(AtomicInteger.class.getDeclaredField("value"));
        } catch (Exception ex) { throw new Error(ex); }
    }

    private volatile int value;

    //返回当前值
    public final int get() {
        return value;
    }

    //递增加detla
    public final int getAndAdd(int delta) {
        //三个参数，1、当前的实例 2、value实例变量的偏移量 3、当前value要加上的数(value+delta)。
        return unsafe.getAndAddInt(this, valueOffset, delta);
    }

    //递增加1
    public final int incrementAndGet() {
        return unsafe.getAndAddInt(this, valueOffset, 1) + 1;
    }
...
}
```

- `value` - value 属性使用 `volatile` 修饰，使得对 value 的修改在并发环境下对所有线程可见；
- `valueOffset` - value 属性的偏移量，通过这个偏移量可以快速定位到 value 字段，这个是实现 AtomicInteger 的关键；
- `unsafe` - Unsafe 类型的属性，它为 `AtomicInteger` 提供了 CAS 操作。



### 引用类型

Java 数据类型分为 **基本数据类型** 和 **引用数据类型** 两大类。上一节中提到了针对基本数据类型的原子类，那么如果想针对引用类型做原子操作怎么办？Java 也提供了相关的原子类：

- `AtomicReference` - 引用类型原子类
- `AtomicMarkableReference` - 带有标记位的引用类型原子类
- `AtomicStampedReference` - 带有版本号的引用类型原子类

> `AtomicStampedReference` 类在引用类型原子类中，彻底地解决了 ABA 问题，其它的 CAS 能力与另外两个类相近，所以最具代表性。因此，本节只针对 `AtomicStampedReference` 进行说明。

示例：基于 `AtomicReference` 实现一个简单的自旋锁：

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicReference;

public class AtomicReferenceDemo2 {

    private static int ticket = 10;

    public static void main(String[] args) {
        threadSafeDemo();
    }

    private static void threadSafeDemo() {
        SpinLock lock = new SpinLock();
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 5; i++) {
            executorService.execute(new MyThread(lock));
        }
        executorService.shutdown();
    }

    /**
     * 基于 {@link AtomicReference} 实现的简单自旋锁
     */
    static class SpinLock {

        private AtomicReference<Thread> atomicReference = new AtomicReference<>();

        public void lock() {
            Thread current = Thread.currentThread();
            while (!atomicReference.compareAndSet(null, current)) {
            }
        }

        public void unlock() {
            Thread current = Thread.currentThread();
            atomicReference.compareAndSet(current, null);
        }

    }

    /**
     * 利用自旋锁 {@link SpinLock} 并发处理数据
     */
    static class MyThread implements Runnable {

        private SpinLock lock;

        public MyThread(SpinLock lock) {
            this.lock = lock;
        }

        @Override
        public void run() {
            while (ticket > 0) {
                lock.lock();
                if (ticket > 0) {
                    System.out.println(Thread.currentThread().getName() + " 卖出了第 " + ticket + " 张票");
                    ticket--;
                }
                lock.unlock();
            }
        }
    }
}
```

原子类的实现基于 CAS 机制，而 CAS 存在 ABA 问题。正是为了解决 ABA 问题，才有了 `AtomicMarkableReference` 和 `AtomicStampedReference`。

---

`AtomicMarkableReference` 使用一个布尔值作为标记，修改时在 true / false 之间切换。这种策略不能根本上解决 ABA 问题，但是可以降低 ABA 发生的几率。常用于缓存或者状态描述这样的场景。

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicMarkableReference;

public class AtomicMarkableReferenceDemo {

    private final static String INIT_TEXT = "abc";

    public static void main(String[] args) throws InterruptedException {

        final AtomicMarkableReference<String> amr = new AtomicMarkableReference<>(INIT_TEXT, false);

        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 10; i++) {
            executorService.submit(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(Math.abs((int) (Math.random() * 100)));
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    String name = Thread.currentThread().getName();
                    if (amr.compareAndSet(INIT_TEXT, name, amr.isMarked(), !amr.isMarked())) {
                        System.out.println(Thread.currentThread().getName() + " 修改了对象！");
                        System.out.println("新的对象为：" + amr.getReference());
                    }
                }
            });
        }

        executorService.shutdown();
        executorService.awaitTermination(3, TimeUnit.SECONDS);
    }
}
```

---

**`AtomicStampedReference` 使用一个整型值做为版本号，每次更新前先比较版本号，如果一致，才进行修改**。通过这种策略，可以根本上解决 ABA 问题。

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicStampedReference;

public class AtomicStampedReferenceDemo {

    private final static String INIT_REF = "pool-1-thread-3";

    private final static AtomicStampedReference<String> asr = new AtomicStampedReference<>(INIT_REF, 0);

    public static void main(String[] args) throws InterruptedException {

        System.out.println("初始对象为：" + asr.getReference());

        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 3; i++) {
            executorService.execute(new MyThread());
        }

        executorService.shutdown();
        executorService.awaitTermination(3, TimeUnit.SECONDS);
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            try {
                Thread.sleep(Math.abs((int) (Math.random() * 100)));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            final int stamp = asr.getStamp();
            if (asr.compareAndSet(INIT_REF, Thread.currentThread().getName(), stamp, stamp + 1)) {
                System.out.println(Thread.currentThread().getName() + " 修改了对象！");
                System.out.println("新的对象为：" + asr.getReference());
            }
        }
    }
}
```



### 数组类型

Java 提供了以下针对数组的原子类：

- `AtomicIntegerArray` - 整形数组原子类
- `AtomicLongArray` - 长整型数组原子类
- `AtomicReferenceArray` - 引用类型数组原子类

已经有了针对基本类型和引用类型的原子类，为什么还要提供针对数组的原子类呢？

数组类型的原子类为 **数组元素** 提供了 `volatile` 类型的访问语义，这是普通数组所不具备的特性——**`volatile` 类型的数组仅在数组引用上具有 `volatile` 语义**。

示例：`AtomicIntegerArray` 使用示例（`AtomicLongArray` 、`AtomicReferenceArray` 使用方式也类似）

```java
public class AtomicIntegerArrayDemo {

    private static AtomicIntegerArray atomicIntegerArray = new AtomicIntegerArray(10);

    public static void main(final String[] arguments) throws InterruptedException {

        System.out.println("Init Values: ");
        for (int i = 0; i < atomicIntegerArray.length(); i++) {
            atomicIntegerArray.set(i, i);
            System.out.print(atomicIntegerArray.get(i) + " ");
        }
        System.out.println();

        Thread t1 = new Thread(new Increment());
        Thread t2 = new Thread(new Compare());
        t1.start();
        t2.start();

        t1.join();
        t2.join();

        System.out.println("Final Values: ");
        for (int i = 0; i < atomicIntegerArray.length(); i++) {
            System.out.print(atomicIntegerArray.get(i) + " ");
        }
        System.out.println();
    }

    static class Increment implements Runnable {

        @Override
        public void run() {

            for (int i = 0; i < atomicIntegerArray.length(); i++) {
                int value = atomicIntegerArray.incrementAndGet(i);
                System.out.println(Thread.currentThread().getName() + ", index = " + i + ", value = " + value);
            }
        }

    }

    static class Compare implements Runnable {

        @Override
        public void run() {
            for (int i = 0; i < atomicIntegerArray.length(); i++) {
                boolean swapped = atomicIntegerArray.compareAndSet(i, 2, 3);
                if (swapped) {
                    System.out.println(Thread.currentThread().getName() + " swapped, index = " + i + ", value = 3");
                }
            }
        }
    }
}
```



### 属性更新器类型

更新器类支持基于反射机制的更新字段值的原子操作。

- `AtomicIntegerFieldUpdater` - 整型字段的原子更新器。
- `AtomicLongFieldUpdater` - 长整型字段的原子更新器。
- `AtomicReferenceFieldUpdater` - 原子更新引用类型里的字段。

这些类的使用有一定限制：

- 因为对象的属性修改类型原子类都是抽象类，所以每次使用都必须使用静态方法 `newUpdater()` 创建一个更新器，并且需要设置想要更新的类和属性；
- 字段必须是 `volatile` 类型的；
- 不能作用于静态变量（static）；
- 不能作用于常量（final）。

```java
public class AtomicReferenceFieldUpdaterDemo {

    static User user = new User("begin");

    static AtomicReferenceFieldUpdater<User, String> updater =
        AtomicReferenceFieldUpdater.newUpdater(User.class, String.class, "name");

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 5; i++) {
            executorService.execute(new MyThread());
        }
        executorService.shutdown();
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            if (updater.compareAndSet(user, "begin", "end")) {
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + " 已修改 name = " + user.getName());
            } else {
                System.out.println(Thread.currentThread().getName() + " 已被其他线程修改");
            }
        }

    }

    static class User {

        volatile String name;

        public User(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public User setName(String name) {
            this.name = name;
            return this;
        }
    }
}
```



### 原子化的累加器

`DoubleAccumulator`、`DoubleAdder`、`LongAccumulator` 和 `LongAdder`，这四个类仅仅用来执行累加操作，相比原子化的基本数据类型，速度更快，但是不支持 `compareAndSet()` 方法。如果你仅仅需要累加操作，使用原子化的累加器性能会更好，代价就是会消耗更多的内存空间。

`LongAdder` 内部由一个 `base` 变量和一个 `cell[]` 数组组成。

- 当只有一个写线程，没有竞争的情况下，`LongAdder` 会直接使用 `base` 变量作为原子操作变量，通过 CAS 操作修改变量；
- 当有多个写线程竞争的情况下，除了占用 `base` 变量的一个写线程之外，其它各个线程会将修改的变量写入到自己的槽 `cell[]` 数组中。

我们可以发现，`LongAdder` 在操作后的返回值只是一个近似准确的数值，但是 `LongAdder` 最终返回的是一个准确的数值， 所以在一些对实时性要求比较高的场景下，`LongAdder` 并不能取代 `AtomicInteger` 或 `AtomicLong`。



## 参考链接

- [JUC原子类: CAS, Unsafe和原子类详解](https://www.pdai.tech/md/java/thread/java-thread-x-juc-AtomicInteger.html#juc%E5%8E%9F%E5%AD%90%E7%B1%BB-cas-unsafe%E5%92%8C%E5%8E%9F%E5%AD%90%E7%B1%BB%E8%AF%A6%E8%A7%A3)
- [github-dunwu](https://dunwu.github.io/javacore/concurrent/Java%E5%B9%B6%E5%8F%91%E6%A0%B8%E5%BF%83%E6%9C%BA%E5%88%B6.html#_4-1-cas-%E7%9A%84%E8%A6%81%E7%82%B9)

