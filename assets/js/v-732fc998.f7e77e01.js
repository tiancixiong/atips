"use strict";(self.webpackChunkatips=self.webpackChunkatips||[]).push([[970],{6834:(e,t,n)=>{n.r(t),n.d(t,{data:()=>a});const a={key:"v-732fc998",path:"/software/vcs/git-ignore.html",title:"忽略特殊文件",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:".gitignore介绍",slug:"gitignore介绍",children:[]},{level:2,title:".gitignore匹配语法",slug:"gitignore匹配语法",children:[]},{level:2,title:"校验规则是否生效",slug:"校验规则是否生效",children:[]},{level:2,title:"特殊案例",slug:"特殊案例",children:[{level:3,title:"只要A目录中的t1文件",slug:"只要a目录中的t1文件",children:[]},{level:3,title:"已经跟踪过的文件忽略规则不生效",slug:"已经跟踪过的文件忽略规则不生效",children:[]}]},{level:2,title:"参考资料",slug:"参考资料",children:[]}],filePathRelative:"software/vcs/git-ignore.md",git:{updatedTime:1701927383e3,contributors:[{name:"TianCi.Xiong",email:"support@xiongtianci.com",commits:1},{name:"TianCi.Xiong",email:"tiancixiong@163.com",commits:1},{name:"Tianci.Xiong",email:"tiancixiong@163.com",commits:1}]}}},4408:(e,t,n)=>{n.r(t),n.d(t,{default:()=>A});var a=n(6252);const s=(0,a._)("h1",{id:"忽略特殊文件",tabindex:"-1"},[(0,a._)("a",{class:"header-anchor",href:"#忽略特殊文件","aria-hidden":"true"},"#"),(0,a.Uk)(" 忽略特殊文件")],-1),i=(0,a._)("h2",{id:"gitignore介绍",tabindex:"-1"},[(0,a._)("a",{class:"header-anchor",href:"#gitignore介绍","aria-hidden":"true"},"#"),(0,a.Uk)(" .gitignore介绍")],-1),l=(0,a._)("p",null,[(0,a.Uk)("在使用 Git 的过程中，我们希望不提交工作目录中的一些文件，比如日志，临时文件等。就可以在 Git 工作区的根目录下创建一个特殊的 "),(0,a._)("code",null,".gitignore"),(0,a.Uk)(" 文件，然后把要忽略的文件名填进去，Git就会自动忽略这些文件。")],-1),r=(0,a.Uk)("另外我们不需要从头写 .gitignore 文件，GitHub 开源了一个项目："),o={href:"https://github.com/github/gitignore",target:"_blank",rel:"noopener noreferrer"},d=(0,a.Uk)("github/gitignore"),c=(0,a.Uk)("，里面已经提供了很多模板。"),p=(0,a.uE)('<hr><p>.gitignore 忽略文件的原则是：</p><ul><li>忽略操作系统自动生成的文件，比如缩略图等；</li><li>忽略编译生成的中间文件、可执行文件等，也就是如果一个文件是通过另一个文件自动生成的，那自动生成的文件就没必要放进版本库，比如 Java 编译产生的 <code>.class</code> 文件；</li><li>忽略你自己的带有敏感信息的配置文件，比如存放口令的配置文件。</li></ul><hr><p><strong>.gitignore 忽略规则的优先级</strong> 在 .gitingore 文件中，每一行指定一个忽略规则，Git 检查忽略规则的时候有多个来源，它的优先级如下（由高到低）：</p><ol><li>从命令行中读取可用的忽略规则【优先级高】</li><li>当前目录定义的规则</li><li>父级目录定义的规则，依次递推</li><li><code>$GIT_DIR/info/exclude</code> 文件中定义的规则</li><li><code>core.excludesfile</code> 中定义的全局规则【优先级低】</li></ol><h2 id="gitignore匹配语法" tabindex="-1"><a class="header-anchor" href="#gitignore匹配语法" aria-hidden="true">#</a> .gitignore匹配语法</h2><p>在 .gitignore 编写规则，一行即一条规则，不区分大小写。</p><table><thead><tr><th style="text-align:left;">符号</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">空格</td><td style="text-align:left;">不匹配任意文件，可作为分隔符，可用反斜杠转义</td></tr><tr><td style="text-align:left;"><code>＃</code></td><td style="text-align:left;">以 <code>#</code> 开头的是注释，都会被 Git 忽略，可以使用反斜杠进行转义</td></tr><tr><td style="text-align:left;"><code>/</code> 开始</td><td style="text-align:left;">以 <code>/</code> 开始则匹配<u>绝对路径</u>，只从项目根目录开始进行匹配；<br>不以 <code>/</code> 开始则是匹配<u>相对路径</u>，会<u>递归</u>进行匹配<br>如：<code>frotz</code> 匹配 <code>frotz</code> 、 <code>a/frotz</code> ；<code>/frotz</code> 只匹配 <code>frotz</code> ，不匹配 <code>a/frotz</code></td></tr><tr><td style="text-align:left;"><code>/</code> 结束</td><td style="text-align:left;">以 <code>/</code> 结束则只匹配<strong>目录</strong>以及在该目录里面的内容，<u>不匹配</u>该<strong>文件</strong>；<br>不以 <code>/</code> 结束则匹配目录、目录下的内容，和文件</td></tr><tr><td style="text-align:left;"><code>*</code></td><td style="text-align:left;">通配符，匹配多个任意字符</td></tr><tr><td style="text-align:left;"><code>**</code></td><td style="text-align:left;">匹配任意中间目录</td></tr><tr><td style="text-align:left;"><code>?</code></td><td style="text-align:left;">通配符，匹配单个任意字符</td></tr><tr><td style="text-align:left;"><code>[]</code></td><td style="text-align:left;">匹配任何一个列在方括号中的字符。比如 <code>[abc]</code> 表示要么匹配一个 a，要么匹配一个 b，要么匹配一个 c</td></tr><tr><td style="text-align:left;"><code>[0-9]</code></td><td style="text-align:left;">在方括号中使用<u>短划线</u>分隔两个字符，表示所有在这两个字符范围内的都可以匹配</td></tr><tr><td style="text-align:left;"><code>!</code></td><td style="text-align:left;">非，取反的意思，即不忽略匹配到的文件或目录<br>注意：<strong>如果文件的父目录已经被已有的规则排除掉了，那么再对里面的子文件用 <code>!</code> 规则是不起作用的</strong></td></tr></tbody></table><p>以上特殊字符如果出现在文件或目录名中，可使用 <code>\\</code> 反斜杠进行转义。如：<code>!\\!important!.txt</code></p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>git 对于 .ignore 配置文件是按行<strong>从上到下</strong>进行规则匹配的，意味着如果前面的规则匹配的范围更大，则后面的规则将不会生效。</p></div><h2 id="校验规则是否生效" tabindex="-1"><a class="header-anchor" href="#校验规则是否生效" aria-hidden="true">#</a> 校验规则是否生效</h2><p>通过 <code>git check-ignore</code> 命令可以检查文件是否被 .gitignore 忽略。</p><p>命令格式：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> check-ignore <span class="token punctuation">[</span>options<span class="token punctuation">]</span> pathname…\n\noptions 选项：\n<span class="token number">1</span>. -v 显示匹配的详细信息\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>例如：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>$ <span class="token function">git</span> check-ignore -v A/t1\n.gitignore:3:A/ A/t1\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>从打印结果可以看到，在 .gitignore 文件的第3行有一条 <code>A/</code> 的规则忽略掉了 A 目录下的 t1 文件。</p><h2 id="特殊案例" tabindex="-1"><a class="header-anchor" href="#特殊案例" aria-hidden="true">#</a> 特殊案例</h2><h3 id="只要a目录中的t1文件" tabindex="-1"><a class="header-anchor" href="#只要a目录中的t1文件" aria-hidden="true">#</a> 只要A目录中的t1文件</h3><p>场景：A 目录下包含 t1、t2、t3等文件，但是只需要跟踪 t1 文件，其他文件忽略。</p><p>正确规则如下：</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>/A/*\n!/A/t1\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><hr><p>错误案例：</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>/A/\n!/A/t1\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>上面规则最后会发现 <code>!/A/t1</code> 并没有生效，t1 仍然被忽略掉了。</p><h3 id="已经跟踪过的文件忽略规则不生效" tabindex="-1"><a class="header-anchor" href="#已经跟踪过的文件忽略规则不生效" aria-hidden="true">#</a> 已经跟踪过的文件忽略规则不生效</h3><p>现在，有文件 t1 之前已经 add 或 commit 跟踪过了，后面发现不需要对其进行跟踪，在 .gitignore 中加入过滤规则。在这种情况下，发现即使添加过滤规则后，文件 t1 仍然在被跟踪，没有被忽略掉。</p><hr><p>场景一：t1 add 了，但是没有 commit。使用下面命令：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 不写 pathname 则取消所有文件的 add</span>\n<span class="token function">git</span> reset HEAD pathname\n<span class="token comment"># 重新 add</span>\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><hr><p>场景二：t1 已经commit了。</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 删除的本地缓存</span>\n<span class="token function">git</span> <span class="token function">rm</span> -r --cached <span class="token builtin class-name">.</span>\n<span class="token comment"># 重新 add</span>\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>通过 <code>git status</code> 可以看到 t1 文件的状态为 <code>deleted</code></p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h2>',37),g={href:"https://www.cnblogs.com/kevingrace/p/5690241.html",target:"_blank",rel:"noopener noreferrer"},u=(0,a.Uk)(".gitignore配置运维总结"),h=(0,a.Uk)(" - 博客园"),b=(0,a.Uk)("Git 官方文档(gitignore)："),m={href:"https://git-scm.com/docs/gitignore",target:"_blank",rel:"noopener noreferrer"},f=(0,a.Uk)("英文"),x=(0,a.Uk)("、"),k={href:"https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E8%AE%B0%E5%BD%95%E6%AF%8F%E6%AC%A1%E6%9B%B4%E6%96%B0%E5%88%B0%E4%BB%93%E5%BA%93",target:"_blank",rel:"noopener noreferrer"},v=(0,a.Uk)("中文"),y={},A=(0,n(3744).Z)(y,[["render",function(e,t){const n=(0,a.up)("OutboundLink");return(0,a.wg)(),(0,a.iD)(a.HY,null,[s,i,l,(0,a._)("p",null,[r,(0,a._)("a",o,[d,(0,a.Wm)(n)]),c]),p,(0,a._)("ul",null,[(0,a._)("li",null,[(0,a._)("a",g,[u,(0,a.Wm)(n)]),h]),(0,a._)("li",null,[b,(0,a._)("a",m,[f,(0,a.Wm)(n)]),x,(0,a._)("a",k,[v,(0,a.Wm)(n)])])])],64)}]])},3744:(e,t)=>{t.Z=(e,t)=>{for(const[n,a]of t)e[n]=a;return e}}}]);