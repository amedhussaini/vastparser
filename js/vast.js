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
	
		var numberOfCreatives = $(data).find('Creatives').children().length;
		var creatives = $(data).find('Creatives').children();
		console.log(numberOfCreatives);
		console.log(creatives);
		console.log($(data).find('Creatives'));
		
		var creativeParentNumber = 1;


		$(creatives).each(function(index, element){
			
			
			//var trackingEvents = $(this).find('TrackingEvents').children();
			
			$(this).each(function(index, element){
				
				//$('#tracking').append('<tr><td>' + creativeNumber + '</td><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');
				var trackingEvents = $(this).find('TrackingEvents').children();
				
				$(trackingEvents).each(function(index, element){
			
					$('#tracking').append('<tr><td>' + creativeParentNumber + '</td><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');

				});

				

			});

			creativeParentNumber++;
		
		});

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