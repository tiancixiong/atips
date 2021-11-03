# Linux - 常用

> 本文整理 Linux 中常用的命令和常见的概念，基于 CentOS 7 环境。

## 系统服务管理

### systemctl

systemctl：系统服务管理器指令，它实际上将 service 和 chkconfig 这两个命令组合到一起。

| 任务                 | 旧指令                        | 新指令                                                       |
| -------------------- | ----------------------------- | ------------------------------------------------------------ |
| 设置开机自启动       | chkconfig --level 3 httpd on  | systemctl enable httpd.service                               |
| 停止开机自启动       | chkconfig --level 3 httpd off | systemctl disable httpd.service                              |
| 检查服务状态         | service httpd status          | systemctl status httpd.service （服务详细信息）<br />systemctl is-active httpd.service （仅显示是否 Active) |
| 显示所有已启动的服务 | chkconfig --list              | systemctl list-units --type=service                          |
| 启动某服务           | service httpd start           | systemctl start httpd.service                                |
| 停止某服务           | service httpd stop            | systemctl stop httpd.service                                 |
| 重启某服务           | service httpd restart         | systemctl restart httpd.service                              |





## 文件管理

### ls

列出当前目录下的所有文件：

```shell
ls       # 仅列出当前目录可见文件
ls -l    # 列出当前目录可见文件详细信息
ls -hl   # 列出详细信息并以可读大小显示文件大小
ls -al   # 列出所有文件（包括隐藏）的详细信息
```

### pwd

获取目前所在工作目录的**绝对路径**

### cd

切换用户当前工作目录

```shell
cd    进入用户主目录；
cd ~  进入用户主目录；
cd -  返回进入此目录之前所在的目录；
cd ..  返回上级目录（若当前目录为“/“，则执行完后还在“/"；".."为上级目录的意思）；
cd ../..  返回上两级目录；
cd !$  把上个命令的参数作为cd参数使用。
```

### date

显示或修改系统时间与日期。在类UNIX系统中，日期被存储为一个整数，其大小为自世界标准时间（UTC）1970年1月1日0时0分0秒起流逝的秒数。

```shell
# 指定显示时使用的日期时间格式
date '+%Y-%m-%d %H:%M:%S'

%H 小时，24小时制（00~23）
%I 小时，12小时制（01~12）
%k 小时，24小时制（0~23）
%l 小时，12小时制（1~12）
%M 分（00～59）
%p 显示出上午或下午
%r 时间，12小时制
%s 从1970年1月1日0点到目前经历的秒数
%S 秒（00～59） 
%T 时间（24小时制）（hh:mm:ss）
%X 显示时间的格式（％H时％M分％S秒）
%Z 按字母表排序的时区缩写
%a 星期名缩写
%A 星期名全称
%b 月名缩写
%B 月名全称
%c 日期和时间
%d 按月计的日期（01～31）
%D 日期（mm/dd/yy） 
%h 和%b选项相同
%j 一年的第几天（001~366）
%m 月份（01～12）
%w 一个星期的第几天（0代表星期天）
%W 一年的第几个星期（00～53，星期一为第一天）
%x 显示日期的格式（mm/dd/yy）
%y 年份的最后两个数字（1999则是99）
%Y 年份（比如1970、1996等）
%C   世纪，通常为省略当前年份的后两位数字
%U  一年中的第几周，以周日为每星期第一天
%e   按月计的日期，添加空格，等于%_d
```

### passwd

passwd：用于设置用户的认证信息，包括用户密码、密码过期时间等。系统管理者则能用它管理系统用户的密码。只有管理者可以指定用户名称，一般用户只能变更自己的密码。

```shell
passwd root
```

### su

用于切换当前用户身份到其他用户身份

```shell
# 切换到超级用户
su -
su root
```

### clear

用于清除屏幕信息

### man

查看Linux中的指令帮助。

我们输入 `man ls`，它会在最左上角显示“LS（1）”，在这里，“LS”表示手册名称，而“（1）”表示该手册位于第一节章，同样，我们输 `man ifconfig` 它会在最左上角显示“IFCONFIG（8）”。也可以这样输入命令：`man [章节号] 手册名称`。

