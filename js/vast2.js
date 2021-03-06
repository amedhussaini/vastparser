var t3 = (function($, window) {
    // private variables

    var tag = "http://vast.brandads.net/vast?line_item=13649676&subid1=novpaid&ba_cb=${rand}";
    var _type = null;
    var _creativeType = null;
    
    // special use cases
    var _isMoat = false;
    var _moatTag = "";
    var _moatOriginalTag = "";
    var _moatWarn = false;

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
        _checkMoatUseCase(tag);

        $.get(tag).done(function(data) {


            context = {};
            //can haz cheeseburger


            if (_isMoat) {
                context.originalMoat = _moatOriginalTag;
                context.moatWrapped = _moatTag;
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
            context.mobile_low = null;
            context.mobile_high = null;
            context.mobile_compatible = null;
            context.duration = "";
            context.isIas = false;
            context.isMoat = false;
            context.isWrapped = false;
            context.wrappedOriginalTag = "";
            context.wrappedVendor = "";
            context.isVastUri = false;
            context.VastAdTagURI = "";
            context.isVast3 = false;

            context.vpaid_flash = false;
            context.vpaid_js = false;
            context.standard_vast = false;

            context.tag_secure = null;
            context.tag_nonsecure = null;
            context.tag_mixed = null;
            context.tag_hasmp4 = false;
            context.mobile_alerts = [];


            var _ads = $(data).find('Ad');
            var _length_ads = _ads.length;
            var _length_ads_children = $(_ads).children().length;

            if (_moatWarn) {
                context.isMoat = true;
            }

            var _impression_trackers = $(data).find('Impression');
            var _study_trackers = $(data).find('Survey');
            var _creatives = $(data).find('Creatives').children();
            var _trackingEvents = $(data).find('Creatives').children();
            var _vastTagUri = $(data).find('VASTAdTagURI');

            if (context.version == '3.0' || context.version == '3') {
                context.isVast3 = true;
            }

            if (_vastTagUri.length > 0) {
                context.isVastUri = true;
                context.VastAdTagURI = _vastTagUri.text();
            }

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
                    
                    if ($(this).find('Duration').text() != '') {
                        context.duration = _convertTimeToSeconds($(this).find('Duration').text()) + "s";
                    }

                    // MediaFiles
                    var media_files = $(this).find('MediaFiles').children();
                    $(media_files).each(function(index, element) {
                        _incrementGeneralUrls($(this).text());

                        var checkForWrapped = _checkForWrappedTag($(this).text());

                        if (checkForWrapped != undefined) {
                            context.isWrapped = true;
                            context.wrappedVendor = checkForWrapped.vendor
                            context.wrappedOriginalTag = checkForWrapped.url
                            if (checkForWrapped.vendor == "AdSafe") {
                                context.isIas = true;
                            }
                        }



                        var is_secure = _checkUrlForSecurity($(this).text());
                        var type = $(this).attr("type");
                        var height = $(this).attr("height");
                        var width = $(this).attr("width");
                        var bitrate = $(this).attr("bitrate");
                        var player = false;

                        if (type == "application/x-shockwave-flash" || type == "application/shockwave-flash") {
                            context.vpaid_flash = true;
                        }

                        if (type == "video/mp4") {
                            switch(_checkMobileCompatability(bitrate, type)) {
                                case "low":
                                    context.mobile_compatible = true;
                                    context.mobile_low = true;
                                case "high":
                                    context.mobile_compatible = true;
                                    context.mobile_high = true;
                            }
                            player = true;
                            context.vast = true;
                            context.has_mp4 = true;
                        } 

                        if (type == "application/javascript" || type == "application/x-javascript") {
                            context.mobile_compatible = true;
                            context.vpaid_js = true;
                        }

                        if (type == "video/mp4" || type == "video/x-mp4" || type == "video/x-flv" || type == "video/flv" || type == "video/3gpp" || type == "video/webm") {
                            context.standard_vast = true;
                        }

                        context.creatives[_index].media_files.push({type: $(this).attr("type"), url: $(this).text(), secure: is_secure, bitrate: bitrate, height: height, width: width, playable: player});
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
                                    //console.log($(this).text());
                                    //console.log(is_secure);
                                    var obj = {type: element.nodeName, url: $(this).text(), secure: is_secure};  
            
                                    if (element.nodeName == 'StaticResource') {
                                        obj.static_resource = true;
                                    }
                                    context.creatives[_index].companion_ads.push(obj);
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

            var security_check = _checkSecurityCount(context.number_of_secure_trackers, context.number_of_general_urls);
    
            switch(security_check) {
                case 0:
                context.tag_nonsecure = true;
                break;
                case -1:
                context.tag_mixed = true;
                break;
                case 1:
                context.tag_secure = true;
                break;
                default:
                break;
            }

            if (context.vpaid_flash && !context.vpaid_js && !context.has_mp4) {
                context.mobile_alerts.push({message: "This is a Flash based VPAID tag and there are no other suitable media types for Mobile included in the tag."});
            }

            if (!context.vpaid_flash && !context.vpaid_js && !context.has_mp4) {
                context.mobile_alerts.push({message: "This tag does not contain any MP4s that meet our mobile specifications."});
            }


            console.log("vpaid flash: " + context.vpaid_flash);
            console.log("vpaid js: " + context.vpaid_js);
            console.log("lacking mp4: " + context.has_mp4);


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

    /*
    *
    * FUNCTIONS
    *
    */

    function _checkSecurityCount(secure_urls, total_urls) {

        if (secure_urls < total_urls && secure_urls != 0) {
            return -1;
        }
        if (secure_urls == total_urls) {
            return 1;
        }
        if (secure_urls == 0) {
            return 0;
        }

    }

    function _convertTimeToSeconds(string) {
        var a = string.split(":");
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        return seconds;
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
            {provider: 'IAS', keyword: 'adsafeprotected.com'},
            {provider: 'MaxPoint Interactive', keyword: 'mps.mxptint.net'}
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
        url = url.trim()
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
        context.number_of_general_urls++;
    }

    function _checkForWrappedTag(data) {
        data = data.trim();
        if (data.match("adsafeprotected.com")) {
            //originalVast=
            var matchKey = "originalVast=";
            var matchKeyLength = matchKey.length;
            var useCase = data.match(matchKey);
            var tagLength = data.length;
            var tag;

            if (useCase != null) {
                tag = unescape(data.substr(useCase.index+matchKeyLength, tagLength)).trim();
            }
            return {vendor: "AdSafe", url: tag};
        }

        if (data.match("b.measuread.com")) {
            //cs_vurl=
            var matchKey = "cs_vurl=";
            var matchKeyLength = matchKey.length;
            var useCase = data.match(matchKey);
            var tagLength = data.length;
            var tag;
            if (useCase != null) {
                tag = unescape(data.substr(useCase.index+matchKeyLength, tagLength)).trim();
            }
            return {vendor: "comScore", url: tag};

        }

        if (data.match("svastx.moatads.com")) {
            //vast=
            var matchKey = "vast=";
            var matchKeyLength = matchKey.length;
            var useCase = data.match(matchKey);
            var tagLength = data.length;
            var tag;

            if (useCase != null) {
                tag = unescape(data.substr(useCase.index+matchKeyLength, tagLength)).trim();
            }
            return {vendor: "Moat", url: tag};
        }


    }


    function _checkMoatUseCase(url) {
        url = url.trim();
        var generalMatchKey = "moatads.com";

        if (url.match(generalMatchKey) == null) {
            //doesnt match the moat pattern
            return false;
        }
        console.log("is_moat");
        var matchKey = "vast_URL=";
        var matchKeyLength = matchKey.length;
        var moatUseCase = url.match(matchKey);
        var tagLength = url.length;

        if (moatUseCase != null) {
            _isMoat = true;
            _moatTag = url.substr(moatUseCase.index+matchKeyLength, tagLength);
            _moatOriginalTag = url;
        } else {
            console.log("still moat but no detected wrapped tag");
            _moatWarn = true;
            _isMoat = false;
        }

    }

    function _checkMobileCompatability(bitrate, file_type) {

        if (file_type == "video/mp4") {

            if (bitrate < 385 && bitrate > 99) {
                return "low";
            } else if (bitrate > 384) {
                return "high";
            } else {
                return "none";
            }

        } else {
            return "none";
        }

    }

    return {
        setTag: setTag,
        getTag: getTag,
        start: parseTag,
        test: _checkUrlForSecurity,
        check: _checkMobileCompatability,
        testing: _convertTimeToSeconds
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
