# Java 基础 - 基础语法

## 数据类型

### 八种基本类型

Java 语言提供了**八种**基本类型。六种数字类型（四个整数型，两个浮点型），一种字符类型，还有一种布尔型。

| 数据类型 | 所占字节     | 默认值  | 可表示的范围                            |
| -------- | ------------ | ------- | --------------------------------------- |
| byte     | 1字节(8bit)  | 0       | -128(-2^7^) ~ 127 (2^7^-1)              |
| short    | 2字节(16bit) | 0       | -32768(-2^15^) ~ 32767(-2^15^-1)        |
| int      | 4字节(32bit) | 0       | -2^31^ ~ 2^31^-1                        |
| long     | 8字节(64bit) | 0L      | -2^63^ ~ 2^63^-1                        |
| float    | 4字节(32bit) | 0.0f    | -2^128^ ~ 2^128^-1                      |
| double   | 8字节(64bit) | 0.0d    | -2^1024^ ~ 2^1024^-1                    |
| boolean  | 1位          | false   | true/false                              |
| char     | 2字节(16bit) | ‘\u000’ | '\u0000'(即为0) ~ '\uffff '(即为65,535) |




### 包装类型

基本类型都有对应的包装类型，具有对象的性质，并且为其添加了属性和方法，丰富了基本类型的操作。基本类型与其对应的包装类型之间的赋值使用自动装箱与拆箱完成。

| 基本数据类型 | 包装类    |
| ------------ | --------- |
| byte         | Byte      |
| short        | Short     |
| int          | Integer   |
| long         | Long      |
| float        | Float     |
| double       | Double    |
| boolean      | Boolean   |
| char         | Character |

```java
Integer i1 = 10;    //自动装箱
int i2 = i1;        //自动拆箱
```



### Integer的缓存机制

