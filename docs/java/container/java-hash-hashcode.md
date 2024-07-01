# HashCode

## HashCode 为什么使用 31 作为乘数？

看一个问题：[Why does Java's hashCode() in String use 31 as a multiplier?](https://stackoverflow.com/questions/299304/)

这个问题就是说为什么在 Java 中计算哈希码的逻辑中，是选择 31 作为乘数。

先看下 *String* 类中源码

```java{8}
// java.lang.String
public int hashCode() {
    int h = hash;
    if (h == 0 && value.length > 0) {
        char val[] = value;

        for (int i = 0; i < value.length; i++) {
            h = 31 * h + val[i];
        }
        hash = h;
    }
    return h;
}
```

上面第 8 行代码中写死了是固定值 31；我们再看下[官方文档](https://docs.oracle.com/javase/8/docs/api/index.html)中的解释：

![image-20211023200104454](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/java/container/image-20211023200104454.png)

官方给出的计算哈希值公司是：`s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]`；`s[i]` 是字符串第 `i` 字符；`n` 是字符串长度。

---

在上面的 [stackoverflow问题](https://stackoverflow.com/questions/299304/) 下方的回答：

1. 31 是一个奇质数，如果选择偶数会导致乘积运算时数据溢出。 
2. 另外在二进制中，2 个 5 次方是 32，那么也就是 `31 * i == (i << 5) - i`。这主要是说乘积运算可以使用位移提升性能，同时目前的 JVM 虚拟机也会自动支持此类的优化。



### 案例

TODO



## 参考资料

- 《Java 面经手册》- 小傅哥



