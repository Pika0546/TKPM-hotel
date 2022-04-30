class PageUtil {
    getCurrentPage = (page, totalPage) => {
        let currentPage = (page && !Number.isNaN(page)) ? parseInt(page) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        currentPage = (currentPage < 1) ? 1 : currentPage; 
        return currentPage;
    }
    
    getPaginationArray = (page, totalPage, maximumPagination) => {
        let paginationArray = [];
        let pageDisplace = Math.min(totalPage - page + 2, maximumPagination);
        if(page === 1){
            pageDisplace -= 1;
        }
        for(let i = 0 ; i < pageDisplace; i++){
            if(page === 1){
                paginationArray.push({
                    page: page + i,
                    isCurrent:  (page + i)===page
                });
            }
            else{
                paginationArray.push({
                    page: page + i - 1,
                    isCurrent:  (page + i - 1)===page
                });
            }
        }
        if(pageDisplace < 2){
            paginationArray=[];
        }
        return paginationArray;
    }
}




module.exports = new PageUtil();