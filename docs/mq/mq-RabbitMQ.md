# MQ - RabbitMQ

## 简介

RabbitMQ 是基于AMQP的一款消息管理系统，采用 Erlang 语言实现。

官网： http://www.rabbitmq.com/

官方教程：http://www.rabbitmq.com/getstarted.html



## 安装

### Windows

分为两步

1. 安装Erlang，下载地址：[otp_win64_21.3.exe](http://erlang.org/download/otp_win64_21.3.exe)

   ![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/arch_screen_53.png)

2. 安装RabbitMQ，下载地址：[rabbitmq-server-3.7.14.exe](https://dl.bintray.com/rabbitmq/all/rabbitmq-server/3.7.14/rabbitmq-server-3.7.14.exe)

   ![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/arch_screen_54.png)

3. 安装完成后，进入 RabbitMQ 安装目录下的 `sbin` 目录

   ![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/arch_screen_55.png)

4. 在地址栏输入 cmd 并回车启动命令行，然后输入以下命令启动管理功能：

   ```bash
   rabbitmq-plugins enable rabbitmq_management
   ```

   ![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/arch_screen_56.png)

5. 访问地址查看是否安装成功：[http://localhost:15672/](http://localhost:15672/)

   ![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/arch_screen_57.png)

6. 输入账号密码并登录：guest guest



### Linux



## 核心概念

**RabbitMQ 整体上是一个生产者与消费者模型，主要负责接收、存储和转发消息**。可以把消息传递的过程想象成：当你将一个包裹送到邮局，邮局会暂存并最终将邮件通过邮递员送到收件人的手上，RabbitMQ 就好比由邮局、邮箱和邮递员组成的一个系统。从计算机术语层面来说，RabbitMQ 模型更像是一种交换机模型。

RabbitMQ 的整体模型架构如下：

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/20201124213040.png)

RabbitMQ 的消息模型：

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/arch_screen_52.png)

| 标志 | 中文名     | 英文名   | 描述                                             |
| ---- | ---------- | -------- | ------------------------------------------------ |
| P    | 生产者     | Producer | 消息的发送者，可以将消息发送到交换机             |
| C    | 消费者     | Consumer | 消息的接收者，从队列中获取消息进行消费           |
| X    | 交换机     | Exchange | 接收生产者发送的消息，并根据路由键发送给指定队列 |
| Q    | 队列       | Queue    | 存储从交换机发来的消息                           |
| type | 交换机类型 | type     | direct表示直接根据路由键（orange/black）发送消息 |

- Broker

  - RabbitMQ 的服务端程序，可以认为一个 mq 节点就是一个 broker；

- Producer 生产者

  - 创建消息 Message，然后发布到 RabbitMQ 中；

- Consumer 消费者

  - 消费队列里面的消息；

- Message 消息

  - 生产消费的内容，有消息头和消息体，也包括多个属性配置，比如 RoutingKey 路由键；

- Queue 队列

  - Queue 是RabbitMQ 的内部对象，用于存储消息，消息都只能存储在队列中；

- Channel 信道

  - 一条支持多路复用的通道，独立的双向数据流通道，可以发布、订阅、接收消息；
  - 信道是建立在真实的 TCP 连接内的虚拟连接，复用 TCP 连接的通道；

- Connection 连接

  - Connection 是 RabbitMQ 的 socket 连接，它封装了 socket 协议相关部分逻辑，一个连接上可以有多个channel 进行通信；

- Exchange 交换机

  - 生产者将消息发送到 Exchange，交换机将消息路由到一个或者多个队列中，里面有多个类型，队列和交换机是多对多的关系；

- RoutingKey 路由键

  - 生产者将消息发给交换器的时候，一般会指定一个 RoutingKey，用来指定这个消息的路由规则；
  - 最大长度255 字节；

- Binding 绑定

  - 通过绑定将交换器与队列关联起来，在绑定的时候一般会指定一个绑定键 ( BindingKey )，这样RabbitMQ 就可以将消息路由到对应的队列；（生产者将消息发送给交换器时，需要一个 RoutingKey，当 BindingKey 和 RoutingKey相匹配时，消息会被路由到对应的队列中）

- Virtual host 虚拟主机

  - 用于不同业务模块的逻辑隔离，一个 Virtual Host 里面可以有若干个 Exchange 和 Queue，同一个VirtualHost 里面不能有相同名称的 Exchange 或 Queue；默认是 `/`；

  - 添加虚拟主机

    ![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1334716-20210613171451601-611682538.png)

- 关系图

  ![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1334716-20210614001238268-1217658587.png)

- 主要端口

  ```
  4369 	#erlang 发现口
  5672 	#client 端通信口
  15672 	#管理界面 ui 端口
  25672 	#server 间内部通信口
  ```



## 工作模式

RabbitMQ提供了6种消息模型，第6种其实是RPC，并不是MQ，因此不予学习。那么也就剩下5种。

但是其实3、4、5这三种都属于订阅模型，只不过进行路由的方式不同。

![1527068544487](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1527068544487.png)

我们通过一个 demo 案例来了解下 RabbitMQ 的工作方式。

- 依赖：

  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-amqp</artifactId>
  </dependency>
  ```

  

- 抽取一个建立RabbitMQ连接的工具类，方便其他程序获取连接：

  ```java
  import com.rabbitmq.client.Connection;
  import com.rabbitmq.client.ConnectionFactory;
  
  public class ConnectionUtil {
      /**
       * 建立与RabbitMQ的连接
       * @return
       * @throws Exception
       */
      public static Connection getConnection() throws Exception {
          // 定义连接工厂
          ConnectionFactory factory = new ConnectionFactory();
          // 设置服务地址【需改成你本地的mq地址】
          factory.setHost("127.0.0.1");
          // 端口
          factory.setPort(5672);
          // 设置账号信息，用户名、密码、vhost(虚拟机)
          factory.setVirtualHost("/yolo");
          factory.setUsername("yolo");
          factory.setPassword("123456");
          // 通过工程获取连接
          Connection connection = factory.newConnection();
          return connection;
      }
  }
  ```



### 简单队列

> 参考：https://www.rabbitmq.com/tutorials/tutorial-one-java.html

一个消息生成者对应一个消息消费者，点对点。

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1334716-20210614113240047-2128567438.png)

- P（producer/ publisher）：生产者
- C（consumer）：消费者
- 队列（红色区域）



#### 示例

我们将用 Java 编写两个程序；发送单个消息的生产者，以及接收消息并将其打印出来的消费者。我们将详细介绍Java API 中的一些细节，这是一个消息传递的“Hello World”。

我们将调用我们的消息发布者（发送者）Send 和我们的消息消费者（接收者）Recv。发布者将连接到RabbitMQ，发送一条消息，然后退出。

##### 生产者发送消息

```java
//import com.example.util.ConnectionUtil; //上文准备的mq连接工具类
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

public class Send {
    private final static String QUEUE_NAME = "simple_queue";
    public static void main(String[] args) throws Exception {
        // 获取到连接以及mq通道
        Connection connection = ConnectionUtil.getConnection();
        // 从连接中创建通道，这是完成大部分API的地方。
        Channel channel = connection.createChannel();

        // 声明（创建）队列，必须声明队列才能够发送消息，我们可以把消息发送到队列中。
        // 声明一个队列是幂等的 - 只有当它不存在时才会被创建
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        // 消息内容
        String message = "Hello World!";
        channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
        System.out.println(" [x] Sent '" + message + "'");

        //关闭通道和连接
        channel.close();
        connection.close();
    }
}
```

控制台：

```
 [x] Sent 'Hello World!'

Process finished with exit code 0
```



##### 管理工具中查看消息

进入队列页面，可以看到新建了一个队列：`simple_queue`

![image-20211112232231938](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112232231938.png)

点击队列名称，进入详情页，可以查看消息：

![image-20211112232329323](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112232329323.png)

在控制台查看消息并不会将消息消费，所以消息还在。



##### 消费者获取消息

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;
import java.io.IOException;

public class Recv {
    private final static String QUEUE_NAME = "simple_queue";
    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 创建通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                                       byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [x] received : " + msg + "!");
            }
        };
        // 监听队列，第二个参数：是否自动进行消息确认。
        channel.basicConsume(QUEUE_NAME, true, consumer);
    }
}
```

控制台：

```
 [x] received : Hello World!!
```

这个时候，队列中的消息就没了：

![image-20211112232622801](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112232622801.png)

我们发现，消费者已经获取了消息，但是程序没有停止，一直在监听队列中是否有新的消息。一旦有新的消息进入队列，就会立即打印。



#### 消息确认机制（ACK）

通过刚才的案例可以看出，消息一旦被消费者接收，队列中的消息就会被删除。

那么问题来了：RabbitMQ 怎么知道消息被接收了呢？如果消费者领取消息后，还没执行操作就挂掉了呢？或者抛出了异常？消息消费失败，但是RabbitMQ无从得知，这样消息就丢失了！

因此，RabbitMQ 有一个 ***ACK*** 机制。当消费者获取消息后，会向 RabbitMQ 发送回执 ACK，告知消息已经被接收。不过这种回执 ACK 分两种情况：

- **自动 ACK**：消息一旦被接收，消费者自动发送ACK
- **手动 ACK**：消息接收后，不会发送ACK，需要手动调用

哪种更好呢？这需要看消息的重要性：

- 如果消息不太重要，丢失也没有影响，那么自动 ACK 会比较方便；
- 如果消息非常重要，不容丢失。那么最好在消费完成后手动 ACK，否则接收消息后就自动 ACK，RabbitMQ 就会把消息从队列中删除。如果此时消费者宕机，那么消息就丢失了。

我们之前的测试都是自动ACK的，如果要手动ACK，需要改动消费者中的代码：

```java{24,28}
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;
import java.io.IOException;

public class Recv2 {
    private final static String QUEUE_NAME = "simple_queue";
    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 创建通道
        final Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                                       byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [x] received : " + msg + "!");
                // 手动进行ACK
                channel.basicAck(envelope.getDeliveryTag(), false);
            }
        };
        // 监听队列，第二个参数false，手动进行ACK
        channel.basicConsume(QUEUE_NAME, false, consumer);
    }
}
```

注意到最后一行代码：

```java
channel.basicConsume(QUEUE_NAME, false, consumer);
```

如果第二个参数为 `true`，则会自动进行 ACK；如果为 `false`，则需要手动 ACK。方法的声明：

```java
// com.rabbitmq.client.Channel
String basicConsume(String queue, boolean autoAck, Consumer callback) throws IOException;
```



##### 自动ACK存在的问题

修改消费者，添加异常，如下：

![1532764600849](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1532764600849.png)

生产者不做任何修改，直接运行，消息发送成功：

![image-20211112233414795](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112233414795.png)

运行消费者，程序抛出异常。但是消息依然被消费：

```bash
23:35:08.909 [pool-1-thread-4] ERROR com.rabbitmq.client.impl.ForgivingExceptionHandler - Consumer com.example.simple.Recv$1@38af4f93 (amq.ctag-Bhinh4S45urhVQ_fUlW3ww) method handleDelivery for channel AMQChannel(amqp://yolo@127.0.0.1:5672//yolo,1) threw an exception for channel AMQChannel(amqp://yolo@127.0.0.1:5672//yolo,1)
java.lang.ArithmeticException: / by zero
	at com.example.simple.Recv$1.handleDelivery(Recv.java:25)
	at com.rabbitmq.client.impl.ConsumerDispatcher$5.run(ConsumerDispatcher.java:149)
	at com.rabbitmq.client.impl.ConsumerWorkService$WorkPoolRunnable.run(ConsumerWorkService.java:100)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
	at java.lang.Thread.run(Thread.java:748)
```

![image-20211112233535862](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112233535862.png)



##### 演示手动ACK

修改消费者，把自动改成手动（去掉之前制造的异常）：

![1532764831241](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1532764831241.png)

生产者不变，再次运行：

![image-20211112233414795](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112233414795.png)

运行消费者：

![image-20211112233852905](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112233852905.png)

但是，查看管理界面，发现：

![image-20211112234014591](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112234014591.png)

停掉消费者的程序，发现：

![image-20211112234111722](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112234111722.png)

这是因为虽然我们设置了手动 ACK，但是代码中并没有进行消息确认！所以消息并未被真正消费掉，当我们关掉这个消费者，消息的状态再次变回 Ready。

---

下面进行手动发送ACK确认。修改消费者代码：

![1532765123282](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1532765123282.png)

执行消费者：

![image-20211112233535862](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211112233535862.png)

消息消费成功！



### Work工作队列

> 参考：https://www.rabbitmq.com/tutorials/tutorial-two-java.html

工作队列或者竞争消费者模式.

工作队列，又称任务队列。主要思想就是避免执行资源密集型任务时，必须等待它执行完成。相反我们稍后完成任务，我们将任务封装为消息并将其发送到队列。 在后台运行的工作进程将获取任务并最终执行作业。当你运行许多消费者时，任务将在他们之间共享，但是**一个消息只能被一个消费者获取**。

![img](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1334716-20210614160200510-1459212516.png)

- 消息生产能力大于消费能力，增加多几个消费节点；
- 和简单队列类似，增加多个几个消费节点，处于竞争关系；
- 策略有轮询和非公平，默认为轮询；



#### 示例

接下来我们来模拟这个流程：

```
P：生产者：任务的发布者

C1：消费者，领取任务并且完成任务，假设完成速度较快

C2：消费者2：领取任务并完成任务，假设完成速度慢
```



##### 生产者

生产者与案例1中的几乎一样，不过这里是循环发送 50 条消息：

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

public class Send {
    private final static String QUEUE_NAME = "test_work_queue";
    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        // 循环发布任务
        for (int i = 0; i < 50; i++) {
            // 消息内容
            String message = "task .. " + i;
            channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
            System.out.println(" [x] Sent '" + message + "'");

            Thread.sleep(i * 2);
        }
        // 关闭通道和连接
        channel.close();
        connection.close();
    }
}
```



##### 消费者1

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;
import java.io.IOException;

public class Recv1 {
    private final static String QUEUE_NAME = "test_work_queue";
    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 创建通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [消费者1] received : " + msg + "!");
                try {
                    // 模拟完成任务的耗时：1000ms
                    Thread.sleep(1000);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                // 手动进行 ACK
                channel.basicAck(envelope.getDeliveryTag(), false);
            }
        };
        // 监听队列，第二个参数：是否自动进行消息确认。
        channel.basicConsume(QUEUE_NAME, false, consumer);
    }
}
```



