const {
    contains,
    containsExpand,
    diff, clone, intersect, assign
} = require('./diff');

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

containsExpand('String', (a, b) => a.indexOf(b) > -1)
console.log('contains', contains('abcde', 'bcd')) // true



let a = { a: 1, b: 2 };
a.z = a;
let b = { a: 1, b: 3 };
b.z = b;
console.log('clone', clone(a));
console.log('clone', clone(b));

console.log('diff', diff(a, b));
console.log('diff', diff([1,2,3], [1,3,3,7]));
console.log('diff', diff({a:1,b:2}, {a:1,b:3}));
console.log('diff', diff({a:1,b:2, c: [1,2,3, { a: 111, b: 222 },4]}, {a:1,b:3, c: [2,2,3, { a: 111, c: 333 },4,5]}));

console.log('intersect', intersect(a, b));
console.log('intersect', intersect([1,2,3], [1,3,3,7]));
console.log('intersect', intersect({a:1,b:2}, {a:1,b:3}));
console.log('intersect', intersect({a:1,b:2, c: [1,2,3, { a: 111, b: 222 },4]}, {a:1,b:3, c: [2,2,3, { a: 111, c: 333 },4,5]}));

console.log('assign', assign([1,2,3], [1,3,3,7]));
console.log('assign', assign({a:1,b:2}, {a:1,b:3}));
console.log('assign', assign({a:1,b:2, c: [1,2,3, { a: 111, b: 222 },4]}, {a:1,b:3, c: [2,2,3, { a: 111, c: 333 },4,5]}));
console.log('assign', assign(a, b, a, b));


// let aa = { a: 1 };
// aa.z = aa;
// let bb = assign(aa, { b: 2, d: [1,2,3] }, { b: 3, c: 4, d: [-11,12] });

// console.log(bb);
// console.log(aa)
// console.log(aa === bb);

