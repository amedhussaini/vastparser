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

		$('#meta-information').append('<li>Version: ' + STR_VERSION + '</li>');
		$('#meta-information').append('<li># of Ads: ' + STR_NUMBER_OF_ADS + '</li>');
		
		$(ADS).each(function(index, element) {
			
			// INLINE LEVEL DATA

			var STR_ADSYSTEM = $(this).find('AdSystem').text();
			var STR_ADTITLE = $(this).find('AdTitle').text();
			var STR_DESCRIPTION = $(this).find('Description').text();
			var IMPRESSION_TRACKERS = $(this).find('Impression');

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

					console.log(STR_TYPE);

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