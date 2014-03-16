2048_cheater
============

Autoplayer for the 2048 Game

## How to use it ##

Open your browser's console (CTRL+SHIFT+K) and paste this to download jQuery

```
var jq = document.createElement("script");
jq.type = "text/javascript";
jq.src = "http://code.jquery.com/jquery-1.11.0.min.js";
var head_element = document.getElementsByTagName('HEAD').item(0);
head_element.appendChild(jq);
```

Then paste this to download and execute the autoplayer:
```
var autoplayer = document.createElement("script");
autoplayer.type = "text/javascript";
autoplayer.src = "https://raw.github.com/frosso/2048_cheater/master/main.js";
var head_element = document.getElementsByTagName('HEAD').item(0);
head_element.appendChild(autoplayer);
```

You can start/stop the autoplayer by hitting the P key on your keyboard.

More features coming soon!

## Compatibility ##

Only Firefox Browser