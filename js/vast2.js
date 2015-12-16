var t3 = (function($) {

    // internal settings

    var debug = false;
    var tag = "http://ad.doubleclick.net/pfadx/N3158.129263.YUME/B8446438.114271426;sz=0x0;ord=$%7Brand%7D;dcmt=text/xml;yume_xml_timeout=10000;yume_ad_timeout=10000";

    function setTag(uri) {
        tag = uri;
    }

    function getTag(uri) {
        return tag;
    }

    function setTagData(data) {
        tagData = data;
    }

    function parseTag() {
        $.get(tag).done(function(data) {
            document.getElementById("version").innerHTML = $(data).find('VAST').attr("version");
            document.getElementById("number-of-ads").innerHTML = $(data).find('VAST').children().length
        });
    }

    return {
        setTag: setTag,
        getTag: getTag,
        start: parseTag
    };

})($);


$(document).ready(function() {
    t3.start();
}); 