##### 消费者2

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;

import java.io.IOException;

public class Recv2 {
    private final static String QUEUE_NAME = "test_work_queue";
    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 创建通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [消费者2] received : " + msg + "!");
                // 手动进行 ACK
                channel.basicAck(envelope.getDeliveryTag(), false);
            }
        };
        // 监听队列，第二个参数：是否自动进行消息确认。
        channel.basicConsume(QUEUE_NAME, false, consumer);
    }
}
```

与消费者1基本类似，就是没有设置消费耗时时间。

这里是模拟有些消费者快，有些比较慢。



接下来，先启动两个消费者，然后再启动生产者发送50条消息：

![1527085826462](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1527085826462.png)

可以发现，两个消费者各自消费了 25 条消息，而且各不相同，这就实现了任务的分发。



#### 能者多劳

刚才的实现有问题吗？

- 消费者1比消费者2的效率要低，一次任务的耗时较长；
- 然而两人最终消费的消息数量是一样的；
- 消费者2大量时间处于空闲状态，消费者1一直忙碌。

现在的状态属于是把任务平均分配，正确的做法应该是消费越快的人，消费的越多。

怎么实现呢？

我们可以使用 `basicQos` 方法和 `prefetchCount = 1` 设置。 这告诉 RabbitMQ 一次不要向工作人员发送多于一条消息。 或者换句话说，不要向工作人员发送新消息，直到它处理并确认了前一个消息。 相反，它会将其分派给不是仍然忙碌的下一个工作人员。

![1532765689904](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1532765689904.png)

> 需在执行比较慢的消费者1中进行设置，在生产者中设置无效。

再次测试：

![image-20211113082109524](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113082109524.png)



### 发布订阅模式

> 参考：https://www.rabbitmq.com/tutorials/tutorial-three-java.html

在之前的模式中，我们创建了一个工作队列。 工作队列背后的假设是：每个任务只被传递给一个工作人员。 在这一部分，我们将做一些完全不同的事情——我们将会传递一个信息给多个消费者。 这种模式被称为“**发布/订阅**”。 

订阅模型示意图：

![1527086284940](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1527086284940.png)

1. 1个生产者，多个消费者；

2. 每一个消费者都有自己的一个队列；

3. 生产者没有将消息直接发送到队列，而是发送到了交换机；

4. 每个队列都要绑定到交换机；

5. 生产者发送的消息，经过交换机到达队列，实现一个消息被多个消费者获取的目的。

X（Exchanges）：RabbitMQ 的 Exchange 交换机。一方面：接收生产者发送的消息。另一方面：知道如何处理消息，例如递交给某个特别队列、递交给所有队列、或是将消息丢弃。到底如何操作，取决于Exchange的类型。

- 生产者将消息发送到 Exchange，交换器将消息路由到一个或者多个队列中，交换机有多个类型，队列和交换机是多对多的关系；
- **交换机只负责转发消息，不具备存储消息的能力**，如果没有队列和 Exchange 绑定，或者没有符合的路由规则，则消息会被丢失！

---

Exchange 类型有以下几种：

- **Fanout**：广播，将消息交给所有绑定到交换机的队列
  - 只需要简单的将队列绑定到交换机上，一个发送到交换机的消息都会被转发到与该交换机绑定的所有队列上；很像子网广播，每台子网内的主机都获得了一份复制的消息；
  - Fanout交换机转发消息是最快的，用于发布订阅，广播形式；
- **Direct**：定向，把消息交给符合指定routing key 的队列
  - 将一个队列绑定到交换机上，要求该消息与一个特定的路由键完全匹配；eg：如果一个队列绑定到该交换机上要求路由键 “aabb”，则只有被标记为“aabb”的消息才被转发，不会转发aabb.cc，也不会转发gg.aabb，只会转发aabb；
- **Topic**：通配符，把消息交给符合routing pattern（路由模式） 的队列
  - topic交换机是一种发布/订阅的模式，结合了直连交换机与扇形交换机的特点；通过过交换机和队列绑定到指定的【通配符路由键】，生产者发送消息到交换机，交换机根据消息的路由key进行转发到对应的队列，消息要指定routingkey路由键；
  - 符号“#”匹配一个或多个词，符号“*”匹配不多不少一个词；eg：因此“abc.#”能够匹配到“abc.def.ghi”，但是“abc.*” 只会匹配到“abc.def”；
- **Headers**（少用）
  - 根据发送的消息内容中的headers属性进行匹配, 在绑定Queue与Exchange时指定一组键值对；
  - 当消息发送到RabbitMQ时会取到该消息的headers与Exchange绑定时指定的键值对进行匹配；
  - 如果完全匹配则消息会路由到该队列，否则不会路由到该队列；

 

#### 广播模式-Fanout

流程图：

 ![1527086564505](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1527086564505.png)

在广播模式下，消息发送流程是这样的：

- 1）  可以有多个消费者
- 2）  每个**消费者有自己的queue**（队列）
- 3）  每个**队列都要绑定到Exchange**（交换机）
- 4）  **生产者发送的消息，只能发送到交换机**，交换机来决定要发给哪个队列，生产者无法决定。
- 5）  交换机把消息发送给绑定过的所有队列
- 6）  队列的消费者都能拿到消息。实现一条消息被多个消费者消费



##### 创建交换机

在 `/yolo` 虚拟机下创建一个叫 `fanout_exchange_test`，类型是 **fanout** 的交换机

![image-20211113084303117](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113084303117.png)



- Virtual host：虚拟机
- Name：交换机名
  - 同一个 Virtual host 里面的 Name 不能重复；不同的 Virtual host 是可以重复的。
- Durability：是否持久化，有2个选项：
  - Durable：是
  - Transient：否

- Auto delete
  - 当最后一个绑定被删除后，该exchange自动被删除。 即，在exchange创建之后，并且已经设置好binding，如果该exchange的所有binding都被删除，则该exchange被删除。当然如果当前的exchange还没有开始binding，是不会被删除的。
- Internal
  - 是否是内部专用exchange，是的话，就意味着我们不能往该exchange里面发送消息
- Arguments
  - 参数，是AMQP协议留给AMQP实现做扩展用的。其中rabbit提供了一个属性 `alternate-exchange`，当发送的消息，当前的exchange，根据路由信息没有找到对应的Queue的时候，就会将消息转发到alternate-exchange属性指定的exchange中。如果最总都没有路由到队列中，就会将该条消息丢弃。



##### 生产者

两个变化：

1. 声明Exchange，不再声明Queue

2. 发送消息到Exchange，不再发送到Queue

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

public class Send {
    // 交换机名称
    private final static String EXCHANGE_NAME = "fanout_exchange_test";

    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();

        // 声明exchange，指定类型为fanout
        channel.exchangeDeclare(EXCHANGE_NAME, "fanout");

        // 消息内容
        String message = "Hello everyone";
        // 发布消息到Exchange
        channel.basicPublish(EXCHANGE_NAME, "", null, message.getBytes());
        System.out.println(" [生产者] Sent '" + message + "'");

        channel.close();
        connection.close();
    }
}
```



