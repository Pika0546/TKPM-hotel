const fetchData = (method, data, url, successCallback, errorCallback) => {
    $.ajax({
        method: method,
        url: url,
        data: data,
        success: successCallback,
        error: errorCallback
    })
}