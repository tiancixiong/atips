# Java 8 - 函数编程

面向对象编程是对数据进行抽象；函数式编程是对行为进行抽象。

核心思想：使用不可变值和函数，函数对一个值进行处理，映射成另一个值。

对核心类库的改进主要包括集合类的 API 和新引入的流 ***Stream***。流使程序员可以站在更高的抽象层次上对集合进行操作。



## Lambda表达式

### 介绍

Lambda 表达式(lambda expression)是一个匿名函数，lambda 表达式基于数学中的 `λ` 演算得名，直接对应于其中的 lambda 抽象(lambda abstraction)，是一个匿名函数，即没有函数名的函数。

Lambda 表达式（也称为闭包）是整个Java 8发行版中最受期待的在Java语言层面上的改变，Lambda 允许把函数作为一个方法的参数（函数作为参数传递进方法中），或者把代码看成数据：函数式程序员对这一概念非常熟悉。在 JVM 平台上的很多语言（Groovy，Scala，……）从一开始就有 Lambda，但是 Java 程序员不得不使用毫无新意的匿名类来代替 lambda。

**Lambda 表达式与匿名类的区别**：使用匿名类与 Lambda 表达式的一大区别在于关键词的使用。对于匿名类，关键词 this 解读为匿名类，而对于 Lambda 表达式，关键词 this 解读为写就 Lambda 的外部类。



### 语法

**Lambda 表达式的基本语法**：`(parameters) -> expression` 或 `(parameters) ->{ statements; }`

Java lambda表达式的简单例子：

```java
// 1. 不需要参数,返回值为 5
() -> 5
 
// 2. 接收一个参数(数字类型),返回其2倍的值
x -> 2 * x
 
// 3. 接受2个参数(数字),并返回他们的差值
(x, y) -> x – y
 
// 4. 接收2个int型整数,返回他们的和
(int x, int y) -> x + y
 
// 5. 接受一个 string 对象,并在控制台打印,不返回任何值(看起来像是返回void)
(String s) -> System.out.print(s)
```

- 一个 Lambda 表达式可以有零个或多个参数
- 参数的类型既可以明确声明，也可以根据上下文来推断。例如：`(int a)` 与 `(a)` 效果相同
- 所有参数需包含在圆括号 `()` 内，参数之间用逗号 `,` 相隔。例如：`(a, b)` 或 `(int a, int b)` 或 `(String a, int b, float c)`
  - 空圆括号代表参数集为空。例如：`() -> 42`
  - 当只有一个参数，且其类型可推导时，圆括号 `()` 可省略。例如：`a -> return a*a`
- Lambda 表达式的主体可包含零条或多条语句
  - 如果 Lambda 表达式的主体只有一条语句，花括号 `{}` 可省略。匿名函数的返回类型与该主体表达式一致
  - 如果 Lambda 表达式的主体包含一条以上语句，则表达式必须包含在花括号 `{}` 中（形成代码块）。匿名函数的返回类型与代码块的返回类型一致，若没有返回则为空



### 使用

- lambda 表达式仅能放入如下代码：预定义使用了 `@Functional` 注释的函数式接口，自带一个抽象函数的方法，或者SAM(Single Abstract Method 单个抽象方法)类型。这些称为 lambda 表达式的目标类型，可以用作返回类型，或 lambda 目标代码的参数。例如，若一个方法接收 Runnable、Comparable 或者 Callable 接口，都有单个抽象方法，可以传入 lambda 表达式。类似的，如果一个方法接受声明于 java.util.function 包内的接口，例如 Predicate、Function、Consumer 或 Supplier，那么可以向其传lambda表达式。

- lambda 表达式内可以使用**方法引用**，仅当该方法不修改 lambda 表达式提供的参数。本例中的 lambda 表达式可以换为方法引用，因为这仅是一个参数相同的简单方法调用。

  ```java
  list.forEach(n -> System.out.println(n)); 
  list.forEach(System.out::println);  // 使用方法引用
  ```

  然而，若对参数有任何修改，则不能使用方法引用，而需键入完整地lambda表达式，如下所示：

  ```java
  list.forEach((String s) -> System.out.println("*" + s + "*"));
  ```

