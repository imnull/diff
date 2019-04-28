# diffi
可配置的分支对象处理工具。分支的处理基于`tname`/`TYPE`两个内置的类型判断方法，可以基于方法名，在每个方法工具库上进行扩展。

# 安装

```bash
npm i diffi
```

# 内置类型判断

- `tname` 基于`Object.prototype.toString`获取对象构造类名。**此名称第一个字母是大写。**
- `TYPE` 判断两个值的类型。当两个值类型一致时，返回该类型；否则返回`*`。

# 分支比较

假设有两个分支集合a、b：
- 当a、b均为`Object`时，若b的`Object.keys`在a中皆具备，并且值相等，此时视b为a的子集。若字段为`Object`或`Array`，则执行深度检查。
- 当a、b均为`Array`时，若`b.lenght <= a.length`，并且b与a的值及顺序的对应关系一致，此时视b为a的子集。若元素为`Object`或`Array`，则执行深度检查。
- 其他类型情况，默认以`a === b`判断。

# 模块

## contains
判断一个值是否是另一个值的子集。

```js
console.log('contains', contains({ a: 1, b: 2 }, { a: 1 })) // true
console.log('contains', contains({ a: 1, b: 2 }, { a: 1, b: 2 })) // true
console.log('contains', contains({ a: 1, b: 2 }, { a: 1, b: 3 })) // false
console.log('contains', contains({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })) // false
console.log('contains', contains([1, 2], [1])) // true
console.log('contains', contains([1, 2], [1, 2])) // true
console.log('contains', contains([1, 2], [1, 3])) // false
console.log('contains', contains([1, 2], [1, 2, 3])) // false

console.log('contains', contains(1, 1)) // true
console.log('contains', contains(1, 2)) // false
```

## clone
深度复制`Object`或`Array`对象。其他未扩展类型直接返回。

```js
let a = { a: 1, b: 2 };
a.z = a;
let b = { a: 1, b: 3 };
b.z = b;
console.log('clone', clone(a));
// clone { a: 1, b: 2, z: [Circular] }
console.log('clone', clone(b));
// clone { a: 1, b: 3, z: [Circular] }
```

## diff
分支比较，返回分支差异。
```js
console.log('diff', diff([1,2,3], [1,3,3,7]));
// diff [ <1 empty item>, 3, <1 empty item>, 7 ]
console.log('diff', diff({a:1,b:2}, {a:1,b:3}));
// diff { b: 3 }
console.log('diff', diff({a:1,b:2, c: [1,2,3, { a: 111, b: 222 },4]}, {a:1,b:3, c: [2,2,3, { a: 111, c: 333 },4,5]}));
// diff { b: 3, c: [ 2, <2 empty items>, { c: 333 }, <1 empty item>, 5 ] }
```

## intersect
取两个集合差集。该方法依赖`diff`对两个对象的分支差异比较结果。

```js
console.log('intersect', intersect([1,2,3], [1,3,3,7]));
// intersect [ 1, 3, 3, 7 ]
console.log('intersect', intersect({a:1,b:2}, {a:1,b:3}));
// intersect { b: 3 }
console.log('intersect', intersect({a:1,b:2, c: [1,2,3, { a: 111, b: 222 },4]}, {a:1,b:3, c: [2,2,3, { a: 111, c: 333 },4,5]}));
// intersect { b: 3, c: [ 2, 2, 3, { c: 333 }, 4, 5 ] }
```

## assign
分支深度覆盖复制。**该方法将更改第一个参数，并返回第一个参数的指针。**
```js
console.log('assign', assign([1,2,3], [1,3,3,7]));
// assign [ 1, 3, 3, 7 ]
console.log('assign', assign({a:1,b:2}, {a:1,b:3}));
// assign { a: 1, b: 3 }
console.log('assign', assign({a:1,b:2, c: [1,2,3, { a: 111, b: 222 },4]}, {a:1,b:3, c: [2,2,3, { a: 111, c: 333 },4,5]}));
// assign { a: 1, b: 3, c: [ 2, 2, 3, { a: 111, c: 333 }, 4, 5 ] }
```

# 扩展
在每个模块中，都有对应的类型方法集。通过扩展这个集合，可让每个模块对更多类型的对象进行处理。
```js
containsExpand('String', (a, b) => a.indexOf(b) > -1)   // 扩展类型处理方法
console.log('contains', contains('abcde', 'bcd')) // true
```

模块扩展方法：
- containsExpand
- cloneExpand
- diffExpand
- intersectExpand
- assignExpand