例子：`man ls`、`man 3 ifconfig`

### who

who：显示目前登录系统的用户信息。执行 who 命令可得知目前有那些用户登入系统，单独执行who命令会列出登入帐号，使用的终端机，登入时间以及从何处登入或正在使用哪个X显示器。

- 查询系统处于什么运行级别：

```shell
who -r
```

- 显示目前登录到系统的用户：
```shell
who -buT
```

### free
显示系统内存状态。展示系统未使用的和已使用的内存数目，还可以显示被内核使用的内存缓冲区。
```shell
free (选项)

选项：
-b #以Byte为单位显示内存使用情况；
-k #以KB为单位显示内存使用情况；
-m #以MB为单位显示内存使用情况；
-g #以GB为单位显示内存使用情况。 
-o #不显示缓冲区调节列；
-s<间隔秒数> #持续观察内存使用状况；
-t #以总和的形式显示内存的使用信息；
-V #显示版本信息。
```

### ps
ps：显示当前系统的进程状态。

可以搭配 kill 指令随时中断、删除不必要的程序。ps命令是最基本同时也是非常强大的进程查看命令，使用该命令可以确定有哪些进程正在运行和运行的状态、进程是否结束、进程有没有僵死、哪些进程占用了过多的资源等等，总之大部分信息都是可以通过执行该命令得到的。

```shell
# 显示系统进程运行动态
ps -ef
# 查看sshd进程的运行动态
ps -ef | grep sshd

# 按内存资源的使用量对进程进行排序
ps aux | sort -rnk 4
# 按 CPU 资源的使用量对进程进行排序
ps aux | sort -nk 3
```
### top
top：查看即时活跃的进程，类似Windows的任务管理器。

选项：

```bash
-b：以批处理模式操作；
-c：显示完整的治命令；
-d：屏幕刷新间隔时间；
-I：忽略失效过程；
-s：保密模式；
-S：累积模式；
-i<时间>：设置间隔时间；
-u<用户名>：指定用户名；
-p<进程号>：指定进程；
-n<次数>：循环显示的次数。
```

#### top交互命令

在top命令执行过程中可以使用的一些交互命令。这些命令都是单字母的，如果在命令行中使用了 `-s` 选项， 其中一些命令可能会被屏蔽。

```bash
h：显示帮助画面，给出一些简短的命令总结说明；
k：终止一个进程；
i：忽略闲置和僵死进程，这是一个开关式命令；
q：退出程序；
r：重新安排一个进程的优先级别；
S：切换到累计模式；
s：改变两次刷新之间的延迟时间（单位为s），如果有小数，就换算成ms。输入0值则系统将不断刷新，默认值是5s；
f或者F：从当前显示中添加或者删除项目；
o或者O：改变显示项目的顺序；
l：切换显示平均负载和启动时间信息；
m：切换显示内存信息；
t：切换显示进程和CPU状态信息；
c：切换显示命令名称和完整命令行；
M：根据驻留内存大小进行排序；
P：根据CPU使用百分比大小进行排序；
T：根据时间/累计时间进行排序；
w：将当前设置写入~/.toprc文件中。
```

### mkdir
mkdir：创建**目录**。

```
mkdir (选项)(参数)

选项：
-Z：设置安全上下文，当使用SELinux时有效；
-m<目标属性>或--mode<目标属性>建立目录的同时设置目录的权限；
-p或--parents 若所要建立目录的上层目录目前尚未建立，则会一并建立上层目录；
--version 显示版本信息。

参数：
1.目录：要创建的目录列表，多个目录之间用空格隔开
```

例子：

```bash
# 有读、写和执行权限，其他人无权访问
mkdir -pm 700 /usr/meng/test
```

### more
显示文件内容，每次显示一屏。用于文件过长时分页查看文件内容。
```shell
# 每页10行查看boot.log文件
more -c -10 /var/log/boot.log

选项：
-<数字>：指定每屏显示的行数；
-d：显示“[press space to continue,'q' to quit.]”和“[Press 'h' for instructions]”；
-c：不进行滚屏操作。每次刷新这个屏幕；
-s：将多个空行压缩成一行显示；
-u：禁止下划线；
+<数字>：从指定数字的行开始显示。
```

