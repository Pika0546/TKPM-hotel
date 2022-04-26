class ObjectUtil {
    getObject = (obj) => {
        const objClone = {...obj};
        const keys = Object.keys(objClone);
        const n = keys.length;
        const subObj = {};
        for(let i = 0 ;i < n;i++){
            if(keys[i].includes('.')){
                const [key, subKey] = keys[i].split('.');
                if(!subObj[key]){
                    subObj[key] = {};
                }
                subObj[key][subKey] = objClone[keys[i]];
                delete objClone[keys[i]];
            }
        }
        return{...objClone, ...subObj}
    }
}

module.exports = new ObjectUtil();