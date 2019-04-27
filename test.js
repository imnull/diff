const { diff, clone } = require('./diff');

const obj = [1,2, {'a': [{bbb:3}, [1,{aaa:2},2,3,]]}];
const _obj = clone(obj);
// obj.push(3)
obj.push(4)
_obj.push(3)
// console.log(obj === _obj, contains(obj, _obj), JSON.stringify(_obj), JSON.stringify(obj))

let a = { a: 1, b: 2, c: { a: 1, b: [1,2,3] } };
a.z = a;
let b = { a: 1, b: 2, c: { a: 1, b: [1,2,4] } };
let c = { a: 1, b: 2, c: { a: 1, b: [1,2,3] } };
c.z = b;
b.z = b;
// console.log(clone(a))
console.log(diff([1,2,3], [1,3,3]))
console.log(diff({ a: [1,2,3] }, { a: [1,2,3] }))
console.log(diff(a, b))
console.log(diff(obj, _obj))
