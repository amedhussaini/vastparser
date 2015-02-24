window.ads = [];

$('#vast-url-button').click(function(){

	var vastUrlString = $('#vast-url-input').val();

	$.get(vastUrlString).done(function(data){

		// TOP LEVEL VAST INFORMATION

		var ADS = $(data).find('VAST').children();


		var STR_NUMBER_OF_ADS = ADS.length;
		var STR_VERSION = $(data).find('VAST').attr('version');


		var NUMBER_OF_ADS = 0;

		// MOBILE CHECK

		var mfiles = $(data).find('MediaFiles').children();

		$(mfiles).each(function(index, element){
			var type = $(this).attr('type');
			var bitrate = $(this).attr('bitrate');
			var url = $(this).text();
			var completed_string = type + ', ' + bitrate + 'kbps';
			if( type == 'video/mp4') {
				if( bitrate == 130 || bitrate == 150 || (299 < bitrate && bitrate < 385)) {
					$('#meta-information').append('<dt><span class="label label-success">Mobile approved</span></dt><dd>' + completed_string + '</dd>');
				}
			}
		});

		// END MOBILE CHECK

		$(ADS).each(function(index, element) {

			var ad = {};

			NUMBER_OF_ADS++;

			// INLINE LEVEL DATA

			var STR_ADSYSTEM = $(this).find('AdSystem').text();
			var STR_ADTITLE = $(this).find('AdTitle').text();
			var STR_DESCRIPTION = $(this).find('Description').text();
			var IMPRESSION_TRACKERS = $(this).find('Impression');
			var STUDY_TRACKERS = $(this).find('Survey');

			ad.ad_system = STR_ADSYSTEM;
			ad.ad_title = STR_ADTITLE;
			ad.description = STR_DESCRIPTION;
			ad.impression_trackers = [];
			ad.creatives = [];
			ad.study_trackers = [];


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
								type: $(this).attr('type')
							});


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

