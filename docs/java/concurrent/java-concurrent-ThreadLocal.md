# Java 并发 - ThreadLocal

***ThreadLocal*** 是一个存储线程本地副本的工具类。

要保证线程安全，不一定非要进行同步。同步只是保证共享数据争用时的正确性，如果一个方法本来就不涉及共享数据，那么自然无须同步。

Java 中的 **无同步方案** 有：

- **可重入代码** - 也叫纯代码。如果一个方法，它的 **返回结果是可以预测的**，即只要输入了相同的数据，就能返回相同的结果，那它就满足可重入性，当然也是线程安全的。
- **线程本地存储** - 使用 ***ThreadLocal* 为共享变量在每个线程中都创建了一个本地副本**，这个副本只能被当前线程访问，其他线程无法访问，那么自然是线程安全的。



ThreadLocal 的主要**特点**是：

- 为每个使用该变量的线程提供独立的变量副本
- 每个线程只能访问和修改自己的副本，不会影响其他线程的副本
- 实现了线程间的数据隔离



**使用示例**

```java
public class ThreadLocalExample {
    private static ThreadLocal<Integer> threadLocal = ThreadLocal.withInitial(() -> 0);
    
    public static void main(String[] args) {
        Runnable task = () -> {
            int value = threadLocal.get();
            threadLocal.set(value + 1);
            System.out.println(Thread.currentThread().getName() + ": " + threadLocal.get());
        };
        
        Thread t1 = new Thread(task, "Thread-1");
        Thread t2 = new Thread(task, "Thread-2");
        
        t1.start();
        t2.start();
    }
}
```



**最佳实践**

1. 尽量使用 `private static final` 修饰 ThreadLocal 变量
2. 使用完毕后必须调用 remove() 清理
3. 考虑使用 InheritableThreadLocal 实现父子线程间的值传递
4. 避免存储大对象，防止内存泄漏



## 实现原理

ThreadLocal 的实现依赖于 Thread 类中的 threadLocals 变量，这是一个 ThreadLocalMap 类型的变量：

```java
public class Thread implements Runnable {
    ThreadLocal.ThreadLocalMap threadLocals = null;
    // ...
}
```

每个 Thread 对象内部都维护了一个 ThreadLocalMap，ThreadLocalMap 是一个定制化的 HashMap，这个 Map 以 ThreadLocal 实例作为 key，以线程的变量副本作为 value。



### 主要方法

1. **get()**：获取当前线程的变量副本

   ```java
   public T get() {
       Thread t = Thread.currentThread();
       ThreadLocalMap map = getMap(t);
       if (map != null) {
           ThreadLocalMap.Entry e = map.getEntry(this);
           if (e != null) {
               @SuppressWarnings("unchecked")
               T result = (T)e.value;
               return result;
           }
       }
       return setInitialValue();
   }
   ```

2. **set()**：设置当前线程的变量副本

   ```java
   public void set(T value) {
       Thread t = Thread.currentThread();
       ThreadLocalMap map = getMap(t);
       if (map != null) {
           map.set(this, value);
       } else {
           createMap(t, value);
       }
   }
   ```

3. `remove()`：移除当前线程的变量副本

   ```java
   public void remove() {
       ThreadLocalMap m = getMap(Thread.currentThread());
       if (m != null)
           m.remove(this);
   }
   ```



### ThreadLocalMap的特殊设计

ThreadLocal 存储结构的真实 key-value 关系如下：

```
Thread (线程)
└── ThreadLocalMap (线程私有Map)
    ├── Entry1: key=ThreadLocal实例1, value=值1
    ├── Entry2: key=ThreadLocal实例2, value=值2
    └── ...
```

关键点：

- 真实key：ThreadLocal对象实例本身（即代码中创建的ThreadLocal变量）
- value：通过 set() 方法设置的值
- 存储位置：每个线程独有的 ThreadLocalMap 中



ThreadLocal 的内部实现类 ThreadLocalMap 有一些特殊设计：

1、**弱引用key**：

```java
static class Entry extends WeakReference<ThreadLocal<?>> {
    Object value;
    Entry(ThreadLocal<?> k, Object v) {
        super(k);  // key是弱引用
        value = v;
    }
}
```

- `Entry extends WeakReference<ThreadLocal<?>>`明确使用了弱引用
- `super(k)`调用将key作为弱引用保存
- 各种方法中都有对`k == null`的判断处理

