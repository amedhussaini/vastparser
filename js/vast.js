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

		var numberTrackingEvents = $(data).find('TrackingEvents').length;

		var trackingEvents = $(data).find('TrackingEvents').children();

		$(trackingEvents).each(function(index, element){
			
			console.log($(this).attr('event'));
			$('#tracking').append('<tr><td>' + $(this).attr('event') + '</td><td>' + $(this).text()  + '</td></tr>');
			console.log($(this).text());
		
		});



	});
});