
export function makeRequest(endpoint, request, sucess, error, options?: { method?: string; token?: string; contentType?: string; dataType?: string; onProgress?: (e: JQueryEventObject) => void }) {

    var method = "POST";
    var dataType = undefined;// "json";
    var contentType = undefined;//"application/json; charset=utf-8";
    var onProgress = undefined;
      
    if (options) { 
        if (options.method) {
            method = options.method.toUpperCase();
        }
        if (options.dataType) {
            dataType = options.dataType;
        }
        if (options.contentType) {
            contentType = options.contentType;
        }
        if (options.onProgress) {
            onProgress = options.onProgress;
        }
    } 

    var beforeSend = function (xhr, settings) {
        if (options && options.token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
        }
    }

    $.ajax({
        url: endpoint,
        type: method,
        data: request === undefined ? undefined : JSON.stringify(request),
        contentType: contentType,
        dataType: dataType,
        xhrFields: onProgress ? {
            onprogress: onProgress
        } : undefined,
        success: sucess,
        error: error,
        beforeSend: beforeSend
    });

}