**设计特点**

1. **Key是弱引用**：Entry继承了WeakReference，并将ThreadLocal对象(k)作为弱引用存储。这意味着当没有其他强引用指向ThreadLocal对象时，它会被垃圾回收。
2. **Value是强引用**：value字段直接存储对象的强引用。

在 `ThreadLocalMap` 的 `set` 方法中的处理：

```java
private void set(ThreadLocal<?> key, Object value) {
    Entry[] tab = table;
    int len = tab.length;
    int i = key.threadLocalHashCode & (len-1);

    for (Entry e = tab[i]; e != null; e = tab[i = nextIndex(i, len)]) {
        ThreadLocal<?> k = e.get();  // 这里获取弱引用的实际对象
        
        if (k == key) {  // 如果引用尚未被回收
            e.value = value;
            return;
        }
        
        if (k == null) {  // 关键点：如果ThreadLocal已被回收(k为null)
            replaceStaleEntry(key, value, i);  // 处理key被GC的情况
            return;
        }
    }
    // ...
}
```



---

2、**惰性清理机制**

ThreadLocalMap 采用三种清理策略组合：

2.1 探测式清理（expungeStaleEntry）

```java
private int expungeStaleEntry(int staleSlot) {
    Entry[] tab = table;
    int len = tab.length;

    // 清理当前staleSlot
    tab[staleSlot].value = null;
    tab[staleSlot] = null;
    size--;

    // 向后探测继续清理
    Entry e;
    int i;
    for (i = nextIndex(staleSlot, len); (e = tab[i]) != null; i = nextIndex(i, len)) {
        ThreadLocal<?> k = e.get();
        if (k == null) {  // 发现其他失效条目
            e.value = null;
            tab[i] = null;
            size--;
        } else {
            // rehash逻辑
            int h = k.threadLocalHashCode & (len - 1);
            if (h != i) {
                tab[i] = null;
                while (tab[h] != null)
                    h = nextIndex(h, len);
                tab[h] = e;
            }
        }
    }
    return i;
}
```

特点：

- 线性探测清理连续段
- 同时重组有效条目
- 每次set/get触发局部清理



2.2 启发式清理（cleanSomeSlots）

```java
private boolean cleanSomeSlots(int i, int n) {
    boolean removed = false;
    Entry[] tab = table;
    int len = tab.length;
    do {
        i = nextIndex(i, len);
        Entry e = tab[i];
        if (e != null && e.get() == null) {
            n = len;
            removed = true;
            i = expungeStaleEntry(i);
        }
    } while ( (n >>>= 1) != 0);
    return removed;
}
```

特点：

- 对数复杂度扫描（O(log n)）
- 在插入操作时触发
- 平衡清理开销与效果



2.3 全量清理（rehash）

```java
private void rehash() {
    expungeStaleEntries();
    
    // 扩容逻辑（阈值2/3）
    if (size >= threshold - threshold / 4)
        resize();
}

private void expungeStaleEntries() {
    Entry[] tab = table;
    int len = tab.length;
    for (int j = 0; j < len; j++) {
        Entry e = tab[j];
        if (e != null && e.get() == null)
            expungeStaleEntry(j);
    }
}
```

特点：

- 扩容前强制执行
- 遍历整个表清理
- 相对耗时的操作



---

3、**哈希算法设计**

ThreadLocal 使用特殊的哈希算法：

```java
private final int threadLocalHashCode = nextHashCode();

private static AtomicInteger nextHashCode = new AtomicInteger();

private static final int HASH_INCREMENT = 0x61c88647;

private static int nextHashCode() {
    return nextHashCode.getAndAdd(HASH_INCREMENT);
}
```

关键点：

- **斐波那契散列**：HASH_INCREMENT = 0x61c88647（黄金分割数相关）
- **原子递增**：保证不同ThreadLocal的hashCode分布均匀
- **避免冲突**：配合开放寻址法减少聚集现象



---

4、**扩容机制**

扩容逻辑在resize()方法中：

