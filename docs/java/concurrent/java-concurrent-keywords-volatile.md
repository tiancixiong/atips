# 关键字: volatile

## 面试题

- volatile 关键字的作用是什么?
- volatile 能保证原子性吗?
- 之前 32 位机器上共享的 long 和 double 变量的为什么要用 volatile? 现在 64 位机器上是否也要设置呢?
- `i++` 为什么不能保证原子性?
- volatile 是如何实现可见性的?  内存屏障。
- volatile 是如何实现有序性的?  `happens-before` 等
- 说下 volatile 的应用场景?



## volatile 的作用详解

### 防重排序

我们可以从下面这个单例的例子来分析重排序问题。

在并发环境下单例模式的实现方式，我们通常可以采用双重检查加锁（DCL）的方式实现： 

```java
public class Singleton {
    public static volatile Singleton singleton;
    /** 构造函数私有，禁止外部实例化 */
    private Singleton() {
    }
    public static Singleton getInstance() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}
```

思考下，为什么第 2 行代码中要在成员变量 singleton 加上 `volatile` 关键字？要理解这个问题，想要了解对象的构造过程，实例化一个对象其实可以分为三个步骤：

1. 分配内存空间

2. 初始化对象

3. 将内存空间地址赋值给对应的引用

但是，由于操作系统可能会**对指令进行重排序**，所以上面的过程也可能会变成：

1. 分配内存空间

2. 将内存空间地址赋值给对应的引用
3. 初始化对象

那么，重排序后多线程环境下就可能将一个未初始化的对象引用暴露出来，从而导致不可预料的结果。因此，为了防止这个过程的重排序，我们需要将变量设置为 `volatile` 类型的变量。



### 实现可见性

可见性问题主要指一个线程修改了共享变量值，而另一个线程却看不到。

引起可见性问题的主要原因是每个线程拥有自己的一个高速缓存区——**线程工作内存**。`volatile` 关键字能有效的解决这个问题，我们看下下面的例子，就可以知道其作用：

```java
public class VolatileTest {
    int a = 1;
    int b = 2;

    public void change() {
        a = 3;
        b = a;
    }

    public void print() {
        System.out.println("b=" + b + ";a=" + a);
    }

    public static void main(String[] args) {
        while (true) {
            final VolatileTest test = new VolatileTest();
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    test.change();
                }
            }).start();
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    test.print();
                }
            }).start();
        }
    }
}
```

直观上说，这段代码的结果只可能有两种：*b=3;a=3* 或 *b=2;a=1*。不过运行上面的代码（可能时间上要长一点），你会发现除了上两种结果之外，还出现了其他结果：

```
...... 
b=2;a=1
b=2;a=1
b=3;a=3
b=3;a=3
b=3;a=1 //第三种结果
...... 
b=3;a=3
b=2;a=1
b=2;a=3 //第四种结果
b=3;a=3
......
```

为什么会出现这种结果呢？正常情况下，如果先执行 `change()` 方法，再执行 `print()` 方法，输出结果应该为 *b=3;a=3*。相反，如果先执行的 `print()` 方法，再执行 `change()` 方法，结果应该是 *b=2;a=1*。那 *b=3;a=1*和 *b=2;a=3* 的结果是怎么出来的？原因就是第一个线程将值 `a=3` 修改后，但是对第二个线程是<u>不可见</u>的，所以才出现这一结果。如果将 a 和 b 都改成 `volatile` 类型的变量再执行，则再也不会出现这种情况了。



## 参考文献

- 
