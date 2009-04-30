// A Library for url pattern matches.
// Match patterns: http://dev.chromium.org/developers/design-documents/extensions/match-patterns
//
// The MIT License
// Copyright (c) 2009 swdyh

function URLPattern(patterns) {
    var hostTree = { keys: {}, values: [] }
    var filePatterns = []
    for (var i = 0; i < patterns.length; i++) {
        var ps = [].concat(patterns[i])
        for (var j = 0; j < ps.length; j++) {
            try {
                var pt = URLPattern.parse(ps[j])
                if (pt.scheme == 'file') {
                    filePatterns.push([i, j])
                }
                else {
                    URLPattern.addTree(hostTree, pt.host, [i, j])
                }
            }
            catch(e) {
                // console.log(e)
            }
        }
    }
    this.patterns = patterns
    this.hostTree = hostTree
    this.filePatterns = filePatterns
}
URLPattern.addTree = function(tree, host, val) {
    var currentNode = tree
    var tmp = host.split('.').reverse()
    for (var i = 0; i < tmp.length; i++) {
        if (!currentNode.keys[tmp[i]]) {
            currentNode.keys[tmp[i]] = { keys: {}, values: [] }
        }
        if (i != (tmp.length - 1)) {
            currentNode = currentNode.keys[tmp[i]]
        }
        else {
            currentNode.keys[tmp[i]].values.push(val)
        }
    }
    return tree
}
URLPattern.prototype.matches = function(url) {
    try {
        var result = []
        var u = URLPattern.parse(url)
        var hosts = (u.scheme == 'file') ? this.filePatterns :
            URLPattern.searchTree(this.hostTree, u.host)
        for (var i = 0; i < hosts.length; i++) {
            var index = hosts[i][0]
            var patternIndex = hosts[i][1]
            var pt = URLPattern.parse([].concat(this.patterns[index])[patternIndex])
            if ((pt.scheme == u.scheme) &&
                (!pt.path || URLPattern.matchesPath(pt.path, u.path))) {
                result.push(index)
            }
        }
        return result
    }
    catch(e) {
        // console.log(e)
        return []
    }
}
URLPattern.matchesPath = function(pattern, path) {
    var escaped = pattern.replace(/[.+?|()\\[\\]{}\\\\]/g, '\\$1')
    var re = new RegExp(escaped.replace('*', '.*'))
    return re.test(path || '/')
}
URLPattern.searchTree = function(tree, host) {
    var tmp = host.split('.').reverse()
    var currentNode = tree
    var result = []
    for (var i = 0; i < tmp.length; i++) {
        if (currentNode.keys['*']) {
            Array.prototype.push.apply(result, currentNode.keys['*'].values)
        }
        if (currentNode.keys[tmp[i]]) {
            Array.prototype.push.apply(result,
                                       currentNode.keys[tmp[i]].values)
            currentNode = currentNode.keys[tmp[i]]
        }
        else {
            break
        }
    }
    return result
}
URLPattern.parse = function(url) {
    var re = /^(http|https|file|ftp):\/\/([^\/]+)?(\/[^ ]+)?/
    var matched = url.match(re)
    if (matched) {
        return { scheme: matched[1], host: matched[2], path: matched[3] }
    }
    else {
        throw 'not supported url'
    }
}
URLPattern.matches = function(pattern, url) {
    var up = new URLPattern([pattern])
    return up.matches(url).length > 0
}
