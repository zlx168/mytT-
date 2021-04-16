class Http {
    apiUrl = "http://192.168.16.190:8888";
    resUrl = "http://192.168.16.190:5386";

    error(str) {
        console.error(str)
        //return alert(str);
    }

    defaultReject(reject, data, withoutDefaultReject?: boolean) {
        if (!withoutDefaultReject) {
            this.error(data._xhr.msg);
        }
        reject(data)
    }

    post<T>(path: string, body?: string | object, withoutDefaultReject?: boolean): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.postWithCallback(path, body, resolve, (data) => {
                this.defaultReject(reject, data, withoutDefaultReject)
            })
        })
    }

    postWithCallback(path, body, resolve, reject) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.timeout = 5000;
        var requestUrl = this.toAbsoluteUrl(this.apiUrl, path);

        xhr.open("POST", requestUrl, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function (res) {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText)
                    var data: any = response.data;
                    data["_xhr"] = { response: response, responseText: xhr.responseText, status: xhr.status }
                    if (response.code === 0) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                } else {
                    var data: any = {}
                    data["msg"] = "illegal status: " + xhr.status
                    data["_xhr"] = { responseText: xhr.responseText, status: xhr.status }
                    reject(data);
                }
            }
        };
        this.send(xhr, body)

    }

    get<T>(path: string, body?: string | object, withoutDefaultReject?: boolean): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.getWithCallback(path, body, resolve, (data) => {
                this.defaultReject(reject, data, withoutDefaultReject)
            })
        })
    }


    getWithCallback(path, body, resolve, reject) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.timeout = 5000;
        var requestUrl = this.toAbsoluteUrl(this.apiUrl, path);
        requestUrl = this.appendUrlParam(requestUrl, body);

        xhr.open("GET", requestUrl, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.onreadystatechange = function (res) {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    let response = JSON.parse(xhr.responseText)
                    let data: any = response.data;
                    data["_xhr"] = { response: response, responseText: xhr.responseText, status: xhr.status }
                    if (response.code === 0) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                } else {
                    let data: any = {}
                    data["msg"] = "illegal status: " + xhr.status
                    data["_xhr"] = { responseText: xhr.responseText, status: xhr.status }
                    reject(data);
                }
            }
        };

        this.send(xhr, null)
    }

    download<T>(path: string, body?: string | object, withoutDefaultReject?: boolean): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.downloadWithCallback(path, body, resolve, (data) => {
                this.defaultReject(reject, data, withoutDefaultReject)
            })
        })
    }

    downloadWithCallback(path, body, resolve, reject) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.timeout = 5000;
        var requestUrl = this.toAbsoluteUrl(this.resUrl, path);
        requestUrl = this.appendUrlParam(requestUrl, body);

        xhr.responseType = "arraybuffer";
        xhr.open("GET", requestUrl, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        xhr.onreadystatechange = function (res) {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    var buffer = xhr.response;
                    var dataview = new DataView(buffer);
                    var ints = new Uint8Array(buffer.byteLength);
                    for (var i = 0; i < ints.length; i++) {
                        ints[i] = dataview.getUint8(i);
                    }
                    var data: any = { data: ints };
                    data["_xhr"] = { responseText: xhr.responseText, status: xhr.status }
                    resolve(data);
                } else {
                    var data: any = {}
                    data["msg"] = "illegal status: " + xhr.status
                    data["_xhr"] = { responseText: xhr.responseText, status: xhr.status }
                    reject(data);
                }
            }
        };
        this.send(xhr, null)
    }

    send(xhr: XMLHttpRequest, body: string | object) {
        if (body) {
            if (typeof body === 'string') {
                xhr.send(body);
            } else {
                xhr.send(JSON.stringify(body));
            }
        } else {
            xhr.send();
        }
    }

    toAbsoluteUrl(bootUrl, path) {
        var requestUrl = null;
        if (path.indexOf("/") == 0) {
            requestUrl = bootUrl + path;
        } else {
            requestUrl = path;
        }
        return requestUrl;
    }

    appendUrlParam(requestUrl, body) {
        if (body) {
            if (typeof body === 'string') {
                if (body.indexOf("?") == 0) {
                    requestUrl += body;
                } else {
                    requestUrl += "?" + body;
                }
            } else {
                let pathParam = {}
                for (var k in body) {
                    let startIndex = requestUrl.indexOf(":" + k);
                    if (startIndex != -1) {
                        pathParam[k] = 1
                        requestUrl = requestUrl.substring(0, startIndex) +
                            body[k] +
                            requestUrl.substring(startIndex + 1 + k.length)
                    }
                }
                var i = 0;
                for (var k in body) {
                    if (pathParam[k]) {
                        continue;
                    }
                    if (i == 0) {
                        requestUrl += "?";
                    } else {
                        requestUrl += "&";
                    }
                    requestUrl += k + "=" + encodeURI(body[k])
                    i++
                }
            }
        }
        return requestUrl;
    }
}

let http = new Http()

export default http