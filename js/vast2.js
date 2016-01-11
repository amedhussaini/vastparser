var t3 = (function($, window) {

    // private variables

    var debug = false;
    var tag = "http://vast.brandads.net/vast?line_item=13649676&subid1=novpaid&ba_cb=${rand}";
    var _type = null;
    var _creativeType = null;
    var _isIas = false;
    var _iasTag = "";
    var _iasOriginalTag = "";
    //var tag = "https://experiences.fuiszmedia.com/5633bf0b9ede1703001a3dae/vast.xml";
    //var tag = "http://fw.adsafeprotected.com/vast/fwjsvid/st/47149/6673121/skeleton.js?originalVast=https://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=is&c=23&pl=VAST&pli=15243107&PluID=0&pos=1000&ord=${rand}&cim=1";
    //var tag = "http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=is&c=23&pl=VAST&pli=13959650&PluID=0&pos=9578&ord=${rand}&cim=1&yume_xml_timeout=10000&yume_ad_timeout=10000";
    function setTag(uri) {
        tag = uri;
    }

    function getTag() {
        tag = window.document.getElementById("tag-input").value;
    }

    function setTagData(data) {
        tagData = data;
    }

    function parseTag() {

        _type = null;
        _creativeType = null;

            _checkIasUseCase(tag);

            if (_isIas) {
                tag = _iasTag;
                console.log(tag);
            }



        $.get(tag).done(function(data) {


            context = {};
            //can haz cheeseburger

            if (_isIas) {
                context.originalIas = _iasOriginalTag;
                context.iasWrapped = _iasTag;
            }

            context.has_ads = true;
            context.impression_trackers = [];
            context.study_trackers = [];
            context.creatives = [];
            context.mediafiles = [];
            context.tracking_events = [];
            context.video_trackers = [];
            context.creatives_video_click = [];

            context.version = $(data).find('VAST').attr("version");
            context.number_of_ads = $(data).find('VAST').children().length
            context.type_of_feed = "";
            context.number_of_trackers = 0;
            context.number_of_secure_trackers = 0;
            context.number_of_general_urls = 0;

            var _ads = $(data).find('Ad');
            var _length_ads = _ads.length;
            var _length_ads_children = $(_ads).children().length;



            var _impression_trackers = $(data).find('Impression');
            var _study_trackers = $(data).find('Survey');
            var _creatives = $(data).find('Creatives').children();
            var _trackingEvents = $(data).find('Creatives').children();


            // check if the feed is lacking ad elements or has an ad element with no children
            if (_length_ads == 0 || _length_ads_children == 0) {
                context.has_ads = false;
            } 

            // impression elements
            $(_impression_trackers).each(function(index, element) {
                _incrementGeneralUrls($(this).text());
                _incrementTrackers();
                var is_secure = _checkUrlForSecurity($(this).text());
                context.impression_trackers.push({url: $(this).text(), provider: _getVendor($(this).text()), secure: is_secure});

            });

            // study elements
            $(_study_trackers).each(function(index,element) {
                _incrementGeneralUrls($(this).text());
                _incrementTrackers();
                var is_secure = _checkUrlForSecurity($(this).text());
                context.study_trackers.push({url: $(this).text(), provider: _getVendor($(this).text()), secure: is_secure});
            });

            // creative elements
            $(_creatives).each(function(index, element) {


                // this is to account for vendors who place a 'VideoClicks' element as a child of 'Creatives', which is not in spec
                if (element.nodeName == 'Creative') {
                    var _index = index;
                    context.creatives.push({type: _getTypeOfCreative($(this))});
                    context.type_of_feed = _getTypeOfTag($(this));
                    context.creatives[index].media_files = [];
                    context.creatives[index].tracking_events = [];
                    context.creatives[index].video_clicks = [];
                    context.creatives[index].companion_ads = [];

                    // MediaFiles
                    var media_files = $(this).find('MediaFiles').children();
                    $(media_files).each(function(index, element) {
                        _incrementGeneralUrls($(this).text());
                        var is_secure = _checkUrlForSecurity($(this).text());
                        context.creatives[_index].media_files.push({type: $(this).attr("type"), url: $(this).text(), secure: is_secure});
                    });

                    // TrackingEvents
                    var tracking_events = $(this).find('TrackingEvents').children();
                    //console.log(tracking_events);
                    $(tracking_events).each(function(index, element) {
                        _incrementGeneralUrls($(this).text());
                        _incrementTrackers();
                        var is_secure = _checkUrlForSecurity($(this).text());
                        context.creatives[_index].tracking_events.push({event: $(this).attr("event"), url: $(this).text(), secure: is_secure});
                        //console.log(context.creatives[_index].tracking_events);
                    });

                    // VideoClicks

                    var video_clicks = $(this).find('VideoClicks').children();
                    //console.log(video_clicks);
                    $(video_clicks).each(function(index, element) {
                        //console.log($(this).text());
                        _incrementGeneralUrls($(this).text());
                        var is_secure = _checkUrlForSecurity($(this).text());
                        context.creatives[_index].video_clicks.push({type: element.nodeName, url: $(this).text(), secure: is_secure});
                    });

                    // CompanionAds

                    var companion_ads = $(this).find('CompanionAds').children();
                    $(companion_ads).each(function(index, element) {

                        var co_ad_elements = $(this).children()

                            $(co_ad_elements).each(function(index, element) {

                                if (element.nodeName != 'TrackingEvents') {
                                    _incrementGeneralUrls($(this).text());
                                    var is_secure = _checkUrlForSecurity($(this).text());            
                                    context.creatives[_index].companion_ads.push({type: element.nodeName, url: $(this).text(), secure: is_secure});
                                }

                            });

                    });
                } else if (element.nodeName == 'VideoClicks') {


                    $(this).each(function(index, element) {
                        _incrementGeneralUrls($(this).text());
                        var is_secure = _checkUrlForSecurity($(this).text());
                        context.creatives_video_click.push({type: element.nodeName, url: $(this).text(), secure: is_secure});
                    });



                }

            });

            var source   = $("#template").html();
            var template = Handlebars.compile(source);
            var html    = template(context);
            $(".table").html(html).hide().fadeIn(800);

            var source2   = $("#quickview").html();
            var template2 = Handlebars.compile(source2);
            var html2    = template2(context);
            $(".quickview").html(html2).hide().fadeIn(200);

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
            {provider: 'Aggregate Knowledge (Neustar)', keyword: 'agkn.com'},
            {provider: 'Segment', keyword: 'segment.io'},
            {provider: 'BrandAds', keyword: 'brandads.net'},
            {provider: 'IAS', keyword: 'adsafeprotected.com'}
        ];

        dict.forEach(function(a) {
            var n = url.search(a.keyword);
            if (n > -1) {
                provider = a.provider;
            }
        });

        return provider;
    }

    function _getTypeOfCreative(object) {

        if (object.find('CompanionAds').length > 0) {
            _creativeType = "Companion Banner";
        } else {

            var media_files = object.find('MediaFiles').children();

            $(media_files).each(function(index, element) {

                var attribute = $(this).attr("type");


                if (attribute == "application/shockwave-flash") {
                    _creativeType = "VPAID (Flash)";
                }
                if (attribute == "application/x-shockwave-flash") {
                    _creativeType = "VPAID (Flash)";
                }
                if (attribute == "application/javascript") {
                    _creativeType = "VPAID (JavaScript)";
                }
                if (attribute == "application/x-javascript") {
                    _creativeType = "VPAID (JavaScript)";
                }


            });
        
        }
        if (_creativeType == null) {
            return "VAST";
        } else {
            return _creativeType;
        }
    }

    function _getTypeOfTag(object) {


            var media_files = object.find('MediaFiles').children();

            $(media_files).each(function(index, element) {

                var attribute = $(this).attr("type");

                //console.log(attribute);

                if (attribute == "application/shockwave-flash") {
                    _type = "VPAID (Flash)";
                }
                if (attribute == "application/x-shockwave-flash") {
                    _type = "VPAID (Flash)";
                }
                if (attribute == "application/javascript") {
                    _type = "VPAID (JavaScript)";
                }
                if (attribute == "application/x-javascript") {
                    _type = "VPAID (JavaScript)";
                }

            });
        

        
        if (_type == null) {
            return "VAST";
        } else {
            return _type;
        }
        
    }

    function _incrementTrackers() {
        context.number_of_trackers++;
    }

    function _checkUrlForSecurity(url) {

        switch(url.substr(0,5).trim()) {
            case "http:":
                return null;
            break;
            case "https":
            context.number_of_secure_trackers++;
                return "true";      
            break;

        }
    }

    function _incrementGeneralUrls(url) {
        //console.log(url);
        context.number_of_general_urls++;
    }

    function _checkIasUseCase(url) {
        var matchKey = "originalVast=";
        var matchKeyLength = matchKey.length;
        var iasUseCase = url.match(matchKey);
        var tagLength = url.length;

        if (iasUseCase != null) {
            //console.log(url.substr(iasUseCase.index+matchKeyLength,tagLength));
            _isIas = true;
            _iasTag = url.substr(iasUseCase.index+matchKeyLength,tagLength);
            _iasOriginalTag = url;
        } else {
            _isIas = false;
        }

    }

    return {
        setTag: setTag,
        getTag: getTag,
        start: parseTag,
        test: _checkUrlForSecurity,
        check: _checkIasUseCase
    };

})($, window);


$(document).ready(function() {

    //t3.start();

    $('#button-input').click(function(){
        t3.getTag();
        t3.start();
    });

}); 

Handlebars.registerHelper('list', function(items, options) {
    var out = "";
    for(var i=0, l=items.length; i<l; i++) {
        out += options.fn(items[i]);
    }
    return out;
});