##### 消费者1

```java{20}
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;
import java.io.IOException;

public class Recv1 {
    // 交换机名
    private final static String EXCHANGE_NAME = "fanout_exchange_test";
    // 队列名
    private final static String QUEUE_NAME = "fanout_exchange_queue_1";

    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        // 绑定队列到交换机
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "");

        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                                       byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [消费者1] received : " + msg + "!");
            }
        };
        // 监听队列，自动返回完成
        channel.basicConsume(QUEUE_NAME, true, consumer);
    }
}
```

要注意代码中：**队列需要和交换机绑定**



##### 消费者2

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;
import java.io.IOException;

public class Recv2 {
    // 交换机名
    private final static String EXCHANGE_NAME = "fanout_exchange_test";
    // 队列名
    private final static String QUEUE_NAME = "fanout_exchange_queue_2";
    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        // 绑定队列到交换机
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "");

        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                                       byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [消费者2] received : " + msg + "!");
            }
        };
        // 监听队列，手动返回完成
        channel.basicConsume(QUEUE_NAME, true, consumer);
    }
}
```



##### 测试

先运行两个消费者，然后再允许生产者发送1条消息：

![image-20211113102833929](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113102833929.png)



#### 路由模式-Direct

> 参考：https://www.rabbitmq.com/tutorials/tutorial-four-java.html

**Direct**：

 ![1532766437787](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1532766437787.png)

- P：生产者，向Exchange发送消息，发送消息时，会指定一个routing key；

- X：Exchange（交换机），接收生产者的消息，然后把消息递交给 与routing key完全匹配的队列；

- C1：消费者，其所在队列指定了需要routing key 为 error 的消息；

- C2：消费者，其所在队列指定了需要routing key 为 info、error、warning 的消息。

在某些场景下，我们希望不同的消息被不同的队列消费。这时就要用到Direct类型的Exchange。

在Direct模型下，队列与交换机的绑定，不能是任意绑定了，而是要指定一个Routing Key（路由key）；消息生产者在向 Exchange 发送消息时，也必须指定消息的 Routing key。交换机根据消息的路由key，转发给对应的队列。



##### 创建交换机

name：`direct_exchange_test`，type：`direct`

![image-20211113171906922](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113171906922.png)



##### 生产者

此处我们模拟商品的增删改，发送消息的 RoutingKey 分别是：insert、update、delete

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

public class Send {
    private final static String EXCHANGE_NAME = "direct_exchange_test";

    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();
        // 声明exchange，指定类型为direct
        channel.exchangeDeclare(EXCHANGE_NAME, "direct");
        // 消息内容
        String message = "商品新增了， id = 1001";
        // String message = "商品更新了， id = 1001";
        // String message = "商品删除了， id = 1001";

        // 发送消息，并且指定routing key 为：insert ,代表新增商品
        channel.basicPublish(EXCHANGE_NAME, "insert", null, message.getBytes());
        // routing key = update,代表更新商品
        // channel.basicPublish(EXCHANGE_NAME, "update", null, message.getBytes());
        // routing key = delete,代表删除商品
        // channel.basicPublish(EXCHANGE_NAME, "delete", null, message.getBytes());

        System.out.println(" [商品服务：] Sent '" + message + "'");

        channel.close();
        connection.close();
    }
}
```



