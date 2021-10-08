# Debug 技巧

> 以下内容基于的环境：Windows10、IntelliJ IDEA 2019.3
>
> 官方文档：[Debug code](https://www.jetbrains.com/help/idea/debugging-code.html)

## 按钮介绍

![image-20211008132848557](/images/software/image-20211008132848557.png)

| 按钮                                                         | 名称                       | 说明                                                         | win快捷键        |
| ------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------ | ---------------- |
| ![image-20211008113026757](/images/software/image-20211008113026757.png) | Show Execution Point       | 跳转到当前执行端点。                                         | Alt + F10        |
| ![image-20211008112923775](/images/software/image-20211008112923775.png) | Step Over                  | 步过，一行一行地往下走。如果这一行上有调用方法，执行时不会进入方法。 | F8               |
| ![image-20211008113141117](/images/software/image-20211008113141117.png) | Step Into                  | 步入，进入代码或者说进入到方法内部。                         | F7               |
| ![image-20211008113156179](/images/software/image-20211008113156179.png) | Force Step Into            | 强制步入，强制进入代码或者说进入到方法内部。能进入任何方法，查看底层源码的时候可以用这个进入官方类库的方法。 | Alt + Shift + F7 |
| ![image-20211008113222794](/images/software/image-20211008113222794.png) | Step Out                   | 步出，跳到下一个断点或者跳出方法。从步入的方法内退出到方法调用处，此时方法已执行完毕，只是还没有完成赋值。 | Shift + F8       |
| ![image-20211008113236857](/images/software/image-20211008113236857.png) | Drop Frame                 | 回退断点。回退到当前方法的调用处。                           |                  |
| ![image-20211008113248420](/images/software/image-20211008113248420.png) | Run to Cursor              | 运行到光标处。你可以将光标定位到你需要查看的那一行，然后使用这个功能，代码会运行至光标行，而不需要打断点。 | Alt + F9         |
| ![image-20211008113312307](/images/software/image-20211008113312307.png) | Evaluate Expression        | 表达式评估。可以改变变量的值，这样有时候就能很方便我们去调试各种值的情况了。 | Alt + F8         |
| ![image-20211008113325993](/images/software/image-20211008113325993.png) | Trace Current Stream Chain | 流式编程调试插件，对 Stream API 的调试。属于IDEA自带的插件。 |                  |
|                                                              |                            |                                                              |                  |
| ![image-20211008155114989](/images/software/image-20211008155114989.png) | Resume Program             | 恢复程序运行，直至下个断点或程序运行结束                     | F9               |
| ![image-20211008131605522](/images/software/image-20211008131605522.png) | View Breakpoints           | 查看断点，展示更多高级设置                                   |                  |
| ![image-20211008131629572](/images/software/image-20211008131629572.png) | Mute Breakpoints           | 置灰所有断点，再次点击，恢复                                 |                  |
| ![image-20211008131700999](/images/software/image-20211008131700999.png) | Get thread dunp            | 获得当前的线程堆栈                                           |                  |

---

其他 debug 快捷键

| win快捷键  | 说明                                                       |
| ---------- | ---------------------------------------------------------- |
| Shift + F7 | 智能步入。断点所在行上有多个方法调用，会弹出进入哪个方法。 |
| Ctrl + Shift + F8          | 指定断点进入条件                                           |



## 条件断点

点击`View Breakpoints`![image-20211008131605522](/images/software/image-20211008131605522.png)按钮可进行设置进入断点的条件，如下图所示

![image-20211008141205676](/images/software/image-20211008141205676.png)

- **标注 1**：`View Breakpoints`，查看断点，展示更多高级设置
- **标注 2**：`Java Line Breakpoints`，展示项目中设置的所有断点
- **标注 3**：`Conditions`，设置条件断点（右键单击断点处也可进行设置）
- **标注 4**：`Remove once hit`，设置击中一次断点后，取消该断点
- **标注 5**：`Pass count `，设置当循环若干次后，进入断点，常用于循环语句



## 多线程调试

可对断点添加条件，如：`currentThread().getName().equals("线程2")` ，这样就能只挂起符合条件的线程

如下面所示，此条件确保调试器仅在当前线程的名称为 **线程2** 时才暂停当前线程

![image-20211008153010240](/images/software/image-20211008153010240.png)



## 远程调试 TODO

> 官方文档：[Remote debug](https://www.jetbrains.com/help/idea/tutorial-remote-debug.html)

### 准备工作

- 明确远程服务器的 IP 地址
- 关掉服务器防火墙：`service iptables stop`



### 本地配置

首先，配置`remote`：



### 服务器 Tomcat 配置



---

如果运行的实例在其它机器（或者虚拟机、docker）上，只要实例设置了以下参数，就可以通过远程调试连接到`8000`端口进行调试。

```
-Xdebug -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=y
```

对于IDEA来说，只需要在**Run** -> **Edit Configuration**里，增加一个**Remote**，设置主机**Host**和端口**Port**，然后调试它即可。


