const ostr = Object.prototype.toString;
const tname = v => ostr.call(v).slice(8, -1);
const isEmptyObj = v => {
    for(let p in v){
        return false;
    }
    return true;
}

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
        return CONTAINS[t](a, b, trap)
    }
};

const CLONE = {
    'Array': (v, trap) => {
        if(trap.indexOf(v) > -1){
            return [ ...v ];
        } else {
            trap.push(v);
            return v.map(vv => clone(vv, trap));
        }
    },
    'Object': (v, trap) => {
        if(trap.indexOf(v) > -1){
            return { ...v };
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
        return CLONE[t](v, trap);
    }
    return v;
};

const DIFF_NONE = Symbol('-diff-none-');
const DIFF = {
    'Array': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return DIFF_NONE;
        }
        trap.push(b);
        let i = 0, len = Math.max(a.length, b.length), o = [], none = true;
        for(; i < len; i++){
            o.push(diff(a[i], b[i], trap))
        };
        while(o[o.length - 1] === DIFF_NONE){
            o.pop();   
        }
        return o.length > 0 ? o : DIFF_NONE;
    },
    'Object': (a, b, trap) => {
        if(trap.indexOf(b) > -1){
            return DIFF_NONE;
        }
        trap.push(b);
        let o = {}, none = true;
        let keys = [...Object.keys(a), ...Object.keys(b)].filter((k, i, kk) => kk.indexOf(k) === i);
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

module.exports = {
    contains, clone, diff
};