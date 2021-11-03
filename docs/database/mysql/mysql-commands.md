# MySQL - 常用命令

> 本文章包含数据定义语句、数据操纵语句及数据控制语句，基于Mysql 5.7 环境

## 数据定义语句(DDL)

### 数据库操作

- 登录数据库：

```shell
-- 连接（地址、端口可不填，默认为localhost:3306）
mysql -h 地址 -P 端口 -u 用户名 -p 密码
```

- 创建数据库：

```sql
create database [if not exists] test;
```

- 查看所有数据库：

```sql
show databases;
```

- 选择数据库并使用：

```sql
use test;
```

- 查看所有数据表：

```sql
show tables;
```

- 删除数据库：

```sql
drop database test;
```



### 表操作

#### 创建

创建表

```sql
create [temporary] table [if not exists] [库名.]表名 (表的结构定义) [表选项]
```
- temporary：临时表，会话结束时表自动消失
- 字段的定义：`字段名 数据类型 [not null | null] [default default_value] [auto_increment] [unique [key] | [primary key] [comment 'string']`



#### 修改

```sql
-- 修改表本身的选项
alter table 表名 表的选项
```

- 字段改名：

```sql
alter table t_user change age age1 int(4);
```

- 修改表字段：

```sql
alter table 表名 操作名;
-- 操作名
	add[ column] 字段定义     -- 增加字段
		after 字段名         -- 表示增加在该字段名后面
		first               -- 表示增加在第一个
	add primary key(字段名)   -- 创建主键
	add unique [索引名] (字段名) -- 创建唯一索引
	add index [索引名] (字段名) -- 创建普通索引
	drop[ column] 字段名      -- 删除字段
	modify[ column] 字段名 字段属性     -- 支持对字段属性进行修改，不能修改字段名(所有原有属性也需写上)
	change[ column] 原字段名 新字段名 字段属性 -- 支持对字段名修改
	drop primary key    -- 删除主键(删除主键前需删除其auto_increment属性)
	drop index 索引名 -- 删除索引
	drop foreign key 外键    -- 删除外键

-- eg：
alter table t_user modify uname varchar(20)
```

- 字段改名：

```sql
-- 方式一
alter table 原表名 rename 新表名;
-- 方式二，可将表移动到另一个数据库
rename table 原表名 to [库名.]新表名;
```

- 添加表字段：

```sql
alter table t_user add column age int(3);
```



#### 查看

- 查看所有表

```bash
show tables [like 't%'];
show tables from 库名;
```

- 查看表的定义：
```sql
desc 表名;
```
- 查看表定义（详细）：
```sql
show create table 表名 \G
```



#### 删除

- 删除表：

```sql
drop table 表名;
```

- 清空表数据：

```sql
truncate [table] 表名;
```

- 删除表字段：

```sql
alter table 表名 drop column 列名;
```



## 数据操纵语句(DML)

### 插入记录

```sql
insert [into] 表名 [(字段列表)] values (值列表)[, (值列表), ...]
    -- 如果要插入的值列表包含所有字段并且顺序一致，则可以省略字段列表。
    -- 可同时插入多条数据记录！
    replace 与 insert 完全一样，可互换
insert [into] 表名 set 字段名=值[, 字段名=值, ...]
```

- 指定名称插入：

```sql
insert into t_user (id,name,age) values ('1','zhangsan',22);
```

- 不指定名称插入：

```sql
insert into t_user values ('2','lisi',21);
```

- 批量插入数据：

```sql
insert into t_user values('4','wangwu',22),('5','yangyi',23);
```



### 修改记录

```sql
update 表名 set 字段名=新值[, 字段名=新值] [更新条件]

-- eg：
update t_user set id='001',age=25 where name='zhangsan';
```



### 删除记录

```sql
delete from 表名[ 删除条件子句]
	⚠没有条件子句，则会删除全部

-- eg：
delete from t_user where name='zhangsan';
```



### 查询记录

```sql
select 字段列表 from 表名 [其他子句]
    -- 可来自多个表的多个字段
    -- 其他子句可以不使用
    -- 字段列表可以用*代替，表示所有字段
```

- 查询所有记录：

```sql
select * from t_user
```

- 查询不重复的记录：

```sql
select distinct age from t_user
```

- 条件查询：

```sql
select * from t_user where 1=1 and age<22;
```

- 排序和限制：

```sql
select * from t_user order by age desc limit 2
```

- 分页查询(查询从第0条记录开始10条)：

```sql
select * from t_user order by age desc limit 0,10;
```

- 聚合(查询部门人数大于1的部门编号)：

```sql
select deptno,count(1) from emp group by deptno having count(1) > 1;
```

- 连接查询：

```sql
select * from emp e 
left join dept d on e.deptno=d.deptno;
```

- 子查询：

```sql
select * from emp 
where deptno in (select deptno from dept);
```

- 记录联合：

```sql
select deptno from emp union select deptno from dept
```





## 其他

每一个命令，没有任何括号修饰的都是必选的。`mysql [OPTIONS] [database]` 

不要在命令行中键入括号本身。

- `[ ]`：方括号，是可选参数
- `< >`：尖括号，是**必选**参数
- `[< >]`：
- `[--]`：
- `-`：
- `--`：
- `[< >...]`：
- `|`：

更多：https://www.cnblogs.com/uakora/p/11809501.html



## 参考文献

- http://www.macrozheng.com/#/reference/mysql