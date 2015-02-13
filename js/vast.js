$('#vast-url-button').click(function(){

	var vastUrlString = $('#vast-url-input').val();

	$.get(vastUrlString).done(function(data){

		// TOP LEVEL VAST INFORMATION

		var ADS = $(data).find('VAST').children();
		var STR_NUMBER_OF_ADS = ADS.length;

		var STR_VERSION = $(data).find('VAST').attr('version');
		
		$('#general').prepend('<h2>General</h2><hr>');
		$('#meta-information').append('<dt>VAST Version:</dt><dd>' + STR_VERSION + '</dd>');
		$('#meta-information').append('<dt>Number of Ads:</dt><dd>' + STR_NUMBER_OF_ADS + '</dd>');

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
			
			NUMBER_OF_ADS++;

			// INLINE LEVEL DATA

			var STR_ADSYSTEM = $(this).find('AdSystem').text();
			var STR_ADTITLE = $(this).find('AdTitle').text();
			var STR_DESCRIPTION = $(this).find('Description').text();
			var IMPRESSION_TRACKERS = $(this).find('Impression');
			var STUDY_TRACKERS = $(this).find('Survey');


			$('#ads').append('<h2>' + STR_ADTITLE + '<small> ad #' + NUMBER_OF_ADS + '</small></h2><hr><dl class="dl-horizontal">' + '<dt>Ad System</dt><dd>' + STR_ADSYSTEM + '</dd>' + '<dt>Description</dt><dd>' + STR_DESCRIPTION + '</dd>' +'</dl>');



			if($(IMPRESSION_TRACKERS).length !== 0) {
				$('#ads').append('<h3>Impression Trackers (' + $(IMPRESSION_TRACKERS).length + ')</h3><dl class="dl-horizontal" id="imp-ad-' + NUMBER_OF_ADS + '"></dl>');
			
			}


			if($(STUDY_TRACKERS).length !== 0) {
				$('#ads').append('<h3>Study Trackers</h3><ul id="study-ad-' + NUMBER_OF_ADS + '"></ul>');
			}

			$(IMPRESSION_TRACKERS).each(function(index, element){

				var impression_description = null;

				if($(this).attr('id') == null) {
					impression_description = 'Impression';
				} else {
					impression_description = $(this).attr('id');
				}	
				$('#imp-ad-' + NUMBER_OF_ADS).append('<dt>' + impression_description +'</dt><dd>' + $(this).text() + '</dd>');
			});


			$(STUDY_TRACKERS).each(function(index, element){
				$('#study-ad-' + NUMBER_OF_ADS).append('<li><b>' + $(this).attr('id') +':</b> ' + $(this).text() + '</li>');
			});

			var INLINE = $(this).find('InLine');
			
			// CREATIVES

			var CREATIVES = $(INLINE).find('Creatives').children();

			var creativeParentNumber = 1;

			$(CREATIVES).each(function(index, element){
				
				$(this).each(function(index, element){
					//$('#tracking').append('<tr><td>' + creativeNumber + '</td><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');
					
					var STR_TYPE = null;
					var STR_DURATION = null;
					// SUPERR EFFICIENT IFSS!!!!!!!

					if ($(this).find('Linear').length == 1) {
						STR_TYPE = 'Linear Ad';
					} else if ($(this).find('CompanionAds').length == 1) {
						STR_TYPE = 'Companion Banner'
					} else if ($(this).find('NonLinearAds').length == 1) {
						STR_TYPE = 'NonLinear Ad';
					} else  {
						STR_TYPE = "UNKNOWN!";
					}

					if ($(this).find('Duration').length == 1) {
						STR_DURATION = $(this).find('Duration').text();						
					} else {
						STR_DURATION = 'NA';
					}

					// MAIN HEADER 

					$('#ads').append('<br><h3>Creative #' + creativeParentNumber + ' (' + STR_TYPE + ', Duration: ' + STR_DURATION + ')</h3>');

					// MEDIA FILES

					var NUM_MEDIAFILES = $(this).find('MediaFiles').length;
					
					if(NUM_MEDIAFILES != 0) {

						$('#ads').append('<h4>MediaFiles</h4><dl class="dl-horizontal" id="media-files-' + creativeParentNumber + '"></dl>');
						var MEDIA_FILES = $($(this)).find('MediaFiles').children();

						$(MEDIA_FILES).each(function(index, element){

							var width = $(this).attr('width');
							var height = $(this).attr('height');
							var bitrate = $(this).attr('bitrate');
							var type = $(this).attr('type');

							//var media_description = type + ', ' + bitrate + 'kbps, ' + width + 'x' + height;
							var media_description = type + '@' + width + 'x' + height;
							
							$('#media-files-' + creativeParentNumber).append('<dt>' + media_description + '</dt><dd>' + $(this).text() + '</dd>');

						});
					}


					// VIDEO CLICKS

					var NUM_VIDEOCLICKS = $(this).find('VideoClicks').length;
					
					if(NUM_VIDEOCLICKS != 0) {

						$('#ads').append('<h4>Video Clicks</h4><dl class="dl-horizontal" id=video-trackers-' + creativeParentNumber + '></dl>');
						var VIDEO_CLICKS = $($(this)).find('VideoClicks').children();

						$(VIDEO_CLICKS).each(function(index, element){

							$('#video-trackers-' + creativeParentNumber).append('<dt>' + element.nodeName + '</dt><dd>' + $(this).text() + '</dd>');

						});
					}
					// TRACKERS
					
					$('#ads').append('<h4>Trackers</h4><dl class="dl-horizontal" id="creative-trackers-' + creativeParentNumber + '"></dl>');

					var trackingEvents = $(this).find('TrackingEvents').children();

					$(trackingEvents).each(function(index, element){
						
						//$('#tracking').append('<tr><td>' + creativeParentNumber + '</td><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');
						$('#creative-trackers-' + creativeParentNumber).append('<dt>' + $(this).attr('event') + '</dt><dd>' + $(this).text() + '</dd>');
					});

					// COMPANION ADS

					var NUM_COMPANIONBANNERS = $(this).find('CompanionAds').length;

					var TALLY_NUM_COMPANIONBANNERS = 1;

					if (NUM_COMPANIONBANNERS != 0) {

						var COMPANIONBANNERS = $(this).find('CompanionAds').children();

						$(COMPANIONBANNERS).each(function(index, element) {

							var width = $(this).attr('width');
							var height = $(this).attr('height');


							$('#ads').append('<h4>Companion Ad #' + TALLY_NUM_COMPANIONBANNERS + ' (' + width + 'x' + height + ')</h4><dl class="dl-horizontal" id="comp-' + NUM_COMPANIONBANNERS + '-' + creativeParentNumber + '"></dl>');
							console.log($(this));

							var pieces = $($(this)).children();

							$(pieces).each(function(index,element){

								$('#comp-' + NUM_COMPANIONBANNERS + '-' + creativeParentNumber).append('<dt>' + element.nodeName + '</dt><dd>' + $(this).text() + '</dd>');
								//console.log(element.nodeName);
							});

							TALLY_NUM_COMPANIONBANNERS++;
						});

					}

				});
				creativeParentNumber++;
			});			
		});
	});
});