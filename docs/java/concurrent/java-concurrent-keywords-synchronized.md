# 关键字: synchronized



## 面试题

- Synchronized可以作用在哪里? 分别通过对象锁和类锁进行举例。
- Synchronized本质上是通过什么保证线程安全的? 分三个方面回答：加锁和释放锁的原理，可重入原理，保证可见性原理。
- Synchronized有什么样的缺陷?  Java Lock是怎么弥补这些缺陷的。
- Synchronized和Lock的对比，和选择?
- Synchronized在使用时有何注意事项?
- Synchronized修饰的方法在抛出异常时,会释放锁吗?
- 多个线程等待同一个Synchronized锁的时候，JVM如何选择下一个获取锁的线程?
- Synchronized使得同时只有一个线程可以执行，性能比较差，有什么提升的方法?
- 我想更加灵活地控制锁的释放和获取(现在释放锁和获取锁的时机都被规定死了)，怎么办?
- 什么是锁的升级和降级? 什么是JVM里的偏斜锁、轻量级锁、重量级锁?
- 不同的JDK中对Synchronized有何优化?



## synchronized 介绍

`synchronized` 它可以把任意一个非 `NULL` 的对象当作锁。它属于独占式的悲观锁，同时属于可重入锁。

- **synchronized** 是 Java 中的关键字，是 **利用锁的机制来实现互斥同步的**。
- **synchronized 可以保证在同一个时刻，只有一个线程可以执行某个方法或者某个代码块**。

在 Java 早期版本中，`synchronized` 属于 **重量级锁**，效率低下。因为监视器锁（monitor）是依赖于底层的操作系统的 `Mutex Lock` 来实现的，Java 的线程是映射到操作系统的原生线程之上的。如果要挂起或者唤醒一个线程，都需要操作系统帮忙完成，而操作系统实现线程之间的切换时需要从用户态转换到内核态，这个状态之间的转换需要相对比较长的时间，时间成本相对较高。

在 Java 1.6 之后 Java 官方对从 JVM 层面对 `synchronized` 较大优化，所以现在的 `synchronized` 锁效率也优化得很不错了。JDK1.6 对锁的实现引入了大量的优化，如自旋锁、适应性自旋锁、锁消除、锁粗化、偏向锁、轻量级锁等技术来减少锁操作的开销。

---

如果不需要 *Lock* 、*ReadWriteLock* 所提供的高级同步特性，应该优先考虑使用 *synchronized* ，理由如下：

- Java 1.6 以后，synchronized 做了大量的优化，其性能已经与 *Lock* 、*ReadWriteLock* 基本上持平。从趋势来看，Java 未来仍将继续优化 `synchronized` ，而不是 `ReentrantLock` 。
- *ReentrantLock* 是 Oracle JDK 的 API，在其他版本的 JDK 中不一定支持；而 *synchronized* 是 JVM 的内置特性，所有 JDK 版本都提供支持。



## synchronized 的使用

`synchronized` 关键字是解决并发问题常用解决方案，有以下三种使用方式:

- 同步**普通方法**，锁的是当前对象；

  ```java
  synchronized void method() {
      //业务代码
  }
  ```

- 同步**静态方法**，锁的是当前 `Class` 对象；进入同步代码前要获得 **当前 Class 的锁**。因为静态成员不属于任何一个实例对象；

  ```java
  synchronized static void method() {
      //业务代码
  }
  ```

- **同步代码块**，锁的是 `()` 中的对象，对给定对象/类加锁；

  - `synchronized(this|object)` 表示进入同步代码块前要获得**指定对象的锁**
  - `synchronized(类.class)` 表示进入同步代码前要获得 **当前 class 的锁**

  ```java
  synchronized (this) {
      //业务代码
  }
  ```

**总结：**

- `synchronized` 关键字加到 `static` 静态方法上和 `synchronized(class)` 代码块上都是给 Class 类上锁；
- `synchronized` 关键字加到实例方法上是给对象实例上锁；
- 尽量不要使用 `synchronized(String a)` 因为 JVM 中，字符串常量池具有缓存功能！

---

在应用 `sychronized` 关键字时需要把握如下注意点：

- 一把锁只能同时被一个线程获取，没有获得锁的线程只能等待；
- 每个实例都对应有自己的一把锁（`this`），不同实例之间互不影响；例外：锁对象是 `*.class` 以及 synchronized 修饰的是 `static` 方法的时候，所有对象共用同一把锁；
- synchronized 修饰的方法，无论方法正常执行完毕还是抛出异常，都会释放锁。



### 对象锁

对象锁：包括方法锁（默认锁对象为 `this`，当前实例对象）和同步代码块锁（自己指定锁对象）。