##### 消费者1

我们此处假设消费者1只接收两种类型的消息：更新商品和删除商品。

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;
import java.io.IOException;

public class Recv1 {
    private final static String QUEUE_NAME = "direct_exchange_queue_1";
    private final static String EXCHANGE_NAME = "direct_exchange_test";

    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        // 绑定队列到交换机，同时指定需要订阅的routing key。假设此处需要update和delete消息
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "update");
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "delete");

        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                                       byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [消费者1] received : " + msg + "!");
            }
        };
        // 监听队列，自动ACK
        channel.basicConsume(QUEUE_NAME, true, consumer);
    }
}
```



##### 消费者2

我们此处假设消费者2接收所有类型的消息：新增商品，更新商品和删除商品。

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;
import java.io.IOException;

public class Recv2 {
    private final static String QUEUE_NAME = "direct_exchange_queue_2";
    private final static String EXCHANGE_NAME = "direct_exchange_test";

    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        // 绑定队列到交换机，同时指定需要订阅的routing key。订阅 insert、update、delete
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "insert");
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "update");
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "delete");

        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                                       byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [消费者2] received : " + msg + "!");
            }
        };
        // 监听队列，自动ACK
        channel.basicConsume(QUEUE_NAME, true, consumer);
    }
}
```



##### 测试