- 按Space键：显示文本的下一屏内容。

- 按Enier键：只显示文本的下一行内容。

- 按斜线符`|`：接着输入一个模式，可以在文本中寻找下一个相匹配的模式。

- 按H键：显示帮助屏，该屏上有相关的帮助信息。

- 按B键：显示上一屏内容。

- 按Q键：退出rnore命令。

### cat

查看Linux启动日志文件文件，并标明行号：
```shell
cat -Ab /var/log/boot.log

选项：
-n或-number：有1开始对所有输出的行数编号；
-b或--number-nonblank：和-n相似，只不过对于空白行不编号；
-s或--squeeze-blank：当遇到有连续两行以上的空白行，就代换为一行的空白行；
-A：显示不可打印字符，行尾显示“$”；
-e：等价于"-vE"选项；
-t：等价于"-vT"选项；
```

为了控制滚屏，可以按Ctrl+S键，停止滚屏；按Ctrl+Q键可以恢复滚屏。按Ctrl+C（中断）键可以终止该命令的执行，并且返回Shell提示符状态。

### touch

*touch* 有两个功能：

1. 用于把已存在文件的时间标签更新为系统当前的时间（默认方式），它们的数据将原封不动地保留下来；
2. 用来创建新的空文件。

```shell
# 创建text.txt文件
touch text.txt

选项：
-a：或--time=atime或--time=access或--time=use  只更改存取时间；
-c：或--no-create  不建立任何文件；
-d：<时间日期> 使用指定的日期时间，而非现在的时间；
-f：此参数将忽略不予处理，仅负责解决BSD版本touch指令的兼容性问题；
-m：或--time=mtime或--time=modify  只更该变动时间；
-r：<参考文件或目录>  把指定文件或目录的日期时间，统统设成和参考文件或目录的日期时间相同；
-t：<日期时间>  使用指定的日期时间，而非现在的时间；
--help：在线帮助；
--version：显示版本信息。
```

### rm

- 删除文件：
```shell
rm text.txt
```
- 强制删除某个目录及其子目录：
```shell
rm -rf testdir/
```

注意：使用rm命令要格外小心。因为一旦删除了一个文件，就无法再恢复它。所以，在删除文件之前，最好再看一下文件的内容，确定是否真要删除。rm命令可以用-i选项，这个选项在使用文件扩展名字符删除多个文件时特别有用。使用这个选项，系统会要求你逐一确定是否要删除。这时，必须输入y并按Enter键，才能删除文件。如果仅按Enter键或其他字符，文件不会被删除。

```
选项：
-d：直接把欲删除的目录的硬连接数据删除成0，删除该目录；
-f：强制删除文件或目录；
-i：删除已有文件或目录之前先询问用户；
-r或-R：递归处理，将指定目录下的所有文件与子目录一并处理；
--preserve-root：不对根目录进行递归操作；
-v：显示指令的详细执行过程。
```


### cp
cp：将一个或多个源文件或者目录复制到指定的目标文件或目录。cp 命令还支持同时复制多个文件，当一次复制多个文件时，目标文件参数必须是一个已经存在的目录，否则将出现错误。

```shell
cp -r 源文件 目标文件

选项：
-a：此参数的效果和同时指定"-dpR"参数相同；
-d：当复制符号连接时，把目标文件或目录也建立为符号连接，并指向与源文件或目录连接的原始文件或目录；
-f：强行复制文件或目录，不论目标文件或目录是否已存在；
-i：覆盖既有文件之前先询问用户；
-l：对源文件建立硬连接，而非复制文件；
-p：保留源文件或目录的属性；
-R/r：递归处理，将指定目录下的所有文件与子目录一并处理；
-s：对源文件建立符号连接，而非复制文件；
-u：使用这项参数后只会在源文件的更改时间较目标文件更新时或是名称相互对应的目标文件并不存在时，才复制文件；
-S：在备份文件时，用指定的后缀“SUFFIX”代替文件的默认后缀；
-b：覆盖已存在的文件目标前将目标文件备份；
-v：详细显示命令执行的操作。
```
### mv
移动或覆盖（重命名）文件。
```shell
mv 源文件 目标文件

选项：
--backup=<备份模式>：若需覆盖文件，则覆盖前先行备份；
-b：当文件存在时，覆盖前，为其创建一个备份；
-f：若目标文件或目录与现有的文件或目录重复，则直接覆盖现有的文件或目录；
-i：交互式操作，覆盖前先行询问用户，如果源文件与目标文件或目标目录中的文件同名，则询问用户是否覆盖目标文件。用户输入”y”，表示将覆盖目标文件；输入”n”，表示取消对源文件的移动。这样可以避免误将文件覆盖。
--strip-trailing-slashes：删除源文件中的斜杠“/”；
-S<后缀>：为备份文件指定后缀，而不使用默认的后缀；
--target-directory=<目录>：指定源文件要移动到目标目录；
-u：当源文件比目标文件新或者目标文件不存在时，才执行移动操作。
```



