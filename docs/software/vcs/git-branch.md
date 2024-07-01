# Branch 分支管理


## 常用分支

```markdown{1-2}
master: 主分支。用来分布重大版本。
develop: 开发用的分支，进行日常开发。

# 临时性分支，使用完以后应该删除
feature: 功能分支。从develop分支分出。为了开发某种特定功能。开发完成后，要再并入develop。
release: 预发布分支。从develop分支分出。发布正式版本之前，我们可能需要有一个预发布的版本进行测试。最后合并到master分支
fixbug: 修补bug分支。从master分支分出。
```

![image-20211015094523203](//gcore.jsdelivr.net/gh/tiancixiong/atips@img-230529/images/software/git-model@2x.png)





## 合并分支

将Develop分支发布到Master分支的命令：

```shell{5}
# 切换到Master分支
git checkout master

# 对Develop分支进行合并
git merge --no-ff develop
```

> 默认情况下，Git执行"快进式合并"（fast-farward merge），会直接将Master分支指向Develop分支。【不推荐此做法】
>
> 使用 `--no-ff` 参数后，会执行正常合并，在Master分支上生成一个新节点。【推荐使用此参数】



## 参考资料

- [Git分支管理策略](https://www.ruanyifeng.com/blog/2012/07/git.html) - 阮一峰
- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/) - 英文