先启动消费者1、消费者2；然后多次启动生产者，分别发送insert、update、delete消息。

![image-20211113173921074](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113173921074.png)

- 消费者1，只消费了update和delete消息
- 消费者2，三种消息都消费了



#### 主题通配符模式-Topic

> 参考：https://www.rabbitmq.com/tutorials/tutorial-five-java.html

 ***Topic*** 类型的 Exchange 与 **Direct** 相比，都是可以根据 RoutingKey 把消息路由到不同的队列。只不过 ***Topic*** 类型 Exchange 可以让队列在绑定 Routing key 的时候使用**通配符**！

- Routingkey  一般都是有一个或多个单词组成，多个单词之间以 `.` (英文点)分割，例如： `user.insert`

- **通配符规则**：
  - `#`：匹配一个或多个词
    - 例如：`audit.#`，能够匹配 `audit.irs.corporate` 或者 `audit.irs`
  - `*`：匹配不多不少恰好1个词
    - 例如：`audit.*`，只能匹配 `audit.irs`

 ![1532766712166](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1532766712166.png)

上图这个例子中，我们将发送所有描述动物的消息。消息将使用由三个字（三个单词，两个点）组成的 routing key 发送。路由关键字中的第一个单词将描述速度，第二个颜色和第三个种类：`<speed>.<color>.<species>`。

