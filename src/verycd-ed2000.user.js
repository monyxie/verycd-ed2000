// ==UserScript==
// @name         VeryCD? ED2000!
// @namespace    http://monyxie.tk/
// @version      0.1
// @description  Helps you find VeryCD downloads on ed2000.com(a verycd.com mirror site) and improve its usability a little bit.
// @icon         http://www.ed2000.com/favicon.ico
// @include      http://www.ed2000.com/ShowFile.asp*  
// @include      http://www.verycd.com/topics/*
// @license      WTFPL http://www.wtfpl.net/txt/copying/
// ==/UserScript==

(function(){
    function $(s) { return document.querySelectorAll(s); }

    function removePuncs(str) {
        return str.replace(/[\s\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\[\]\:\"\;\'\<\>\?\,\.\/\|\\\`！￥…（）—【】；：‘’“”，。《》？、·–]+/g, " ").trim();
    }

    function vcUi() {
        var div, btn;
        div = $('#iptcomED2K')[0];
        if (div) {
            if (/无法提供下载/.test(div.innerText)) {
                btn = document.createElement("button");
                btn.innerText = "ED2000!";
                btn.title = "在ed2000.com上搜索这个资源";
                btn.addEventListener("click", function() {
                    window.open("http://search.ed2000.com/cse/search?s=5102198518115871963&q="+removePuncs($("#topicstitle")[0].innerText));
                });
                div.firstChild.appendChild(btn);
            }
        }
    }

    if (window.location.hostname === "www.verycd.com") {
        vcUi();
        return;
    }

    var fileid = window.location.search.match(/FileID=(\d+)/)[1];

    function cleanUpFilename(str) {
        return str.replace(/\(ed2000\.com\)(?=\.\w+\|)/ig, "");
    }

    function modalDialog(child) {
        var ol, inner, btn;
        ol = document.createElement("div");
        ol.setAttribute("style", "visibility:visible; position:fixed; left:0px; top:0px; width:100%; height:100%; text-align:center; z-index:1000; background-color:#000; opacity:0.95;");
        inner = document.createElement("div");
        inner.setAttribute("style", "width:800px; margin:100px auto; background-color:#fff; border:1px solid #00; padding:15px; text-align:center; opacity:1.0; border-radius:10px;");
        btn = document.createElement("button");
        btn.innerText = "关闭";
        btn.addEventListener("click", function() {
            document.body.removeChild(this.parentNode.parentNode);
        });
        child.style.width = "100%";
        inner.appendChild(child);
        inner.appendChild(btn);
        ol.appendChild(inner);
        document.body.appendChild(ol);
    }

    function msgBox(text) {
        var el = document.createElement("p");
        el.innerText = text;
        modalDialog(el);
    }

    function initUi() {
        var table, trs, buttonsTd, btn;
        table = $("table.CommonListArea")[1];
        if (!fileid || !table) {
            return false;
        }
        trs = table.getElementsByTagName("tr");
        buttonsTd = trs[trs.length-1].getElementsByTagName("td")[1];
        btn = document.createElement("input");
        btn.type = "button";
        btn.value = "提取选中链接";
        btn.class = "filebutton";
        btn.addEventListener("click", function() {
            var ta = createSelectedLinksList();
            modalDialog(ta);
            ta.select();
        });
        buttonsTd.appendChild(btn);
    }

    function createSelectedLinksList() {
        var sel, ta, len, value;
        sel = getSelectedLinks();
        // var ul = document.createElement("ul");
        ta = document.createElement("textarea");
        ta.setAttribute("rows", "15");
        ta.setAttribute("title", "请用Ctrl+C复制");
        value = "";
        len = sel.length;
        for (var i = 0; i < len; i++) {
            value += sel[i] + "\n";
        }
        ta.value = cleanUpFilename(value);
        return ta;
    }

    function getSelectedLinks() {
        var a, n, links;
        a = document.getElementsByName("File"+fileid);
        n = a.length;
        links = [];
        for (var i = 0; i < n; i++) {
            if(a[i].checked) {
                links.push(a[i].value);
            }
        }
        return links;
    }

    function main() {
        initUi();
    }

    main();
})();
