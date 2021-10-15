# 调试排错 - Arthas使用

## Arthas简介

### Arthas是什么

Arthas 是 Alibaba 开源的 Java 诊断工具。支持 JDK6+， 采用命令行交互模式，提供 Tab 自动补全，可以方便定位和诊断线上程序的运行问题。



## Arthas入门

### Arthas安装

下载 `arthas-boot.jar`，然后用 `java -jar` 的方式启动：

```shell
curl -O https://arthas.aliyun.com/arthas-boot.jar
java -jar arthas-boot.jar
```



### Arthas能解决什么问题

使用 Arthas 可以帮助你解决：

- 可以很方便查到一类是从哪个 jar 包加载的？为什么会报各种类相关的 Exception？
- 怀疑自己的代码未被部署到服务器，可以通过命令快速验证服务器上的代码就是本地的代码；
- 可以直接通过 arthas 进行线上 debug，查看方法返回值以确认问题所在；
- 可以很方便嵌入自己的 debug 代码，快速验证猜想；
- 操作完成后，可以将所有 debug 代码删除，从而避免影响线上运行；



### 常用命令

#### dashboard

[dashboard](https://arthas.aliyun.com/doc/dashboard.html#dashboard) 命令可以查看当前系统的实时数据面板。

![dashboard](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/java/jvm/java-jvm-agent-arthas-dashboard.png)

面板中 **Thread** 各数据说明：

| 名称        | 说明                                                         |
| :---------- | :----------------------------------------------------------- |
| ID          | Java级别的线程ID，注意这个ID不能跟 jstack 中的 nativeID 一一对应 |
| NAME        | 线程名                                                       |
| GROUP       | 线程组名                                                     |
| PRIORITY    | 线程优先级, 1~10之间的数字，越大表示优先级越高               |
| STATE       | 线程的状态                                                   |
| CPU%        | 线程的cpu使用率。比如采样间隔1000ms，某个线程的增量cpu时间为100ms，则cpu使用率=100/1000=10% |
| DELTA_TIME  | 上次采样之后线程运行增量CPU时间，数据格式为`秒`              |
| TIME        | 线程运行总CPU时间，数据格式为`分:秒`                         |
| INTERRUPTED | 线程当前的中断位状态                                         |
| DAEMON      | 是否是daemon线程                                             |



JVM内部线程包括下面几种：

- JIT编译线程: 如 C1 CompilerThread0、 C2 CompilerThread0
- GC线程: 如 GC Thread0、 G1 Young RemSet Sampling
- 其它内部线程: 如 VM Periodic Task Thread,、VM Thread、 Service Thread



#### thread

[thread](https://arthas.aliyun.com/doc/thread.html#thread) 命令可以查看当前 JVM 的线程堆栈信息。一目了然的了解系统的状态，哪些线程比较占cpu，他们到底在做什么。

`thread` 参数列表：

| 参数名称 | 参数说明                              |
| :------- | :------------------------------------ |
| id       | 线程id                                |
| -n       | 指定最忙的前N个线程并打印堆栈         |
| [b]      | 找出当前阻塞其他线程的线程            |
| [i ]     | 指定cpu占比统计的采样间隔，单位为毫秒 |
| [--all]  | 显示所有匹配的线程                    |

例如：`thread -n 3` 展示当前最忙的前3个线程并打印堆栈



#### classloader

[classloader](https://arthas.aliyun.com/doc/classloader.html#classloader) 命令将 JVM 中所有的 classloader 的信息统计出来，并可以展示继承树，urls 等。了解当前系统中有多少类加载器，以及每个加载器加载的类数量，帮助您判断是否有类加载器泄露。





#### jad

[jad](https://arthas.aliyun.com/doc/jad.html#jad) 命令可以对类进行反编译。将 JVM 中实际运行的 class 的 byte code 反编译成 java 代码，便于你理解业务逻辑。

参数列表：

| 参数名称              | 参数说明                                   |
| :-------------------- | ------------------------------------------ |
| *class-pattern*       | 类名表达式匹配                             |
| `[c:]`                | 类所属 ClassLoader 的 hashcode             |
| `[classLoaderClass:]` | 指定执行表达式的 ClassLoader 的 class name |
| [E]                   | 开启正则表达式匹配，默认为通配符匹配       |

例如：`jad java.lang.String toString`



#### monitor

[monitor](https://arthas.aliyun.com/doc/monitor.html#monitor) 监控某个特殊方法的调用统计数据，包括总调用次数，平均 rt，成功率等信息，每隔5秒输出一次。



#### watch

[watch](https://arthas.aliyun.com/doc/watch.html#watch) 命令用于方法执行数据观测。可以观察指定方法的调用情况。能观察到的范围为：**返回值**、**抛出异常**、**入参**，通过编写 OGNL 表达式进行对应变量的查看。

参数列表：

| 参数名称            | 参数说明                                                     |
| :------------------ | :----------------------------------------------------------- |
| *class-pattern*     | 类名表达式匹配                                               |
| *method-pattern*    | 方法名表达式匹配                                             |
| *express*           | 观察表达式，主要由 ognl 表达式组成，默认值：`{params, target, returnObj}` |
| *condition-express* | 条件表达式                                                   |
| [b]                 | 在**方法调用之前**观察                                       |
| [e]                 | 在**方法异常之后**观察                                       |
| [s]                 | 在**方法返回之后**观察                                       |
| [f]                 | 在**方法结束之后**(正常返回和异常返回)观察                   |
| [E]                 | 开启正则表达式匹配，默认为通配符匹配                         |
| [x:]                | 指定输出结果的属性遍历深度，默认为 1                         |

例子：`watch demo.MathGame primeFactors "{params,throwExp}" -e` 观察方法 `demo.MathGame#primeFactors` 执行的入参，仅当方法抛出异常时才输出



#### tt

[tt](https://arthas.aliyun.com/doc/tt.html#tt) 命令是 Time Tunnel 缩写，方法执行数据的时空隧道，可以录下指定方法每次调用的入参和返回信息，并能对这些不同的时间下调用进行观测。



#### 退出arthas

如果只是退出当前的连接，可以用 `quit` 或者 `exit` 命令。Attach 到目标进程上的 arthas 还会继续运行，端口会保持开放，下次连接时可以直接连接上。

如果想完全退出 arthas，可以执行 `stop` 命令。



#### 更多命令

- [命令列表](https://arthas.aliyun.com/doc/commands.html)



## 实际场景

> [博客园 - yougewe](https://www.cnblogs.com/yougewe/p/10770690.html)

### 查看最繁忙的线程，以及是否有阻塞情况发生?

```shell
thread -n 3 # 查看最繁忙的三个线程栈信息
thread  # 以直观的方式展现所有的线程情况
thread -b #找出当前阻塞其他线程的线程
```



## 文档资料

- 官方文档：[Arthas 用户文档](https://arthas.aliyun.com/doc/)
- 开源地址：[Arthas - Github](https://github.com/alibaba/arthas)

