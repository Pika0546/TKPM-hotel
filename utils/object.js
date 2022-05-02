class ObjectUtil {
    getObject = (obj) => {
        const objClone = {...obj};
        const keys = Object.keys(objClone);
        const n = keys.length;
        const subObj = {};
        // for(let i = 0 ;i < n;i++){
        //     if(keys[i].includes('.')){
        //         const [key, subKey] = keys[i].split('.');
        //         if(!subObj[key]){
        //             subObj[key] = {};
        //         }
        //         subObj[key][subKey] = objClone[keys[i]];
        //         delete objClone[keys[i]];
        //     }
        // }
        for(let i = 0 ;i < n;i++){
            if(keys[i].includes('.')){
                const keySplit = keys[i].split('.');
                if(!subObj[keySplit[0]]){
                    subObj[keySplit[0]] = {};
                }
                subObj[keySplit[0]][keySplit.slice(1).join(".")] = objClone[keys[i]];
                delete objClone[keys[i]];
            }
        }
        const subObjKeys = Object.keys(subObj);
        for(let i = 0 ; i< subObjKeys.length; i++){
            subObj[subObjKeys[i]] = this.getObject(subObj[subObjKeys[i]]);
        }
        return{...objClone, ...subObj}
    }

    convertRuleToObject = (rule) => {
        const result = {};
        const n = rule.length;
        for(let i = 0; i < n ; i++){
            result[rule[i].key] = rule[i].value;
        }
        return result;
    }
}

module.exports = new ObjectUtil();