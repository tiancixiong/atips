# Debug 技巧

> 以下内容基于的环境：Windows10、IntelliJ IDEA 2019.3
>

## 按钮介绍

![image-20211008132848557](/atips/images/software/image-20211008132848557.png)

| 按钮                                                         | 名称                       | 说明                                                         | win快捷键        |
| ------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------ | ---------------- |
| ![image-20211008113026757](/atips/images/software/image-20211008113026757.png) | Show Execution Point       | 跳转到当前执行端点。                                         | Alt + F10        |
| ![image-20211008112923775](/atips/images/software/image-20211008112923775.png) | Step Over                  | 步过，一行一行地往下走。如果这一行上有调用方法，执行时不会进入方法。 | F8               |
| ![image-20211008113141117](/atips/images/software/image-20211008113141117.png) | Step Into                  | 步入，进入代码或者说进入到方法内部。                         | F7               |
| ![image-20211008113156179](/atips/images/software/image-20211008113156179.png) | Force Step Into            | 强制步入，强制进入代码或者说进入到方法内部。能进入任何方法，查看底层源码的时候可以用这个进入官方类库的方法。 | Alt + Shift + F7 |
| ![image-20211008113222794](/atips/images/software/image-20211008113222794.png) | Step Out                   | 步出，跳到下一个断点或者跳出方法。从步入的方法内退出到方法调用处，此时方法已执行完毕，只是还没有完成赋值。 | Shift + F8       |
| ![image-20211008113236857](/atips/images/software/image-20211008113236857.png) | Drop Frame                 | 回退断点。回退到当前方法的调用处。                           |                  |
| ![image-20211008113248420](/atips/images/software/image-20211008113248420.png) | Run to Cursor              | 运行到光标处。你可以将光标定位到你需要查看的那一行，然后使用这个功能，代码会运行至光标行，而不需要打断点。 | Alt + F9         |
| ![image-20211008113312307](/atips/images/software/image-20211008113312307.png) | Evaluate Expression        | 表达式评估。可以改变变量的值，这样有时候就能很方便我们去调试各种值的情况了。 | Alt + F8         |
| ![image-20211008113325993](/atips/images/software/image-20211008113325993.png) | Trace Current Stream Chain | 流式编程调试插件，对 Stream API 的调试。属于IDEA自带的插件。 |                  |
|                                                              |                            |                                                              |                  |
| ![image-20211008155114989](/atips/images/software/image-20211008155114989.png) | Resume Program             | 恢复程序运行，直至下个断点或程序运行结束                     | F9               |
| ![image-20211008131605522](/atips/images/software/image-20211008131605522.png) | View Breakpoints           | 查看断点，展示更多高级设置                                   |                  |
| ![image-20211008131629572](/atips/images/software/image-20211008131629572.png) | Mute Breakpoints           | 置灰所有断点，再次点击，恢复                                 |                  |
| ![image-20211008131700999](/atips/images/software/image-20211008131700999.png) | Get thread dunp            | 获得当前的线程堆栈                                           |                  |

---

其他 debug 快捷键

| win快捷键  | 说明                                                       |
| ---------- | ---------------------------------------------------------- |
| Shift + F7 | 智能步入。断点所在行上有多个方法调用，会弹出进入哪个方法。 |
| Ctrl + Shift + F8          | 指定断点进入条件                                           |



## 断点类型

断点有四种类型：

1. 行断点（Line Breakpoints）：最经常用的方式， 可以设置在任何可执行的代码行上 
2. 方法断点（Method Breakpoints）： 在进入或退出指定的方法或其实现之一时挂起程序，允许您检查方法的进入/退出条件
3. 字段断点（Field Watchpoints）： 当指定的字段被读取或写入时，挂起程序。需要注意的是，默认只有写才会停下，想要让读取时也停下，需要右击断点，在**Watch**的**Field access**上打勾才行
4. 异常断点（Exception Breakpoints）： 当抛出Throwable或其子类时挂起程序 。可以在 **Run — View Breakpoints** 中的 Java Exception Breakpoints 里添加异常的具体类型。这样的话，程序中一旦发生了这种异常马上就会停下来

---

