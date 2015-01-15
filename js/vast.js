$('#vast-url-button').click(function(){
	var vastUrlString = $('#vast-url-input').val();
	$.get(vastUrlString).done(function(data){

		//$xml = $(data);
		//$test = $xml.find('TrackingEvents').children();
		//console.log($test);
		//$.each($test, function(k, v){

//			console.log(v);
//		})

// count creatives, traverse each, display table based on creative #
	
		// TOP LEVEL VAST INFORMATION


		var ADS = $(data).find('VAST').children();

		var STR_VERSION = $(data).find('VAST').attr('version');
		var STR_NUMBER_OF_ADS = $(data).find('VAST').children().length;

		$('#general').prepend('<h3>General</h3>');
		$('#meta-information').append('<li><b>VAST Version:</b> ' + STR_VERSION + '</li>');
		$('#meta-information').append('<li><b>Number of Ads:</b> ' + STR_NUMBER_OF_ADS + '</li>');

		var NUMBER_OF_ADS = 0;

		$(ADS).each(function(index, element) {
			
			NUMBER_OF_ADS++;

			// INLINE LEVEL DATA

			var STR_ADSYSTEM = $(this).find('AdSystem').text();
			var STR_ADTITLE = $(this).find('AdTitle').text();
			var STR_DESCRIPTION = $(this).find('Description').text();
			var IMPRESSION_TRACKERS = $(this).find('Impression');
			var STUDY_TRACKERS = $(this).find('Survey');

			$('#meta-information').append('<li><b>Ad System:</b> ' + STR_ADSYSTEM + '</li>');
			$('#meta-information').append('<li><b>Title:</b> ' + STR_ADTITLE + '</li>');
			$('#meta-information').append('<li><b>Description:</b> ' + STR_DESCRIPTION + '</li>');

			$('#ads').append('<h2>' + STR_ADTITLE + '</h2><ul>' + '<li><b>Ad System: </b>' + STR_ADSYSTEM + '</li>' + '<li><b>Description: </b>' + STR_DESCRIPTION + '</li>' +'</ul>');

			if($(IMPRESSION_TRACKERS).length != 0) {

			$('#ads').append('<h3>Impression Trackers</h3><ul id="imp-ad-' + NUMBER_OF_ADS + '"></ul>');
			}

			if($(STUDY_TRACKERS).length != 0) {
			$('#ads').append('<h3>Study Trackers</h3><ul id="study-ad-' + NUMBER_OF_ADS + '"></ul>');
			}

			$(IMPRESSION_TRACKERS).each(function(index, element){

				$('#imp-ad-' + NUMBER_OF_ADS).append('<li><b>' + $(this).attr('id') +':</b> ' + $(this).text() + '</li>');
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


					$('#ads').append('<h3>Creative #' + creativeParentNumber + ' (' + STR_TYPE + ')</h3><ul id="ad-' + creativeParentNumber + '"></ul>');
			

					var trackingEvents = $(this).find('TrackingEvents').children();

					$(trackingEvents).each(function(index, element){
						
						//$('#tracking').append('<tr><td>' + creativeParentNumber + '</td><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');
						$('#ad-' + creativeParentNumber).append('<li><b>' + $(this).attr('event') + ':</b> ' + $(this).text() + '</li>');
					});
				});
				creativeParentNumber++;
			});

			
		});


		//var numberOfCreatives = $(data).find('Creatives').children().length;
		//var creatives = $(data).find('Creatives').children();
		
		//console.log(creatives);

		

/*

		

		var trackingEvents = $(data).find('TrackingEvents').children();

		$(trackingEvents).each(function(index, element){
			
			$('#tracking').append('<tr><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');

		});

		var mediaFiles = $(data).find('MediaFiles').children();

		$(mediaFiles).each(function(index, element){

			var url = $(this).text();
			var bitrate = $(this).attr('bitrate');
			var height = $(this).attr('height');
			var width = $(this).attr('width');
			var type = $(this).attr('type');

			$('#mediafiles').append('<tr><td>' + url + '</td><td>' + bitrate + '</td><td>' + height + '</td><td>' + width + '</td><td>' + type + '</td></tr>');

		});

*/
	});
});