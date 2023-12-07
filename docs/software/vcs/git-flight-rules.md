# Git 飞行规则

## 什么是"飞行规则"?

> *飞行规则(Flight Rules)* 是记录在手册上的来之不易的一系列知识，记录了某个事情发生的原因，以及怎样一步一步的进行处理。本质上, 它们是特定场景的非常详细的标准处理流程。



## 编辑提交(editting commits)

### 我刚才提交了什么?

当你想快速知道上一次 commit 提交了哪些内容。可以通过以下命令显示当前 `HEAD` 上的最近一次提交：

```shell
$ git show
```

或者：

```shell
$ git log -n1 -p
```



### commit message写错了

场景：上一次提交信息（commit message）写错了，需要修改 message。

修改最近一次 commit 的 message 信息：

```shell
$ git commit --amend --only
```

上面命令会进入 vi 编辑页面进行修改，加上 `-m [new message]` 可以一次完成：

```shell
$ git commit --amend --only -m "新的信息"
```

如果需要修改多个 commit message，可以参考[Git修改已提交的commit注释](https://blog.xiongtianci.com/2019/11/12/Git%E4%BF%AE%E6%94%B9%E5%B7%B2%E6%8F%90%E4%BA%A4%E7%9A%84commit%E6%B3%A8%E9%87%8A/)。



### commit中的用户名和邮箱不对

场景：上一次进行提交时，作者信息是错误的，导致 commit 中的作者信息（姓名和邮箱）有误。想将其修改成正确的信息。

只修改最近一次提交，使用以下命令：

```shell
$ git commit --amend --no-edit --author "Name <email>"
```

邮箱需使用 `<>` 括住。另一种方式是先将全局变量修正后再进行修改，如：

```shell
# 第一步：设置全局变量
$ git config --global user.name "Author Name"
$ git config --global user.email "Author Email"

# 第二步：重置作者信息（作者时间戳也会被更新）
$ git commit --amend --reset-author --no-edit
```

如果你需要更改所有历史记录，请参考 `git filter-branch`。



### 我想从一个提交(commit)里移除一个文件

[TODO](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md#%E6%88%91%E6%83%B3%E4%BB%8E%E4%B8%80%E4%B8%AA%E6%8F%90%E4%BA%A4commit%E9%87%8C%E7%A7%BB%E9%99%A4%E4%B8%80%E4%B8%AA%E6%96%87%E4%BB%B6)



### 删除任意提交

:::  warning 注意
此操作使用 [变基](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA) 实现，请谨慎使用。**如果 commit 已经 push 了，而别人可能基于这些提交进行开发，那么不要执行变基！**
:::

```shell
$ git rebase --onto base from to
$ git push -f [remote] [branch]
```

> 使用 `--onto`  之后, 后面会跟3个参数（`git rebase --onto base from to`）。意思是使用 (from, to] 所指定的范围内的所有 commit 在 base 这个 commit 之上进行重建。



## 暂存(Staging)

### 把暂存的内容添加到上一次的提交

```shell
$ git commit --amend
```



### 只暂存一个新文件的一部分

> 参考：[xueliang.org](http://xueliang.org/article/detail/20180223141445088)

想暂存一个文件的部分内容，而不是文件的全部内容。

```shell
$ git add -p <filename>
```

加上 `-p` 或 `--patch` 会打开交互模式，它会将文件分解成它认为合理的 *块（hunk）* （文件的一部分）。能够用 `s` 选项来分隔提交（commit）。其他选项说明：

```
y 暂存该块
n 不暂存该块
a 暂存该块及该文件中的剩余所有块
d 不暂存该块及该文件中的剩余所有块
g 选择并跳转至指定块块
/ 搜索与给定的正则表达式匹配的块
j 离开当前未定的块，处理下一个未定的块
J 离开当前未定的块，处理下一个块
k 离开当前未定的块，处理上一个未定的块
K 离开当前未定的块，处理上一个块
s 将当前的大块分成更小的块
e 手动编辑当前的块
? 打印帮助
```

然而，如果这个文件是新的，会没有这个选择，则可以先执行 `git add -N <filename>`。之后你可以继续 `git add -p <filename>`。



### 撤销暂存的内容，恢复到工作区

某些文件被 add 到了暂存区，现在需要撤销这个文件的 add 操作，并保留这个文件的修改内容。

```shell
$ git reset --mixed [filename]
```

如果是需要撤销所有的 add，可使用 `git reset --mixed` 或 `git reset HEAD .` 实现。



## 未暂存(Unstaged)的内容

### 把未暂存的内容移动到一个新分支

```shell
$ git checkout -b <new branch>
```



### 把未暂存的内容移动到另一个已存在的分支

```shell
$ git stash
$ git checkout <branch>
$ git stash pop
```



### 丢弃本地未提交的变化(uncommitted changes)

如果你只是想重置源(origin)和你本地(local)之间的一些提交(commit)，你可以：

```shell
# one commit
(my-branch)$ git reset --hard HEAD^
# two commits
(my-branch)$ git reset --hard HEAD^^
# four commits
(my-branch)$ git reset --hard HEAD~4
# or
(main)$ git checkout -f
```

重置某个特殊的文件, 你可以用文件名做为参数:

```shell
$ git reset filename
```



### 丢弃某些未暂存的内容

如果你想丢弃工作目录中的一部分内容，而不是全部。

签出（checkout）不需要的内容，保留需要的。

```shell
$ git checkout -p
# Answer y to all of the snippets you want to drop
```

另外一个方法是使用 `stash`，Stash 所有要保留下的内容，重置工作拷贝，重新应用保留的部分。

```shell
$ git stash -p
# Select all of the snippets you want to save
$ git reset --hard
$ git stash pop
```

或者，stash 你不需要的部分，然后 stash drop。

```shell
$ git stash -p
# Select all of the snippets you don't want to save
$ git stash drop
```



## 分支(Branches)

### 我从错误的分支拉取了内容，或把内容拉取到了错误的分支

这是另外一种使用 `git reflog` 情况，找到在这次错误拉（pull）之前 HEAD 的指向。

```shell
(main)$ git reflog
ab7555f HEAD@{0}: pull origin wrong-branch: Fast-forward
c5bc55a HEAD@{1}: checkout: checkout message goes here
```

重置分支到你所需的提交（desired commit）：

```shell
$ git reset --hard c5bc55a
```

完成。



## 变基(rebase)和合并(merge)

### 我想撤销rebase/merge

你可以合并（merge）或变基（rebase）了一个错误的分支，或者完成不了一个进行中的 rebase/merge。 Git 在进行危险操作的时候会把原始的HEAD保存在一个叫 `ORIG_HEAD` 的变量里，所以要把分支恢复到 rebase/merge 前的状态是很容易的。

```shell
(my-branch)$ git reset --hard ORIG_HEAD
```



### 我已经rebase过, 但是我不想强推(force push)

不幸的是，如果你想把这些变化（changes）反应到远程分支上，你就必须得强推（force push）。 是因你快进（Fast forward）了提交，改变了 Git 历史，远程分支不会接受变化（changes），除非强推（force push）。

这就是许多人使用 merge 工作流，而不是 rebasing 工作流的主要原因之一，开发者的强推（force push）会使大的团队陷入麻烦。使用时需要注意，一种安全使用 rebase 的方法是，不要把你的变化（changes）反映到远程分支上，而是按下面的做：

```shell
(main)$ git checkout my-branch
(my-branch)$ git rebase -i main
(my-branch)$ git checkout main
(main)$ git merge --ff-only my-branch
```

更多, 参见 [this SO thread](http://stackoverflow.com/questions/11058312/how-can-i-use-git-rebase-without-requiring-a-forced-push).



### 检查是否分支上的所有提交(commit)都合并(merge)过了

检查一个分支上的所有提交（commit）是否都已经合并（merge）到了其它分支，你应该在这些分支的 head (或任何 commits)之间做一次 diff：

```shell
(main)$ git log --graph --left-right --cherry-pick --oneline HEAD...feature/120-on-scroll
```

这会告诉你在一个分支里有而另一个分支没有的所有提交（commit），和分支之间不共享的提交（commit）的列表。 另一个做法可以是：

```shell
(main)$ git log main ^feature/120-on-scroll --no-merges
```



### 交互式rebase(interactive rebase)可能出现的问题

#### 这个rebase编辑屏幕出现'noop'

如果你看到的是这样：

```
noop
```

这意味着你 rebase 的分支和当前分支在同一个提交(commit)上, 或者 *领先(ahead)* 当前分支。 你可以尝试：

- 检查确保主(main)分支没有问题
- rebase `HEAD~2` 或者更早

#### 有冲突的情况

如果你不能成功的完成 rebase，你可能必须要解决冲突。

首先执行 `git status` 找出哪些文件有冲突：

```shell
(my-branch)$ git status
On branch my-branch
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   README.md
```

在这个例子里面，`README.md` 有冲突。 打开这个文件找到类似下面的内容:

```md
<<<<<<< HEAD
some code
=========
some code
>>>>>>> new-commit
```

你需要解决新提交的代码（示例里, 从中间 `==` 线到 `new-commit` 的地方）与 `HEAD`  之间不一样的地方。

有时候这些合并非常复杂，你应该使用可视化的差异编辑器(visual diff editor)：

```shell
(main*)$ git mergetool -t opendiff
```

在你解决完所有冲突和测试过后，`git add` 变化了的(changed)文件，然后用 `git rebase --continue` 继续 rebase。

```shell
(my-branch)$ git add README.md
(my-branch)$ git rebase --continue
```

如果在解决完所有的冲突过后，得到了与提交前一样的结果，可以执行 `git rebase --skip`。

任何时候你想结束整个 rebase 过程，回来 rebase 前的分支状态，你可以做：

```shell
(my-branch)$ git rebase --abort
```



## Stash

`git stash` 会把所有未提交的修改（包括暂存的和非暂存的）都保存起来，用于后续恢复当前工作目录。

### 暂存所有改动

暂存你工作目录下的所有改动

```shell
$ git stash
```

你可以使用 `-u` 来排除一些文件

```shell
$ git stash -u
```



### 暂存指定文件

假设你只想暂存某一个文件

```shell
$ git stash push working-directory-path/filename.ext
```

假设你想暂存多个文件

```shell
$ git stash push working-directory-path/filename1.ext working-directory-path/filename2.ext
```



## 杂项

### 克隆所有子模块

```shell
$ git clone --recursive git://github.com/foo/bar.git
```

如果已经克隆了:

```
$ git submodule update --init --recursive
```



### 恢复已删除标签(tag)

如果你想恢复一个已删除标签(tag), 可以按照下面的步骤: 首先, 需要找到无法访问的标签(unreachable tag):

```
$ git fsck --unreachable | grep tag
```

记下这个标签(tag)的hash，然后用Git的 [update-ref](http://git-scm.com/docs/git-update-ref):

```
$ git update-ref refs/tags/<tag_name> <hash>
```

这时你的标签(tag)应该已经恢复了。




## 参考资料

- [git-flight-rules](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md) - GitHub

