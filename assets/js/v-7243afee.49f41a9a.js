"use strict";(self.webpackChunkatips=self.webpackChunkatips||[]).push([[4082],{36:(e,t,a)=>{a.r(t),a.d(t,{data:()=>r});const r={key:"v-7243afee",path:"/mq/mq-overview.html",title:"Message Queue",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"简介",slug:"简介",children:[]},{level:2,title:"消息队列的作用",slug:"消息队列的作用",children:[]},{level:2,title:"使用消息队列带来的问题",slug:"使用消息队列带来的问题",children:[]},{level:2,title:"消息模型",slug:"消息模型",children:[{level:3,title:"JMS 两种消息模型",slug:"jms-两种消息模型",children:[]},{level:3,title:"AMQP 五种消息模型",slug:"amqp-五种消息模型",children:[]},{level:3,title:"JMS vs AMQP",slug:"jms-vs-amqp",children:[]}]},{level:2,title:"常见的消息队列对比",slug:"常见的消息队列对比",children:[]},{level:2,title:"📚 资料",slug:"📚-资料",children:[]},{level:2,title:"参考资料",slug:"参考资料",children:[]}],filePathRelative:"mq/mq-overview.md",git:{updatedTime:1719836412e3,contributors:[{name:"Tianci.Xiong",email:"tiancixiong@163.com",commits:3},{name:"TianCi.Xiong",email:"tiancixiong@163.com",commits:2}]}}},8823:(e,t,a)=>{a.r(t),a.d(t,{default:()=>x});var r=a(6252);const i=(0,r.uE)('<h1 id="message-queue" tabindex="-1"><a class="header-anchor" href="#message-queue" aria-hidden="true">#</a> Message Queue</h1><h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h2><p><strong>Message Queue</strong>：消息队列，即MQ</p><p>消息（Message）是指在应用间传送的数据。消息可以非常简单，比如只包含文本字符串，也可以更复杂，可能包含嵌入对象。</p><p>消息队列（Message Queue）是一种应用间的通信方式。消息队列是典型的 <em>生产者-消费者</em> 模型。生产者不断向消息队列中生产消息，消费者不断的从队列中获取消息。因为消息的生产和消费都是异步的，而且只关心消息的发送和接收，没有业务逻辑的侵入，这样就实现了生产者和消费者的解耦。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/mq/image-20211112161717225.png" alt="image-20211112161717225"></p><h2 id="消息队列的作用" tabindex="-1"><a class="header-anchor" href="#消息队列的作用" aria-hidden="true">#</a> 消息队列的作用</h2><ol><li><p><strong>解耦</strong></p><p>如图所示，假设有系统B、C、D都需要系统A的数据，于是系统A调用三个方法发送数据到B、C、D。这时，系统D不需要了，那就需要在系统A把相关的代码删掉。假设这时有个新的系统E需要数据，这时系统A又要增加调用系统E的代码。为了降低这种强耦合，就可以使用MQ，系统A只需要把数据发送到MQ，其他系统如果需要数据，则从MQ中获取即可。通过一个 MQ，Pub/Sub 发布订阅消息这么一个模型，A 系统就跟其它系统彻底解耦了。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/mq/image-20211112161554428.png" alt="img"></p></li><li><p><strong>异步</strong></p><p>如图所示，一个客户端请求发送进来，系统A会调用系统B、C、D三个系统，同步请求的话，响应时间就是系统A、B、C、D的总和，也就是800ms。如果使用MQ，系统A发送数据到MQ，然后就可以返回响应给客户端，不需要再等待系统B、C、D的响应，可以大大地提高性能。对于一些非必要的业务，比如发送短信，发送邮件等等，就可以采用这种方式。</p><p>只有在业务流程允许异步处理的情况下才能这么做。比如在注册流程中，如果要求用户对验证邮件进行点击之后才能完成注册的话，就不能再使用消息队列。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/mq/image-20211112161832548.png" alt="image-20211112161832548"></p></li><li><p><strong>削峰</strong>，通过异步处理，将短时间高并发产生的事务消息存储在消息队列中，从而削平高峰期的并发事务。</p><p>如图所示，这其实是MQ一个很重要的应用。假设系统A在某一段时间请求数暴增，有5000个请求发送过来，系统A这时就会发送5000条SQL进入MySQL进行执行，MySQL对于如此庞大的请求当然处理不过来，MySQL就会崩溃，导致系统瘫痪。</p><p>如果使用MQ，系统A不再是直接发送SQL到数据库，而是把数据发送到MQ，MQ短时间积压数据是可以接受的，然后由消费者每次拉取2000条进行处理，防止在请求峰值时期大量的请求直接发送到MySQL导致系统崩溃。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/mq/image-20211112162014339.png" alt="image-20211112162014339"></p></li></ol><blockquote><p>💡 <code>发布-订阅模式</code>是 <strong>JMS 规范</strong> 两种消息模型中的一种，另外 <strong>AMQP 协议</strong> 还提出了五种消息模型，见下文。</p></blockquote><h2 id="使用消息队列带来的问题" tabindex="-1"><a class="header-anchor" href="#使用消息队列带来的问题" aria-hidden="true">#</a> 使用消息队列带来的问题</h2><ul><li><strong>系统可用性降低：</strong> 在加入MQ之前，你不用考虑消息丢失或者说 MQ 挂掉等等的情况，但是，引入MQ之后你就需要去考虑了；</li><li><strong>系统复杂性提高：</strong> 加入MQ之后，你需要保证消息没有被重复消费、处理消息丢失的情况、保证消息传递的顺序性等等问题；</li><li><strong>一致性问题：</strong> 消息队列带来的异步确实可以提高系统响应速度。但是，万一消息的真正消费者并没有正确消费消息，就会导致数据不一致的情况。</li></ul><h2 id="消息模型" tabindex="-1"><a class="header-anchor" href="#消息模型" aria-hidden="true">#</a> 消息模型</h2><h3 id="jms-两种消息模型" tabindex="-1"><a class="header-anchor" href="#jms-两种消息模型" aria-hidden="true">#</a> JMS 两种消息模型</h3><p>JMS（JAVA Message Service, java消息服务）是 java 的消息服务，JMS 的客户端之间可以通过 JMS 服务进行异步的消息传输。JMS API 是一个消息服务的标准或者说是规范，允许应用程序组件基于 JavaEE 平台创建、发送、接收和读取消息。它使分布式通信耦合度更低，消息服务更加可靠以及异步性。<strong><em>ActiveMQ</em> 就是基于 JMS 规范实现的。</strong></p><p><strong>JMS 定义了五种不同的消息正文格式，以及调用的消息类型</strong>，允许你发送并接收以一些不同形式的数据，提供现有消息格式的一些级别的兼容性：</p><ul><li><code>StreamMessage </code>：Java原始值的数据流</li><li><code>MapMessage</code>：一套名称-值对</li><li><code>TextMessage</code>：一个字符串对象</li><li><code>ObjectMessage</code>：一个序列化的 Java对象</li><li><code>BytesMessage</code>：一个字节的数据流</li></ul><h4 id="点对点模型-p2p" tabindex="-1"><a class="header-anchor" href="#点对点模型-p2p" aria-hidden="true">#</a> 点对点模型 P2P</h4><p><strong>一个生产者向一个特定的队列发布消息，只有一个消费者从该队列中读取消息</strong>。</p><p>生产者不需要在接收者消费该消息期间处于运行状态，接收者也同样不需要在消息发送时处于运行状态；每一个成功处理的消息都由接收者签收；多个消费者对于队列内的消息是竞争消费关系，每个消费者只能收到队列中的一部分消息。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/mq/20201124141849.png" alt=""></p><h4 id="发布-订阅模型-pub-sub" tabindex="-1"><a class="header-anchor" href="#发布-订阅模型-pub-sub" aria-hidden="true">#</a> 发布/订阅模型 Pub/Sub</h4><p><strong>一个生产者向一个特定的队列发布消息，0 个或多个订阅者可以接受来自特定消息主题的消息</strong>。</p><p>发布者需要创建一个 <code>订阅主题（Topic）</code> 以便客户能够购订阅并保持持续的活动以接受消息，<strong>一个订阅主题是由至少一个队列（Queue）组成的，除非订阅者创建了持久的订阅，在订阅者未连接时发布的消息将在订阅者重新连接时重新发布</strong>，每个消费者都能收到全量的消息。</p><p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/mq/20201124141856.png" alt=""></p><h3 id="amqp-五种消息模型" tabindex="-1"><a class="header-anchor" href="#amqp-五种消息模型" aria-hidden="true">#</a> AMQP 五种消息模型</h3><p><strong>AMQP</strong>，即 Advanced Message Queuing Protocol，一个提供统一消息服务的<strong>应用层</strong>标准——<strong>高级消息队列协议</strong>（二进制应用层协议），是应用层协议的一个开放标准, 为面向消息的中间件设计，兼容 JMS。基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件同产品，不同的开发语言等条件的限制。<strong><em>RabbitMQ</em> 就是基于 AMQP 协议实现的。</strong></p><p>AMQP 提供了五种消息模型：</p><ul><li><strong>direct exchange</strong></li><li><strong>fanout exchange</strong></li><li><strong>topic change</strong></li><li><strong>headers exchange</strong></li><li><strong>system exchange</strong></li></ul><p>本质来讲，后四种和 JMS 的 <em>Pub/Sub</em> 模型没有太大差别，仅是在路由机制上做了更详细的划分。</p><h3 id="jms-vs-amqp" tabindex="-1"><a class="header-anchor" href="#jms-vs-amqp" aria-hidden="true">#</a> JMS vs AMQP</h3><table><thead><tr><th>对比方向</th><th>JMS</th><th>AMQP</th></tr></thead><tbody><tr><td>定义</td><td>Java API</td><td>协议</td></tr><tr><td>跨语言</td><td>否</td><td>是</td></tr><tr><td>跨平台</td><td>否</td><td>是</td></tr><tr><td>支持消息类型</td><td>提供两种消息模型：①Peer-2-Peer；②Pub/sub</td><td>提供了五种消息模型：①direct exchange；②fanout exchange；③topic change；④headers exchange；⑤system exchange。本质来讲，后四种和JMS的pub/sub模型没有太大差别，仅是在路由机制上做了更详细的划分。</td></tr><tr><td>支持消息类型</td><td>支持 5 种消息类型</td><td><code>byte[]</code>（二进制）</td></tr></tbody></table><p><strong>总结：</strong></p><ul><li><strong>AMQP 为消息定义了线路层（wire-level protocol）的协议，而 JMS 所定义的是 API 规范</strong>。在 Java 体系中，多个 client 均可以通过 JMS 进行交互，不需要应用修改代码，但是其对跨平台的支持较差。而 AMQP 天然具有跨平台、跨语言特性。</li><li>JMS 支持 TextMessage、MapMessage 等复杂的消息类型；而 AMQP 仅支持 <code>byte[]</code> 消息类型（复杂的类型可序列化后发送）。</li><li>由于 Exchange 提供的路由算法，AMQP 可以提供多样化的路由方式来传递消息到消息队列，而 JMS 仅支持 队列 和 主题/订阅 方式两种。</li></ul><h2 id="常见的消息队列对比" tabindex="-1"><a class="header-anchor" href="#常见的消息队列对比" aria-hidden="true">#</a> 常见的消息队列对比</h2><ul><li>ActiveMQ：基于JMS</li><li>RabbitMQ：基于AMQP协议，erlang语言开发，稳定性好</li><li>RocketMQ：基于JMS，阿里巴巴产品，目前交由Apache基金会</li><li>Kafka：分布式消息系统，高吞吐量</li></ul><table><thead><tr><th>特性</th><th>ActiveMQ</th><th>RabbitMQ</th><th>RocketMQ</th><th>Kafka</th></tr></thead><tbody><tr><td>单机吞吐量</td><td>万级，比 RocketMQ、Kafka 低一个数量级</td><td>同 ActiveMQ</td><td>10 万级，支撑高吞吐</td><td>10 万级，高吞吐，一般配合大数据类的系统来进行实时数据计算、日志采集等场景</td></tr><tr><td>topic 数量对吞吐量的影响</td><td></td><td></td><td>topic 可以达到几百/几千的级别，吞吐量会有较小幅度的下降，这是 RocketMQ 的一大优势，在同等机器下，可以支撑大量的 topic</td><td>topic 从几十到几百个时候，吞吐量会大幅度下降，在同等机器下，Kafka 尽量保证 topic 数量不要过多，如果要支撑大规模的 topic，需要增加更多的机器资源</td></tr><tr><td>时效性</td><td>ms 级</td><td>微秒级，这是 RabbitMQ 的一大特点，延迟最低</td><td>ms 级</td><td>延迟在 ms 级以内</td></tr><tr><td>可用性</td><td>高，基于主从架构实现高可用</td><td>同 ActiveMQ</td><td>非常高，分布式架构</td><td>非常高，分布式，一个数据多个副本，少数机器宕机，不会丢失数据，不会导致不可用</td></tr><tr><td>消息可靠性</td><td>有较低的概率丢失数据</td><td>基本不丢</td><td>经过参数优化配置，可以做到 0 丢失</td><td>同 RocketMQ</td></tr><tr><td>功能支持</td><td>MQ 领域的功能极其完备</td><td>基于 erlang 开发，并发能力很强，性能极好，延时很低</td><td>MQ 功能较为完善，还是分布式的，扩展性好</td><td>功能较为简单，主要支持简单的 MQ 功能，在大数据领域的实时计算以及日志采集被大规模使用</td></tr></tbody></table><p><strong>总结：</strong></p><ul><li><p><strong>ActiveMQ</strong> 的社区算是比较成熟，但是较目前来说，ActiveMQ 的性能比较差，而且版本迭代很慢，<strong>不推荐使用</strong>。</p></li><li><p><strong>RabbitMQ</strong> 在吞吐量方面虽然稍逊于 Kafka 和 RocketMQ，但是由于它基于 erlang 开发，所以并发能力很强，性能极其好，延时很低，达到微秒级。但是也因为 RabbitMQ 基于 erlang 开发，所以国内很少有公司有实力做 erlang 源码级别的研究和定制。</p><p>👍 <strong>如果业务场景对并发量要求不是太高（十万级、百万级），那这四种消息队列中，<em>RabbitMQ</em>一定是你的首选。</strong></p><p>👍 <strong>如果是大数据领域的实时计算、日志采集等场景，用 <em>Kafka</em> 是业内标准的，绝对没问题</strong>，社区活跃度很高，绝对不会黄，何况几乎是全世界这个领域的事实性规范。</p></li><li><p><strong>RocketMQ</strong> 阿里出品，Java 系开源项目，源代码我们可以直接阅读，然后可以定制自己公司的 MQ，并且 RocketMQ 有阿里巴巴的实际业务场景的实战考验。RocketMQ 社区活跃度相对较为一般，不过也还可以，文档相对来说简单一些，然后接口这块不是按照标准 JMS 规范走的有些系统要迁移需要修改大量代码。还有就是阿里出台的技术，你得做好这个技术万一被抛弃，社区黄掉的风险.</p></li><li><p><strong>kafka</strong> 的特点其实很明显，就是仅仅提供较少的核心功能，但是提供超高的吞吐量，ms 级的延迟，极高的可用性以及可靠性，而且分布式可以任意扩展。同时 kafka 最好是支撑较少的 topic 数量即可，保证其超高吞吐量。kafka 唯一的一点劣势是有可能消息重复消费，那么对数据准确性会造成极其轻微的影响，在大数据领域中以及日志采集中，这点轻微影响可以忽略这个特性，天然适合大数据实时计算以及日志收集。</p></li></ul><h2 id="📚-资料" tabindex="-1"><a class="header-anchor" href="#📚-资料" aria-hidden="true">#</a> 📚 资料</h2>',39),l=(0,r._)("p",null,[(0,r._)("strong",null,"RabbitMQ")],-1),n={href:"https://www.rabbitmq.com/",target:"_blank",rel:"noopener noreferrer"},d=(0,r.Uk)("RabbitMQ 官网"),s=(0,r._)("p",null,[(0,r._)("strong",null,"Kafka")],-1),o={href:"https://github.com/apache/kafka",target:"_blank",rel:"noopener noreferrer"},g=(0,r.Uk)("Kafka Github"),h={href:"http://kafka.apache.org/",target:"_blank",rel:"noopener noreferrer"},c=(0,r.Uk)("Kafka 官网"),p={href:"https://kafka.apache.org/documentation/",target:"_blank",rel:"noopener noreferrer"},u=(0,r.Uk)("Kafka 官方文档"),M={href:"https://github.com/apachecn/kafka-doc-zh",target:"_blank",rel:"noopener noreferrer"},m=(0,r.Uk)("Kafka 中文文档"),b=(0,r._)("p",null,"ActiveMQ",-1),Q={href:"http://activemq.apache.org/",target:"_blank",rel:"noopener noreferrer"},k=(0,r.Uk)("ActiveMQ 官网"),f=(0,r._)("h2",{id:"参考资料",tabindex:"-1"},[(0,r._)("a",{class:"header-anchor",href:"#参考资料","aria-hidden":"true"},"#"),(0,r.Uk)(" 参考资料")],-1),v={href:"https://doocs.gitee.io/advanced-java/#/./docs/distributed-system/distributed-system-interview",target:"_blank",rel:"noopener noreferrer"},A=(0,r.Uk)("doocs.gitee.io/advanced-java"),_=(0,r._)("li",null,[(0,r._)("a",{href:"gitee/v"},"gitee@veal98/CS-Wiki")],-1),S={},x=(0,a(3744).Z)(S,[["render",function(e,t){const a=(0,r.up)("OutboundLink");return(0,r.wg)(),(0,r.iD)(r.HY,null,[i,(0,r._)("ul",null,[(0,r._)("li",null,[l,(0,r._)("ul",null,[(0,r._)("li",null,[(0,r._)("a",n,[d,(0,r.Wm)(a)])])])]),(0,r._)("li",null,[s,(0,r._)("ul",null,[(0,r._)("li",null,[(0,r._)("a",o,[g,(0,r.Wm)(a)])]),(0,r._)("li",null,[(0,r._)("a",h,[c,(0,r.Wm)(a)])]),(0,r._)("li",null,[(0,r._)("a",p,[u,(0,r.Wm)(a)])]),(0,r._)("li",null,[(0,r._)("a",M,[m,(0,r.Wm)(a)])])])]),(0,r._)("li",null,[b,(0,r._)("ul",null,[(0,r._)("li",null,[(0,r._)("a",Q,[k,(0,r.Wm)(a)])])])])]),f,(0,r._)("ul",null,[(0,r._)("li",null,[(0,r._)("a",v,[A,(0,r.Wm)(a)])]),_])],64)}]])},3744:(e,t)=>{t.Z=(e,t)=>{for(const[a,r]of t)e[a]=r;return e}}}]);