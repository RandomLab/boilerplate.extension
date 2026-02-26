(function(window) {

    const config = chrome.extension.config;

    let isAbstract = false;
    let styleAdded = false;
    let timeoutId;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        log("AbstractBrowsing.onMessage, method:" + message.method + ", isAbstract:" + isAbstract);
        switch (message.method) {
            case "status":
                sendResponse(isAbstract);
                break;
            case "toggle":
                if (isAbstract) {
                    sendResponse(false);
                    window.location.reload(false);
                }
                else {
                    generate();
                    sendResponse(true);
                }
                break;
            case "log":
                log("AbstractBrowsing.log: " + message.data);
                break;
        }
    });

    const onGetStatusResponse = response => {
        log("AbstractBrowsing.onGetStatusResponse ", response);
        if (response === true) generate();
        show();
        for (var i = 1; i <= 10; i++) {
            setTimeout(show, i * 300);
        }
    }

    const initExtension = () => {
        //Start with getting extension activation status for this tab (true/false)
        chrome.runtime.sendMessage({ method: "getStatus" }, onGetStatusResponse);
    }



    function show() {
        document.getElementsByTagName('html')[0].style.visibility = 'visible';
    }

    function addStyle() {
        if (styleAdded) return;
        var css = '*:before,*:after,.abstractbrowsing {color: transparent !important;' +
            'border: transparent !important;' +
            'border-top: transparent !important;' +
            'border-bottom: transparent !important; ' +
            'border-left: transparent !important; ' +
            'border-right: transparent !important; ' +
            'border-radius: 0 !important; ' +
            'border-top-left-radius: 0 !important; ' +
            'border-top-right-radius: 0 !important; ' +
            'border-bottom-left-radius: 0 !important; ' +
            'border-bottom-right-radius: 0 !important; ' +
            'background-image:none !important;' +
            'background-color:transparent;' +
            'box-shadow:none !important;' +
            'text-shadow:none !important;' +
            '}' +
            'ul,ol {list-style-type:none !important; list-style:none none none !important; list-style-image: none !important;}' +
            'input[placeholder], [placeholder], *[placeholder] {color: transparent !important;}' +
            '::-webkit-input-placeholder {color: transparent !important;}' +
            ':-moz-placeholder {color: transparent !important;}' +
            '::-moz-placeholder {color: transparent !important;}' +
            ':-ms-input-placeholder {color: transparent !important;}' +
            'input[type=checkbox], input[type=radio], select {display:none !important;}' +
            'abstractbrowsingSmallImage {opacity:0 !important;}' +
            '}';
        //
        var style = document.createElement('style');
        style.setAttribute("id", "abstractbrowsing");
        style.type = 'text/css';
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));
        //
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
        styleAdded = true;
    }

    function generate() {
        //remove backgroundimages
        // log("AbstractBrowsing.generate " + Date.now());
        addStyle();
        var selector = 'body,img,div,table,tr,td,svg,figure,object,textarea,input[type="submit"],input[type="search"],input[type="text"],input[type="password"]';
        $('*,*:before,*:after').each(function() {
            if (!$(this).hasClass("abstractbrowsing")) $(this).addClass("abstractbrowsing");
        });
        $('*:not(' + selector + ')').each(function() {
            this.style.setProperty('background-color', 'transparent', "important");
        });
        document.body.style.backgroundColor = getColor();
        $(selector).each(function() {
            var obj = $(this);
            //remove background-image !important
            this.style.removeProperty('background-image');
            this.style.setProperty('background', 'inherit', 'important');//remove !important setting
            //
            if (obj.width() >= config.minWidth && obj.height() >= config.minHeight) {
                this.style.setProperty('background-color', getColor(), "important");
            }
        });
        $('img').each(function() {
            var obj = $(this);
            if (obj.width() >= config.minWidth && obj.height() >= config.minHeight) {
                colorImage(obj[0]);
            }
            else {
                if (!obj.hasClass("abstractbrowsingSmallImage")) obj.addClass("abstractbrowsingSmallImage");
            }
        });
        $('iframe,video').css("display", "none");
        $('svg').html('');
        $('object,canvas').remove();
        //$('canvas').each(function() { colorCanvas($(this)[0]);	});
        //
        isAbstract = true;
        clearTimeout(timeoutId);
        if (config.interval > 0) {
            timeoutId = setTimeout(function() { generate(); }, config.interval);
        }
    }

    function colorCanvas(canvas) {
        var ctx = canvas.getContext('2d');
        //log(ctx, canvas.width, canvas.height);
        ctx.fillStyle = getColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    function colorImage(img) {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = getColor();
        ctx.fillRect(0, 0, 1, 1);
        img.src = canvas.toDataURL("image/png");
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
    }

    function getColor() {
        var cs = config.colors;
        return cs[Math.floor(Math.random() * cs.length)];
    }

    function log() {
        if (config.debug && window.console && window.console.log) window.console.log.apply(null, arguments);
    }

    window.colorImage = colorImage;

    log("AbstractBrowsing, content script injected.");
    
    initExtension();

}(window));
















