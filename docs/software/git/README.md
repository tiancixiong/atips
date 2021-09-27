## Commit Mesage 格式

### 完整格式

Commit Message应包括三个部分：Header（**必需**），Body（可选）和 Footer（可选）。

```markdown
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

完整的示例：

```markdown
fix(go/1.1.1): 修订条目内容
 
- 修正代码示例缩进问题
 
Close #1
```



### Header

Header 部分只有一行，包括三个字段：`type`（必需）、`scope`（可选）和 `subject`（必需）

#### 1.type

`type` 用于说明 commit 的*类别*，只允许使用下面7个标识：

```markdown
feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
```

#### 2.scope

`scope` 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

#### 3.subject

`subject`是 commit 目的的简短描述，不超过50个字符。

```markdown
以动词开头，使用第一人称现在时，比如change，而不是changed或changes
第一个字母小写
结尾不加句号（.）
```



### Body

Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。



### Footer

Footer 部分可用于描述关闭 Issue。如果当前 commit 针对某个issue，可以在 Footer 部分关闭这个 issue 。

```markdown
# 关闭单个 issue
Closes #234

# 关闭多个 issue
Closes #123, #245, #992
```



### 文档

参考文档：

- [Commit message 和 Change log 编写指南 - 阮一峰](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
- [代码安全指南 - 腾讯](https://github.com/Tencent/secguide/blob/main/CONTRIBUTING.md#i-commit-mesage-%E7%BC%96%E5%86%99%E6%8C%87%E5%BC%95)