我们创建了三个绑定：Q1绑定了绑定键 `* .orange.*`，Q2绑定了 `*.*.rabbit` 和 `lazy.＃`：

- Q1匹配所有的橙色动物。

- Q2匹配关于兔子以及懒惰动物的消息。

```
# 练习，生产者发送如下消息，会进入哪个队列：
quick.orange.rabbit 	匹配 *.orange.* 和 *.*.rabbit，进到Q1和Q2
lazy.orange.elephant 	匹配 *.orange.* 和 lazy.#，进到Q1和Q2
quick.orange.fox 		匹配 *.orange.*，进入Q1
lazy.brown.fox 			匹配 lazy.#，进入Q2
lazy.pink.rabbit 		匹配 lazy.# 和 *.*.rabbit，进入同一个队列Q2(消息只会发一次)
```



##### 创建交换机

name：`topic_exchange_test`；type：`topic`

![image-20211113185032178](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113185032178.png)



##### 生产者

使用topic类型的Exchange，发送消息的routing key有3种： `item.isnert`、`item.update`、`item.delete`：

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

public class Send {
    private final static String EXCHANGE_NAME = "topic_exchange_test";

    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();
        // 声明exchange，指定类型为topic
        channel.exchangeDeclare(EXCHANGE_NAME, "topic");
        // 消息内容
        String message = "新增商品 : id = 1001";
        // String message = "更新商品 : id = 1001";
        // String message = "删除商品 : id = 1001";
        // String message = "商品status : id = 1001";

