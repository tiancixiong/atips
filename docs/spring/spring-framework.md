# Spring框架

## 概述

*Spring* 是一个支持快速开发 Java企业版（Java Enterprise Edition，JEE，也称J2EE））应用程序的框架。它提供了一系列底层容器和基础设施，并可以和大量常用的开源框架无缝集成，可以说是开发 Java EE 应用程序的必备。

Spring 最早是在《[Expert One-on-One J2EE Development without EJB](https://book.douban.com/subject/1426848/)》- Rod Johnson 一书中提出的用来取代 EJB 的轻量级框架。随后作者又开始专心开发这个基础框架，并起名为 *Spring Framework*。

随着 Spring 越来越受欢迎，在 Spring Framework 基础上，又诞生了 Spring Boot、Spring Cloud、Spring Data、Spring Security 等一系列基于 Spring Framework 的项目。

Spring 最核心的两个技术思想是：IoC 和 AOP



## Spring Framework

![img](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/spring/spring-overview.png)

Spring Framework 主要包括几个模块：

- 支持 IoC 和 AOP 的容器；
- 支持 JDBC 和 ORM 的数据访问模块；
- 支持声明式事务的模块；
- 支持基于 Servlet 的 MVC 开发；
- 支持基于 Reactive 的 Web 开发；
- 以及集成 JMS、JavaMail、JMX、缓存等其他模块。

我们会依次介绍Spring Framework的主要功能。



## Spring IoC原理

### Spring Ioc容器和beans介绍

**容器**：是一种为某种特定组件的运行提供必要支持的一个软件环境。例如，Tomcat 就是一个 Servlet 容器，它可以为 Servlet 的运行提供运行环境。类似 Docker 这样的软件也是一个容器，它提供了必要的 Linux 环境以便运行一个特定的 Linux 进程。

`org.springframework.context.ApplicationContext` 接口代表了 Spring IoC 容器，它负责实例化、配置、组装之前的 beans。在 Spring 中，由 Spring IoC 容器管理的对象叫做 beans。bean 就是由 Spring IoC 容器实例化、组装和以其他方式管理的对象。此外 bean 只是你应用中许多对象中的一个。Beans 以及他们之间的依赖关系是通过容器配置元数据反映出来。

Spring 的核心就是提供了一个 *IoC 容器*，它可以管理所有轻量级的 JavaBean 组件，提供的底层服务包括组件的生命周期管理、配置和组装服务、AOP 支持，以及建立在 AOP 基础上的声明式事务服务等。

**IoC**：全称 Inversion of Control，直译为*控制反转*。由 Spring 容器管理 bean 的整个生命周期。通过反射实现对其他对象的控制，包括初始化、创建、销毁等，解放手动创建对象的过程，同时降低类之间的耦合度。

IoC 又称为依赖注入DI（Dependency Injection），在 Spring 创建对象的过程中，把对象依赖的属性注入到对象中。有两种方式：构造器注入和属性注入。它解决了一个最主要的问题：将组件的创建+配置与组件的使用相分离，并且，由 IoC 容器负责管理组件的生命周期。

在 IoC 模式下，控制权发生了反转，即从应用程序转移到了IoC容器，所有组件不再由应用程序自己创建和配置，而是由 IoC 容器负责，这样，应用程序只需要直接使用已经创建好并且配置好的组件。



`org.springframework.beans` 和 `org.springframework.context` 是 Spring 框架中 IoC 容器的基础，[*BeanFactory*](http://docs.spring.io/spring-framework/docs/5.0.0.M5/javadoc-api/org/springframework/beans/factory/BeanFactory.html) 接口提供一种高级的配置机制能够管理任何类型的对象。[*ApplicationContext*](https://docs.spring.io/spring-framework/docs/5.0.0.M5/javadoc-api/org/springframework/context/ApplicationContext.html) 是 *BeanFactory* 的子接口。

Spring 主要有两种 IoC 容器，实现了 *BeanFactory* 接口的简单容器和 *ApplicationContext* 高级容器。

- **BeanFactory** ：延迟注入（使用到某个 bean 的时候才会注入），相比于 BeanFactory 来说会占用更少的内存，程序启动速度更快。BeanFactory 提供了最基本的 IoC 容器的功能（最基本的依赖注入支持）；
- **ApplicationContext** ：容器启动的时候，一次性创建所有 bean。ApplicationContext 扩展了 BeanFactory ，除了有 BeanFactory 的功能还有额外更多功能，所以一般开发人员使用 ApplicationContext 会更多。

总之，BeanFactory 提供了配置框架和基本方法，ApplicationContext 添加更多的企业特定的功能

ApplicationContext 提供了 BeanFactory 没有的新特性：

1. 支持多语言版本；
2. 支持多种途径获取 bean 定义信息；
3. 支持应用事件，方便管理 bean。

如果想使用 IoC 容器，下面两个依赖是必须的：

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.1.8.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.1.8.RELEASE</version>
</dependency>
```



### 配置元数据

Spring IoC 容器使用了一种*配置元数据*的形式。此配置元数据表示应用程序的开发人员告诉Spring容器怎样去实例化、配置和装备你应用中的对象。

Spring 容器使配置元数据方式：

- 基于XML配置
- [基于注解配置](http://docs.spring.io/spring/docs/5.0.0.M5/spring-framework-reference/html/beans.html#beans-annotation-config)：在 Spring2.5 中有过介绍支持基于注解的配置元数据
- [基于Java配置](http://docs.spring.io/spring/docs/5.0.0.M5/spring-framework-reference/html/beans.html#beans-java)：从 Spring3.0 开始，由 Spring JavaConfig 提供的许多功能已经成为 Spring 框架中的核心部分。这样你可以使用 Java 程序而不是 XML 文件定义外部应用程序中的 bean 类。使用这些新功能，可以查看`@Configuration`，`@Bean`，`@Import` 和 `@DependsOn` 这些注解

接下来这个例子展示了基于XML配置元数据的基本结构：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="..." class="...">
        <!-- 在这里写 bean 的配置和相关引用 -->
    </bean>
    <bean id="..." class="...">
        <!-- 在这里写 bean 的配置和相关引用 -->
    </bean>
    <!-- 在这里配置更多的bean -->
</beans>
```

`id` 属性用来使用标识每个独立的 bean 定义的字符串。`class` 属性定义了 bean 的类型，这个类型必须使用全路径类名（必须是包路径+类名）。id 属性值可以被依赖对象引用。该例中没有体现 XML 引用其他依赖对象。更多请查看[bean的依赖](http://docs.spring.io/spring/docs/5.0.0.M5/spring-framework-reference/html/beans.html#beans-dependencies)。



#### 基于Java的容器配置

最核心的是 Spring 支持全新的 Java 配置，例如 `@Configuration` 注解的类和 `@Bean` 注解的方法。

`@Bean` 注解用来说明通过 Spring IoC 容器来管理时一个新对象的实例化，配置和初始化的方法。你可以在任何使用 `@Componen` 的地方使用 `@Bean`，但是更常用的是在配置 `@Configuration` 的类中使用

一个用 `@Configuration` 注解的类说明这个类的主要是作为一个 bean 定义的资源文件。被 `@Configuration` 注解的类通过简单地在调用同一个类中其他的 `@Bean` 方法来定义 bean 之间的依赖关系。使用如下：

```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

上面的 AppConfig 类在 Spring XML 的对应配置为：

```xml
<beans>
    <bean id="myService" class="com.acme.services.MyServiceImpl"/>
</beans>
```





### Spring Bean作用域

Spring 3 中为 Bean 定义了 5 种作用域，5 种作用域说明如下：

1. **singleton**：单例模式（多线程下不安全）；Spring 中的 bean 默认都是单例的。Spring IoC容器中只会存在一个共享的Bean实例，无论有多少个Bean引用它，始终指向同一对象。该模式在多线程下是不安全的。Singleton作用域是Spring中的缺省作用域，也可以显示的将Bean定义为singleton模式，配置为：

   ```xml
   <bean id="userDao" class="com.ioc.UserDaoImpl" scope="singleton"/>
   ```

2. **prototype**：原型模式（每次使用时创建）；每次通过 Spring 容器获取 prototype 定义的 bean 时，容器都将创建一个新的 Bean 实例，每个 Bean 实例都有自己的属性和状态，而 singleton 全局只有一个对象。根据经验，对有状态的 bean 使用 prototype 作用域，而对无状态的 bean 使用 singleton 作用域。

3. **request**：一次 request 一个实例；在一次 Http 请求中，容器会返回该 Bean 的同一实例。而对不同的 Http 请求则会产生新的 Bean，而且该 bean 仅在当前 Http Request 内有效，当前 Http 请求结束，该 bean 实例也将会被销毁；

   ```xml
   <bean id="loginAction" class="com.cnblogs.Login" scope="request"/>
   ```

4. **session**：在一次 Http Session 中，容器会返回该 Bean 的同一实例。而对不同的 Session 请求则会创建新的实例，该 bean 实例仅在当前 Session 内有效。同 Http 请求相同，每一次 session 请求创建新的实例，而不同的实例之间不共享属性，且实例仅在自己的 session 请求内有效，请求结束，则实例将被销毁；

   ```xml
   <bean id="userPreference" class="com.ioc.UserPreference" scope="session"/>
   ```

5. **global Session**：全局 session 作用域，在一个全局的 Http Session 中，容器会返回该 Bean 的同一个实例，仅在使用 portlet context 时有效。



### Spring Bean生命周期

![image-20211026192731810](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/spring/image-20211026192731810.png)

1. 对 Bean 进行实例化；

2. IoC 依赖注入；按照 Spring 上下文对实例化的 Bean 进行配置，也就是 IoC 注入；

3. setBeanName 实现；如果 Bean 实现了 BeanNameAware 接口，Spring 将调用 `setBeanName(String)`，此处参数传递的就是 Spring 配置文件中 Bean 的 id 值（xml文件中 bean 标签的 id）；

4. BeanFactoryAware 实现；如果 Bean 实现了 BeanFactoryAware 接口，Spring 将调用它实现的 `setBeanFactory(BeanFactory)`，传递的是Spring工厂自身（可以用这个方式来获取其它Bean，只需在Spring配置文件中配置一个普通的 Bean 就可以）；

5. ApplicationContextAware 实现；如果 Bean 实现了 ApplicationContextAware 接口，Spring 容器将调用 `setApplicationContext(ApplicationContext)` 方法，传入 Spring 上下文（同样这个方式也可以实现步骤4的内容，但比4更好，因为 ApplicationContext 是 BeanFactory 的子接口，有更多的实现方法）；

6. postProcessBeforeInitialization 接口实现-初始化预处理；如果这个 Bean 关联了 BeanPostProcessor 接口，将会调用 `postProcessBeforeInitialization(Object obj, String s)` 预初始化方法，在 Bean 初始化前对其进行处理。BeanPostProcessor 经常被用作是 Bean 内容的更改，并且由于这个是在 Bean 初始化结束时调用那个的方法，也可以被应用于内存或缓存技术；

7. init-method；如果 Bean 实现了 InitializingBean 接口，Spring 将调用它的 afterPropertiesSet 方法，然后调用 xml 定义的 init-method 方法，两个方法作用类似，都是在初始化 bean 的时候执行；

8. postProcessAfterInitialization；如果这个 Bean 关联了 BeanPostProcessor 接口，Spring 将调用 `postProcessAfterInitialization(Object obj, String s)` 后初始化方法，在Bean 初始化后对其进行处理；
9. 注：以上工作完成以后就可以应用这个 Bean 了，那这个 Bean 是一个 Singleton 的，所以一般情况下我们调用同一个 id 的 Bean 会是在内容地址相同的实例，当然在 Spring 配置文件中也可以配置非 Singleton。
10. Destroy 过期自动清理阶段；Bean 初始化完成，供应用使用，当 Bean 不再需要时，会经过清理阶段，如果Bean 实现了 DisposableBean 这个接口，会调用那个其实现的 `destroy()` 方法；
11. destroy-method 自配置清理；最后，如果 Bean 实现了 DisposableBean 接口，Spring 将调用它的 destory 方法，然后调用在 xml 中定义的 destory-method 属性，这两个方法作用类似，都是在 Bean 实例销毁前执行。

bean 标签有两个重要的属性（init-method 和 destroy-method）。用它们你可以自己定制初始化和注销方法。它们也有相应的注解（@PostConstruct 和 @PreDestroy）：

```xml
<bean id="" class="" init-method="初始化方法" destroy-method="销毁方法">
```



### Spring 依赖注入四种方式

#### 构造器注入

```java
public class CatDaoImpl {
    private String message;
    /** 带参数，方便利用构造器进行注入 */
    public CatDaoImpl(String message) {
        this.message = message;
    }
}
```

xml

```xml
<bean id="CatDaoImpl" class="com.CatDaoImpl">
    <constructor-arg value=" message "></constructor-arg>
</bean>
```



#### setter方法注入

```java
public class Id {
    private int id;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
}
```

xml

```xml
<bean id="id" class="com.id "> <property name="id" value="123"></property> </bean>
```





#### 静态工厂注入

静态工厂顾名思义，就是通过调用静态工厂的方法来获取自己需要的对象，为了让 Spring 管理所有对象，我们不能直接通过 *工程类.静态方法()* 来获取对象，而是依然通过 Spring 注入的形式获取：

```
public class DaoFactory { //静态工厂
public static final FactoryDao getStaticFactoryDaoImpl(){
return new StaticFacotryDaoImpl();
}
}
public class SpringAction {
private FactoryDao staticFactoryDao; //注入对象
//注入对象的set方法
public void setStaticFactoryDao(FactoryDao staticFactoryDao) {
this.staticFactoryDao = staticFactoryDao;
}
}
//factory-method="getStaticFactoryDaoImpl"指定调用哪个工厂方法
<bean name="springAction" class=" SpringAction" >
<!--使用静态工厂的方法注入对象,对应下面的配置文件-->
<property name="staticFactoryDao" ref="staticFactoryDao"></property>
</bean>
<!--此处获取对象的方式是从工厂类中获取静态方法-->
<bean name="staticFactoryDao" class="DaoFactory"
factory-method="getStaticFactoryDaoImpl"></bean>
```





#### 实例工厂

实例工厂的意思是获取对象实例的方法不是静态的，所以你需要首先new工厂类，再调用普通的实例方法：

```
public class DaoFactory { //实例工厂
public FactoryDao getFactoryDaoImpl(){
return new FactoryDaoImpl();
}
}
public class SpringAction {
private FactoryDao factoryDao; //注入对象
public void setFactoryDao(FactoryDao factoryDao) {
this.factoryDao = factoryDao;
}
}
<bean name="springAction" class="SpringAction">
<!--使用实例工厂的方法注入对象,对应下面的配置文件-->
<property name="factoryDao" ref="factoryDao"></property>
</bean>
<!--此处获取对象的方式是从工厂类中获取实例方法-->
<bean name="daoFactory" class="com.DaoFactory"></bean>
<bean name="factoryDao" factory-bean="daoFactory"
factory-method="getFactoryDaoImpl"></bean>
```



### 自动装配

Spring装配包括手动装配和自动装配，手动装配是有基于xml装配、构造方法、setter方法等
自动装配有五种自动装配的方式，可以用来指导Spring容器用自动装配方式来进行依赖注入。
1. no：默认的方式是不进行自动装配，通过显式设置ref 属性来进行装配。
2. byName：通过参数名 自动装配，Spring容器在配置文件中发现bean的autowire属性被设置成byname，之后容器试图匹配、装配和该bean的属性具有相同名字的bean。
3. byType：通过参数类型自动装配，Spring容器在配置文件中发现bean的autowire属性被设置成byType，之后容器试图匹配、装配和该bean的属性具有相同类型的bean。如果有多个bean符合条件，则抛出错误。
4. constructor：这个方式类似于byType， 但是要提供给构造器参数，如果没有确定的带参数的构造器参数类型，将会抛出异常。
5. autodetect：首先尝试使用constructor来自动装配，如果无法工作，则使用byType方式。



## Spring AOP原理

### 介绍

AOP 为 Aspect Oriented Programming 的缩写，意为：面向切面编程，通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。是作为面向对象的一种补充，利用AOP可以将公共逻辑（事务管理、日志、缓存等）封装成切面，跟业务代码进行分离，可以减少系统的重复代码和降低模块之间的耦合度。切面就是那些与业务无关，但所有业务模块都会调用的公共逻辑。



### AOP的实现方式

AOP有两种实现方式：静态代理和动态代理。

**静态代理**

静态代理：代理类在编译阶段生成，在编译阶段将通知织入Java字节码中，也称编译时增强。AspectJ使用的是静态代理。

缺点：代理对象需要与目标对象实现一样的接口，并且实现接口的方法，会有冗余代码。同时，一旦接口增加方法，目标对象与代理对象都要维护。

**动态代理**

动态代理：代理类在程序运行时创建，AOP框架不会去修改字节码，而是在内存中临时生成一个代理对象，在运行期间对业务方法进行增强，不会生成新类。



### Spring AOP相关术语

- 连接点（Join point）：指方法，在Spring AOP中，一个连接点总是代表一个方法的执行。连接点是在应用执行过程中能够插入切面的一个点。这个点可以是调用方法时、抛出异常时、甚至修改一个字段时。切面代码可以利用这些点插入到应用的正常流程之中，并添加新的行为。
- 通知（Advice）：在AOP术语中，切面的工作被称为通知。通知描述了切面要完成的工作以及何时执行。比如我们的日志切面需要记录每个接口调用时长，就需要在接口调用前后分别记录当前时间，再取差值。
  - 前置通知（Before）：在目标方法调用前调用通知功能；
  - 后置通知（After）：在目标方法调用之后调用通知功能，不关心方法的返回结果；
  - 返回通知（AfterReturning）：在目标方法成功执行之后调用通知功能；
  - 异常通知（AfterThrowing）：在目标方法抛出异常后调用通知功能；
  - 环绕通知（Around）：通知包裹了目标方法，在目标方法调用之前和之后执行自定义的行为。
- 切点（Pointcut）：切点的定义会匹配通知所要织入的一个或多个连接点。我们通常使用明确的类和方法名称，或是利用正则表达式定义所匹配的类和方法名称来指定这些切点。切点定义了通知功能被应用的范围。比如日志切面的应用范围就是所有接口，即所有controller层的接口方法。
- 切面（Aspect）：切面是通知和切点的结合，定义了何时、何地应用通知功能。通知和切点共同定义了切面的全部内容。
- 引入（Introduction）：引入允许我们在无需修改现有类的情况下，向现有类添加新方法或属性。
- 目标对象（Target Object）： 被一个或者多个切面（aspect）所通知（advise）的对象。它通常是一个代理对象。
- 织入（Weaving）：织入是把切面应用到目标对象并创建新的代理对象的过程。在目标对象的生命周期里有以下时间点可以进行织入：
  - 编译期：切面在目标类编译时被织入。AspectJ的织入编译器是以这种方式织入切面的。
  - 类加载期：切面在目标类加载到JVM时被织入。需要特殊的类加载器，它可以在目标类被引入应用之前增强该目标类的字节码。AspectJ5的加载时织入就支持以这种方式织入切面。
  - 运行期：切面在应用运行的某个时刻被织入。一般情况下，在织入切面时，AOP容器会为目标对象动态地创建一个代理对象。SpringAOP就是以这种方式织入切面。



### Spring中使用注解创建切面

#### 相关注解

- @Aspect：用于定义切面
- @Before：通知方法会在目标方法调用之前执行
- @After：通知方法会在目标方法返回或抛出异常后执行
- @AfterReturning：通知方法会在目标方法返回后执行
- @AfterThrowing：通知方法会在目标方法抛出异常后执行
- @Around：通知方法会将目标方法封装起来
- @Pointcut：定义切点表达式



#### 切点表达式

指定了通知被应用的范围，表达式格式：

```java
execution(方法修饰符 返回类型 方法所属的包.类名.方法名称(方法参数))
```

```java
//com.example.controller包中所有类的public方法都应用切面里的通知
execution(public * com.example.controller.*.*(..))
//com.example.service包及其子包下所有类中的所有方法都应用切面里的通知
execution(* com.example.service..*.*(..))
//com.example.service.DemoService类中的所有方法都应用切面里的通知
execution(* com.example.service.DemoService.*(..))
```



## Spring常用注解

Spring 在 2.5 版本以后开始支持注解的方式来配置依赖注入。可以用注解的方式来代替 xml 中 bean 的描述。注
解注入将会被容器在 XML 注入之前被处理，所以后者会覆盖掉前者对于同 一个属性的处理结果。
注解装配在 Spring 中默认是关闭的。所以需要在 Spring 的核心配置文件中配置一下才能使用基于注解的装配模
式。配置方式如下：`<context:annotation-config />`

常用的注解：

- @Required：该注解应用于设值方法；

- @Autowired：：该注解应用于有值设值方法、非设值方法、构造方法和变量；

- @Qualifier：该注解和 @Autowired 搭配使用，用于消除特定 bean 自动装配的歧义；

  

### @Autowired和@Resource的区别？

@Autowired 注解是按照类型（byType）装配依赖对象的，但是存在多个类型⼀致的 bean，⽆法通过 byType 注⼊时，就会再使⽤ byName 来注⼊；如果还是⽆法判断注⼊哪个 bean 则会 UnsatisfiedDependencyException。 @Resource 会⾸先按照 byName 来装配，如果找不到 bean，会⾃动 byType 再找⼀次。



### @Bean和@Component有什么区别？

都是使用注解定义 Bean。@Bean 是使用 Java 代码装配 Bean，@Component 是自动装配 Bean。

@Component 注解用在类上，表明一个类会作为组件类，并告知 Spring 要为这个类创建 bean，每个类对应一个 Bean。

@Bean 注解用在方法上，表示这个方法会返回一个 Bean。@Bean 需要在配置类中使用，即类上需要加上@Configuration 注解。

```java
@Component
public class Student {
    private String name = "lkm";
 
    public String getName() {
        return name;
    }
}

@Configuration
public class WebSocketConfig {
    @Bean
    public Student student(){
        return new Student();
    }
}
```

@Bean 注解更加灵活。当需要将第三方类装配到 Spring 容器中，因为没办法源代码上添加 @Component 注解，只能使用 @Bean 注解的方式，当然也可以使用 xml 的方式。



### @Component、@Controller、@Repositor和@Service的区别？

- @Component：最普通的组件，可以被注入到spring容器进行管理。
- @Controller：将类标记为 Spring Web MVC 控制器。
- @Service：将类标记为业务层组件。
- @Repository：将类标记为数据访问组件，即DAO组件。



## Spring面试题

### Spring 事务实现方式有哪些？

事务就是一系列的操作原子执行。Spring 事务机制主要包括声明式事务和编程式事务。

- 编程式事务：通过编程的方式管理事务，这种方式带来了很大的灵活性，但很难维护；
- 声明式事务：将事务管理代码从业务方法中分离出来，通过 aop 进行封装。Spring 声明式事务使得我们无需要去处理获得连接、关闭连接、事务提交和回滚等这些操作。使用 `@Transactional` 注解开启声明式事务。

`@Transactional` 相关属性如下：

| 属性                   | 类型                               | 描述                                   |
| ---------------------- | ---------------------------------- | -------------------------------------- |
| value                  | String                             | 可选的限定描述符，指定使用的事务管理器 |
| propagation            | enum: Propagation                  | 可选的事务传播行为设置                 |
| isolation              | enum: Isolation                    | 可选的事务隔离级别设置                 |
| readOnly               | boolean                            | 读写或只读事务，默认读写               |
| timeout                | int (in seconds granularity)       | 事务超时时间设置                       |
| rollbackFor            | Class对象数组，必须继承自Throwable | 导致事务回滚的异常类数组               |
| rollbackForClassName   | 类名数组，必须继承自Throwable      | 导致事务回滚的异常类名字数组           |
| noRollbackFor          | Class对象数组，必须继承自Throwable | 不会导致事务回滚的异常类数组           |
| noRollbackForClassName | 类名数组，必须继承自Throwable      | 不会导致事务回滚的异常类名字数组       |



### 有哪些事务传播行为？

在 TransactionDefinition 接口中定义了七个事务传播行为：

1. **PROPAGATION_REQUIRED**：如果存在一个事务，则支持当前事务。如果没有事务则开启一个新的事务。如果嵌套调用的两个方法都加了事务注解，并且运行在相同线程中，则这两个方法使用相同的事务中。如果运行在不同线程中，则会开启新的事务。
2. **PROPAGATION_SUPPORTS**：如果存在一个事务，支持当前事务。如果没有事务，则非事务的执行。
3. **PROPAGATION_MANDATORY**：如果已经存在一个事务，支持当前事务。如果不存在事务，则抛出*IllegalTransactionStateException* 异常。
4. **PROPAGATION_REQUIRES_NEW**：总是开启一个新的事务。需要使用 JtaTransactionManager 作为事务管理器。
5. **PROPAGATION_NOT_SUPPORTED**：总是非事务地执行，并挂起任何存在的事务。需要使用JtaTransactionManager 作为事务管理器。
6. **PROPAGATION_NEVER**：总是非事务地执行，如果存在一个活动事务，则抛出异常。
7. **PROPAGATION_NESTED**：如果一个活动的事务存在，则运行在一个嵌套的事务中。如果没有活动事务，则按 *PROPAGATION_REQUIRED* 属性执行。

---

**PROPAGATION_NESTED 与PROPAGATION_REQUIRES_NEW的区别:**

使用 `PROPAGATION_REQUIRES_NEW` 时，内层事务与外层事务是两个独立的事务。一旦内层事务进行了提交后，外层事务不能对其进行回滚。两个事务互不影响。

使用 `PROPAGATION_NESTED` 时，外层事务的回滚可以引起内层事务的回滚。而内层事务的异常并不会导致外层事务的回滚，它是一个真正的嵌套事务。



### Spring怎么解决循环依赖的问题？

- 构造器注入的循环依赖：Spring 处理不了，直接抛出 `BeanCurrentlylnCreationException` 异常；

- 单例模式下属性注入的循环依赖：通过三级缓存处理循环依赖；

- 非单例循环依赖：无法处理。

下面分析单例模式下属性注入的循环依赖是怎么处理的：

首先，Spring 单例对象的初始化大略分为三步：

1. `createBeanInstance`：实例化bean，使用构造方法创建对象，为对象分配内存。
2. `populateBean`：进行依赖注入。
3. `initializeBean`：初始化bean。

Spring 为了解决单例的循环依赖问题，使用了三级缓存：

- `singletonObjects`：一级缓存，完成了初始化的单例对象map，bean name --> bean instance
- `earlySingletonObjects `：二级缓存，完成实例化未初始化的单例对象map，bean name --> bean instance

- `singletonFactories `： 三级缓存，单例对象工厂map，bean name --> ObjectFactory，单例对象实例化完成之后会加入 singletonFactories。

在调用 createBeanInstance 进行实例化之后，会调用 addSingletonFactory，将单例对象放到 singletonFactories 中。

```java
// org.springframework.beans.factory.support.DefaultSingletonBeanRegistry
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);
private final Map<String, Object> earlySingletonObjects = new ConcurrentHashMap<>(16);
private final Set<String> registeredSingletons = new LinkedHashSet<>(256);

protected void addSingletonFactory(String beanName, ObjectFactory<?> singletonFactory) {
    Assert.notNull(singletonFactory, "Singleton factory must not be null");
    synchronized (this.singletonObjects) {
        if (!this.singletonObjects.containsKey(beanName)) {
            this.singletonFactories.put(beanName, singletonFactory);
            this.earlySingletonObjects.remove(beanName);
            this.registeredSingletons.add(beanName);
        }
    }
}
```

假如A依赖了B的实例对象，同时B也依赖A的实例对象。

1. A首先完成了实例化，并且将自己添加到 三级缓存(singletonFactories) 中；
2. 接着进行依赖注入，发现自己依赖对象B，此时就尝试去 get(B)；
3. 发现B还没有被实例化，对B进行实例化；
4. 然后B在初始化的时候发现自己依赖了对象A，于是尝试 get(A)，尝试 一级缓存(singletonObjects) 和 二级缓存(earlySingletonObjects) 没找到，尝试 三级缓存(singletonFactories)；由于A初始化时将自己添加到了 三级缓存(singletonFactories) 中，所以B可以拿到A对象，然后将A从三级缓存中移到二级缓存中；
5. B拿到A对象后顺利完成了初始化，然后将自己放入到 一级缓存(singletonObjects) 中
6. 此时返回A中，A此时能拿到B的对象顺利完成自己的初始化

由此看出，属性注入的循环依赖主要是通过将实例化完成的 bean 添加到 singletonFactories 来实现的。而使用构造器依赖注入的 bean 在实例化的时候会进行依赖注入，不会被添加到 singletonFactories 中。比如A和B都是通过构造器依赖注入，A在调用构造器进行实例化的时候，发现自己依赖B，B没有被实例化，就会对B进行实例化，此时A未实例化完成，不会被添加到 singtonFactories。而B依赖于A，B会去三级缓存寻找A对象，发现不存在，于是又会实例化A，A实例化了两次，从而导致抛异常。

总结：1、利用缓存识别已经遍历过的节点； 2、利用Java引用，先提前设置对象地址，后完善对象。



### Spring的单例Bean是否有线程安全问题？

当多个用户同时请求一个服务时，容器会给每一个请求分配一个线程，这时多个线程会并发执行该请求对应的业务逻辑，如果业务逻辑有对单例状态的修改（体现为此单例的成员属性），则必须考虑线程安全问题。

若每个线程中对全局变量、静态变量只有读操作，而无写操作，那么不会有线程安全问题；若有多个线程同时执行写操作，一般都需要考虑线程同步，否则就可能影响线程安全。

**无状态bean和有状态bean**

- 有实例变量的bean，可以保存数据，是非线程安全的。
- 没有实例变量的对象。不能保存数据，是线程安全的。

在Spring中无状态的Bean适合用单例模式，这样可以共享实例提高性能。有状态的Bean在多线程环境下不安全，一般用Prototype模式或者使用ThreadLocal解决线程安全问题。

---

参考

- [Spring面试题](https://github.com/Tyson0314/Java-learning/blob/master/%E6%A1%86%E6%9E%B6/Spring%E9%9D%A2%E8%AF%95%E9%A2%98.md) - GitHub@Tyson0314





## 参考资料

- [Spring 官网](https://spring.io/)、[docs/5.0.0.M5](https://docs.spring.io/spring-framework/docs/5.0.0.M5/spring-framework-reference/html/)、[Spring 官网案例](https://spring.io/guides) - 英文
- [Spring 开发](https://www.liaoxuefeng.com/wiki/1252599548343744/1266263217140032) - 廖雪峰
- [Spring 框架](https://github.com/Tyson0314/Java-learning/tree/master/%E6%A1%86%E6%9E%B6) - GitHub@Tyson0314