## 压缩与解压

### tar

Linux下的归档使用工具，用来打包和备份。

首先要弄清两个概念：打包和压缩。打包是指将一大堆文件或目录变成一个总的文件；压缩则是将一个大的文件通过一些压缩算法变成一个小文件。

为什么要区分这两个概念呢？这源于 Linux 中很多压缩程序只能针对一个文件进行压缩，这样当你想要压缩一大堆文件时，你得先将这一大堆文件先打成一个包（tar命令），然后再用压缩程序进行压缩（gzip bzip2命令）。

```bash{6,9,11,13,14}
tar 打包后的包名 要打包的目录

选项：
-A或--catenate：新增文件到以存在的备份文件；
-B：设置区块大小；
-c或--create：建立新的备份文件；
-C <目录>：这个选项用在解压缩，若要在特定目录解压缩，可以使用这个选项。
-d：记录文件的差别；
-x或--extract或--get：从备份文件中还原文件；
-t或--list：列出备份文件的内容；
-z或--gzip或--ungzip：通过gzip指令处理备份文件；
-Z或--compress或--uncompress：通过compress指令处理备份文件；
-f<备份文件>或--file=<备份文件>：指定备份文件；
-v或--verbose：显示指令执行过程；
-r：添加文件到已经压缩的文件；
-u：添加改变了和现有的文件到已经存在的压缩文件；
-j：支持bzip2解压文件；
-v：显示操作过程；
-l：文件系统边界设置；
-k：保留原有文件不覆盖；
-m：保留文件不被覆盖；
-w：确认压缩文件的正确性；
-p或--same-permissions：用原来的文件权限还原文件；
-P或--absolute-names：文件名使用绝对名称，不移除文件名称前的“/”号；
-N <日期格式> 或 --newer=<日期时间>：只将较指定日期更新的文件保存到备份文件里；
--exclude=<范本样式>：排除符合范本样式的文件。
```

- 将/etc文件夹中的文件归档到文件etc.tar（并不会进行压缩）：
```shell
tar -cvf /mydata/etc.tar /etc
```
- 用gzip压缩文件夹/etc中的文件到文件etc.tar.gz：
```shell
tar -zcvf /mydata/etc.tar.gz /etc
```
- 用bzip2压缩文件夹/etc到文件/etc.tar.bz2：
```shell
tar -jcvf /mydata/etc.tar.bz2 /etc
```

- 分页查看压缩包中内容（gzip）：
```shell
tar -ztvf /mydata/etc.tar.gz |more -c -10
```

- 解压文件到当前目录（gzip）：
```shell
tar -zxvf /mydata/etc.tar.gz
```
- 解压文件到指定目录（gzip）：
```shell
tar -zxvf /mydata/etc.tar.gz -C /mydata/etc
```



## 磁盘和网络管理