断点图标的[类型](https://www.jetbrains.com/help/idea/using-breakpoints.html#breakpoint-types)和[状态](https://www.jetbrains.com/help/idea/using-breakpoints.html#breakpoint-statuses)：

![img](/atips/images/software/image-20211014210420999.png)



### 字段断点

在 IDEA 中为某个字段添加断点，当字段值有修改时，可以自动跳到相应方法位置。

在字段定义地方 鼠标左键 添加断点（会出现「眼睛」的图标），在眼睛」图标上鼠标右键，然后在弹框中勾选上 `Field access` 和 `Field modification` 两个选项。

![image-20211014203737311](/atips/images/software/image-20211014203737311.png)

- **Condition**：定义断点进入条件
- **Field access**：字段被 `read` 时进行断点
- **Field modification**：字段被 `writte` 时进行断点





## 条件断点

点击 `View Breakpoints` ![image-20211008131605522](/atips/images/software/image-20211008131605522.png)按钮可进行设置进入断点的条件，如下图所示

![image-20211008141205676](/atips/images/software/image-20211008141205676.png)

- **标注 1**：`View Breakpoints`，查看断点，展示更多高级设置
- **标注 2**：`Java Line Breakpoints`，展示项目中设置的所有断点
- **标注 3**：`Conditions`，设置条件断点（右键单击断点处也可进行设置）
- **标注 4**：`Remove once hit`，临时断点，就是只断一次，一次之后断点就自动消失了，不用手动取消
- **标注 5**：`Pass count `，设置当循环若干次后，进入断点，常用于循环语句



## 多线程调试

可对断点添加条件，如：`currentThread().getName().equals("线程2")` ，这样就能只挂起符合条件的线程

如下面所示，此条件确保调试器仅在当前线程的名称为 **线程2** 时才暂停当前线程

![image-20211008153010240](/atips/images/software/image-20211008153010240.png)



## 断点处添加 log

在调试代码时希望打印一些内容。通过代码 `print` 的方式在调试完后还需要删除掉，防止提交到线上。

IDEA 提供  `Evaluate and Log at Breakpoints`  功能可以帮助我们解决这个问题。

在正常加断点的地方使用 `Shift + 鼠标左键` 添加外观是黄色的断点，并弹出选项。

![image-20211014201735696](/atips/images/software/image-20211014201735696.png)

勾选上 `Evaluate and log`，输入想查看的 log/变量，以 *Debug* 模式运行程序（正常模式运行，不会打印这些 log）。

其他选项：

- **"Breakpoint hit" message**：在断点触发了会打印一条日志消息，如 `Breakpoint reached at ocean.Whale.main(Whale.java:5)`；
- **Stack trace**：堆栈跟踪，会同时打印队栈信息；
- **Evaluate and log**：计算表达式，将结果输出到控制台。这个表达式不仅可以是一般变量或参数，也可以是方法，当你的一行代码中调用了几个方法时，就可以通过这种方式查看查看某个方法的返回值。





## 远程调试

> 官方文档：[Remote debug](https://www.jetbrains.com/help/idea/tutorial-remote-debug.html)

### 准备工作

- 明确远程服务器的 IP 地址。这里演示使用`localhost`
- 关掉服务器防火墙：`service iptables stop`。演示使用的是window环境，通过 控制面板->防火墙 关闭。

创建演示项目`test_2110`，编写一个返回String类型的get请求

1、使用idea进行创建后，在 `pom.xml` 中引入springboot有关依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

构建工具：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

打包方式选择jar

```xml
<groupId>com.example</groupId>
<artifactId>test_2110</artifactId>
<version>0.0.1-SNAPSHOT</version>
<name>test_2110</name>
<description>练习IDEA远程debug功能</description>
<packaging>jar</packaging>
```

在 `application.yml` 中配置服务端口：

```yml
server:
  port: 8099
```

2、启动类

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

3、在Controller中编写一个get接口

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloController {
    @GetMapping("/getTitle")
    public String getStr(String str) {
        System.out.println("str = " + str);
        return "Hello, " + str;
    }
}
```

4、使用maven打包，在项目目录的 `target` 目录中生成 jar 包



### 本地配置

IDEA中设置远程调试，点击 `Edit Configurations` 进入 `Run/Debug Configuration` 界面

![image-20211009141011294](/atips/images/software/image-20211009141011294.png)

然后点击左上角的 `+` ，选择 `Remote` 后在右侧设置属性：

![image-20211009133025343](/atips/images/software/image-20211009133025343.png)

- **标注 1**：调试模式，默认为`Attach`
  - `Attach`：调试服务端（被调试远程运行的机器）启动一个端口等待我们（调试客户端）去连接
  - `Listen`：我们（调试客户端）去监听一个端口，当调试服务端准备好了，就会进行连接
  
- **标注 2**：传输方式，默认为`Socket`
  
  - `Socket`：macOS 及 Linux 系统使用此种传输方式
  - `Shared memory`： Windows 系统使用此种传输方式
  
- **标注 3**：服务器 IP 地址，默认为`localhost`，需要修改为目标服务器的真实 IP 地址

- **标注 4**：服务器端口号，默认为`5005`，需要修改为目标服务器的真实端口号

- **标注 5**：运行远程 JVM 的命令行参数

  - ```md
    -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
    ```

  - ```md
    -agentlib:jdwp=transport=dt_shmem,server=y,suspend=n,address=...
    ```




### 服务器配置

#### 1.对于 SpringBoot

由于笔者演示的服务器是本地的windows，而在上述参数中 **标注 2** 选择默认的 `Socket` 方式。这里就需要用 **Git Bath** 进行启动：

```shell
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar test_2110-0.0.1-SNAPSHOT.jar
```

---

由于 **标注 2** 选择默认的 `Socket` 方式，在windows中如果使用黑窗口启动就会一直报错：`ERROR: transport error 202: gethostbyname: unknown host`

![image-20211014101455014](/atips/images/software/image-20211014101455014.png)



#### 2.对于 Tomcat

命令行参数，然后导入到 Tomcat 的配置文件（Linux路径：`tomcat/bin/catalina.sh`，Windows路径：`catalina.bat`）中。

在该配置文件的最上面，添加我们刚刚复制的那句话

- Linux：`export JAVA_OPTS='-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005'`

- Windows：`set JAVA_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=...`



### 开始调试

服务器启动好后，启动本地 Remote Server

![image-20211009160827580](/atips/images/software/image-20211009160827580.png)

如果连接成功，则会出现如下提示：

![image-20211009161153071](/atips/images/software/image-20211009161153071.png)

---

前提是本机得有项目的源码 ，在需要的地方打个断点，然后访问一个**远程的url**，断点就会停下来。



## 参考资料

- 官方文档：[Debug code](https://www.jetbrains.com/help/idea/debugging-code.html)
- [IDEA的Debug技巧](https://www.cnblogs.com/csh24/p/14724135.html) - 博客园
- [在Intellij IDEA中使用Debug](https://www.cnblogs.com/chiangchou/p/idea-debug.html) - 博客园
- [Intellij IDEA 调试魔法](https://segmentfault.com/a/1190000040017745) - 公众号

