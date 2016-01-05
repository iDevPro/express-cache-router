function CacheMiddleware(options) {
    options = options || {};
    var expire = options.expire || 5 * 60 * 1000;
    var content;

    return function(req, res, next) {
        if(content) {
            res.charset = 'utf-8';
            res.contentType('application/json; charset=UTF-8');
            return res.end(content);
        }
        var end = res.end;
        res.end = function(buffer) {
            if(req.method === 'GET' && (typeof buffer === 'string' || Buffer.isBuffer(buffer)) ) {
                content = buffer;
                setTimeout(function() {
                    content = null;
                }, expire);
            }
            end.apply(res, arguments);
        }
        next();
    }
}

module.exports = CacheMiddleware;