        // 发送消息，并且指定routing key 为：insert ,代表新增商品
        String routingKey = "item.insert";
        // String routingKey = "item.update";
        // String routingKey = "item.delete";
        // String routingKey = "item.status";

        channel.basicPublish(EXCHANGE_NAME, routingKey, null, message.getBytes());
        System.out.println(" [商品服务：] Sent '" + message + "'");

        channel.close();
        connection.close();
    }
}
```



##### 消费者1

我们此处假设消费者1只接收两种类型的消息：更新商品和删除商品

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;
import java.io.IOException;

public class Resv1 {
    private final static String QUEUE_NAME = "topic_exchange_queue_1";
    private final static String EXCHANGE_NAME = "topic_exchange_test";

    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        // 绑定队列到交换机，同时指定需要订阅的routing key。需要 update、delete
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "item.update");
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "item.delete");

        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                                       byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [消费者1] received : " + msg + "!");
            }
        };
        // 监听队列，自动ACK
        channel.basicConsume(QUEUE_NAME, true, consumer);
    }
}
```



##### 消费者2

我们此处假设消费者2接收所有类型的消息：新增商品，更新商品和删除商品等。

```java
import com.example.util.ConnectionUtil;
import com.rabbitmq.client.*;

import java.io.IOException;

public class Resv2 {
    private final static String QUEUE_NAME = "topic_exchange_queue_2";
    private final static String EXCHANGE_NAME = "topic_exchange_test";

    public static void main(String[] args) throws Exception {
        // 获取到连接
        Connection connection = ConnectionUtil.getConnection();
        // 获取通道
        Channel channel = connection.createChannel();
        // 声明队列
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        // 绑定队列到交换机，同时指定需要订阅的routing key。订阅 insert、update、delete
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "item.*");

        // 定义队列的消费者
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            // 获取消息，并且处理，这个方法类似事件监听，如果有消息的时候，会被自动调用
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                                       byte[] body) throws IOException {
                // body 即消息体
                String msg = new String(body);
                System.out.println(" [消费者2] received : " + msg + "!");
            }
        };
        // 监听队列，自动ACK
        channel.basicConsume(QUEUE_NAME, true, consumer);
    }
}
```