- **代码块形式：手动指定锁定对象，也可以是 `this`，也可以是自定义的锁**

- **方法锁形式：synchronized 修饰普通方法，锁对象默认为 `this`**



### 类锁

类锁：指 `synchronize` 修饰静态的方法或指定锁对象为 Class 对象



## synchronized 原理

*synchronized* 代码块是由一对 `monitorenter` 和 `monitorexit` 指令进入、退出对象监视器（Monitor）实现对方法、同步块的同步的。*Monitor* 对象是同步的基本实现单元。

在 Java 6 之前，*Monitor* 的实现完全是依靠操作系统内部的互斥锁，因为需要进行用户态到内核态的切换，所以同步操作是一个无差别的重量级操作。

具体实现是在编译之后在同步方法调用前加入一个 `monitor.enter` 指令，在退出方法和异常处插入 `monitor.exit` 的指令。其本质就是对一个对象监视器（Monitor）进行获取，而这个获取过程具有排他性从而达到了同一时刻只能一个线程访问的目的。而对于没有获取到锁的线程将会阻塞到方法入口处，直到获取锁的线程 `monitor.exit` 之后才能尝试继续获取锁。流程图如下：

![img](img/5d313f638492c49210.jpg)



### 同步代码块

通过一段代码来演示:

```java
public class TestSync {
    public static void main(String[] args) {
        synchronized (TestSync.class){
            System.out.println("Synchronize");
        }
    }
}
```

使用 `javac TestSync.java` 和 `javap -c TestSync.class` 可以查看编译之后的具体信息。

```java{14,19}
Compiled from "TestSync.java"
public class com.example.concurrent.TestSync {
  public com.example.concurrent.TestSync();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: ldc           #2                  // class com/example/concurrent/TestSync
       2: dup
       3: astore_1
       4: monitorenter
       5: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
       8: ldc           #4                  // String Synchronize
      10: invokevirtual #5                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      13: aload_1
      14: monitorexit
      15: goto          23
      18: astore_2
      19: aload_1
      20: monitorexit
      21: aload_2
      22: athrow
      23: return
    Exception table:
       from    to  target type
           5    15    18   any
          18    21    18   any
}
```

可以看到在同步块的入口和出口分别有 `monitorenter`、`monitorexit` 指令，其中 `monitorenter` 指令指向同步代码块的开始位置，`monitorexit` 指令则指明同步代码块的结束位置。。

当执行 `monitorenter` 指令时，线程试图获取锁也就是获取 **对象监视器 `monitor`** 的持有权。

