var t3 = (function($) {

    // internal settings

    var debug = false;

    var tag = "http://ad.doubleclick.net/pfadx/N3158.129263.YUME/B8446438.114271426;sz=0x0;ord=$%7Brand%7D;dcmt=text/xml;yume_xml_timeout=10000;yume_ad_timeout=10000";
    var tagData = null;


    function setTag(uri) {
        tag = uri;
    }

    function getTag(uri) {
        return tag;
    }

    function setTagData(data) {
        tagData = data;
    }
    function getTagData() {
        return tagData;
    }

    function requestAd() {
        $.get(tag).done(function(data) {
            setTagData(data);
        });
    }

    return {
        setTag: setTag,
        getTag: getTag,
        getTagData: getTagData,
        requestAd: requestAd
    };

})($);