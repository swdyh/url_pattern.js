$(document).ready(function(){
    module('urlpattern')
    test('parse', function() {
        var parsedURL = URLPattern.parse('http://*.google.com/foo/bar.html')
        equals(parsedURL.scheme, 'http')
        equals(parsedURL.host, '*.google.com')
        equals(parsedURL.path, '/foo/bar.html')

        var parsedURL_ =  URLPattern.parse('file:///foo/bar.html')
        equals(parsedURL_.scheme, 'file')
        equals(parsedURL_.path, '/foo/bar.html')
        ok(!parsedURL_.host)
    })

    test('matches', function() {
        var patterns = [
                        [
                         'https://*.google.com/foo*bar',
                         'http://example.org/foo/bar.html',
                         ],
                        ['http://*/*'],
                        [
                         'http://*/foo*',
                         'file:///foo*',
                         ],
                        'http://127.0.0.1/*',
                        'file:///foo/bar/*',
                         ]

        var up = new URLPattern(patterns)
        var ms = up.matches('http://127.0.0.1/foo.html')
        equals(ms[0], 1)
        equals(ms[1], 2)
        equals(ms[2], 3)

        ok(URLPattern.matches('http://*/*',
                               'http://example.org/foo/bar.html'))
        ok(URLPattern.matches('http://*/*',
                               'http://www.google.com/'))

        ok(URLPattern.matches('http://*/foo*',
                              'http://example.com/foo/bar.html'))
        ok(URLPattern.matches('http://*/foo*',
                              'http://www.google.com/foo'))

        ok(URLPattern.matches('https://*.google.com/foo*bar',
                               'https://www.google.com/foo/baz/bar'))
        ok(URLPattern.matches('https://*.google.com/foo*bar',
                               'https://docs.google.com/foobar'))

        ok(!URLPattern.matches('https://*.google.com/foo*bar',
                               'http://www.google.com/foo/baz/bar'))
        ok(!URLPattern.matches('https://*.google.com/foo*bar',
                               'http://docs.google.com/foobar'))

        ok(URLPattern.matches('file:///foo*', 'file:///foo/bar.html'))
        ok(URLPattern.matches('file:///foo*', 'file:///foo'))

        ok(URLPattern.matches('http://127.0.0.1/*',
                              'http://127.0.0.1/'))
        ok(URLPattern.matches('http://127.0.0.1/*',
                              'http://127.0.0.1/foo/bar.html'))

        ok(URLPattern.matches('http://www.google.co.jp/*',
                              'http://www.google.co.jp/search?q=hello&lr=lang_ja&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:ja-JP-mac:official&client=firefox-a'))
    })
})
