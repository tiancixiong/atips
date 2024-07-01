# Java 并发体系

## 📖 内容

**Java JUC** 简介：在 Java 5.0 提供了 `java.util.concurrent`（简称JUC ）包，在此包中增加了在并发编程中很常用的实用工具类，用于定义类似于线程的自定义子系统，包括线程池、异步 IO 和轻量级任务框架。提供可调的、灵活的线程池。还提供了设计用于多线程上下文中的 Collection 实现等。

Java 对于并发的支持主要汇聚在 J.U.C。而 J.U.C 的核心是 AQS。

![image-20211027190935750](//www.jsdelivr.ren/gh/tiancixiong/atips@img-230529/images/java/concurrent/java-juc-overview.png)

### Java 并发 - 并发简介

> **关键词：`进程`、`线程`、`安全性`、`活跃性`、`性能`、`死锁`、`饥饿`、`上下文切换`**

![img](//www.jsdelivr.ren/gh/tiancixiong/atips@img-230529/images/java/concurrent/20200701113445.png)

### Java 并发 - 线程基础

> **关键词：`Thread`、`Runnable`、`Callable`、`Future`、`wait`、`notify`、`notifyAll`、`join`、`sleep`、`yeild`、`线程状态`、`线程通信`**

![img](//www.jsdelivr.ren/gh/tiancixiong/atips@img-230529/images/java/concurrent/20200630221707.png)

![img](//www.jsdelivr.ren/gh/tiancixiong/atips@img-230529/images/java/concurrent/java-thread_1.png)



### Java 并发 - 核心机制

> **关键词：`synchronized`、`volatile`、`CAS`、`ThreadLocal`**



### Java 并发锁

> **关键词：`AQS`、`ReentrantLock`、`ReentrantReadWriteLock`、`Condition`**



### Java 原子类

> **关键词：`CAS`、`Atomic`**



### Java 并发容器

> **关键词：`ConcurrentHashMap`、`CopyOnWriteArrayList`**



### Java 线程池

> **关键词：`Executor`、`ExecutorService`、`ThreadPoolExecutor`、`Executors`**



### Java 并发工具类

> **关键词：`CountDownLatch`、`CyclicBarrier`、`Semaphore`**



### Java 内存模型

> **关键词：`JMM`、`volatile`、`synchronized`、`final`、`Happens-Before`、`内存屏障`**



## 📚 资料

- [Java 并发知识点总结](https://github.com/CL0610/Java-concurrency) - GitHub@CL0610

