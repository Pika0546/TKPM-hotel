const createAlert = (type, message, duration) => {
    let alertEle = null;
    switch (type) {
        case 'success':
            alertEle = `<div id="my-alert" class="alert alert-success alert-success-style1 alert-success-stylenone">
                            <button type="button" class="close sucess-op" data-dismiss="alert" aria-label="Close">
                                    <span class="icon-sc-cl" aria-hidden="true">&times;</span>
                                </button>
                            <i class="fa fa-check edu-checked-pro admin-check-sucess admin-check-pro-none" aria-hidden="true"></i>
                            <p class="message-alert-none"><strong>Thành công!</strong> ${message}</p>
                        </div>`
            break;
        case 'info':
            alertEle = `<div id="my-alert" class="alert alert-info alert-success-style2 alert-success-stylenone">
                            <button type="button" class="close sucess-op" data-dismiss="alert" aria-label="Close">
                                    <span class="icon-sc-cl" aria-hidden="true">&times;</span>
                                </button>
                            <i class="fa fa-info-circle edu-inform admin-check-sucess admin-check-pro-none" aria-hidden="true"></i>
                            <p class="message-alert-none"><strong>Thông báo!</strong> ${message}</p>
                        </div>`
            break;
        case 'warning':
            alertEle = `<div id="my-alert" class="alert alert-warning alert-success-style3 alert-success-stylenone">
                            <button type="button" class="close sucess-op" data-dismiss="alert" aria-label="Close">
                                    <span class="icon-sc-cl" aria-hidden="true">&times;</span>
                                </button>
                            <i class="fa fa-exclamation-triangle edu-warning-danger admin-check-pro admin-check-pro-none" aria-hidden="true"></i>
                            <p class="message-alert-none"><strong>Cảnh báo!</strong> ${message}</p>
                        </div>`
            break;
        case 'error':
            alertEle = `<div id="my-alert" class="alert alert-danger alert-mg-b alert-success-style4 alert-success-stylenone">
                            <button type="button" class="close sucess-op" data-dismiss="alert" aria-label="Close">
                                    <span class="icon-sc-cl" aria-hidden="true">&times;</span>
                                </button>
                            <i class="fa fa-times edu-danger-error admin-check-pro admin-check-pro-none" aria-hidden="true"></i>
                            <p class="message-alert-none"><strong>Lỗi! </strong> ${message}</p>
                        </div>`
            break;
        default:
            break;
        
    }
    if(alertEle){
        $("body").append(alertEle)
        setTimeout(()=>{
            const alert = document.getElementById("my-alert");
            if(alert){
                document.getElementsByTagName("body")[0].removeChild(alert);
            }
           
        }, duration || 3000)
    }
}