> 在 Java 虚拟机(HotSpot)中，Monitor 是基于 C++实现的，由 [ObjectMonitor](https://github.com/openjdk-mirror/jdk7u-hotspot/blob/50bdefc3afe944ca74c3093e7448d6b889cd20d1/src/share/vm/runtime/objectMonitor.cpp) 实现的。每个对象中都内置了一个 `ObjectMonitor`对象。
>
> 另外，`wait()、notify()` 等方法也依赖于 `monitor` 对象，这就是为什么只有在同步的块或者方法中才能调用 `wait/notify` 等方法，否则会抛出 `java.lang.IllegalMonitorStateException` 的异常的原因。

在执行 `monitorenter` 时，会尝试获取对象的锁，如果锁的计数器为 0 则表示锁可以被获取，获取后将锁计数器设为 1 也就是加 1。

在执行 `monitorexit` 指令后，将锁计数器设为 0，表明锁被释放。如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止。



### 修饰方法

```
public class TestSync2 {
    public synchronized void method() {
        System.out.println("synchronized 方法");
    }
}
```



```bash{52}
$ javap -v TestSync2.class //输出行号、本地变量表信息、反编译汇编代码、当前类用到的常量池等信息
Classfile /E:/Workspace_idea/java-learning-demo/src/main/java/com/example/concurrent/TestSync2.class
  Last modified 2021-11-18; size 434 bytes
  MD5 checksum 23ecd3ee5453cd3df64362eef0ac166c
  Compiled from "TestSync2.java"
public class com.example.concurrent.TestSync2
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #6.#14         // java/lang/Object."<init>":()V
   #2 = Fieldref           #15.#16        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = String             #17            // synchronized 鏂规硶
   #4 = Methodref          #18.#19        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #5 = Class              #20            // com/example/concurrent/TestSync2
   #6 = Class              #21            // java/lang/Object
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               method
  #12 = Utf8               SourceFile
  #13 = Utf8               TestSync2.java
  #14 = NameAndType        #7:#8          // "<init>":()V
  #15 = Class              #22            // java/lang/System
  #16 = NameAndType        #23:#24        // out:Ljava/io/PrintStream;
  #17 = Utf8               synchronized 鏂规硶
  #18 = Class              #25            // java/io/PrintStream
  #19 = NameAndType        #26:#27        // println:(Ljava/lang/String;)V
  #20 = Utf8               com/example/concurrent/TestSync2
  #21 = Utf8               java/lang/Object
  #22 = Utf8               java/lang/System
  #23 = Utf8               out
  #24 = Utf8               Ljava/io/PrintStream;
  #25 = Utf8               java/io/PrintStream
  #26 = Utf8               println
  #27 = Utf8               (Ljava/lang/String;)V
{
  public com.example.concurrent.TestSync2();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 7: 0

  public synchronized void method();
    descriptor: ()V
    flags: ACC_PUBLIC, ACC_SYNCHRONIZED
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #3                  // String synchronized 鏂规硶
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 9: 0
        line 10: 8
}
SourceFile: "TestSync2.java"
```

`synchronized` 修饰的方法并没有 `monitorenter` 指令和 `monitorexit` 指令，取得代之的确实是 `ACC_SYNCHRONIZED` 标识，该标识指明了该方法是一个同步方法。JVM 通过该 `ACC_SYNCHRONIZED` 访问标志来辨别一个方法是否声明为同步方法，从而执行相应的同步调用，其本质也是对对象监视器 monitor 的获取。



## synchronized 与 Lock

### synchronized 的缺陷

- **效率低**：锁的释放情况少，只有代码执行完毕或者异常结束才会释放锁；试图获取锁的时候不能设定超时；不能中断一个正在使用锁的线程。相对而言，*Lock* 可以中断和设置超时；
- **不够灵活**：加锁和释放的时机单一，每个锁仅有一个单一的条件(某个对象)，相对而言，读写锁更加灵活；
- **无法知道是否成功获得锁**，相对而言，Lock可以拿到状态



### Lock

*java.util.concurrent.locks.Lock* 接口中重要的方法：

- `lock()`：加锁
- `unlock()`：解锁
- `tryLock()`：尝试获取锁，返回一个 boolean 值
- `tryLock(long,TimeUtil)`：尝试获取锁，可以设置超时

多线程竞争一个锁时，其余未得到锁的线程只能不停的尝试获得锁，而不能中断。高并发的情况下会导致性能下降。ReentrantLock 的 `lockInterruptibly()` 方法可以优先考虑响应中断。 一个线程等待时间过长，它可以中断自己，然后 ReentrantLock 响应这个中断，不再让这个线程继续等待。有了这个机制，使用 ReentrantLock 时就不会像 synchronized 那样产生死锁了。



---

- **使用Synchronized有哪些要注意的？**
  - 锁对象不能为空，因为锁的信息都保存在对象头里
  - 作用域不宜过大，影响程序执行的速度，控制范围过大，编写代码也容易出错
  - 避免死锁
- **synchronized是公平锁吗？**

synchronized 实际上是非公平的，新来的线程有可能立即获得监视器，而在等待区中等候已久的线程可能再次等待，不过这种抢占的方式可以预防饥饿。



## synchronized 错误使用案例

### 保护对象不对

加锁前要清楚锁和被保护的对象是不是一个层面的。

静态字段属于*类*，类级别的锁才能保护；而非静态字段属于*类实例*，实例级别的锁就可以保护。

```java{14,20,36-38,40-44}
import java.util.stream.IntStream;

public class synchronized错误示例_保护对象不对 {

    public static void main(String[] args) {
        synchronized错误示例_保护对象不对 demo = new synchronized错误示例_保护对象不对();
        System.out.println(demo.wrong(1000000));
        System.out.println(demo.right(1000000));
    }

    public int wrong(int count) {
        Data.reset(); //重置Data.counter
        // 利用并行流，调用 Data.wrong() 方法count次
        IntStream.rangeClosed(1, count).parallel().forEach(i -> new Data().wrong());
        return Data.getCounter();
    }

    public int right(int count) {
        Data.reset();
        IntStream.rangeClosed(1, count).parallel().forEach(i -> new Data().right());
        return Data.getCounter();
    }

    private static class Data {
        private static int counter = 0;
        public static int getCounter() {
            return counter;
        }
        private static Object locker = new Object();

        public static int reset() {
            counter = 0;
            return counter;
        }
        
        public synchronized void wrong() {
            counter++;
        }
        
        public void right() {
            synchronized (locker) {
                counter++;
            }
        }
    }
}
```

执行结果：

```
892565
1000000
```

发现 `Data.wrong()` 最后的结果总是小于 `Data.right()`。这个是因为 `wrong()` 方法是在普通方法上加锁，是属于实例对象；而 `Data.counter` 是静态变量，属于类。试图对一个静态变量加对象级别的 synchronized 锁，并不能保证线程安全。可以使用下面代码解决：

```java
// Data
public void wrong() {
    synchronized (Data.class) {
        counter++;
    }
}
```



### 锁粒度导致的问题

要尽可能的缩小加锁的范围，这可以提高并发吞吐。

如果精细化考虑了锁应用范围后，性能还无法满足需求的话，我们就要考虑另一个维度的粒度问题了，即：区分读写场景以及资源的访问冲突，考虑使用悲观方式的锁还是乐观方式的锁。

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;

public class synchronized错误案例_锁粒度不当 {
    private final static Logger log = LoggerFactory.getLogger(synchronized错误案例_锁粒度不当.class);

    public static void main(String[] args) {
        Demo demo = new Demo();
        demo.wrong();
        demo.right();
    }

    private static class Demo {
        private List<Integer> data = new ArrayList<>();

        private void slow() {
            try {
                TimeUnit.MILLISECONDS.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        public int wrong() {
            long begin = System.currentTimeMillis();
            IntStream.rangeClosed(1, 1000).parallel().forEach(i -> {
                synchronized (this) {
                    slow();
                    data.add(i);
                }
            });
            log.info("耗时: {}ms", System.currentTimeMillis() - begin);
            return data.size();
        }

        public int right() {
            long begin = System.currentTimeMillis();
            IntStream.rangeClosed(1, 1000).parallel().forEach(i -> {
                slow();
                synchronized (data) {
                    data.add(i);
                }
            });
            log.info("耗时: {}ms", System.currentTimeMillis() - begin);
            return data.size();
        }
    }
}
```

执行结果：

```
[main] INFO com.example.syn.synchronized错误案例_锁粒度不当 - 耗时:10529
[main] INFO com.example.syn.synchronized错误案例_锁粒度不当 - 耗时:2600
```



## 面试题

### 1. 构造方法可以使用 synchronized 关键字修饰么？

先说结论：**构造方法不能使用 synchronized 关键字修饰。**

构造方法本身就属于线程安全的，不存在同步的构造方法一说。



### 2. 谈谈 synchronized 和 ReentrantLock 的区别

- 两者都是可重入锁

  **可重入锁**指的是自己可以再次获取自己的内部锁。比如一个线程获得了某个对象的锁，此时这个对象锁还没有释放，当其再次想要获取这个对象的锁的时候还是可以获取的，如果不可锁重入的话，就会造成死锁。同一个线程每次获取锁，锁的计数器都自增 1，所以要等到锁的计数器下降为 0 时才能释放锁。

- synchronized 依赖于 JVM；而 ReentrantLock 依赖于 API

  `synchronized` 是依赖于 JVM 实现的，前面我们也讲到了 虚拟机团队在 JDK1.6 为 `synchronized` 关键字进行了很多优化，但是这些优化都是在虚拟机层面实现的，并没有直接暴露给我们。`ReentrantLock` 是 JDK 层面实现的（也就是 API 层面，需要 `lock()` 和 `unlock()` 方法配合 `try/finally` 语句块来完成），所以我们可以通过查看它的源代码，来看它是如何实现的。

- ReentrantLock 比 synchronized 增加了一些高级功能

  相比 `synchronized`，`ReentrantLock` 增加了一些高级功能。主要来说主要有三点：

  - **等待可中断**：`ReentrantLock` 提供了一种能够中断等待锁的线程的机制，通过 `lock.lockInterruptibly()` 来实现这个机制。也就是说正在等待的线程可以选择放弃等待，改为处理其他事情。
  - **可实现公平锁**：`ReentrantLock` 可以指定是公平锁还是非公平锁。而 `synchronized` 只能是非公平锁。所谓的公平锁就是先等待的线程先获得锁。`ReentrantLock` 默认情况是非公平的，可以通过 `ReentrantLock` 类的 `ReentrantLock(boolean fair)` 构造方法来制定是否是公平的。
  - **可实现选择性通知（锁可以绑定多个条件）**：`synchronized` 关键字与 `wait()` 和`notify()/notifyAll()` 方法相结合可以实现等待/通知机制。`ReentrantLock` 类当然也可以实现，但是需要借助于 `Condition` 接口与 `newCondition()` 方法。



## 参考文献

- https://crossoverjie.top/JCSprout/#/thread/Synchronize
- [github-javaguide](https://snailclimb.gitee.io/javaguide/#/docs/java/concurrent/java%E5%B9%B6%E5%8F%91%E8%BF%9B%E9%98%B6%E5%B8%B8%E8%A7%81%E9%9D%A2%E8%AF%95%E9%A2%98%E6%80%BB%E7%BB%93)
- https://www.cnblogs.com/wuqinglong/p/9945618.html
