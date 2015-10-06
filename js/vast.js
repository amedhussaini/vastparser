window.ads = [];
window.ads.version = null;
window.basic = [];
window.basic.version = "testing";
window.ads.urls = [];
window.ads.url_secure_number = 0;
window.ads.url_unsecure_number = 0;
window.ads.security_message = "Unknown";
$('#vast-url-button').click(function(){
    //console.log(window.ads.length);
    window.ads.length = 0;
	$('#div_template').empty();

	var vastUrlString = $('#vast-url-input').val();

	$.get(vastUrlString).done(function(data){

		// TOP LEVEL VAST INFORMATION
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
		{provider: 'Adometry', keyword: 'js.dmtry.com'}
		];

		// vizu = study
		// doubleverify = multiple products
		// add capability value
		// viewability, fraud, survey, impression tracking (eric, PYM (rebecca/stacy), claire)
		// (ping ratana/stacy for additional fields)

		window.ads.version = $(data).find('VAST').attr('version');
		window.ads.number_of_trackers = null;
		window.ads.isEmpty = 'Active'
		window.basic.isActive = 'Active'
		// END MOBILE CHECK

		var adsChildren = $(data).find('VAST').children();

		if (adsChildren.length === 0) {

		window.ads.isEmpty = 'This tag appears to be empty.'

		}

		$(adsChildren).each(function(index, element) {

			var ad = {};
			ad.ad_system = $(this).find('AdSystem').text();
			ad.ad_title = $(this).find('AdTitle').text();
			ad.description = $(this).find('Description').text();
			ad.type = 'VAST';

			if($(this).find('VASTAdTagURI').length === 0) {
				ad.wrapped_tag = 'NA';
			} else {
				ad.wrapped_tag = $(this).find('VASTAdTagURI').text();
			}


			ad.impression_trackers = [];
			ad.creatives = [];
			ad.study_trackers = [];
			// INLINE LEVEL DATA

			var IMPRESSION_TRACKERS = $(this).find('Impression');
			var STUDY_TRACKERS = $(this).find('Survey');




			$(IMPRESSION_TRACKERS).each(function(index, element){
				var currentUrl = $(this).text();
				var provider = null;
				dict.forEach(function(a) {
					var n = currentUrl.search(a.keyword);
					if(n > -1) {
						provider = a.provider;
					}
				});
				ad.impression_trackers.push({url: $(this).text(), provider: provider});
				window.ads.urls.push({url: $(this).text(), secure: null});
			});

			window.ads.number_of_trackers += IMPRESSION_TRACKERS.length;

			$(STUDY_TRACKERS).each(function(index, element){
				var currentUrl = $(this).text();
				var provider = null;
				dict.forEach(function(a) {
					var n = currentUrl.search(a.keyword);
					if(n > -1) {
						provider = a.provider;
					} else {
						provider = 'Unknown';
					}
				});
				ad.study_trackers.push({url: $(this).text(), provider: provider});
				window.ads.urls.push({url: $(this).text(), secure: null});
			});

			window.ads.number_of_trackers += STUDY_TRACKERS.length;

			var INLINE = $(this).find('InLine');
			var WRAPPED = $(this).find('Wrapper');
			var NONLINEAR = $(this).find('NonLinear');
			var ADTYPE = null;

			if(INLINE.length > 0) {
				ADTYPE = INLINE;
			}
			if(WRAPPED.length > 0) {
				ADTYPE = WRAPPED;
				ad.type = 'WRAPPED';
			}

			// CREATIVES

			var CREATIVES = $(ADTYPE).find('Creatives').children();



			$(CREATIVES).each(function(index, element){

				$(this).each(function(index, element){
					//$('#tracking').append('<tr><td>' + creativeNumber + '</td><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');
					var creative = {};
					creative.duration = 'NA';
					creative.media_files = [];
					creative.video_clicks = [];
					creative.creative_trackers = [];
					creative.companion_banners = [];


					// MAIN HEADER

					if ($(this).find('Duration').length !== 0) {
						creative.duration = $(this).find('Duration').text();
					}

					// MEDIA FILES

					var NUM_MEDIAFILES = $(this).find('MediaFiles').length;

					if(NUM_MEDIAFILES !== 0) {



						var MEDIA_FILES = $($(this)).find('MediaFiles').children();

						$(MEDIA_FILES).each(function(index, element){
							window.ads.urls.push({url: $(this).text(), secure: null});
							creative.media_files.push({
								url: $(this).text(),
								width: $(this).attr('width'),
								height: $(this).attr('height'),
								bitrate: $(this).attr('bitrate'),
								type: $(this).attr('type'),
								apiFramework: $(this).attr('apiFramework'),
								delivery: $(this).attr('delivery')
							});

							if($(this).attr('apiFramework') === 'VPAID') {
								ad.type = 'VPAID';
							} else {
								//ad.type = 'VAST';
							}
						});
					}


					// VIDEO CLICKS

					var NUM_VIDEOCLICKS = $(this).find('VideoClicks').length;

					if(NUM_VIDEOCLICKS !== 0) {



						var VIDEO_CLICKS = $($(this)).find('VideoClicks').children();

						$(VIDEO_CLICKS).each(function(index, element){
							creative.video_clicks.push({type: element.nodeName, url: $(this).text()});
							window.ads.urls.push({url: $(this).text(), secure: null});
						});
					}
					// TRACKERS


					var trackingEvents = $(this).find('TrackingEvents').children();

					window.ads.number_of_trackers += trackingEvents.length;

					$(trackingEvents).each(function(index, element){

						//$('#tracking').append('<tr><td>' + creativeParentNumber + '</td><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');
						creative.creative_trackers.push({
							event: $(this).attr('event'),
							url: $(this).text()
						});
						window.ads.urls.push({url: $(this).text(), secure: null});

					});

					// COMPANION ADS

					var NUM_COMPANIONBANNERS = $(this).find('CompanionAds').length;

					var TALLY_NUM_COMPANIONBANNERS = 1;

					if (NUM_COMPANIONBANNERS !== 0) {

						var COMPANIONBANNERS = $(this).find('CompanionAds').children();

						$(COMPANIONBANNERS).each(function(index, element) {

							var width = $(this).attr('width');
							var height = $(this).attr('height');




							var pieces = $($(this)).children();

							var companionbanner = [];
							$(pieces).each(function(index,element){


								//console.log(element.nodeName);
								companionbanner.push({name:element.nodeName, url: $(this).text()});
								window.ads.urls.push({url: $(this).text(), secure: null});
							});
							creative.companion_banners.push({assets: companionbanner, meta: {width: width, height: height}});
							TALLY_NUM_COMPANIONBANNERS++;
						});

					}

					ad.creatives.push(creative);

				});

			});
		window.ads.push(ad);
		});

		// debug purposes
		console.log(window.ads);


		for (var x=0; x < window.ads.urls.length; x++) {

			window.ads.urls[x].url.replace("", "");
		}


		for (var x=0; x < window.ads.urls.length; x++) {
			switch(window.ads.urls[x].url.substr(0,5)) {
				case "http:":
					window.ads.urls[x].secure = false;
					window.ads.url_unsecure_number = window.ads.url_unsecure_number + 1;
				break;
				case "https":
					window.ads.urls[x].secure = true;
					window.ads.url_secure_number = window.ads.url_secure_number + 1;
				break;
			}
			console.log(window.ads.urls[x].url.substr(0,5));
		}
		if (window.ads.url_unsecure_number == 0 && window.ads.url_secure_number > 0) {

			window.ads.security_message = "Secure";
		}
		if (window.ads.url_unsecure_number > 0 && window.ads.url_secure_number == 0) {

			window.ads.security_message = "Non-secure";
		}
		if (window.ads.url_unsecure_number > 0 && window.ads.url_secure_number > 0) {

			window.ads.security_message = "Mixed";
		}
		
		var template = $('#template').html();
		Mustache.parse(template);   // optional, speeds up future uses
		var rendered = Mustache.render(template, {
						ads: window.ads});

		$('#div_template').html(rendered);

		var basic_template = $('#basic_template').html();
		Mustache.parse(basic_template);
		var basic_rendered = Mustache.render(basic_template, { basic: window.basic});

		$('#div_basic_template').html(basic_rendered);
	});
});