```java
private void resize() {
    Entry[] oldTab = table;
    int oldLen = oldTab.length;
    int newLen = oldLen * 2;
    Entry[] newTab = new Entry[newLen];
    int count = 0;
    
    for (Entry e : oldTab) {
        if (e != null) {
            ThreadLocal<?> k = e.get();
            if (k == null) {
                e.value = null; // 清理旧值
            } else {
                // 重新哈希
                int h = k.threadLocalHashCode & (newLen - 1);
                while (newTab[h] != null)
                    h = nextIndex(h, newLen);
                newTab[h] = e;
                count++;
            }
        }
    }
    
    setThreshold(newLen);
    size = count;
    table = newTab;
}
```

特点：

- 容量翻倍
- 扩容时执行全量清理
- 重组所有有效条目
- 新阈值 = 新长度 * 2 / 3



---

与常规Map的对比

| 特性         | ThreadLocalMap         | HashMap       |
| :----------- | :--------------------- | :------------ |
| 哈希冲突解决 | 开放寻址法（线性探测） | 链表+红黑树   |
| 键引用类型   | 弱引用                 | 强引用        |
| 清理机制     | 惰性三阶段清理         | 无特殊清理    |
| 扩容触发条件 | 2/3容量                | 0.75容量      |
| 哈希算法     | 斐波那契散列           | 扰动函数+取模 |
| 迭代器       | 不支持                 | 支持          |
| 线程安全     | 单线程访问             | 非线程安全    |



## 典型使用场景

### 场景1：数据库连接管理

```java
public class ConnectionManager {
    private static ThreadLocal<Connection> connectionHolder = 
        ThreadLocal.withInitial(() -> {
            try {
                return DriverManager.getConnection(DB_URL);
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        });
    
    public static Connection getConnection() {
        return connectionHolder.get();
    }
    
    public static void setConnection(Connection conn) {
        connectionHolder.set(conn);
    }
    
    public static void removeConnection() {
        connectionHolder.remove();
    }
}
```

每个线程从连接池获取连接后，使用ThreadLocal存储，确保该线程在整个操作过程中使用的是同一个连接，避免了频繁获取和释放连接的开销。



### 场景2：用户会话信息管理

```java
public class UserContext {
    private static ThreadLocal<User> currentUser = new ThreadLocal<>();
    
    public static void setCurrentUser(User user) {
        currentUser.set(user);
    }
    
    public static User getCurrentUser() {
        return currentUser.get();
    }
    
    public static void clear() {
        currentUser.remove();
    }
}

// 在拦截器或过滤器中
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        User user = getUserFromRequest(request);
        UserContext.setCurrentUser(user);
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        UserContext.clear(); // 防止内存泄漏
    }
}
```

在Web应用中，使用ThreadLocal存储当前登录用户信息，可以在任何地方通过UserContext获取，避免了在方法参数中层层传递用户信息。



### 场景3：日期格式化

```java
public class DateUtils {
    // SimpleDateFormat不是线程安全的
    private static ThreadLocal<SimpleDateFormat> dateFormatHolder = 
        ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
    
    public static String format(Date date) {
        return dateFormatHolder.get().format(date);
    }
}
```

SimpleDateFormat不是线程安全的，使用ThreadLocal为每个线程提供独立的实例，既保证了线程安全又避免了频繁创建对象的开销。



### 场景4：分页参数管理

```java
public class PageContext {
    private static ThreadLocal<PageInfo> pageInfoHolder = new ThreadLocal<>();
    
    public static void setPageInfo(int pageNum, int pageSize) {
        pageInfoHolder.set(new PageInfo(pageNum, pageSize));
    }
    
    public static PageInfo getPageInfo() {
        return pageInfoHolder.get();
    }
    
    public static void clear() {
        pageInfoHolder.remove();
    }
}

// 在Controller中
@GetMapping("/users")
public List<User> getUsers(@RequestParam(defaultValue = "1") int page, 
                          @RequestParam(defaultValue = "10") int size) {
    PageContext.setPageInfo(page, size);
    return userService.getUsers();
}

// 在Service中
public List<User> getUsers() {
    PageInfo pageInfo = PageContext.getPageInfo();
    // 使用分页参数查询
}
```

将分页参数存储在ThreadLocal中，避免了在方法调用链中层层传递分页参数。



## 内存泄漏问题

ThreadLocal 可能引起内存泄漏，原因在于：

1. ThreadLocalMap 的 key 是弱引用（WeakReference），但 value 是强引用
2. 当 ThreadLocal 外部强引用被回收后，key 会被 GC 回收，但 value 仍然存在
3. 如果线程长时间运行(如线程池中的线程)，会导致 value 无法被回收



