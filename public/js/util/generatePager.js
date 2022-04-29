function generatePager(paginationArray, prevPage, nextPage, callback){
    let result = [];
    result.push(`
        <li class="my-page-item">
            <input onchange='${callback}' style="display: none;" id="page-prev" value="${prevPage}" type="radio" name="page"/>
            <label for="page-prev"  class="my-page-button">Trang trước</label>
        </li>
    `)
    paginationArray.forEach(page=>{
        if(page.isCurrent){
            result.push(`
                <li class="my-page-item">
                    <input checked onchange='${callback}' style="display: none;" id="page-${page.page}" value="${page.page}" type="radio" name="page"/>
                    <label for="page-${page.page}"  class="my-page-link my-current-page">${page.page}</label>
                </li>
            `)
        }else{
            result.push(`
                <li class="my-page-item">
                    <input onchange='${callback}' style="display: none;" id="page-${page.page}" value="${page.page}" type="radio" name="page"/>
                    <label for="page-${page.page}"  class="my-page-link">${page.page}</label>
                </li>
            `)
        }
    });
    result.push(`
        <li class="my-page-item">
            <input onchange='${callback}' style="display: none;" id="page-next" value="${nextPage}" type="radio" name="page"/>
            <label for="page-next"  class="my-page-button">Trang sau</label>
        </li>
    `)
    return result;
}