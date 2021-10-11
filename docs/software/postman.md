# Postman

> 官方文档：[Postman](https://learning.postman.com/docs/getting-started/introduction/)

::: tip
以下文档基于 Postman_v9.0.5_win_x64 整理
:::




## 环境变量

在一个项目的生命周期中，可能会有开发环境、测试环境、预上线环境、线上环境等众多的不同环境，这时候就可以通过环境变量来管理接口的**地址**以及**端口**。

点击左侧 `Environments`，系统中默认已经存在了一个 `Globals` 的全局环境，可以在其中存放一些通用的公共变量。先在这里写入 `host` 和 `port` 信息：

![image-20211011084255809](/atips/images/software/image-20211011084255809.png)

在需要使用变量时，可以在访问接口时使用双大括号引用变量，以 `{{variable}}` 的方式进行引用：

![image-20211011085001157](/atips/images/software/image-20211011085001157.png)

以上是使用全局环境变量，此外我们也可以创建新的环境来存放变量。

![image-20211011085706552](/atips/images/software/image-20211011085706552.png)

这里创建了 本地环境、测试环境、生产环境 共三个环境，这样我们可以直接在多个环境间进行切换。测试接口的过程中，就不需要频繁的改动接口的地址了。

![image-20211011085849973](/atips/images/software/image-20211011085849973.png)

---

我们将环境变量分为了两类，**普通环境变量**和全局变量。总的来说，全局变量具有更高的使用范围，即使切换到自己创建的环境，全局变量仍然可用。但是我们自己创建的环境之间是相互隔离的，如果切换到一个环境，那么其他环境中的变量将不再可用。



## 预请求脚本

> 文档：[Pre-request Script](https://go.pstmn.io/docs-prerequest-scripts/)

`Pre-request Script` 预请求脚本，是在**请求发送前**被执行的代码逻辑，可以在这里执行一些 `JavaScript` 代码。

这里后端准备一个接口，接受一个 String 类型的参数，返回拼接好的字符串

```java
@GetMapping("/getTitle")
public String getStr(@RequestParam String str) {
    System.out.println("str = " + str);
    return "Hello, " + str;
}
```

在 Params 选项卡中添加参数，key 为 str，value 采用大括号引用变量，变量名自定义。

![image-20211011092412037](/atips/images/software/image-20211011092412037.png)

在 Pre-request Script 选项卡中编写脚本，设置 str 参数的值，在请求中传给后端：

```js
pm.collectionVariables.set("str_value","jack");
```

![image-20211011092549537](/atips/images/software/image-20211011092549537.png)

> 关于脚本中 `pm.*` 使用的详细信息，请查看 [Postman JavaScript reference](https://learning.postman.com/docs/writing-scripts/script-references/postman-sandbox-api-reference/)

---

Pre-request Script 还可以在请求当前接口前，通过执行脚本来**先请求一下其他接口**。



### Get

通过内置函数 [pm.sendRequest](https://learning.postman.com/docs/writing-scripts/script-references/postman-sandbox-api-reference/#sending-requests-from-scripts) 可以发送方法请求。

这里编写一个脚本，在执行目标请求 `/getTitle` 之前需先执行 `/before` 请求，并将返回信息打印到控制台：

```js
pm.sendRequest("localhost:8099/hello/before",function(err,response){
    console.log("接口返回：" + response.json().data);
});
```

Console 控制台中的打印顺序可以看到，是在先执行了 `Pre-request` 中的请求后，才去执行的真正目标接口的请求。

![image-20211011101013521](/atips/images/software/image-20211011101013521.png)



### Post

从上面可以看到调用 `sendRequest` 时，默认发送的 `get` 请求，如果需要使用 `post` 请求、配置其他请求参数等可以下面方式。

这里模拟一个场景，访问正式接口前需访问登录接口 `/login` 拿到 token，用于身份认证。

```js
const loginRequest = {
    url: 'localhost:8099/login',
    method: 'POST',
    body: {
        mode: 'urlencoded',
        urlencoded: 'username=jack&password=1234'
    }
};
pm.sendRequest(loginRequest, function(err,response){
    console.log(response.json().data);
    pm.collectionVariables.set("TOKEN",response.json().data.token);
});
```

定义一个变量 loginRequest，在其中使用 `url` 指定请求地址， `method` 指定请求方法， `body` 携带参数，最后使用 `sendRequest` 进行请求的发送。

在获取完成 token 后，通过下面的代码将获取的 token 放入了 Collection 的变量中：

```js
pm.collectionVariables.set("TOKEN",response.json().data.token);
```

查看 Collection 中的变量，已经保存了刚才获取的 token：

![image-20211011111940912](/atips/images/software/image-20211011111940912.png)

在需要认证的请求头 `Headers` 中，引用这个 token，就可以正常的调用接口了：

![image-20211011112700886](/atips/images/software/image-20211011112700886.png)

---

在上面的例子中，我们使用的是 `urlencoded` 格式的传参方式，如果接口定义是使用 JSON方式传参，可以写成下面的格式：

```js
const loginRequest = {
    url: 'url',
    method: 'POST',
    body: {
        mode: 'raw',
        raw: JSON.stringify({key:'value'})
    }
};
```

如果需要传递 `header` 请求头信息，也可以在自定义的请求中添加：

```js
const loginRequest = {
    url: 'url',
    header: [
        'Key1 : Value1',
        'Key2 : Value2'
    ],
    ...
};
```



## 测试脚本

> 文档：[Tests](https://go.pstmn.io/docs-test-scripts/)

在 `Tests` 中可以为请求编写测试脚本，是在**请求完成后**执行的操作。和 `Pre-request Script` 相对。

这里模拟场景：由于 token 具有时效性，一段时间过后 token 就会失效然后就需要重新调用 login 接口拿到新的token，在 `Tests` 中使用脚本将获取的 token 放入 `Collection` 的变量中

```js
pm.collectionVariables.set("TOKEN",pm.response.json().data.token);
```

![image-20211011130542669](/atips/images/software/image-20211011130542669.png)

然后其他接口通过 `{{TOKEN}}` 就可以使用 token 了



### 断言

> 官方文档：[Test script examples](https://learning.postman.com/docs/writing-scripts/script-references/test-examples/)

断言，就是对预期结果与实际结果进行对比，如果一致，则用例通过；如果不一致，断言失败，用例失败。

Postman 断言的一些特点：

- 断言编写位置：Tests 标签
- 断言所用语言：JavaScript
- 断言执行顺序：在响应体数据返回后执行
- 断言执行结果查看：Test Results

Postman 已经给我们内置了一些常用的断言 。用的时候，只需从 Tests 选项卡右侧点击 **SNIPPETS** 其中一个断言，就会在文本框中自动生成对应断言代码块 。

![image-20211011145112432](/atips/images/software/image-20211011145112432.png)

> `pm` 是 Postman 的主要对象，一般通过它来调用函数、数据等。

范例：

```js
// 判断请求返回的状态码为200。推荐用全等(===)，确保类型和值都一致
tests['Status code is 200'] = responseCode.code === 200;
// 判断请求返回的时间小于200ms
tests['Response time is less than 200ms'] = responseTime < 200; 
// response body 是否包含 xxx。只要有指定关键字就行，在哪、有几个等都不管 
tests['Body matches string'] = responseBody.has('xxx');
// response header 中是否包含 Content-Type
tests['Content-Type is present'] = postman.getResponseHeader('Content-Type') || false; 
```

---

对返回的 json 数据进行断言

```json
{
    "status": 1,
    "data": [
        {
            "id": 1,
            "name": "zhangsan",
            "age": 23
        },
        {
            "id": 2,
            "name": "lisi",
            "age": 25
        }
    ]
}
```

1、先获取到返回的 json 数据

```js
let jsonData = pm.response.json();
```

2、断言 status 返回的值为 1

```js
tests["判断返回的status返回为1"] = jsonData.status === 1;
```

3、断言 data 中第一个元素中 name 的值为 zhangsan

```js
tests["data第一个元素中的name值正确"] = jsonData.data[0].name === "zhangsan";
```

4、判断数据返回类型

类型种类：number 、string 、object 、array 、boolean 、undefind

```js
tests["判断data下第一个元素中id的返回类型为number"] = typeof(jsonData.data[0].id) === "number";
```

5、判断返回数据中是否存在某个元素。只要有指定关键字就行，在哪、有几个等都不管 。

```js
tests["判断返回的元素中带有status"] = responseBody.has("status");
```

---

其他的操作：

| 代码                                                 | 说明             |
| ---------------------------------------------------- | ---------------- |
| pm.environment.set("variable_key","variable_value"); | 设置环境变量     |
| pm.environment.get("variable_key");                  | 获得环境变量     |
| pm.environment.unset("variable_key");                | 删除一个环境变量 |
| pm.globals.set("variable_key", "variable_value");    | 设置全局变量     |
| pm.globals.get("variable_key");                      | 获得全局变量     |
| pm.globals.unset("variable_key");                    | 删除一个全局变量 |


