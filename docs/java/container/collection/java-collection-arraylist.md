# Collection - ArrayList

## 数据结构

*ArrayList* = Array + List = 数组 + 列表 = 数组列表

*ArrayList* 实现了 *List* 接口，是顺序容器，即元素存放的数据与放进去的顺序相同，允许放入 `null` 元素，底层通过**数组实现**。

![image-20211020091551051](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/java/container/collection/image-20211020091551051.png)



### 底层数据结构

ArrayList 的底层是一个 Object 数组

```java
transient Object[] elementData; // non-private to simplify nested class access
```

elementData 使用 `transient` 修饰的目的是为了节省空间。

> elementData 数组相当于容器，当容器不足时就会再扩充容量，但是容器的容量往往都是大于或者等于ArrayList所存元素的个数。 比如，现在实际有了 8 个元素，那么 elementData 数组的容量可能是8x1.5=12，如果直接序列化 elementData 数组，那么就会浪费 4 个元素的空间，特别是当元素个数非常多时，这种浪费是非常不合算的。所以 ArrayList 的设计者将 elementData 设计为 transient，然后在 writeObject 方法中手动将其序列化，并且只序列化了实际存储的那些元素，而不是整个数组。参考：[ArrayList序列化技术细节详解](https://www.cnblogs.com/aoguren/p/4767309.html)

---

实现 Serilizable 接口后，将不需要序列化的属性前添加关键字 `transient`，序列化对象的时候，这个属性就不会序列化到指定的目的地中。参考：[Java transient关键字使用小记](https://www.cnblogs.com/lanxuezaipiao/p/3369962.html)



## 构造函数

ArrayList 提供了三种方式的构造器：

- `ArrayList()` - 可以构造一个默认初始容量为 10 的空 list；

  ```java
  // java.util.ArrayList
  private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
  
  public ArrayList() {
      this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
  }
  ```

- `ArrayList(int initialCapacity)` - 构造一个指定初始容量 `initialCapacity` 的空 list；

  ```java
  // java.util.ArrayList
  public ArrayList(int initialCapacity) {
      if (initialCapacity > 0) {
          this.elementData = new Object[initialCapacity];
      } else if (initialCapacity == 0) {
          this.elementData = EMPTY_ELEMENTDATA;
      } else {
          throw new IllegalArgumentException("Illegal Capacity: " + initialCapacity);
      }
  }
  ```

- `ArrayList(Collection<? extends E> c)` - 构造一个包含指定 Collection 的元素的 list。



## 扩容方式

扩容操作最终是通过 `grow()` 方法完成的。得到的新容量等于旧容量的 1.5 倍。

```java
// java.util.ArrayList
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}

private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}

private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

![image-20211020095730582](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/java/container/collection/image-20211020095730582.png)

图中介绍了当 List 结合可用空间长度不足时则需要扩容，在 ArrayList 中主要包括如下步骤：

1. 判断长度充足：`ensureCapacityInternal(size + 1);`；

2. 当判断长度不足时，则通过扩大函数，进行扩容：`grow(int minCapacity)`；
2. 扩容的长度计算：`int newCapacity = oldCapacity + (oldCapacity >> 1);`，旧容量 + 旧容量右移1位，这相当于扩容了原来容量的 (int) `3/2 = 1.5` 倍 ；
3. 当扩容完以后，就需要进行把数组中的数据拷贝到新数组中，这个过程会用到 `Arrays.copyOf(elementData, newCapacity);`，但他的底层用到的是：`System.arraycopy`

---

ArrayList 扩容时计算新长度的方式：

```java{2}
// java.util.ArrayList#grow()
int newCapacity = oldCapacity + (oldCapacity >> 1);
// 若 oldCapacity 十进制数为 10
// int newCapacity = 10 + (10>>1) = 10+5 = 15;
```

这里 oldCapacity 的十进制数若为 10，其二进制是 `1010`；然后计算 `oldCapacity >> 1` 得到二进制 `101`，十进制数为 5。



### System.arraycopy

当 ArrayList 扩容完以后，就需要通过 `Arrays.copyOf` 把数组中的数据拷贝到新数组中，其底层用到的是：`System. arraycopy`。

下面通过一个例子了解下 `System. arraycopy` 的使用，这个例子模拟了 ArrayList 元素迁移的效果：

```java{5}
@Test
public void test_arraycopy() {
    int[] oldArr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    int[] newArr = new int[oldArr.length + (oldArr.length >> 1)];
    System.arraycopy(oldArr, 0, newArr, 0, oldArr.length);
    newArr[11] = 11;
    newArr[12] = 12;
    newArr[13] = 13;
    newArr[14] = 14;
    System.out.println("数组元素：" + JSON.toJSONString(newArr)); // 数组元素：[1,2,3,4,5,6,7,8,9,10,0,11,12,13,14]
    System.out.println("数组长度：" + newArr.length); // 数组长度：15
}
```

- 拷贝数组的过程并不复杂，主要是对 `System.arraycopy` 的操作；
- 上面就是把数组 oldArr 拷贝到 newArr ，同时新数组的长度，采用和 ArrayList 一样的计算逻辑：`oldArr.length + (oldArr.length >> 1)`。



## 插入

### 普通插入

使用 `add()` 进行元素的插入，其实就是对数组的操作，只不过需要特定时候扩容。源码：

```java
// java.util.ArrayList
public boolean add(E e) {
	ensureCapacityInternal(size + 1);  // Increments modCount!!
	elementData[size++] = e;
	return true;
}
```

插入元素时， `size++` 自增，把对应元素添加进去。



### 指定位置插入

使用 `add(int index, E element)` 可以指定位置进行插入元素操作。

---

下面，我们通过一个例子来了解一下：

```java{2}
public static void main(String[] args) {
    List<String> list = new ArrayList<String>(10);
    list.add(2, "1");
    System.out.println(list.get(0));
}
```

上面代码执行到 `list.add(2, "1");` 时报错，输出结果：

```shell
Exception in thread "main" java.lang.IndexOutOfBoundsException: Index: 2, Size: 0
	at java.util.ArrayList.rangeCheckForAdd(ArrayList.java:665)
	at java.util.ArrayList.add(ArrayList.java:477)
	at com.example.demo.ListDemo.main(ListDemo.java:13)
```

为什么会报错呢？看下插入源码：

```java
// java.util.ArrayList
public void add(int index, E element) {
    // 判断是否可以插入，索引是否越界
	rangeCheckForAdd(index);

    // 判断是否需要扩容以及扩容操作
	ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 数据拷贝迁移，把待插入位置空出来
	System.arraycopy(elementData, index, elementData, index + 1,
					 size - index);
    // 数据插入操作
	elementData[index] = element;
	size++;
}

private void rangeCheckForAdd(int index) {
    if (index > size || index < 0)
        throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
}
```



#### 容量验证

`rangeCheckForAdd()`

- 指定位置插入首先要通过 `rangeCheckForAdd` 判断 size（size为ArrayList包含的元素数） 的长度；
- 每插入一个元素， size 自增一次 `size++`；所有在执行 `list.add(2, "1");` 时 size 的值还是 **0**；
- 所以即使我们申请了 10 个容量长度的 ArrayList ，但是指定位置插入会依赖于 `size` 进行判断；进行判断时 index 为 2，而 size 为 0。所以会抛出 *IndexOutOfBoundsException* 异常。



#### 元素迁移

![image-20211020161643231](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/java/container/collection/image-20211020161643231.png)

指定位置插入的核心步骤包括：
1. 判断 size 是否可以插入：`rangeCheckForAdd(index);`；
2. 判断插入后是否需要扩容：`ensureCapacityInternal(size + 1);`；
3. 通过 `System.arraycopy` 进行数据元素迁移，把从待插入位置后的元素，顺序往后迁移；
4. 给数组的指定位置赋值，也就是把待插入元素插入进来。



## 删除

*ArrayList* 中提供的 remove 方法有：

- `remove(int index)` 删除指定位置的元素；
- `remove(Object o)` 删除第一个满足 `o.equals(elementData[index])` 的元素。

```java
// java.util.ArrayList
public E remove(int index) {
	rangeCheck(index);

	modCount++;
	E oldValue = elementData(index);

	int numMoved = size - index - 1;
	if (numMoved > 0)
		System.arraycopy(elementData, index+1, elementData, index,
						 numMoved);
	elementData[--size] = null; // clear to let GC do its work

	return oldValue;
}

public boolean remove(Object o) {
    if (o == null) {
        for (int index = 0; index < size; index++)
            if (elementData[index] == null) {
                fastRemove(index);
                return true;
            }
    } else {
        for (int index = 0; index < size; index++)
            if (o.equals(elementData[index])) {
                fastRemove(index);
                return true;
            }
    }
    return false;
}
```

![image-20211020164233475](//tiancixiong.coding.net/p/atips-cdn/d/atips-cdn/git/raw/images/images/java/container/collection/image-20211020164233475.png)
结合上图理解，通过 `remove(int index)` 删除的过程主要包括：

1. 校验是否越界：`rangeCheck(index);`；
2. 计算删除元素时需移动元素的数量 numMoved（将后面所有的元素向前移动的距离）；并通过 `System.arraycopy` 将自己所有需移动的元素（即删除节点后面所有的元素，不包含删除节点本身）复制到以删除节点开始的位置上；
3. 此时结尾元素还是原来的值，需把结尾元素清空（为了让 *GC* 起作用，必须显式的为最后一个位置赋 `null` 值）。

> 关于 Java GC 这里需要特别说明一下，**有了垃圾收集器并不意味着一定不会有内存泄漏**。对象能否被 GC 的依据是是否还有引用指向它，上面代码中如果不手动赋 `null` 值，除非对应的位置被其他元素覆盖，否则原来的对象就一直不会被回收。




## 参考文献

- 《Java 面经手册》- 小傅哥

