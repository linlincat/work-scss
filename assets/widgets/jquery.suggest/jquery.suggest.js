/*
     *	jquery.suggest 1.1 - 2007-08-06
     *
     *	Uses code and techniques from following libraries:
     *	1. http://www.dyve.net/jquery/?autocomplete
     *	2. http://dev.jquery.com/browser/trunk/plugins/interface/iautocompleter.js
     *
     *	All the new stuff written by Peter Vulgaris (www.vulgarisoip.com)
     *	Feel free to do whatever you want with this file
     *
     */

(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        factory();
    }
}(function () {

    $.suggest = function(input, options) {
        var $input = $(input).attr("autocomplete", "off");
        var $results = $(document.createElement("div"));

        var timeout = false;		// hold timeout ID for suggestion results to appear
        var prevLength = 0;			// last recorded length of $input.val()
        var prevVal = "";           // last recorded val String
        var cache = [];				// cache MRU list
        var cacheSize = 0;			// size of cache in chars (bytes?)
        $results.css("width", input.offsetWidth-2);
        $results.css("padding-top",2);
        if (options.container && options.offset) {
        	$results.addClass(options.resultsClass).appendTo($(options.container));
        } else {
        	$results.addClass(options.resultsClass).appendTo('body');
        }


        resetPosition();
        $(window)
                .load(resetPosition)// just in case user is changing size of page while loading
                .resize(resetPosition);
        timeout = setTimeout(suggest, options.delay);


        $input.blur(function() {
            setTimeout(function() {
                $results.hide()
            }, 200);
        });


			// help IE users if possible
        try {
            $results.bgiframe();
        } catch(e) {
        }


			// I really hate browser detection, but I don't see any other way
//        if ($.browser.mozilla)
//            $input.keypress(processKey);    // onkeypress repeats arrow keys in Mozilla/Opera
//        else
            $input.keydown(processKey);		// onkeydown repeats arrow keys in IE/Safari


        function resetPosition() {
	        if (options.container && options.offset) {
	            $results.css({
	                top: options.offset.top,
	                left: options.offset.left
	            });
	        } else {
	        	// requires jquery.dimension plugin
	            var offset = $input.offset();
	            $results.css({
	                top: (offset.top + input.offsetHeight) + 'px',
	                left: offset.left + 'px'
	            });
	        }

        }


        function processKey(e) {

            // handling up/down/escape requires results to be visible
            // handling enter/tab requires that AND a result to be selected
            if ((/27$|38$|40$/.test(e.keyCode) && $results.is(':visible')) ||
                (/^13$|^9$/.test(e.keyCode) && getCurrentResult())) {

                if (e.preventDefault)
                    e.preventDefault();
                if (e.stopPropagation)
                    e.stopPropagation();

                e.cancelBubble = true;
                e.returnValue = false;

                switch (e.keyCode) {

                    case 38: // up
                        prevResult();
                        break;

                    case 40: // down
                        nextResult();
                        break;

                    case 9:  // tab
                    case 13: // return
                        selectCurrentResult();
                        break;

                    case 27: //	escape
                        $results.hide();
                        break;

                }

            } else {
//	            if (timeout)
//	                clearTimeout(timeout);
//	            timeout = setTimeout(suggest, options.delay);
//	            prevLength = $input.val().length;
            }
        }


        function suggest() {

            timeout = setTimeout(suggest, options.delay);

            var act=document.activeElement;
            if(act.id==input.id){
//              setTimeout(function() {
//                    $results.hide()
//                }, 200);

	            var q = $.trim($input.val());
	            if (q.length >= options.minchars && prevVal != q) {
	                prevVal = q;

	                cached = checkCache(q);

	                if (cached) {

	                    displayItems(cached['items']);

	                } else {

	                    $.post(options.source, {q: q}, function(txt) {

	                        $results.hide();

	                        var items = parseTxt(txt, q);

	                        displayItems(items);
	                        addToCache(q, items, txt.length);

	                    });

	                }

	            }
	            else {
	                if (q.length < options.minchars) {
	                    prevVal = q;
	                    $results.hide();
	                }
	            }
	        }
        }


        function checkCache(q) {

            for (var i = 0; i < cache.length; i++)
                if (cache[i]['q'] == q) {
                    cache.unshift(cache.splice(i, 1)[0]);
                    return cache[0];
                }

            return false;

        }

        function addToCache(q, items, size) {

            while (cache.length && (cacheSize + size > options.maxCacheSize)) {
                var cached = cache.pop();
                cacheSize -= cached['size'];
            }

            cache.push({
                q: q,
                size: size,
                items: items
            });

            cacheSize += size;

        }

        function displayItems(items) {

            if (!items)
                return;

            if (!items.length) {
                $results.hide();
                return;
            }

            var html = '<table style="width:100%;border-collapse:collapse;border-width:0;border-style:none;"><tbody>';
            for (var i = 0; i < items.length; i++) {
                var parts = items[i].split(",");
                html += '<tr><td class="ac_word">' + parts[0] + '</td>' + '<td class="ac_desc">' + parts[1] + '</td></tr>';
            }
            html += "</tbody></table>"

            $results.html(html).show();
            $("table > tbody > tr",$results).mouseover(function() {
                var currentResult = getCurrentResult();
                if(currentResult){
                    currentResult.removeClass(options.selectClass);
                }
                $(this).addClass(options.selectClass);
            }).click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                selectCurrentResult();
            });
        }

        function parseTxt(txt, q) {

            var items = [];
            var tokens = txt.split(options.delimiter);

			// parse returned data for non-empty items
            for (var i = 0; i < tokens.length; i++) {
                var token = $.trim(tokens[i]);
                if (token) {
                    //token = token.replace(
                    //	new RegExp(q, 'ig'),
                    //	function(q) { return '<span class="' + options.matchClass + '">' + q + '</span>' }
                    //	);
                    items[items.length] = token;
                }
            }
            return items;
        }

        function getCurrentResult() {

            if (!$results.is(':visible'))
                return false;

            var $currentResult =$("table > tbody > tr." +  options.selectClass,$results);// $results.children('tr.' + options.selectClass);

            if (!$currentResult.length)
                $currentResult = false;

            return $currentResult;

        }

        function selectCurrentResult() {

            $currentResult = getCurrentResult();

            if ($currentResult) {
                var text = $($("td",$currentResult)[0]).text();
                $input.val(text);
                $results.hide();
//                checkTopSearchForm();
//                $("#searchform").submit();
                if(options.fn!=undefined&&options.fn!=''){
                  clearTimeout(timeout);
                  eval(options.fn);
                }
//                var form=document.getElementById(options.searchForm);
//                if(form!=null&&form!=undefined){
//                  clearTimeout(timeout);
//                  form.submit();
//                }

                if (options.onSelect)
                    options.onSelect.apply($input[0]);

            }

        }

        function nextResult() {

            $currentResult = getCurrentResult();

            if ($currentResult)
                $currentResult
                        .removeClass(options.selectClass)
                        .next()
                        .addClass(options.selectClass);
            else{
                var table = $results.children("table");
                var tbody = table.children("tbody");
                var tr = tbody.children("tr")[0];
                $(tr).addClass(options.selectClass);
                //$results.children('table tr:first-child').addClass(options.selectClass);
            }

        }

        function prevResult() {

            $currentResult = getCurrentResult();

            if ($currentResult)
                $currentResult
                        .removeClass(options.selectClass)
                        .prev()
                        .addClass(options.selectClass);
            else
            {
                var table = $results.children("table");
                var tbody = table.children("tbody");
                var tr = tbody.children("tr");
                $(tr[tr.length-1]).addClass(options.selectClass);
            }

        }

    }

    $.fn.suggest = function(source, options) {

        if (!source)
            return;

        options = options || {};
        options.source = source;
        options.delay = options.delay || 100;
        options.resultsClass = options.resultsClass || 'ac_results';
        options.selectClass = options.selectClass || 'ac_over';
        options.matchClass = options.matchClass || 'ac_match';
        options.minchars = options.minchars || 2;
        options.delimiter = options.delimiter || '\n';
        options.onSelect = options.onSelect || false;
        options.maxCacheSize = options.maxCacheSize || 65536;
        options.fn = options.fn || '';;
        options.container = options.container || null;;
        options.offset = options.offset || null;

        this.each(function() {
            new $.suggest(this, options);
        });

        return this;

    };
}));