> 详情：[Java中整型的缓存机制](http://www.hollischuang.com/?p=1174)、[Java Integer Cache](http://javapapers.com/java/java-integer-cache/) - 英文

在 Java 5 中，在 Integer 的操作上引入了一个新功能来节省内存和提高性能。整型对象通过使用相同的对象引用实现了缓存和重用。

> 适用于整数值区间 -128 至 +127。
>
> 只适用于自动装箱。使用构造函数创建对象不适用。

Java 的编译器把基本数据类型自动转换成封装类对象的过程叫做 `自动装箱`，相当于使用 `valueOf` 方法：

```java
Integer a = 10; //this is autoboxing
Integer b = Integer.valueOf(10); //under the hood
```

现在我们知道了这种机制在源码中哪里使用了，那么接下来我们就看看JDK中的 `valueOf` 方法。下面是 `JDK 1.8.0 build 25` 的实现：

```java
// java.lang.Integer
/**
 * Returns an {@code Integer} instance representing the specified
 * {@code int} value.  If a new {@code Integer} instance is not
 * required, this method should generally be used in preference to
 * the constructor {@link #Integer(int)}, as this method is likely
 * to yield significantly better space and time performance by
 * caching frequently requested values.
 *
 * This method will always cache values in the range -128 to 127,
 * inclusive, and may cache other values outside of this range.
 *
 * @param  i an {@code int} value.
 * @return an {@code Integer} instance representing {@code i}.
 * @since  1.5
 */
public static Integer valueOf(int i) {
	if (i >= IntegerCache.low && i <= IntegerCache.high)
		return IntegerCache.cache[i + (-IntegerCache.low)];
	return new Integer(i);
}
```

在创建对象之前先从 IntegerCache.cache 中寻找。如果没找到才使用 new 新建对象。



#### 其他缓存的对象

这种缓存行为不仅适用于 Integer 对象。我们针对所有的整数类型的类都有类似的缓存机制。

- **ByteCache** 用于缓存 Byte 对象
- **ShortCache** 用于缓存 Short 对象
- **LongCache** 用于缓存 Long 对象
- **CharacterCache** 用于缓存 Character 对象

`Byte`、 `Short`、`Long` 有固定范围:：-128 到 127。对于 `Character`，范围是 0 到 127。除了 `Integer` 以外，这个范围都不能改变。



### 参考文献

- [Java基本数据类型](https://github.com/h2pl/Java-Tutorial/blob/master/docs/java/basic/2%E3%80%81Java%E5%9F%BA%E6%9C%AC%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B.md) - GitHub@h2pl
- [自动拆装箱](https://hollischuang.github.io/toBeTopJavaer/#/basics/java-basic/boxing-unboxing) - GitHub@hollischuang



## String

### 概览

String 被声明为 `final`，因此它不可被*继承*。

内部使用 **char 数组**存储数据，<u>该数组被声明为 final</u>，这意味着 value 数组初始化之后就不能再引用其它数组。并且 String 内部没有改变 value 数组的方法，因此可以保证 String 不可变。

```java
// java.lang.String
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
```



### String对"+"的重载

Java 中，想要拼接字符串，最简单的方式就是通过 `+` 连接两个字符串。

有人把 Java 中使用 `+` 拼接字符串的功能理解为运算符重载。其实并不是，Java 是不支持运算符重载的。这其实只是 Java 提供的一个语法糖。

> 运算符重载：在计算机程序设计中，运算符重载（英语：operator overloading）是多态的一种。运算符重载，就是对已有的运算符重新进行定义，赋予其另一种功能，以适应不同的数据类型。

> 语法糖：语法糖（Syntactic sugar），也译为糖衣语法，是由英国计算机科学家彼得·兰丁发明的一个术语，指计算机语言中添加的某种语法，这种语法对语言的功能没有影响，但是更方便程序员使用。语法糖让程序更加简洁，有更高的可读性。

前面提到过，使用 `+` 拼接字符串，其实只是 Java 提供的一个语法糖。Java 字符串常量在使用 `+` 对字符串的拼接过程中，是将 String 转成了 **StringBuilder** 后，使用其 **append** 方法进行处理的。

但是，String 的使用 `+` 字符串拼接也不全都是基于 `StringBuilder.append`，还有种特殊情况，那就是如果是两个固定的字面量拼接，如：

```markup
String s = "a" + "b";
```

编译器会进行常量折叠(因为两个都是编译期常量，编译期可知)，直接变成 `String s = "ab"`。



### 参考文献

- [String](https://hollischuang.github.io/toBeTopJavaer/#/basics/java-basic/final-string) - GitHub@hollischuang



## 包命名规则

- `java.*`：Java 的核心包
- `javax.*`：扩展包，`x` 是 extension 的意思，也就是扩展。
- `org.*`：各个机构或组织发布的包，因为这些组织很有影响力，它们的代码质量很高，所以也将它们开发的部分常用的类随JDK一起发布。

在包的命名方面，为了防止重名，有一个惯例：大家都以自己域名的倒写形式作为开头来为自己开发的包命名。例如百度发布的包会以 `com.baidu.*` 开头，W3C 组织发布的包会以 `org.w3c.*` 开头。

组织机构的域名后缀一般为 `org`，公司的域名后缀一般为 `com`，可以认为 `org.*` 开头的包为非盈利组织机构发布的包，它们一般是开源的，可以免费使用在自己的产品中，不用考虑侵权问题。而以 `com.*` 开头的包往往由盈利性的公司发布，可能会有版权问题，使用时要注意。



## 关键字

### Java中常见的关键字

|                      |          |            |          |              |            |           |        |
| -------------------- | -------- | ---------- | -------- | ------------ | ---------- | --------- | ------ |
| 访问控制             | private  | protected  | public   |              |            |           |        |
| 类，方法和变量修饰符 | abstract | class      | extends  | final        | implements | interface | native |
|                      | new      | static     | strictfp | synchronized | transient  | volatile  |        |
| 程序控制             | break    | continue   | return   | do           | while      | if        | else   |
|                      | for      | instanceof | switch   | case         | default    |           |        |
| 错误处理             | try      | catch      | throw    | throws       | finally    |           |        |
| 包相关               | import   | package    |          |              |            |           |        |
| 基本类型             | boolean  | byte       | char     | double       | float      | int       | long   |
|                      | short    | null       | true     | false        |            |           |        |
| 变量引用             | super    | this       | void     |              |            |           |        |
| 保留字               | goto     | const      |          |              |            |           |        |



### 访问权限修饰符



| 修饰符    | 当前类 | 同包 | 子类 | 其他包 |
| --------- | ------ | ---- | ---- | ------ |
| public    | ✔      | ✔    | ✔    | ✔      |
| protected | ✔      | ✔    | ✔    | 🚫      |
| 空        | ✔      | ✔    | 🚫    | 🚫      |
| private   | ✔      | 🚫    | 🚫    | 🚫      |



### final

#### 1.修饰变量

声明变量为**常量**，可以是编译时常量，也可以是在运行时被初始化后不能被改变的常量。

- 对于基本类型，final 使数值不变；
- 对于引用类型，final 使引用不变，也就不能引用其它对象，但是被引用的对象本身是可以修改的。

```java
final int i = 1;
// i = 2; //编译报错：Cannot assign a value to final variable 'i'
final A a = new A();
a.num = 1;
```

#### 2.修饰方法

声明方法不能被子类重写。

private 方法隐式地被指定为 final，如果在子类中定义的方法和基类中的一个 private 方法签名相同，此时子类的方法不是重写基类方法，而是在子类中定义了一个新的方法。

#### 3.修饰类

声明类不允许被继承。



### static

#### 1.修饰成员变量和方法

被 static 修饰的成员属于类，不属于单个这个类的某个对象，被类中所有的对象共享，可通过类名调用。被 static 声明的成员变量属于静态变量成员，静态变量存放在 Java 内存区域的方法区。

- 静态变量：又称为类变量，也就是说这个变量属于类的，类所有的实例都共享静态变量，可以直接通过类名来访问它；静态变量在内存中只存在一份。
- 实例变量：每创建一个实例就会产生一个实例变量，它与该实例同生共死。

- 静态方法：不能访问非静态成员，方法中不能有 `this` 和 `super` 关键字。静态方法在类加载的时候就存在了，它不依赖于任何实例。所以静态方法必须有实现，也就是说它不能是抽象方法(abstract)。

#### 2.静态代码块

静态代码块在非静态代码块之前执行。执行先后顺序：静态代码块 -> 非静态代码块 -> 构造方法。该类不管创建多少对象，静态代码块只执行一次。

静态代码块与非静态代码块比较：

- 相同点： 都是在 JVM 加载类时且在构造方法执行之前执行，在类中都可以定义多个，定义多个时按定义的顺序执行，一般在代码块中对一些 static 变量进行赋值。
- 不同点： 静态代码块在非静态代码块之前执行。静态代码块只在第一次 new 执行一次，之后不再执行；而非静态代码块在每 new 一次就执行一次。 非静态代码块可在普通方法中定义(不过作用不大)；而静态代码块不行。

#### 3.静态内部类

静态内部类和非静态内部类之间最大的一个区别在于：非静态内部类在编译完成之后会隐含地保存一个引用，该引用是指向创建它的外部类，但是静态内部类却没有。

没有这个引用就意味着：

1. 静态内部类的创建不需要依赖外围类的创建
2. 静态内部类不能使用任何外部类的非 static 成员变量和方法

#### 4.静态导包

格式 `import static`，可以导入指定类中的静态变量，1.5 之后的新特性。在使用静态变量和方法时不用再指明 ClassName，从而简化代码，但可读性大大降低。



### this

this 关键字返回当前对象的引用。this 关键字只能在非静态方法内部使用。

建议 this 关键字只用在一些必须显式使用当前对象引用的特殊场合。例如，用在 return 语句中返回对当前对象的引用。

### super

super 关键字用于子类访问父类的变量和方法。

>  在构造方法中，通过 this、super 关键字调用其他构造方法时，必须放在第一行，否则编译器会报错。且在构造方法中，只能通过 this、super 调用一次其他构造方法。



## 反射

反射：运行时分析类以及执行类中方法的能力，通过反射可以获取任意一个类的所有属性和方法，并且可以显式的调用这些方法和属性。

Java 中的反射首先是能够获取到 Java 中要反射类的字节码，然后将字节码中的方法、变量、构造函数等映射成相应的 Method、Filed、Constructor 等类，这些类提供了丰富的方法可以被我们所使用。

`Class` 和 `java.lang.reflect` 一起对反射提供了支持，`java.lang.reflect` 类库主要包含了以下三个类:

- **Field** : 可以使用 `get()` 和 `set()` 方法读取和修改 Field 对象关联的字段；
- **Method** : 可以使用 `invoke()` 方法调用与 Method 对象关联的方法；
- **Constructor** : 可以用 Constructor 创建新的对象。



---

- [深入解析Java反射（1） - 基础](https://www.sczyh30.com/posts/Java/java-reflection-1/)



## 异常

Throwable 是 Java 语言中所有错误和异常的超类，可以用来表示任何可以作为异常抛出的类。它有两个子类:  **Error**  和 **Exception**。

- Error 用来表示 JVM 无法处理的错误；
- Exception 分为两种：
  - 检查性异常：除了 Error 和 RuntimeException 的其它异常。Javac 强制要求程序员为这样的异常做预备处理工作（使用 try…catch…finally 或者 throws）。在方法中要么用 try-catch 语句捕获它并处理，要么用throws 声明抛出它，否则编译不会通过；
  - 运行时异常：是程序运行时错误，例如 除0 会引发 Arithmetic Exception，此时程序崩溃并且无法恢复。

![异常的结构](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/java/basic/throwable.png)



## 泛型

Java 泛型(generics)是 JDK 5 中引入的一个新特性，泛型提供了**编译时类型安全检测机制**，该机制允许程序员在编译时检测到非法的类型。泛型的本质是**参数化类型**，也就是说所操作的数据类型被指定为一个参数，这种参数类型可以用在类、接口和方法中，分别被称为泛型类、泛型接口、泛型方法。

### 常用的通配符

Java 中常用的通配符有：T，E，K，V，？

- ？ 表示不确定的 Java 类型
- T (type) 表示具体的一个 Java 类型
- K V (key value) 分别代表 Java 键值中的 Key Value
- E (element) 代表 Element



## 枚举

Enum 全称 Enumeration 即枚举，是 Java 1.5 中引入的新特性。一般表示一组常量，比如一年的 4 个季节，一个年的 12 个月份，一个星期的 7 天，方向有东南西北等。

Enum 与 Class、Interface 具有相同地位。 可以继承多个接口， 可以拥有构造器、成员方法、成员变量。

枚举类与普通类不同之处：

- 枚举类默认继承 `java.lang.Enum` 类，所以不能继承其他父类；
- 枚举类默认使用 final 修饰，因此不能派生子类；
- 枚举类构造器默认使用 private 修饰，且只能使用 private 修饰；
- 枚举类所有实例必须在第一行给出，默认添加 public static final 修饰，否则无法产生实例。

---

- [Java 枚举](https://www.cnblogs.com/jingmoxukong/p/6098351.html)
- [Java 枚举(enum) 详解7种常见的用法](https://blog.csdn.net/qq_27093465/article/details/52180865)
