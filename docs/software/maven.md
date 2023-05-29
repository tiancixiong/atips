# Maven

## 基础概念

**本地仓库、远程仓库关系**：

![image-20211028143854066](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/software/image-20211028143854066.png)

- **本地仓库**：
- **私服**：私服中存储了公司的内部专用的jar！不仅如此，私服还充当了中央仓库的镜像，说白了就是一个代理
- **[中央仓库](https://repo1.maven.org/maven2/)**：该仓库存储了互联网上的 jar，由 Maven 团队来维护



### 坐标

`groupId`，`artifactId`和`version`一起形成坐标的概念。坐标能够唯一确定 jar 或者 pom。

查找坐标网址：[](https://search.maven.org/)、[](https://mvnrepository.com/)

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.5.5</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>

<groupId>com.example</groupId>
<artifactId>test</artifactId>
<version>0.0.1-SNAPSHOT</version>
<packaging>jar</packaging>

<dependency>
    <groupId></groupId>
    <artifactId></artifactId>
    <version></version>
</dependency>
```

- `<groupId>`：组织名，一般是域名反写+实际项目名，如：org.springframework.boot
- `<artifactId>`：项目名，如：spring-boot-starter
- `<version>`：版本号
- `<packaging>`：打包方式

其他属性：

```xml
<dependency>
    <groupId></groupId>
    <artifactId></artifactId>
    <version></version>
    <scope></scope>
    <exclusions></exclusions>
</dependency>
```

- `<scope>`：依赖的范围。可以控制哪些依赖在哪些 `classpath` 中可用，哪些依赖包含在一个应用中
  - compile(默认)：运行期有效，依赖在所有的 `classpath` 中可用，会被打入包中
  - provided：编译期有效，运行期不需要提供，不会打入包中
  - runtime：编译不需要，在运行期有效，需要导入包中（接口与实现分离）
  - test：测试需要，不会打入包中。
  - system：非本地仓库引入、存在系统的某个路径下的jar（一般不使用）



### 生命周期

| 生命周期阶段            | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| **validate**            | 验证项目是否正确，以及所有为了完整构建必要的信息是否可用     |
| generate-sources        | 生成所有需要包含在编译过程中的源代码                         |
| process-sources         | 处理源代码，比如过滤一些值                                   |
| generate-resources      | 生成所有需要包含在打包中的资源文件                           |
| process-resources       | 复制并处理资源文件至目标(target)目录，准备打包               |
| **compile**             | 编译项目的源代码                                             |
| process-classes         | 后处理编译生成的 class 文件，例如对Java类进行字节码增强      |
| generate-test-sources   | 生成所有包含在测试编译过程中的测试源码                       |
| process-test-sources    | 处理测试源码，比如过滤一些值                                 |
| generate-test-resources | 生成测试需要的资源文件                                       |
| process-test-resources  | 复制并处理测试资源文件至测试目标目录                         |
| test-compile            | 编译测试源码至测试目标目录                                   |
| **test**                | 使用合适的单元测试框架运行测试，这些测试不需要被打包或发布   |
| prepare-package         | 在真正的打包之前，执行一些准备打包必要的操作                 |
| **package**             | 将编译好的代码打包成可分发的格式，如 JAR，WAR                |
| pre-integration-test    | 执行一些在集成测试运行之前需要的动作。如建立集成测试需要的环境 |
| integration-test        | 如果有必要的话，处理包并发布至集成测试可以运行的环境         |
| post-integration-test   | 执行一些在集成测试运行之后需要的动作。如清理集成测试环境。   |
| **verify**              | 执行所有检查，验证包是有效的，符合质量规范                   |
| **install**             | 安装包至本地仓库，以备本地的其它项目作为依赖使用             |
| **deploy**              | 安装包至远程仓库(私服)，共享给其他开发人员和项目             |

IDEA 中 Lifecycle ：

- **clean**：有问题，多清理！
- **package**：打成 Jar/War 包，会自动进行 clean+compile

maven 常用构建命令：

![image-20211028153649935](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/software/image-20211028153649935.png)



### 约定目录结构

Maven 提倡使用一个共同的标准目录结构，Maven 使用约定优于配置的原则，大家尽可能的遵守这样的目录结构。如下所示：

- `${basedir}`：存放pom.xml和所有的子目录
- `${basedir}/src/main/java`：项目的源代码
- `${basedir}/src/main/resources`：项目的资源，比如说 property、yml 文件
- `${basedir}/src/main/webapp/WEB-INF`：web应用文件目录，web项目的信息，比如存放web.xml、本地图片、jsp视图页面
- `${basedir}/src/test/java`：项目的测试类，比如说 Junit 代码
- `${basedir}/src/test/resources`：测试用的资源
- `${basedir}/target`：打包输出目录
- `${basedir}/target/classes`：编译输出目录
- `${basedir}/target/test-classes`：测试编译输出目录
- `~/.m2/repository`、`C:\Users\Administrator\.m2`：maven 默认的本地仓库目录位置

![image-20211028150357970](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/software/image-20211028150357970.png)

- `src/main`：这个目录中的内容最终会打包到 Jar/War 包中
  - `src/main/resources`
- `src/test`：测试内容，并不会打包进去



## 配置文件

在安装目录中找到配置文件：`conf/settings.xml`



### 本地仓库

配置**本地仓库**地址：

```xml
<localRepository>路径</localRepository>
```



### 设置镜像仓库

设置镜像仓库，可以提高下载速度。在配置文件的 `<mirrors></mirrors>` 标签中添加 `<mirror/>` 子节点:

- [阿里云公共仓库](https://developer.aliyun.com/mvn/guide)：

  ```xml
  <mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
  </mirror>
  ```



### 参考文献

- [mavenGuide](http://www.kailing.pub/PdfReader/web/viewer.html?file=mavenGuide)



## Jar 包冲突

Jar 包冲突表现往往有这几种：

- 程序抛出 `java.lang.ClassNotFoundException` 异常；
- 程序抛出 `java.lang.NoSuchMethodError` 异常；
- 程序抛出 `java.lang.NoClassDefFoundError` 异常；
- 程序抛出 `java.lang.LinkageError` 异常等；



### Maven Jar包管理机制

#### 依赖传递原则

当在 Maven 项目中引入 A 的依赖，A 的依赖通常又会引入 B 的 jar 包，B 可能还会引入 C 的 jar 包。这样，当你在 pom.xml 文件中添加了 A 的依赖，Maven 会自动的帮你把所有相关的依赖都添加进来。

这样的好处是，使用起来就非常方便，不用自己挨个去找依赖 Jar 包了。坏处是会引起 Jar 包冲突。



#### 最短路径优先原则

规则内容：（有多个依赖时）主要根据依赖的**路径长短**来决定引入哪个依赖。

举例说明：

```
依赖链路一：A -> X -> Y -> Z(v1.1)
依赖链路二：B -> Q -> Z(v1.2)
```

项目中同时引入了 A 和 B 两个依赖，它们间接都引入了 Z 依赖，但由于 B 的依赖链路比较短，因此最终生效的是Z(v1.2) 版本。这就是最短路径优先原则。

此时如果 Z 的 v1.2 版本和 v1.2 版本区别较大，那么就会发生 Jar 包冲突的表现。



#### 最先声明优先原则

规则内容：如果两个依赖的路径一样，最短路径优先原则是无法进行判断的。此时需要使用**最先声明优先原则**，也就是说，谁的声明在前则优先选择。

举例说明：

```
依赖链路一：A -> X -> Z(v1.2)
依赖链路二：B -> Q -> Z(v1.1)
```

A 和 B 最终都依赖 Z，此时 A 的声明（pom.xml 中引入的顺序）优先于 B，则针对冲突的 Z 会优先引入 Z(v1.2)。

如果 Z(v1.2) 向下兼容 Z(v1.1)，则不会出现 Jar 包冲突问题。但如果将 B 声明放前面，则有可能会发生 Jar 包冲突。



### Jar包冲突产生的原因

上面讲了 Maven 维护 Jar 包的三个原则，其实每个原则会发生什么样的 Jar 包冲突。

举例说明：

```
依赖链路一：A -> B -> C -> G21(v21.0)
依赖链路二：D -> F -> G20(v20.0)
```

假设项目中同时引入了 A 和 D 的依赖，按照依赖传递机制和默认依赖调节机制（第一：路径最近者优先；第二：第一声明优先），默认会引入 G20 版本的 Jar 包，而 G21 的 Jar 包不会被引用。

如果 C 中的方法使用了 G21 版本中的某个新方法（或类），由于 Maven 的处理，导致 G21 并未被引入。此时，程序在调用对应类时便会抛出 `ClassNotFoundException` 异常；调用对应方法时便会抛出 `NoSuchMethodError` 异常。



### 排查定位Jar包冲突

在高版本的 IDEA 中已经自带了 Maven 依赖管理插件，依次执行：打开 pom.xml 文件，在文件内右击，选择Maven，选择 Show Dependencies 即可查看 Maven 的依赖层级结构：

![image-20211026151051714](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/software/image-20211026151051714.png)

在图中可以清楚的看到都使用了哪些依赖，它们的层级，是否有冲突的 jar 包等。冲突部分会用红色标出，同时标出 Maven 默认选择了哪个版本。

如果你的IDEA版本中默认没有Maven管理插件，也可安装 [Maven Helper](https://plugins.jetbrains.com/plugin/7179-maven-helper/)，通过这块插件来帮你分析Jar包冲突。

安装完插件，重启之后，打开 pom.xml 文件，在文件下面的 *Dependency Analyzer* 视图中便可以看到 Jar 包冲突的结果分析：

![image-20211026162032598](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/software/image-20211026162032598.png)

此时，关于哪些 Jar 包冲突了，便一目了然。同时，可以右击冲突的 Jar 包，执行 **Exclude** 进行排除，在pom.xml中便会自动添加排除jar包的 `<exclusion>` 标签：

![image-20211026170132602](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/software/image-20211026170132602.png)



### 解决Jar包冲突的方法

这里基于 Maven 项目介绍几种场景下解决Jar冲突的方法：

- Maven 默认处理：采用此种方法，要牢记 Maven 依赖调节机制的基本原则，路径最近者优先和第一声明优先；
- 排除法：上面 Maven Helper 的实例中已经讲到，可以将冲突的 Jar 包在 pom.xml 中通过 `<exclusion>` 标签来进行排除；
- 版本锁定法：如果项目中依赖同一 Jar 包的很多版本，一个个排除非常麻烦，此时可用**版本锁定法**，即直接明确引入指定版本的依赖。根据前面介绍 Maven 处理 Jar 包基本原则，此种方式的优先级最高。这种方法一般采用上面我们讲到的**如何统一 Jar 包依赖**的方式。

#### 依赖排除

去掉间接引入的jar包，在 pom.xml 中使用 `<exclusion>` 标签去排除冲突的 jar 包（上面利用插件 Maven Helper 中的 execlude 方法其实等同于该方法）

```xml{5,9}
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter</artifactId>
	<exclusions>
		<exclusion>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-logging</artifactId>
		</exclusion>
	</exclusions>
</dependency>
```

---

对于本地环境可以利用 Maven Helper 等插件来解决，但在预生产或生成环境中就没那么方便了。此时可以通过`mvn` 命令来定位突出的细节。

执行如下 `mvn` 命令，注意不要省略 `-Dverbose`，要不然不会显示被忽略的包：

```shell
mvn dependency:tree -Dverbose
```

输出内容：

```shell
[INFO] --- maven-dependency-plugin:2.1:tree (default-cli) @ euler-foundation ---
[INFO] com.hsit:euler-foundation:jar:0.9.0.1-SNAPSHOT
[INFO] +- com.rop:rop:jar:1.0.1:compile
[INFO] |  +- org.slf4j:slf4j-api:jar:1.7.5:compile
[INFO] |  +- org.slf4j:slf4j-log4j12:jar:1.7.5:compile
[INFO] |  +- log4j:log4j:jar:1.2.16:compile
[INFO] |  +- commons-lang:commons-lang:jar:2.6:compile
[INFO] |  +- commons-codec:commons-codec:jar:1.6:compile
[INFO] |  +- javax.validation:validation-api:jar:1.0.0.GA:compile
[INFO] |  +- org.hibernate:hibernate-validator:jar:4.2.0.Final:compile
[INFO] |  +- org.codehaus.jackson:jackson-core-asl:jar:1.9.5:compile
[INFO] |  +- org.codehaus.jackson:jackson-mapper-asl:jar:1.9.5:compile
[INFO] |  +- org.codehaus.jackson:jackson-jaxrs:jar:1.9.5:compile
[INFO] |  +- org.codehaus.jackson:jackson-xc:jar:1.9.5:compile
[INFO] |  \- com.fasterxml.jackson.dataformat:jackson-dataformat-xml:jar:2.2.3:compile
[INFO] |     +- com.fasterxml.jackson.core:jackson-core:jar:2.2.3:compile
[INFO] |     +- com.fasterxml.jackson.core:jackson-annotations:jar:2.2.3:compile
[INFO] |     +- com.fasterxml.jackson.core:jackson-databind:jar:2.2.3:compile
[INFO] |     +- com.fasterxml.jackson.module:jackson-module-jaxb-annotations:jar:2.2.3:compile
[INFO] |     \- org.codehaus.woodstox:stax2-api:jar:3.1.1:compile
[INFO] |        \- javax.xml.stream:stax-api:jar:1.0-2:compile
```

加上参数 `Dincludes` 或者 `Dexcludes` 制定小包含或者排除的包，参数后使用 `groupId:artifactId:version` 格式传值，dependency:tree 就会帮你过滤出来：

```
mvn dependency:tree -Dverbose -Dincludes=org.springframework:spring-tx
```



### 参考文献

- [解决 Maven Jar 包冲突](https://mp.weixin.qq.com/s/Eu2SmJKC7LLkk9DnGzyM6w) - 公众号@日拱一兵

