const ostr = Object.prototype.toString;
const tname = v => ostr.call(v).slice(8, -1);
const object_keys = (...objs) => objs
    .reduce((a, b) => a.concat(Object.keys(b)), [])
    .filter((k, i, kk) => kk.indexOf(k) === i)
    ;

// const for_up_loop = (len, fn, i, up = 1) => {
//     up = Math.max(1, up);
//     for(; i < len; i += up){
//         fn(i, len);
//     }
// }

const TYPE = (a, b) => {
    let n = tname(a);
    return n === tname(b) ? n : '*';
};

const CONTAINS = {
    'Array': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return true;
        }
        trap.push(b);
        if(b.length <= a.length){
            return b.every((vb, i) => contains(a[i], vb, trap))
        } else {
            return false;
        }
    },
    'Object': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return true;
        }
        trap.push(b);
        let bKeys = Object.keys(b);
        if(bKeys.some(k => !(k in a))){
            return false;
        }
        return bKeys.every(i => contains(a[i], b[i], trap))
    }
};
const contains = (a, b, trap = []) => {
    let t = TYPE(a, b);
    if(t === '*' || !(t in CONTAINS)){
        return a === b;
    } else {
        trap.push(b);
        return CONTAINS[t](a, b, trap)
    }
};

const CLONE = {
    'Array': (v, trap) => {
        if(trap.indexOf(v) > -1){
            return v;
        } else {
            trap.push(v);
            return v.map(vv => clone(vv, trap));
        }
    },
    'Object': (v, trap) => {
        if(trap.indexOf(v) > -1){
            return v;
        } else {
            trap.push(v);
            let o = {};
            Object.keys(v).forEach(key => o[key] = clone(v[key], trap));
            return o;
        }
    }
};
const clone = (v, trap = []) => {
    let t = tname(v);
    if(t in CLONE){
        trap.push(v);
        return CLONE[t](v, trap);
    }
    return v;
};

// const DIFF_NONE = Symbol('-diff-none-');
const DIFF_NONE = undefined;
const DIFF = {
    'Array': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return DIFF_NONE;
        }
        trap.push(b);
        let i = 0, len = Math.max(a.length, b.length), o = Array(len), none = true;
        for(; i < len; i++){
            let r = diff(a[i], b[i], trap);
            if(r !== DIFF_NONE){
                none = false;
                o[i] = r;
            }
            // o.push(r)
        };
        // while(o[o.length - 1] === DIFF_NONE){
        //     o.pop();   
        // }
        return none ? DIFF_NONE : o;
    },
    'Object': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return DIFF_NONE;
        }
        trap.push(b);
        let o = {}, none = true;
        let keys = object_keys(a, b);
        keys.forEach(i => {
            if(!contains(a[i], b[i])){
                let r = diff(a[i], b[i], trap);
                if(r !== DIFF_NONE){
                    none = false;
                    o[i] = r;
                }
            }
        });
        return none ? DIFF_NONE : o;
    }
};
const diff = (a, b, trap = []) => {
    if(typeof(a) === 'undefined'){
        if(typeof(b) === 'undefined'){
            return DIFF_NONE;
        } else {
            return clone(b);
        }
    } else if(typeof(b) === 'undefined'){
        return DIFF_NONE;
    }
    let t = TYPE(a, b), r;
    if(t === '*' || !(t in DIFF)){
        r = a === b ? DIFF_NONE : b;
    } else {
        r = DIFF[t](a, b, trap);
    }
    return r;
}

const INTERSECT = {
    'Array': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return b;
        }
        trap.push(b);
        let _a = clone(a);
        b.forEach((v, i) => intersect(_a[i], v, trap));
        return _a;
    },
    'Object': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return b;
        }
        trap.push(b);
        let o = {};
        for(let i in b){
            o[i] = intersect(a[i], b[i], trap);
        }
        return o;
    }
};

const intersect = (a, b, trap = []) => {

    let _b = diff(a, b);
    if(_b === DIFF_NONE){
        return DIFF_NONE;
    }
    let t = TYPE(a, _b);
    if(t === '*' || !(t in INTERSECT)){
        return _b;
    } else {
        return INTERSECT[t](a, _b, trap)
    }
}

const ASSIGN = {
    'Array': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return b;
        }
        trap.push(b);
        for(let i = 0, len = Math.max(a.length, b.length); i < len; i++){
            a[i] = assign2(a[i], b[i], trap);
        }
        return a;
    },
    'Object': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return b;
        }
        trap.push(b);
        object_keys(a, b).forEach(i => a[i] = assign2(a[i], b[i], trap));
        return a;
    }
};

const assign2 = (a, b, trap = []) => {
    if(b === DIFF_NONE || typeof(b) === 'undefined'){
        return a;
    }
    let t = TYPE(a, b);
    if(t === '*' || !(t in ASSIGN)){
        return clone(b);
    } else {
        trap.push(b);
        return ASSIGN[t](a, b, trap)
    }
};

const assign = (a, ...args) => {
    if(args.length < 1){
        return a;
    } else {
        let trap = [];
        return args.reduce((A, B) => {
            return assign2(A, B, trap)
        }, a);
    }
}

module.exports = {
    contains, clone, diff, intersect, assign
};