事实上，可以省略这里的lambda参数的类型声明，编译器可以从列表的类属性推测出来。

- lambda 内部可以使用静态、非静态和局部变量，这称为 lambda 内的变量捕获。

- lambda 方法在编译器内部被翻译成私有方法，并派发 `invokedynamic` 字节码指令来进行调用。可以使用JDK 中的 `javap` 工具来反编译 class 文件。使用 `javap -p` 或  `javap -c -v` 命令来看一看 lambda 表达式生成的字节码。大致应该长这样：

  ```java
  private static java.lang.Object lambda$0(java.lang.String);
  ```

- lambda表达式有个限制，那就是只能引用 final 或 final 局部变量，这就是说不能在 lambda 内部修改定义在域外的变量。

  ```java
  List<Integer> primes = Arrays.asList(new Integer[]{2, 3, 5, 7});
  int factor = 2;
  primes.forEach(element -> {
      factor++;
  });
  ```

  上面这段代码会编译报错：Variable used in lambda expression should be final or effectively final；

  另外，只是访问它而不作修改是可以的，如下所示：

  ```java
  List<Integer> primes = Arrays.asList(new Integer[]{2, 3, 5, 7});
  int factor = 2;
  primes.forEach(element -> {
      System.out.println(factor * element);
  });
  ```

- 









## Stream

Stream（流）是一个来自数据源的元素队列，它可以支持聚合操作。

- 数据源：流的数据来源，构造 Stream 对象的数据源，比如通过一个 List 来构造 Stream 对象，这个 List 就是数据源；
- 聚合操作：对 Stream 对象进行处理后使得 Stream 对象返回指定规则数据的操作称之为聚合操作，比如filter、map、limit、sorted等都是聚合操作。

### parallelStream

每个 Stream 都有两种模式：顺序执行和并行执行。

- 顺序流：`List <Person> people = list.getStream.collect(Collectors.toList());`
- 并行流：`List <Person> people = list.getStream.parallel().collect(Collectors.toList());`

顾名思义，当使用顺序方式去遍历时，每个item读完后再读下一个item。而使用并行去遍历时，数组会被分成多个段，其中每一个都在不同的线程中处理，然后将结果一起输出。



### 常用方法

- 中间操作：filter、map、mapToInt、mapToLong、mapToDouble、flatMap、sorted、distinct、limit、skip、of、iterate
- 终止操作：forEach、count、collect、reduce、toArray、anyMatch、allMatch、noneMatch、findAny、findFirst、max、min
- 原始类型特化流：IntStream、LongStream、DoubleStream

看下所有API：