### 内存泄漏场景示例

**内存泄漏场景：**

```java
ExecutorService pool = Executors.newFixedThreadPool(1);
ThreadLocal<byte[]> tl = new ThreadLocal<>();

pool.execute(() -> {
    tl.set(new byte[1024 * 1024]); // 1MB
    // 忘记调用tl.remove()
});

tl = null; // 强引用解除
// 线程池线程存活，value永远无法回收
```



展示 ThreadLocal 的内存管理机制和潜在的内存泄漏问题：

```java
import java.lang.ref.Reference;
import java.lang.ref.WeakReference;
import java.lang.reflect.Method;

public class ThreadLocalWeakRefTest {
    public static void main(String[] args) throws InterruptedException {
        // 1. 测试ThreadLocal的Entry key(弱引用)被回收情况
        testThreadLocalWeakRef();
        
        // 2. 对比普通WeakReference的行为
        testStandardWeakRef();
    }

    private static void testThreadLocalWeakRef() throws InterruptedException {
        System.out.println("===== ThreadLocal弱引用测试 =====");
        
        ThreadLocal<Object> tl = new ThreadLocal<>();
        Object value = new Object();
        
        // 保存value的弱引用用于后续验证
        WeakReference<Object> valueWeakRef = new WeakReference<>(value);
        
        tl.set(value);
        
        // 第一次GC - tl强引用仍然存在
        System.gc();
        Thread.sleep(500); // 给GC一点时间
        
        System.out.println("[tl强引用存在时]");
        System.out.println("ThreadLocal value: " + (tl.get() != null)); // true
        System.out.println("value对象存活: " + (valueWeakRef.get() != null)); // true
        
        // 解除ThreadLocal的强引用
        tl = null;
        
        // 第二次GC - tl只有Entry中的弱引用
        System.gc();
        Thread.sleep(500);
        
        // 获取当前线程的ThreadLocalMap查看Entry状态
        Thread currentThread = Thread.currentThread();
        java.lang.reflect.Field threadLocalsField;
        try {
            threadLocalsField = Thread.class.getDeclaredField("threadLocals");
            threadLocalsField.setAccessible(true);
            Object threadLocalMap = threadLocalsField.get(currentThread);
            
            if (threadLocalMap != null) {
                java.lang.reflect.Field tableField = threadLocalMap.getClass().getDeclaredField("table");
                tableField.setAccessible(true);
                Object[] table = (Object[]) tableField.get(threadLocalMap);
                
                System.out.println("\n[解除tl强引用后]");
                System.out.println("ThreadLocalMap中Entry数量: " + table.length);
                
                boolean foundStaleEntry = false;
                for (Object entry : table) {
                    if (entry != null) {
                        // 获取Entry的referent(即key/ThreadLocal对象)
                        Method getMethod = Reference.class.getDeclaredMethod("get");
                        getMethod.setAccessible(true);
                        Object referent = getMethod.invoke(entry);
                        
                        // 获取Entry的value
                        java.lang.reflect.Field valueField = entry.getClass().getDeclaredField("value");
                        valueField.setAccessible(true);
                        Object entryValue = valueField.get(entry);
                        
                        if (referent == null) {
                            foundStaleEntry = true;
                            System.out.println("发现key被回收的Entry, value: " + entryValue);
                            System.out.println("value对象存活: " + (valueWeakRef.get() != null)); // true - 内存泄漏!
                        }
                    }
                }
                
                if (!foundStaleEntry) {
                    System.out.println("未找到key被回收的Entry");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // 3. 调用remove清理
        // 由于我们已失去tl引用，无法直接调用remove
        // 这模拟了实际开发中忘记调用remove的情况
        System.out.println("\n由于失去ThreadLocal引用，无法调用remove()");
        System.out.println("value对象仍然存活: " + (valueWeakRef.get() != null));
        
        // 4. 模拟ThreadLocal的自我清理机制
        System.out.println("\n模拟ThreadLocal的set/get触发清理...");
        // 新建一个ThreadLocal触发清理
        ThreadLocal<Object> newTl = new ThreadLocal<>();
        newTl.set(new Object()); // 这会触发清理逻辑
        newTl.get(); // 也会触发清理
        
        // 再次检查value
        System.out.println("value对象存活: " + (valueWeakRef.get() != null)); // 可能已被清理
    }

    private static void testStandardWeakRef() throws InterruptedException {
        System.out.println("\n===== 标准WeakReference测试 =====");
        
        Object obj = new Object();
        WeakReference<Object> weakRef = new WeakReference<>(obj);
        
        System.out.println("强引用存在时: " + (weakRef.get() != null)); // true
        
        // 第一次GC - 强引用仍然存在
        System.gc();
        Thread.sleep(500);
        System.out.println("强引用存在时GC后: " + (weakRef.get() != null)); // true
        
        // 解除强引用
        obj = null;
        
        // 第二次GC - 只有弱引用
        System.gc();
        Thread.sleep(500);
        System.out.println("解除强引用后GC: " + (weakRef.get() != null)); // false
    }
}
```

