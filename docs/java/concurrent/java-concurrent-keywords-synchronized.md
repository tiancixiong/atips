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

synchronized 它可以把任意一个非 NULL 的对象当作锁。它属于独占式的悲观锁，同时属于可重入锁。

- **synchronized** 是 Java 中的关键字，是 **利用锁的机制来实现互斥同步的**。

- **synchronized 可以保证在同一个时刻，只有一个线程可以执行某个方法或者某个代码块**。

如果不需要 *Lock* 、*ReadWriteLock* 所提供的高级同步特性，应该优先考虑使用 *synchronized* ，理由如下：

- Java 1.6 以后，synchronized 做了大量的优化，其性能已经与 Lock 、ReadWriteLock 基本上持平。从趋势来看，Java 未来仍将继续优化 synchronized ，而不是 ReentrantLock 。
- *ReentrantLock* 是 Oracle JDK 的 API，在其他版本的 JDK 中不一定支持；而 *synchronized* 是 JVM 的内置特性，所有 JDK 版本都提供支持。



## synchronized 的使用

在应用 sychronized 关键字时需要把握如下注意点：

- 一把锁只能同时被一个线程获取，没有获得锁的线程只能等待；
- 每个实例都对应有自己的一把锁（`this`），不同实例之间互不影响；例外：锁对象是 `*.class` 以及 synchronized 修饰的是 `static` 方法的时候，所有对象公用同一把锁；
- synchronized 修饰的方法，无论方法正常执行完毕还是抛出异常，都会释放锁。



### 对象锁

对象锁：包括方法锁（默认锁对象为this,当前实例对象）和同步代码块锁（自己指定锁对象）。

**代码块形式：手动指定锁定对象，也可是是 `this`，也可以是自定义的锁**

**方法锁形式：synchronized 修饰普通方法，锁对象默认为 `this`**



### 类锁

类锁：指 synchronize 修饰静态的方法或指定锁对象为 Class 对象



## synchronized 原理

*synchronized* 代码块是由一对 `monitorenter` 和 `monitorexit` 指令实现的，*Monitor* 对象是同步的基本实现单元。在 Java 6 之前，*Monitor* 的实现完全是依靠操作系统内部的互斥锁，因为需要进行用户态到内核态的切换，所以同步操作是一个无差别的重量级操作。

如果 synchronized 明确制定了对象参数，那就是这个对象的引用；如果没有明确指定，那就根据 synchronized 修饰的是实例方法还是静态方法，去对对应的对象实例或 *Class* 对象来作为锁对象。

synchronized 同步块对同一线程来说是可重入的，不会出现锁死问题。

synchronized 同步块是互斥的，即已进入的线程执行完成前，会阻塞其他试图进入的线程。



## synchronized 与 Lock

### synchronized的缺陷

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