### df
查看磁盘空间占用情况。
```shell
df -hT

选项：
-a或--all：包含全部的文件系统；
--block-size=<区块大小>：以指定的区块大小来显示区块数目；
-h或--human-readable：以可读性较高的方式来显示信息；
-H或--si：与-h参数相同，但在计算时是以1000 Bytes为换算单位而非1024 Bytes；
-i或--inodes：显示inode的信息；
-k或--kilobytes：指定区块大小为1024字节；
-l或--local：仅显示本地端的文件系统；
-m或--megabytes：指定区块大小为1048576字节；
--no-sync：在取得磁盘使用信息前，不要执行sync指令，此为预设值；
-P或--portability：使用POSIX的输出格式；
--sync：在取得磁盘使用信息前，先执行sync指令；
-t<文件系统类型>或--type=<文件系统类型>：仅显示指定文件系统类型的磁盘信息；
-T或--print-type：显示文件系统的类型；
-x<文件系统类型>或--exclude-type=<文件系统类型>：不要显示指定文件系统类型的磁盘信息；
--help：显示帮助；
--version：显示版本信息。
```

### du
*du*：显示每个文件和目录的磁盘使用空间。

```shell
# 查看当前目录下的文件及文件夹所占大小：
du -h --max-depth=1 ./*

选项：
-a或-all 显示目录中个别文件的大小。
-b或-bytes 显示目录或文件大小时，以byte为单位。
-c或--total 除了显示个别目录或文件的大小外，同时也显示所有目录或文件的总和。
-k或--kilobytes 以KB(1024bytes)为单位输出。
-m或--megabytes 以MB为单位输出。
-s或--summarize 仅显示总计，只列出最后加总的值。
-h或--human-readable 以K，M，G为单位，提高信息的可读性。
-x或--one-file-xystem 以一开始处理时的文件系统为准，若遇上其它不同的文件系统目录则略过。
-L<符号链接>或--dereference<符号链接> 显示选项中所指定符号链接的源文件大小。
-S或--separate-dirs 显示个别目录的大小时，并不含其子目录的大小。
-X<文件>或--exclude-from=<文件> 在<文件>指定目录或文件。
--exclude=<目录或文件> 略过指定的目录或文件。
-D或--dereference-args 显示指定符号链接的源文件大小。
-H或--si 与-h参数相同，但是K，M，G是以1000为换算单位。
-l或--count-links 重复计算硬件链接的文件。
```

### ifconfig
配置和显示Linux系统网卡的网络参数。用ifconfig命令配置的网卡信息，在网卡重启后机器重启后，配置就不存在。要想将上述的配置信息永远的存的电脑里，那就要修改网卡的配置文件了。

```
选项：
add<地址>：设置网络设备IPv6的ip地址；
del<地址>：删除网络设备IPv6的IP地址；
down：关闭指定的网络设备；
<hw<网络设备类型><硬件地址>：设置网络设备的类型与硬件地址；
io_addr<I/O地址>：设置网络设备的I/O地址；
irq<IRQ地址>：设置网络设备的IRQ；
media<网络媒介类型>：设置网络设备的媒介类型；
mem_start<内存地址>：设置网络设备在主内存所占用的起始地址；
metric<数目>：指定在计算数据包的转送次数时，所要加上的数目；
mtu<字节>：设置网络设备的MTU；
netmask<子网掩码>：设置网络设备的子网掩码；
tunnel<地址>：建立IPv4与IPv6之间的隧道通信地址；
up：启动指定的网络设备；
-broadcast<地址>：将要送往指定地址的数据包当成广播数据包来处理；
-pointopoint<地址>：与指定地址的网络设备建立直接连线，此模式具有保密功能；
-promisc：关闭或启动指定网络设备的promiscuous模式；
IP地址：指定网络设备的IP地址；
网络设备：指定网络设备的名称。
```

---

```shell
# 显示网络设备信息（激活状态的）：
[root@localhost ~]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:16:3E:00:1E:51  
          inet addr:10.160.7.81  Bcast:10.160.15.255  Mask:255.255.240.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:61430830 errors:0 dropped:0 overruns:0 frame:0
          TX packets:88534 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:3607197869 (3.3 GiB)  TX bytes:6115042 (5.8 MiB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:56103 errors:0 dropped:0 overruns:0 frame:0
          TX packets:56103 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:5079451 (4.8 MiB)  TX bytes:5079451 (4.8 MiB)
```