**关键点说明**：

1. ThreadLocal内存泄漏演示：
   - 当ThreadLocal强引用被置为null后，Entry中的key(弱引用)会被回收
   - 但value仍然保持强引用，导致内存泄漏
   - 通过反射查看ThreadLocalMap内部状态验证这一点
2. 与标准WeakReference对比：
   - 标准WeakReference在强引用消失后，对象会被回收
   - ThreadLocal的Entry设计特殊，只有key是弱引用，value不是
3. ThreadLocal的自我清理：
   - 当调用ThreadLocal的set/get时，会清理key为null的Entry
   - 示例中通过新建ThreadLocal并操作来触发这个机制

**运行结果**：

```
===== ThreadLocal弱引用测试 =====
[tl强引用存在时]
ThreadLocal value: true
value对象存活: true

[解除tl强引用后]
ThreadLocalMap中Entry数量: 16
发现key被回收的Entry, value: java.lang.Object@330bedb4
value对象存活: true

由于失去ThreadLocal引用，无法调用remove()
value对象仍然存活: true

模拟ThreadLocal的set/get触发清理...
value对象存活: true

===== 标准WeakReference测试 =====
强引用存在时: true
强引用存在时GC后: true
解除强引用后GC: false
```

- ThreadLocal弱引用测试
  - `[tl强引用存在时]` 阶段：
    - `ThreadLocal value: true`（正常）
    - `value对象存活: true`（正常）
  - `[解除tl强引用后]` 阶段：
    - 发现了key被回收的Entry（`java.lang.Object@330bedb4`）
    - 但`value对象存活: true` → 确认value未被回收
    - 这正是ThreadLocal内存泄漏的典型表现
  - 模拟set/get清理后value仍然存活
- 标准WeakReference测试，完全符合预期
  - 强引用存在时对象存活
  - 解除强引用后GC，对象被回收



#### 问题分析

1. **为什么ThreadLocal的value没有被自动清理？**
   - ThreadLocalMap的清理是"惰性清理"，只有以下操作会触发：
     - 调用set()时遇到key为null的Entry
     - 调用get()时遇到key为null的Entry
     - 调用remove()时
   - 测试中虽然模拟了set/get，但可能：
     - 没有触发再哈希过程
     - 没有扫描到那个特定的Entry
2. **内存泄漏的严重程度**：
   - 如果线程是线程池的工作线程（长期存活）
   - 泄漏的value会一直存在，直到：
     - 线程死亡
     - 恰好有set/get操作触发了清理
     - 手动调用remove()



### 解决方案

1、**必须遵循的使用规范**：

```java
try {
    // 使用ThreadLocal
    threadLocal.set(someValue);
    // ...
} finally {
    threadLocal.remove(); // 必须手动清理
}
```

查看`remove()`方法的实现：

```java
private void remove(ThreadLocal<?> key) {
    Entry[] tab = table;
    int len = tab.length;
    int i = key.threadLocalHashCode & (len-1);
    for (Entry e = tab[i]; e != null; e = tab[i = nextIndex(i, len)]) {
        if (e.get() == key) {
            e.clear();  // 清除WeakReference
            expungeStaleEntry(i);  // 清除整个Entry
            return;
        }
    }
}
```

其中`expungeStaleEntry()`会清理key为null的Entry，释放value的内存。



2、**对于线程池场景的特别处理**：

```java
ExecutorService pool = Executors.newCachedThreadPool();
pool.execute(() -> {
    try {
        threadLocal.set(value);
        // ...任务代码...
    } finally {
        threadLocal.remove(); // 必须清理
    }
});
```

