# Maven



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

![image-20211026151051714](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/software/image-20211026151051714.png)

在图中可以清楚的看到都使用了哪些依赖，它们的层级，是否有冲突的 jar 包等。冲突部分会用红色标出，同时标出 Maven 默认选择了哪个版本。

如果你的IDEA版本中默认没有Maven管理插件，也可安装 [Maven Helper](https://plugins.jetbrains.com/plugin/7179-maven-helper/)，通过这块插件来帮你分析Jar包冲突。

安装完插件，重启之后，打开 pom.xml 文件，在文件下面的 *Dependency Analyzer* 视图中便可以看到 Jar 包冲突的结果分析：

![image-20211026162032598](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/software/image-20211026162032598.png)

此时，关于哪些 Jar 包冲突了，便一目了然。同时，可以右击冲突的 Jar 包，执行 **Exclude** 进行排除，在pom.xml中便会自动添加排除jar包的 `<exclusion>` 标签：

![image-20211026170132602](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/software/image-20211026170132602.png)



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