- **eth0**：表示第一块网卡，其中`HWaddr`表示网卡的物理地址，可以看到目前这个网卡的物理地址(MAC地址）是`00:16:3E:00:1E:51`。
- **inet addr**：用来表示网卡的IP地址，此网卡的IP地址是`10.160.7.81`，广播地址`Bcast:10.160.15.255`，掩码地址`Mask:255.255.240.0`。
- **lo**：是表示主机的回坏地址，这个一般是用来测试一个网络程序，但又不想让局域网或外网的用户能够查看，只能在此台主机上运行和查看所用的网络接口。比如把 httpd服务器的指定到回坏地址，在浏览器输入127.0.0.1就能看到你所架WEB网站了。但只是您能看得到，局域网的其它主机或用户无从知道。
  - 第一行：连接类型：Ethernet（以太网）HWaddr（硬件mac地址）。
  - 第二行：网卡的IP地址、子网、掩码。
  - 第三行：UP（代表网卡开启状态）RUNNING（代表网卡的网线被接上）MULTICAST（支持组播）MTU:1500（最大传输单元）：1500字节。
  - 第四、五行：接收、发送数据包情况统计。
  - 第七行：接收、发送数据字节数统计信息。

---

```shell
# 启动关闭指定网卡：
ifconfig eth0 up
ifconfig eth0 down

# 配置IP地址：
ifconfig eth0 192.168.2.10
```



### netstat

netstat：查看Linux中网络系统状态信息。

```shell
选项：
-a或--all：显示所有连线中的Socket；
-A<网络类型>或--<网络类型>：列出该网络类型连线中的相关地址；
-c或--continuous：持续列出网络状态；
-C或--cache：显示路由器配置的快取信息；
-e或--extend：显示网络其他相关信息；
-F或--fib：显示FIB；
-g或--groups：显示多重广播功能群组组员名单；
-h或--help：在线帮助；
-i或--interfaces：显示网络界面信息表单；
-l或--listening：显示监控中的服务器的Socket；
-M或--masquerade：显示伪装的网络连线；
-n或--numeric：直接使用ip地址，而不通过域名服务器；
-N或--netlink或--symbolic：显示网络硬件外围设备的符号连接名称；
-o或--timers：显示计时器；
-p或--programs：显示正在使用Socket的程序识别码和程序名称；
-r或--route：显示Routing Table；
-s或--statistice：显示网络工作信息统计表；
-t或--tcp：显示TCP传输协议的连线状况；
-u或--udp：显示UDP传输协议的连线状况；
-v或--verbose：显示指令执行过程；
-V或--version：显示版本信息；
-w或--raw：显示RAW传输协议的连线状况；
-x或--unix：此参数的效果和指定"-A unix"参数相同；
--ip或--inet：此参数的效果和指定"-A inet"参数相同。
```

- 找出程序运行的端口：

```shell
netstat -ap | grep ssh
# 不是所有的进程都能找到，没有权限的会不显示，使用 root 权限查看所有的信息。
```

- 找出运行在指定端口的进程：

```shell
netstat -anp | grep ':80'
```

- 在netstat输出中显示 PID 和进程名称：

```shell
netstat -pt
# netstat -p 可以与其它开关一起使用，就可以添加“PID/进程名称”到netstat输出中，这样debugging的时候可以很方便的发现特定端口运行的程序。
```

- 查看当前路由信息：
```shell
netstat -rn
```

- 查看所有有效TCP连接：
```shell
netstat -an
```
- 查看系统中启动的监听服务：
```shell
netstat -tulnp
```

- 查看处于连接状态的系统资源信息：
```shell
netstat -atunp
```

### wget
*wget*：用来从指定的URL下载文件。wget非常稳定，它在带宽很窄的情况下和不稳定网络中有很强的适应性，如果是由于网络的原因下载失败，wget会不断的尝试，直到整个文件下载完毕。如果是服务器打断下载过程，它会再次联到服务器上从停止的地方继续下载。这对从那些限定了链接时间的服务器上下载大文件非常有用。

wget支持HTTP，HTTPS和FTP协议，可以使用HTTP代理。所谓的自动下载是指，wget可以在用户退出系统的之后在后台执行。这意味这你可以登录系统，启动一个wget下载任务，然后退出系统，wget将在后台执行直到任务完成，相对于其它大部分浏览器在下载大量数据时需要用户一直的参与，这省去了极大的麻烦。

```shell
# 语法
wget [参数] [URL地址]
```

#### 选项

```bash
# 忽略证书安装
wget --no-cookie --no-check-certificate
```

```bash
启动参数：

-V, –-version 显示wget的版本后退出
-h, –-help 打印语法帮助
-b, –-background 启动后转入后台执行
-e, –-execute=COMMAND 执行`.wgetrc’格式的命令，wgetrc格式参见/etc/wgetrc或~/.wgetrc

记录和输入文件参数：

-o, –-output-file=FILE 把记录写到FILE文件中
-a, –-append-output=FILE 把记录追加到FILE文件中
-d, –-debug 打印调试输出
-q, –-quiet 安静模式(没有输出)
-v, –-verbose 冗长模式(这是缺省设置)
-nv, –-non-verbose 关掉冗长模式，但不是安静模式
-i, –-input-file=FILE 下载在FILE文件中出现的URLs
-F, –-force-html 把输入文件当作HTML格式文件对待
-B, –-base=URL 将URL作为在-F -i参数指定的文件中出现的相对链接的前缀
–-sslcertfile=FILE 可选客户端证书
–-sslcertkey=KEYFILE 可选客户端证书的KEYFILE
–-egd-file=FILE 指定EGD socket的文件名

下载参数：

–-bind-address=ADDRESS 指定本地使用地址(主机名或IP，当本地有多个IP或名字时使用)
-t, –-tries=NUMBER 设定最大尝试链接次数(0 表示无限制).
-O –-output-document=FILE 把文档写到FILE文件中
-nc, –-no-clobber 不要覆盖存在的文件或使用.#前缀
-c, –-continue 接着下载没下载完的文件
–progress=TYPE 设定进程条标记
-N, –-timestamping 不要重新下载文件除非比本地文件新
-S, –-server-response 打印服务器的回应
–-spider 不下载任何东西
-T, –-timeout=SECONDS 设定响应超时的秒数
-w, –-wait=SECONDS 两次尝试之间间隔SECONDS秒
–waitretry=SECONDS 在重新链接之间等待1…SECONDS秒
–random-wait 在下载之间等待0…2*WAIT秒
-Y, –-proxy=on/off 打开或关闭代理
-Q, –-quota=NUMBER 设置下载的容量限制
–limit-rate=RATE 限定下载输率

目录参数：

-nd –-no-directories 不创建目录
-x, –-force-directories 强制创建目录
-nH, –-no-host-directories 不创建主机目录
-P, –-directory-prefix=PREFIX 将文件保存到目录 PREFIX/…
–cut-dirs=NUMBER 忽略 NUMBER层远程目录

HTTP 选项参数：

-–http-user=USER 设定HTTP用户名为 USER.
-–http-passwd=PASS 设定http密码为 PASS
-C, –-cache=on/off 允许/不允许服务器端的数据缓存 (一般情况下允许)
-E, –-html-extension 将所有text/html文档以.html扩展名保存
-–ignore-length 忽略 `Content-Length’头域
-–header=STRING 在headers中插入字符串 STRING
-–proxy-user=USER 设定代理的用户名为 USER
-–proxy-passwd=PASS 设定代理的密码为 PASS
-–referer=URL 在HTTP请求中包含 `Referer: URL’头
-s, –-save-headers 保存HTTP头到文件
-U, –-user-agent=AGENT 设定代理的名称为 AGENT而不是 Wget/VERSION
-–no-http-keep-alive 关闭 HTTP活动链接 (永远链接)
–-cookies=off 不使用 cookies
–-load-cookies=FILE 在开始会话前从文件 FILE中加载cookie
-–save-cookies=FILE 在会话结束后将 cookies保存到 FILE文件中

FTP 选项参数：

-nr, -–dont-remove-listing 不移走 `.listing’文件
-g, -–glob=on/off 打开或关闭文件名的 globbing机制
-–passive-ftp 使用被动传输模式 (缺省值).
-–active-ftp 使用主动传输模式
-–retr-symlinks 在递归的时候，将链接指向文件(而不是目录)

递归下载参数：

-r, -–recursive 递归下载－－慎用!
-l, -–level=NUMBER 最大递归深度 (inf 或 0 代表无穷)
–-delete-after 在现在完毕后局部删除文件
-k, –-convert-links 转换非相对链接为相对链接
-K, –-backup-converted 在转换文件X之前，将之备份为 X.orig
-m, –-mirror 等价于 -r -N -l inf -nr
-p, –-page-requisites 下载显示HTML文件的所有图片

递归下载中的包含和不包含(accept/reject)：

-A, –-accept=LIST 分号分隔的被接受扩展名的列表
-R, –-reject=LIST 分号分隔的不被接受的扩展名的列表
-D, –-domains=LIST 分号分隔的被接受域的列表
–-exclude-domains=LIST 分号分隔的不被接受的域的列表
–-follow-ftp 跟踪HTML文档中的FTP链接
–-follow-tags=LIST 分号分隔的被跟踪的HTML标签的列表
-G, –-ignore-tags=LIST 分号分隔的被忽略的HTML标签的列表
-H, –-span-hosts 当递归时转到外部主机
-L, –-relative 仅仅跟踪相对链接
-I, –-include-directories=LIST 允许目录的列表
-X, –-exclude-directories=LIST 不被包含目录的列表
-np, –-no-parent 不要追溯到父目录
wget -S –-spider url 不下载只显示过程
```

#### 例子

- 下载并以不同的文件名保存：

```shell
wget -O wordpress.zip http://www.jsdig.com/download.aspx?id=1080

# 错误案例：下面的例子会下载一个文件并以名称download.aspx?id=1080保存
wget http://www.jsdig.com/download?id=1
```

- 使用wget断点续传：

```shell
wget -c http://www.jsdig.com/testfile.zip
```

- 使用wget后台下载：

```shell
wget -b http://www.jsdig.com/testfile.zip

# 对于下载非常大的文件的时候，我们可以使用参数-b进行后台下载，你可以使用以下命令来察看下载进度：
tail -f wget-log
```

- 伪装代理名称下载：

```shell
wget --user-agent="Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.204 Safari/534.16" http://www.jsdig.com/testfile.zip
# 有些网站能通过根据判断代理名称不是浏览器而拒绝你的下载请求。不过你可以通过--user-agent参数伪装。
```

- 测试下载链接：

```shell
wget --spider URL
# 当你打算进行定时下载，你应该在预定时间测试下载链接是否有效。我们可以增加--spider参数进行检查。
```

- 增加重试次数：

```shell
wget --tries=40 URL
# 如果网络有问题或下载一个大文件也有可能失败。wget默认重试20次连接下载文件。如果需要，你可以使用--tries增加重试次数。
```

- 下载多个文件：

```shell
wget -i filelist.txt
# filelist.txt 文件中每一行就是一个下载链接
```



## 文件上传下载

### 安装上传下载工具

```bash
yum install -y lrzsz
```

### 上传文件

```bash
rz
```

### 下载文件

```bash
sz fileName
```



## 软件的安装与管理

### rpm

- 安装软件包：`rpm -ivh nginx-1.12.2-2.el7.x86_64.rpm`
- 模糊搜索软件包：`rpm -qa | grep nginx`
- 精确查找软件包：`rpm -qa nginx`
- 查询软件包的安装路径：`rpm -ql nginx-1.12.2-2.el7.x86_64`
- 查看软件包的概要信息：`rpm -qi nginx-1.12.2-2.el7.x86_64`
- 验证软件包内容和安装文件是否一致：`rpm -V nginx-1.12.2-2.el7.x86_64`
- 更新软件包：`rpm -Uvh nginx-1.12.2-2.el7.x86_64`
- 删除软件包：`rpm -e nginx-1.12.2-2.el7.x86_64`

### yum

- 安装软件包： `yum install nginx`
- 检查可以更新的软件包：`yum check-update`
- 更新指定的软件包：`yum update nginx`
- 在资源库中查找软件包信息：`yum info nginx*`
- 列出已经安装的所有软件包：`yum info installed`
- 列出软件包名称：`yum list nginx*`
- 模糊搜索软件包：`yum search nginx`



## 参考文献

- https://www.yuque.com/books/share/742ca8f6-34f3-41ef-b239-be00aaf0df31