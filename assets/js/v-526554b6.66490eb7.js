"use strict";(self.webpackChunkatips=self.webpackChunkatips||[]).push([[3948],{5575:(t,e,a)=>{a.r(e),a.d(e,{data:()=>r});const r={key:"v-526554b6",path:"/java/jvm/java-jvm-agent-arthas.html",title:"调试排错 - Arthas使用",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"Arthas简介",slug:"arthas简介",children:[{level:3,title:"Arthas是什么",slug:"arthas是什么",children:[]}]},{level:2,title:"Arthas入门",slug:"arthas入门",children:[{level:3,title:"Arthas安装",slug:"arthas安装",children:[]},{level:3,title:"Arthas能解决什么问题",slug:"arthas能解决什么问题",children:[]},{level:3,title:"常用命令",slug:"常用命令",children:[]}]},{level:2,title:"实际场景",slug:"实际场景",children:[{level:3,title:"查看最繁忙的线程，以及是否有阻塞情况发生?",slug:"查看最繁忙的线程-以及是否有阻塞情况发生",children:[]}]},{level:2,title:"参考资料",slug:"参考资料",children:[]}],filePathRelative:"java/jvm/java-jvm-agent-arthas.md",git:{updatedTime:1719836412e3,contributors:[{name:"Tianci.Xiong",email:"tiancixiong@163.com",commits:3},{name:"TianCi.Xiong",email:"support@xiongtianci.com",commits:2}]}}},6004:(t,e,a)=>{a.r(e),a.d(e,{default:()=>Q});var r=a(6252);const l=(0,r.uE)('<h1 id="调试排错-arthas使用" tabindex="-1"><a class="header-anchor" href="#调试排错-arthas使用" aria-hidden="true">#</a> 调试排错 - Arthas使用</h1><h2 id="arthas简介" tabindex="-1"><a class="header-anchor" href="#arthas简介" aria-hidden="true">#</a> Arthas简介</h2><h3 id="arthas是什么" tabindex="-1"><a class="header-anchor" href="#arthas是什么" aria-hidden="true">#</a> Arthas是什么</h3><p>Arthas 是 Alibaba 开源的 Java 诊断工具。支持 JDK6+， 采用命令行交互模式，提供 Tab 自动补全，可以方便定位和诊断线上程序的运行问题。</p><h2 id="arthas入门" tabindex="-1"><a class="header-anchor" href="#arthas入门" aria-hidden="true">#</a> Arthas入门</h2><h3 id="arthas安装" tabindex="-1"><a class="header-anchor" href="#arthas安装" aria-hidden="true">#</a> Arthas安装</h3><p>下载 <code>arthas-boot.jar</code>，然后用 <code>java -jar</code> 的方式启动：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">curl</span> -O https://arthas.aliyun.com/arthas-boot.jar\njava -jar arthas-boot.jar\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="arthas能解决什么问题" tabindex="-1"><a class="header-anchor" href="#arthas能解决什么问题" aria-hidden="true">#</a> Arthas能解决什么问题</h3><p>使用 Arthas 可以帮助你解决：</p><ul><li>可以很方便查到一类是从哪个 jar 包加载的？为什么会报各种类相关的 Exception？</li><li>怀疑自己的代码未被部署到服务器，可以通过命令快速验证服务器上的代码就是本地的代码；</li><li>可以直接通过 arthas 进行线上 debug，查看方法返回值以确认问题所在；</li><li>可以很方便嵌入自己的 debug 代码，快速验证猜想；</li><li>操作完成后，可以将所有 debug 代码删除，从而避免影响线上运行；</li></ul><h3 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令" aria-hidden="true">#</a> 常用命令</h3><h4 id="dashboard" tabindex="-1"><a class="header-anchor" href="#dashboard" aria-hidden="true">#</a> dashboard</h4>',13),d={href:"https://arthas.aliyun.com/doc/dashboard.html#dashboard",target:"_blank",rel:"noopener noreferrer"},n=(0,r.Uk)("dashboard"),s=(0,r.Uk)(" 命令可以查看当前系统的实时数据面板。"),h=(0,r.uE)('<p><img src="//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/java/jvm/java-jvm-agent-arthas-dashboard.png" alt="dashboard"></p><p>面板中 <strong>Thread</strong> 各数据说明：</p><table><thead><tr><th style="text-align:left;">名称</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">ID</td><td style="text-align:left;">Java级别的线程ID，注意这个ID不能跟 jstack 中的 nativeID 一一对应</td></tr><tr><td style="text-align:left;">NAME</td><td style="text-align:left;">线程名</td></tr><tr><td style="text-align:left;">GROUP</td><td style="text-align:left;">线程组名</td></tr><tr><td style="text-align:left;">PRIORITY</td><td style="text-align:left;">线程优先级, 1~10之间的数字，越大表示优先级越高</td></tr><tr><td style="text-align:left;">STATE</td><td style="text-align:left;">线程的状态</td></tr><tr><td style="text-align:left;">CPU%</td><td style="text-align:left;">线程的cpu使用率。比如采样间隔1000ms，某个线程的增量cpu时间为100ms，则cpu使用率=100/1000=10%</td></tr><tr><td style="text-align:left;">DELTA_TIME</td><td style="text-align:left;">上次采样之后线程运行增量CPU时间，数据格式为<code>秒</code></td></tr><tr><td style="text-align:left;">TIME</td><td style="text-align:left;">线程运行总CPU时间，数据格式为<code>分:秒</code></td></tr><tr><td style="text-align:left;">INTERRUPTED</td><td style="text-align:left;">线程当前的中断位状态</td></tr><tr><td style="text-align:left;">DAEMON</td><td style="text-align:left;">是否是daemon线程</td></tr></tbody></table><p>JVM内部线程包括下面几种：</p><ul><li>JIT编译线程: 如 C1 CompilerThread0、 C2 CompilerThread0</li><li>GC线程: 如 GC Thread0、 G1 Young RemSet Sampling</li><li>其它内部线程: 如 VM Periodic Task Thread,、VM Thread、 Service Thread</li></ul><h4 id="thread" tabindex="-1"><a class="header-anchor" href="#thread" aria-hidden="true">#</a> thread</h4>',6),i={href:"https://arthas.aliyun.com/doc/thread.html#thread",target:"_blank",rel:"noopener noreferrer"},o=(0,r.Uk)("thread"),c=(0,r.Uk)(" 命令可以查看当前 JVM 的线程堆栈信息。一目了然的了解系统的状态，哪些线程比较占cpu，他们到底在做什么。"),g=(0,r.uE)('<p><code>thread</code> 参数列表：</p><table><thead><tr><th style="text-align:left;">参数名称</th><th style="text-align:left;">参数说明</th></tr></thead><tbody><tr><td style="text-align:left;">id</td><td style="text-align:left;">线程id</td></tr><tr><td style="text-align:left;">-n</td><td style="text-align:left;">指定最忙的前N个线程并打印堆栈</td></tr><tr><td style="text-align:left;">[b]</td><td style="text-align:left;">找出当前阻塞其他线程的线程</td></tr><tr><td style="text-align:left;">[i ]</td><td style="text-align:left;">指定cpu占比统计的采样间隔，单位为毫秒</td></tr><tr><td style="text-align:left;">[--all]</td><td style="text-align:left;">显示所有匹配的线程</td></tr></tbody></table><p>例如：<code>thread -n 3</code> 展示当前最忙的前3个线程并打印堆栈</p><h4 id="classloader" tabindex="-1"><a class="header-anchor" href="#classloader" aria-hidden="true">#</a> classloader</h4>',4),u={href:"https://arthas.aliyun.com/doc/classloader.html#classloader",target:"_blank",rel:"noopener noreferrer"},p=(0,r.Uk)("classloader"),f=(0,r.Uk)(" 命令将 JVM 中所有的 classloader 的信息统计出来，并可以展示继承树，urls 等。了解当前系统中有多少类加载器，以及每个加载器加载的类数量，帮助您判断是否有类加载器泄露。"),m=(0,r._)("h4",{id:"jad",tabindex:"-1"},[(0,r._)("a",{class:"header-anchor",href:"#jad","aria-hidden":"true"},"#"),(0,r.Uk)(" jad")],-1),b={href:"https://arthas.aliyun.com/doc/jad.html#jad",target:"_blank",rel:"noopener noreferrer"},x=(0,r.Uk)("jad"),y=(0,r.Uk)(" 命令可以对类进行反编译。将 JVM 中实际运行的 class 的 byte code 反编译成 java 代码，便于你理解业务逻辑。"),k=(0,r.uE)('<p>参数列表：</p><table><thead><tr><th style="text-align:left;">参数名称</th><th>参数说明</th></tr></thead><tbody><tr><td style="text-align:left;"><em>class-pattern</em></td><td>类名表达式匹配</td></tr><tr><td style="text-align:left;"><code>[c:]</code></td><td>类所属 ClassLoader 的 hashcode</td></tr><tr><td style="text-align:left;"><code>[classLoaderClass:]</code></td><td>指定执行表达式的 ClassLoader 的 class name</td></tr><tr><td style="text-align:left;">[E]</td><td>开启正则表达式匹配，默认为通配符匹配</td></tr></tbody></table><p>例如：<code>jad java.lang.String toString</code></p><h4 id="monitor" tabindex="-1"><a class="header-anchor" href="#monitor" aria-hidden="true">#</a> monitor</h4>',4),_={href:"https://arthas.aliyun.com/doc/monitor.html#monitor",target:"_blank",rel:"noopener noreferrer"},v=(0,r.Uk)("monitor"),j=(0,r.Uk)(" 监控某个特殊方法的调用统计数据，包括总调用次数，平均 rt，成功率等信息，每隔5秒输出一次。"),U=(0,r._)("h4",{id:"watch",tabindex:"-1"},[(0,r._)("a",{class:"header-anchor",href:"#watch","aria-hidden":"true"},"#"),(0,r.Uk)(" watch")],-1),T={href:"https://arthas.aliyun.com/doc/watch.html#watch",target:"_blank",rel:"noopener noreferrer"},A=(0,r.Uk)("watch"),E=(0,r.Uk)(" 命令用于方法执行数据观测。可以观察指定方法的调用情况。能观察到的范围为："),w=(0,r._)("strong",null,"返回值",-1),C=(0,r.Uk)("、"),M=(0,r._)("strong",null,"抛出异常",-1),W=(0,r.Uk)("、"),I=(0,r._)("strong",null,"入参",-1),D=(0,r.Uk)("，通过编写 OGNL 表达式进行对应变量的查看。"),G=(0,r.uE)('<p>参数列表：</p><table><thead><tr><th style="text-align:left;">参数名称</th><th style="text-align:left;">参数说明</th></tr></thead><tbody><tr><td style="text-align:left;"><em>class-pattern</em></td><td style="text-align:left;">类名表达式匹配</td></tr><tr><td style="text-align:left;"><em>method-pattern</em></td><td style="text-align:left;">方法名表达式匹配</td></tr><tr><td style="text-align:left;"><em>express</em></td><td style="text-align:left;">观察表达式，主要由 ognl 表达式组成，默认值：<code>{params, target, returnObj}</code></td></tr><tr><td style="text-align:left;"><em>condition-express</em></td><td style="text-align:left;">条件表达式</td></tr><tr><td style="text-align:left;">[b]</td><td style="text-align:left;">在<strong>方法调用之前</strong>观察</td></tr><tr><td style="text-align:left;">[e]</td><td style="text-align:left;">在<strong>方法异常之后</strong>观察</td></tr><tr><td style="text-align:left;">[s]</td><td style="text-align:left;">在<strong>方法返回之后</strong>观察</td></tr><tr><td style="text-align:left;">[f]</td><td style="text-align:left;">在<strong>方法结束之后</strong>(正常返回和异常返回)观察</td></tr><tr><td style="text-align:left;">[E]</td><td style="text-align:left;">开启正则表达式匹配，默认为通配符匹配</td></tr><tr><td style="text-align:left;">[x:]</td><td style="text-align:left;">指定输出结果的属性遍历深度，默认为 1</td></tr></tbody></table><p>例子：<code>watch demo.MathGame primeFactors &quot;{params,throwExp}&quot; -e</code> 观察方法 <code>demo.MathGame#primeFactors</code> 执行的入参，仅当方法抛出异常时才输出</p><h4 id="tt" tabindex="-1"><a class="header-anchor" href="#tt" aria-hidden="true">#</a> tt</h4>',4),J={href:"https://arthas.aliyun.com/doc/tt.html#tt",target:"_blank",rel:"noopener noreferrer"},P=(0,r.Uk)("tt"),O=(0,r.Uk)(" 命令是 Time Tunnel 缩写，方法执行数据的时空隧道，可以录下指定方法每次调用的入参和返回信息，并能对这些不同的时间下调用进行观测。"),R=(0,r.uE)('<h4 id="退出arthas" tabindex="-1"><a class="header-anchor" href="#退出arthas" aria-hidden="true">#</a> 退出arthas</h4><p>如果只是退出当前的连接，可以用 <code>quit</code> 或者 <code>exit</code> 命令。Attach 到目标进程上的 arthas 还会继续运行，端口会保持开放，下次连接时可以直接连接上。</p><p>如果想完全退出 arthas，可以执行 <code>stop</code> 命令。</p><h4 id="更多命令" tabindex="-1"><a class="header-anchor" href="#更多命令" aria-hidden="true">#</a> 更多命令</h4>',4),L={href:"https://arthas.aliyun.com/doc/commands.html",target:"_blank",rel:"noopener noreferrer"},N=(0,r.Uk)("命令列表"),S=(0,r._)("h2",{id:"实际场景",tabindex:"-1"},[(0,r._)("a",{class:"header-anchor",href:"#实际场景","aria-hidden":"true"},"#"),(0,r.Uk)(" 实际场景")],-1),V={href:"https://www.cnblogs.com/yougewe/p/10770690.html",target:"_blank",rel:"noopener noreferrer"},q=(0,r.Uk)("博客园 - yougewe"),Y=(0,r.uE)('<h3 id="查看最繁忙的线程-以及是否有阻塞情况发生" tabindex="-1"><a class="header-anchor" href="#查看最繁忙的线程-以及是否有阻塞情况发生" aria-hidden="true">#</a> 查看最繁忙的线程，以及是否有阻塞情况发生?</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>thread -n <span class="token number">3</span> <span class="token comment"># 查看最繁忙的三个线程栈信息</span>\nthread  <span class="token comment"># 以直观的方式展现所有的线程情况</span>\nthread -b <span class="token comment">#找出当前阻塞其他线程的线程</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h2>',3),F=(0,r.Uk)("官方文档："),X={href:"https://arthas.aliyun.com/doc/",target:"_blank",rel:"noopener noreferrer"},Z=(0,r.Uk)("Arthas 用户文档"),z=(0,r.Uk)("开源地址："),H={href:"https://github.com/alibaba/arthas",target:"_blank",rel:"noopener noreferrer"},K=(0,r.Uk)("Arthas - Github"),B={},Q=(0,a(3744).Z)(B,[["render",function(t,e){const a=(0,r.up)("OutboundLink");return(0,r.wg)(),(0,r.iD)(r.HY,null,[l,(0,r._)("p",null,[(0,r._)("a",d,[n,(0,r.Wm)(a)]),s]),h,(0,r._)("p",null,[(0,r._)("a",i,[o,(0,r.Wm)(a)]),c]),g,(0,r._)("p",null,[(0,r._)("a",u,[p,(0,r.Wm)(a)]),f]),m,(0,r._)("p",null,[(0,r._)("a",b,[x,(0,r.Wm)(a)]),y]),k,(0,r._)("p",null,[(0,r._)("a",_,[v,(0,r.Wm)(a)]),j]),U,(0,r._)("p",null,[(0,r._)("a",T,[A,(0,r.Wm)(a)]),E,w,C,M,W,I,D]),G,(0,r._)("p",null,[(0,r._)("a",J,[P,(0,r.Wm)(a)]),O]),R,(0,r._)("ul",null,[(0,r._)("li",null,[(0,r._)("a",L,[N,(0,r.Wm)(a)])])]),S,(0,r._)("blockquote",null,[(0,r._)("p",null,[(0,r._)("a",V,[q,(0,r.Wm)(a)])])]),Y,(0,r._)("ul",null,[(0,r._)("li",null,[F,(0,r._)("a",X,[Z,(0,r.Wm)(a)])]),(0,r._)("li",null,[z,(0,r._)("a",H,[K,(0,r.Wm)(a)])])])],64)}]])},3744:(t,e)=>{e.Z=(t,e)=>{for(const[a,r]of e)t[a]=r;return t}}}]);