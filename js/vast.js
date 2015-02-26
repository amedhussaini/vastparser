window.ads = [];
window.ads.version = null;

$('#vast-url-button').click(function(){

	var vastUrlString = $('#vast-url-input').val();

	$.get(vastUrlString).done(function(data){

		// TOP LEVEL VAST INFORMATION


		window.ads.version = $(data).find('VAST').attr('version');
		// END MOBILE CHECK

		var adsChildren = $(data).find('VAST').children();

		$(adsChildren).each(function(index, element) {

			var ad = {};
			ad.ad_system = $(this).find('AdSystem').text();
			ad.ad_title = $(this).find('AdTitle').text();
			ad.description = $(this).find('Description').text();
			ad.type = null;
			ad.impression_trackers = [];
			ad.creatives = [];
			ad.study_trackers = [];

			// INLINE LEVEL DATA

			var IMPRESSION_TRACKERS = $(this).find('Impression');
			var STUDY_TRACKERS = $(this).find('Survey');




			$(IMPRESSION_TRACKERS).each(function(index, element){
				ad.impression_trackers.push({url: $(this).text()});
			});


			$(STUDY_TRACKERS).each(function(index, element){
				ad.study_trackers.push({url: $(this).text()});
			});

			var INLINE = $(this).find('InLine');

			// CREATIVES

			var CREATIVES = $(INLINE).find('Creatives').children();

			var creativeParentNumber = 1;

			$(CREATIVES).each(function(index, element){

				$(this).each(function(index, element){
					//$('#tracking').append('<tr><td>' + creativeNumber + '</td><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');
					var creative = {};

					creative.media_files = [];
					creative.video_clicks = [];
					creative.creative_trackers = [];
					creative.companion_banners = [];


					// MAIN HEADER



					// MEDIA FILES

					var NUM_MEDIAFILES = $(this).find('MediaFiles').length;

					if(NUM_MEDIAFILES !== 0) {



						var MEDIA_FILES = $($(this)).find('MediaFiles').children();

						$(MEDIA_FILES).each(function(index, element){

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
								ad.type = 'VAST';
							}
						});
					}


					// VIDEO CLICKS

					var NUM_VIDEOCLICKS = $(this).find('VideoClicks').length;

					if(NUM_VIDEOCLICKS !== 0) {



						var VIDEO_CLICKS = $($(this)).find('VideoClicks').children();

						$(VIDEO_CLICKS).each(function(index, element){
							creative.video_clicks.push({type: element.nodeName, url: $(this).text()});

						});
					}
					// TRACKERS


					var trackingEvents = $(this).find('TrackingEvents').children();

					$(trackingEvents).each(function(index, element){

						//$('#tracking').append('<tr><td>' + creativeParentNumber + '</td><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');
						creative.creative_trackers.push({
							event: $(this).attr('event'),
							url: $(this).text()
						});

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

							});
							creative.companion_banners.push(companionbanner);
							TALLY_NUM_COMPANIONBANNERS++;
						});

					}

					ad.creatives.push(creative);

				});
				creativeParentNumber++;
			});
		window.ads.push(ad);
		});
		var template = $('#template').html();
		Mustache.parse(template);   // optional, speeds up future uses
		var rendered = Mustache.render(template, {
						ads: window.ads});

		$('#div_template').html(rendered);
	});
});

