# url_pattern.js

A Library for url pattern matches. Match patterns: http://dev.chromium.org/developers/design-documents/extensions/match-patterns

## Example

Use single pattern.

    URLPattern.matches('http://example.com/*',
                       'http://example.com/foo.html') // true

    URLPattern.matches('http://example.com/bar*',
                       'http://example.com/foo.html') // false

    URLPattern.matches('http://*.com/*',
                       'http://example.com/foo.html') // true

    URLPattern.matches('http://*.com/*',
                       'http://example.org/foo.html') // false

    URLPattern.matches('https://*.com/*',
                       'http://example.org/foo.html') //false


Use multiple patterns.

    var scripts = [
                   {
                       name: 'foo',
                       matches: ['http://example.com/*']
                   },
                   {
                       name: 'bar',
                       matches: ['http://*/*', 'https://*/*']
                   },
                   {
                       name: 'baz',
                       matches: ['file:///*']
                   }
                   ]
    var up = new URLPattern(scripts.map(function(i) { return i.matches }))
    var indexes = up.matches('http://example.com/foo.html')
    indexes.map(function(i) { return scripts[i].name }) // [foo, bar]


## Copyright

The MIT License
Copyright (c) 2009 swdyh

