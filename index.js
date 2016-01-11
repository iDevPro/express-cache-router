function CacheMiddleware(options) {
    options = options || {};
    var expire = options.expire || 5 * 60 * 1000;
    var content;
    var id; // id from request, you can add another parameters for test, object can't be equal

    return function(req, res, next) {
        //  if content present and id equal params.id (undefined is equal undefined)
        if(content && id == req.params.id) { 
            res.charset = 'utf-8';
            res.contentType('application/json; charset=UTF-8');
            var origin = (req.headers.origin || "*");
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Origin', origin);
            
            return res.end(content);
        }
        var end = res.end;
        res.end = function(buffer) {
            if(req.method === 'GET' && (typeof buffer === 'string' || Buffer.isBuffer(buffer)) ) {
                content = buffer;
                id = req.params.id; // get id from params here
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



<th class="glyphicon glyphicon-plane">A</th>
<th class="glyphicon glyphicon-dashboard">B</th>
<th class="glyphicon glyphicon-certificate">C</th>