![image-20211101172003759](//jsd.cdn.zzko.cn/gh/tiancixiong/atips@img-230529/images/java/java1.8/image-20211101172003759.png)



#### 过滤 Filter

Filter通过 `predicate` 判断函数来过滤所有的元素。这个操作是中间操作，需要通过终止操作才会触发执行。

```java
Arrays.asList("Java", "Scala", "C++", "Haskell", "Lisp").stream()
    .filter(s -> s.startsWith("C"))
    .forEach(System.out::println);
// C++
```



#### 映射 Map

`map` 是一种中间过程操作，借助函数表达式将元素转换成另一种形式。下面的例子将每个字符串转换成大写的字符串。但你也可以使用 `map` 将每个对象转换为另一种类型。最终输出的结果类型依赖于你传入的函数表达式。

```java
Arrays.asList("Java", "Scala", "C++", "Haskell", "Lisp").stream()
    .map(String::toUpperCase)
    .sorted((o1,o2)->o2.compareTo(o1)) //由大到小
    .forEach(System.out::println);
// "SCALA","LISP","JAVA","HASKELL","C++"
```



#### 映射 flatMap

如果涉及到一对多映射，需要将映射结果放入 Stream 中。使用 flatMap 方法的效果是，转换后的多个结果并不是分别映射成一个流，而是映射成流的内容。

```java
Arrays.asList("Hello", "World").stream()
    .flatMap(word -> Stream.of(word.split("")))
    .distinct()
    .forEach(System.out::println);
```



#### 排序 Sorted

Sorted 是一个中间态操作，它返回流的有序视图。 除非你传递自定义的 `Comparator`，否则元素按默认的 **由小到大** 排序。

```java
List<String> list = Arrays.asList("Java", "Scala", "C++", "Haskell", "Lisp");
list.stream()
    .sorted() //默认排序
    .forEach(e -> System.out.print(e + ","));
System.out.println("\n" + list);
```

特别注意：`sorted` 只是创建流的排序视图，并没有改变原始集合的顺序。所以说原集合 list 的顺序并没有改变。



#### 归约 Reduce

终止型操作，通过给定的函数表达式来处理流中的前后两个元素，或者中间结果与下一个元素。Lambda 反复结合每一个元素，直到流被归约成一个值。例如求和或查找最大元素。

```java
public class Demo1 {
    // 将流数据列表拆分多批，sum初始为0，每批都执行 (sum, p) -> sum = sum + p.age，得到局部的sum总和。并行计算
    // 最后通过 (sum1, sum2) -> sum1 + sum2 ，计算最终的总和
    // (sum1, sum2) -> sum1 + sum2，主要适用于并行，parallelStream（），单线程是无效的。
    public static void main(String[] args) {
        List<Person> persons = new ArrayList<>();
        persons.add(new Person("zhangsan", 16));
        persons.add(new Person("wangwu", 18));
        persons.add(new Person("lisi", 14));
        Integer ageSum = persons.parallelStream().reduce(0, (sum, p) -> sum += p.age, (sum1, sum2) -> sum1 + sum2);
        System.out.println(ageSum); //
    }

    static class Person {
        String name;
        int age;
        // 省略get、set、构造   
    }
}
```



### distinct

去重



#### 计数 Count

Count 是一个终止型操作，返回一个 long 类型的元素列表总数。

```java
long countNum = Arrays.asList("Java", "Scala", "C++", "JavaScript", "Lisp").stream()
    .filter(s -> s.startsWith("J"))
    .count();
System.out.println(countNum); //2
```



#### 匹配 Match

各种匹配操作用于判断是否满足 stream 条件。所有的操作都完成后，返回一个 boolean 类型结果。

```java
List<String> stringCollection = new ArrayList<>();
stringCollection.add("ddd2");
stringCollection.add("aaa2");
stringCollection.add("bbb1");
stringCollection.add("aaa1");
stringCollection.add("bbb3");
stringCollection.add("ccc");
stringCollection.add("bbb2");
stringCollection.add("ddd1");

// 只需要一个条件满足
boolean anyStartsWithA = stringCollection.stream().anyMatch((s) -> s.startsWith("a"));
System.out.println("anyMatch：" + anyStartsWithA); //true

// 所有条件都要满足
boolean allStartsWithA = stringCollection.stream().allMatch((s) -> s.startsWith("a"));
System.out.println("allMatch：" + allStartsWithA); //false

// 所有的条件都要不满足
boolean noneStartsWithZ = stringCollection.stream().noneMatch((s) -> s.startsWith("z"));
System.out.println("noneMatch：" + noneStartsWithZ); //true

// 返回任意一个元素
Optional<String> anyE = stringCollection.stream().findAny();
System.out.println("findAny：" + anyE.get());

//返回第一个元素
Optional<String> firstE = stringCollection.stream().findFirst();
System.out.println("findFirst：" + firstE.get());
```



#### 跳过 skip

返回一个扔掉前 n 个元素的流。

```java
Arrays.asList("Java", "Scala", "C++", "Haskell", "Lisp").stream()
    .skip(3) //扔掉前三个元素
    .forEach(System.out::println);
```



#### 输出 limit

只取前 n 个结果。

```java
Arrays.asList("Java", "Scala", "C++", "Haskell", "Lisp").stream()
    .limit(3) //取前三个元素
    .forEach(System.out::println);
```



#### 输出 collect

接受各种做法作为参数，将流中的元素累积成一个汇总结果

常见例子：

- 对一个交易列表按货币分组，获得该货币的所有交易额总和（返回一个`Map<Currency，Integer>`）
- 将交易列表分成两组，贵的和不贵的（返回一个`Map<Boolean，List<Transaction>>`）
- 创建多级分组，比如按城市对交易分组，然后进一步按照贵的或不贵分组

Collectors常见方法：

- Collectors.toList，得到List列表
- Collectors.toSet，得到Set集合
- Collectors.joining ，通过`连接符`拼接字符串
- Collectors.groupingBy(Function<? super T,? extends K>) ，按K值分组，返回Map<K，List>
- Collectors.groupingBy(Function<? super T,? extends K>, Collector<? super T,A,D>)，二级分组，得到两级Map
- Collectors.partitioningBy(Predicate<? super T> predicate) ，分区是分组的特殊情况，返回一个布尔值，意味着得到的分组Map的key只能是Boolean，于是它最多可以分为两组
- Collectors.maxBy，求最大值，需要传一个自定义的Comparator
- Collectors.reducing，广义的归约汇总。
- Collectors.toMap ，得到Map集合。注意：如果key重复会抛异常，要特殊处理



## 常用例子

### 匿名类简写

```java
new Thread(() -> System.out.println("In Java8, Lambda expression rocks !!")).start();

// 用法
(params) -> expression
(params) -> statement
(params) -> { statements }
```



### forEach

```java
List features = Arrays.asList("Lambdas", "Default Method", "Stream API", "Date and Time API");
// forEach
features.forEach(n -> System.out.println(n));
 
// 使用Java 8的方法引用更方便，方法引用由::双冒号操作符标示，
features.forEach(System.out::println);
```



### 方法引用

*构造引用*

```java
// Supplier<Student> s = () -> new Student();
Supplier<Student> s = Student::new;
```

*对象::实例方法*，Lambda表达式的(形参列表)与实例方法的(实参列表)类型个数是对应

```java
// set.forEach(t -> System.out.println(t));
set.forEach(System.out::println);
```

*类名::静态方法*

```java
// Stream<Double> stream = Stream.generate(() -> Math.random());
Stream<Double> stream = Stream.generate(Math::random);
```

*类名::实例方法*

```java
//  TreeSet<String> set = new TreeSet<>((s1,s2) -> s1.compareTo(s2));
/*  这里如果使用第一句话，编译器会有提示: Can be replaced with Comparator.naturalOrder，这句话告诉我们
  String已经重写了compareTo()方法，在这里写是多此一举，这里为什么这么写，是因为为了体现下面
  这句编译器的提示: Lambda can be replaced with method reference。好了，下面的这句就是改写成方法引用之后: 
*/
TreeSet<String> set = new TreeSet<>(String::compareTo);
```



### Collectors

```java
// 将字符串换成大写并用逗号链接起来
List<String> G7 = Arrays.asList("USA", "Japan", "France", "Germany", "Italy", "U.K.", "Canada");
String G7Countries = G7.stream().map(x -> x.toUpperCase()).collect(Collectors.joining(", "));
System.out.println(G7Countries);
```

- Collectors.joining(", ")
- Collectors.toList()
- Collectors.toSet() ，生成set集合
- Collectors.toMap(MemberModel::getUid, Function.identity())
- Collectors.toMap(ImageModel::getAid, o -> IMAGE_ADDRESS_PREFIX + o.getUrl())



## FunctionalInterface

### 理解注解 @FunctionInterface

- interface 做注解的注解类型，被定义成java语言规范
- 一个被它注解的接口只能有一个抽象方法，有两种例外
  - 第一是接口允许有实现的方法，这种实现的方法是用 `default` 关键字来标记的（java反射中`java.lang.reflect.Method#isDefault()` 方法用来判断是否是 default 方法）
  - 第二如果声明的方法和 `java.lang.Object` 中的某个方法一样，它可以不当做未实现的方法，不违背这个原则：一个被它注解的接口只能有一个抽象方法, 比如: `java public interface Comparator<T> { int compare(T o1, T o2); boolean equals(Object obj); }`

- 如果一个类型被这个注解修饰，那么编译器会要求这个类型必须满足如下条件：
  - 这个类型必须是一个 `interface`，而不是其他的注解类型、枚举 `enum` 或者类 `class`
  - 这个类型必须满足 function interface 的所有要求，如你个包含两个抽象方法的接口增加这个注解，会有编译错误。

- 编译器会自动把满足 function interface 要求的接口自动识别为 function interface



## 参考文献

- [https://github.com/aalansehaiyang/java8-tutorial](https://github.com/aalansehaiyang/java8-tutorial)

