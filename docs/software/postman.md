# Postman

> 官方文档：[Postman](https://learning.postman.com/docs/getting-started/introduction/)

::: tip
以下文档基于 Postman 7.36.5_win_x64 整理
:::




## 环境变量

在一个项目的生命周期中，可能会有开发环境、测试环境、预上线环境、线上环境等众多的不同环境，这时候就可以通过环境变量来管理接口的**地址**以及**端口**。

点击右侧 `Manage Environments`，系统中默认已经存在了一个 `Globals` 的全局环境，在这里可以存放一些通用的公共变量的值。先在这里写入 `host` 和 `port` 信息：

![image-20211010223411465](/atips/images/software/image-20211010223411465.png)

![image-20211010224152486](/atips/images/software/image-20211010224152486.png)

在需要使用变量时，可以在访问接口时使用双大括号引用变量，以 `{{variable}}` 的方式进行引用：

![image-20211010224409156](/atips/images/software/image-20211010224409156.png)

以上是使用全局环境变量，此外我们也可以创建新的环境来存放变量。

![image-20211010224842208](/atips/images/software/image-20211010224842208.png)

![image-20211010225101455](/atips/images/software/image-20211010225101455.png)

这里创建了 本地环境、测试环境、生产环境 共三个环境，这样我们可以直接在多个环境间进行切换。测试接口的过程中，就不需要频繁的改动接口的地址了。

![image-20211010225435424](/atips/images/software/image-20211010225435424.png)

---

我们将环境变量分为了两类，**普通环境变量**和全局变量。总的来说，全局变量具有更高的使用范围，即使切换到自己创建的环境，全局变量仍然可用。但是我们自己创建的环境之间是相互隔离的，如果切换到一个环境，那么其他环境中的变量将不再可用。

