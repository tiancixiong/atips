# JUC锁 - ReentrantLock

> 可重入锁 ReentrantLock 的底层是通过 AQS(AbstractQueuedSynchronizer) 实现

**重入锁**：一个线程获得了锁之后仍然可以**反复**的加锁，不会出现自己阻塞自己的情况。

