class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // 调用 Error 的构造函数
        this.code = errorCode; // 为 HttpError 实例添加一个错误码属性
    }
}

module.exports = HttpError;
