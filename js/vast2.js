var t3 = (function($) {

    // internal settings

    var debug = false;
    var tag = "http://ad.doubleclick.net/pfadx/N3158.129263.YUME/B8446438.114271426;sz=0x0;ord=$%7Brand%7D;dcmt=text/xml;yume_xml_timeout=10000;yume_ad_timeout=10000";
    //var tag = "https://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=is&c=23&pl=VAST&pli=14272792&PluID=0&pos=7918&ord=${rand}&cim=1";
    //var tag = "http://fw.adsafeprotected.com/vast/fwjsvid/st/47149/6673121/skeleton.js?originalVast=https://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=is&c=23&pl=VAST&pli=15243107&PluID=0&pos=1000&ord=${rand}&cim=1";
    //var tag = "http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=is&c=23&pl=VAST&pli=13959650&PluID=0&pos=9578&ord=${rand}&cim=1&yume_xml_timeout=10000&yume_ad_timeout=10000";
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

            context = {};
            context.impression_trackers = [];
            context.study_trackers = [];
            context.creatives = [];
            context.mediafiles = [];
            context.tracking_events = [];
            context.video_trackers = [];
            

            context.version = $(data).find('VAST').attr("version");
            context.number_of_ads = $(data).find('VAST').children().length

            var _impression_trackers = $(data).find('Impression');
            var _study_trackers = $(data).find('Survey');
            var _creatives = $(data).find('Creatives').children();
            var _trackingEvents = $(data).find('Creatives').children()
            $(_impression_trackers).each(function(index, element) {
                context.impression_trackers.push({url: $(this).text(), provider: _getVendor($(this).text())});
            });

            $(_study_trackers).each(function(index,element) {
                context.study_trackers.push({url: $(this).text(), provider: _getVendor($(this).text())});
            });

            $(_creatives).each(function(index, element) {
                var _index = index;
                context.creatives.push({type: _getTypeOfCreative($(this))});
                context.creatives[index].media_files = [];
                context.creatives[index].tracking_events = [];
                context.creatives[index].video_clicks = [];
                context.creatives[index].companion_ads = [];

                // MediaFiles
                var media_files = $(this).find('MediaFiles').children();
                $(media_files).each(function(index, element) {
                    //var media_files = [];
                    //context.mediafiles.push({type: $(this).attr("type"), url: $(this).text()});
                    context.creatives[_index].media_files.push({type: $(this).attr("type"), url: $(this).text()});
                });

                // TrackingEvents
                var tracking_events = $(this).find('TrackingEvents').children();
                $(tracking_events).each(function(index, element) {
                    context.creatives[_index].tracking_events.push({event: $(this).attr("event"), url: $(this).text()});
                });

                // VideoClicks

                var video_clicks = $(this).find('VideoClicks').children();
                $(video_clicks).each(function(index, element) {
                    context.creatives[_index].video_clicks.push({type: element.nodeName, url: $(this).text()});
                });

                // CompanionAds

                var companion_ads = $(this).find('CompanionAds').children();
                $(companion_ads).each(function(index, element) {
                    context.creatives[_index].video_clicks.push({});
                });


            });

            var source   = $("#template").html();
            var template = Handlebars.compile(source);
            var html    = template(context);
            $(".table").html(html);

        });
    }

    function _getVendor(url) {

        var provider = null;

        var dict = [
            {provider: 'Media Mind', keyword: 'serving-sys'},
            {provider: 'Nielsen', keyword: 'imrworldwide.com'},
            {provider: 'Insight Express', keyword: 'insightexpressai.com'},
            {provider: 'comScore', keyword: 'b.scorecardresearch.com'},
            {provider: 'DoubleVerify', keyword: 'doubleverify.com'},
            {provider: 'Vizu', keyword: 'vizu.com'},
            {provider: 'DoubleClick', keyword: 'doubleclick.net'},
            {provider: 'Atlas', keyword: 'atdmt.com'},
            {provider: 'Vindico', keyword: 'vindicosuite'},
            {provider: 'Adometry', keyword: 'js.dmtry.com'},
            {provider: 'Zedo', keyword: 'zedo.com'},
            {provider: 'Innovid', keyword: 'innovid.com'},
            {provider: 'Telemetry', keyword: 'telemetryverification.net'},
            {provider: 'BlueKai', keyword: 'bluekai.com'},
            {provider: 'Aggregate Knowledge (Neustar)', keyword: 'agkn.com'}
        ];

        dict.forEach(function(a) {
            var n = url.search(a.keyword);
            if(n > -1) {
                provider = a.provider;
            }
        });

        return provider;

    }

    function _getTypeOfCreative(object) {

        var type = null;

        if (object.find('CompanionAds').length > 0) {
            type = "Companion Banner";
        } else {

            var media_files = object.find('MediaFiles').children();

            $(media_files).each(function(index, element) {

                switch($(this).attr("type")) {
                    case "application/shockwave-flash":
                        type = "VPAID (Flash)";
                    case "application/x-shockwave-flash":
                        type = "VPAID (Flash)";
                    case "application/javascript":
                        type = "VPAID (JavaScript)";
                    case "application/x-javascript":
                        type = "VPAID (JavaScript)";
                    default:
                        type = "VAST";
                }

            });
        }

        return type;

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

Handlebars.registerHelper('list', function(items, options) {
    var out = "";
    for(var i=0, l=items.length; i<l; i++) {
        out += options.fn(items[i]);
    }
    return out;
});
