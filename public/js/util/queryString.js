const queryString = (query) => {
    const s = Object.keys(query).map(key=>{
        if(query[key].length > 0){
            return `${key}=${query[key]}`;
        }
        return ""
    })

    return s.filter(v => v.length > 0).join("&");
}