##### 测试

先启动消费者1、消费者2；然后多次启动生产者分别发送各种 routingKey 不同的消息：

![image-20211113185421314](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113185421314.png)



## 持久化

- 如何避免消息丢失？

  消费者的ACK机制。可以防止消费者丢失消息。但是，如果在消费者消费之前，MQ就宕机了，消息就没了。

- 是可以将消息进行持久化呢？

  要将消息持久化，前提是：队列、Exchange 都持久化。

RabbitMQ 不允许你绑定一个非持久化（non-durable）的交换机和一个 durable 的队列；反之亦然。要想成功实现持久化必须队列和交换机都是 durable 的。

一旦创建了队列和交换机，就不能修改其标志了。例如，如果创建了一个 non-durable 的队列，然后想把它改变成 durable 的，唯一的办法就是删除这个队列然后重现创建。

---

参考：https://www.cnblogs.com/wu-song/p/9923220.html



### 交换机持久化

下面通过修改上文 topic 中的案例，来了解配置持久化。

由于之前案例中交换机 `topic_exchange_test` 是非持久化的，这里需要先将其删除，然后再新建一个同名的但是是持久化的交换机：

 ![image-20211113214713785](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113214713785.png)

 ![image-20211113214844869](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113214844869.png)

通过点击交换机名称进入详情页，找到 `Delete` 选项将其删除。

然后再新建一个同名为的、持久化的交换机：

![image-20211113215046636](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113215046636.png)

---

然后，修改 ***生产者***：

 ![1532766951432](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1532766951432.png)

```java
Exchange.DeclareOk exchangeDeclare(String exchange, String type, boolean durable) throws IOException;
```

- `durable`：true-持久化；false-非持久化



### 队列持久化

同样的，需要将原来非持久化的队列 `topic_exchange_queue_1`和`topic_exchange_queue_2` 删除，然后新建持久化的队列：

 ![image-20211113215433835](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113215433835.png)

 ![image-20211113215625732](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113215625732.png)

新建持久化的队列：

 ![image-20211113215756090](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/image-20211113215756090.png)

---

修改 ***消费者***：

 ![1532766981230](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1532766981230.png)



### 消息持久化

生产者：

 ![1532767057491](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/mq/1532767057491.png)























## 参考文献

- https://www.rabbitmq.com/getstarted.html
- http://www.macrozheng.com/#/architect/mall_arch_09
- https://www.cnblogs.com/coder-zyc/p/14880725.html

