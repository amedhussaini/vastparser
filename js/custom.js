$(document).ready(function(){

	var locked_height = $('.guide_video').height();
	var locked_width = $('.guide_video').width();

	var isShowing = false;

	var bannerTemplate = false;
	var showCB = true;

	var selectedPreset = null;

	var global_selected_file;

	// CLICK EVENTS

	$('#add-player-text').click(function() {


		$('#text-overlay').html($('#text-overlay-input').val());
		$('#text-overlay').show();
		$('#text-overlay').draggable();

	});

	$('#add-player-text-increase').click(function() {

		$('#text-overlay').css('font-size', '+=1px');

	});


	$('#add-player-text-decrease').click(function() {

		$('#text-overlay').css('font-size', '-=1px');

	});

	$('#player-move-left').click(function(){

		$( '.video-wrapper' ).css( 'left', '-=1px' );

	});

	$('#player-move-right').click(function(){

		$( '.video-wrapper' ).css( 'left', '+=1px' );

	});

	$('#player-move-up').click(function(){

		$( '.video-wrapper' ).css( 'top', '-=1px' );

	});

	$('#player-move-down').click(function(){

		$( '.video-wrapper' ).css( 'top', '+=1px' );
	});

	$('#hide-all-button').click(function(){

		//class dropdown
		//id learning-modal
		//id playerAdditionalMenu
		//id playerAdditionalMenu2
		$('.dropdown').toggle(500);
		//$('#playerAdditionalMenu2').toggle(800);
		$('#learning-modal').toggle(500);

	});

	$('#wider').click(function(){
		$('#viewport').css('width', '+=4px');
	});

	$('#thinner').click(function(){
		$('#viewport').css('width', '-=4px');
	});

	$('#cbwider').click(function(){
		$('#cb-iframe').css('width', '+=5px');
		$('#cb-iframe').css('height', '+=5px');
	});

	$('#cbthinner').click(function(){
		$('#cb-iframe').css('width', '-=5px');
		$('#cb-iframe').css('height', '-=5px');
	});

	$('#bring-player-forward').click(function() {

		$('#iframe-viewport').css('z-index', 1002);
	}
	);

	$('#add-player-overlay').click(function() {

		$('#player_overlay').show();
		$('#remove-yume-logo').show();

	});

	$('#add-player-timer').click(function() {

		$('#mobile_timer').html(':' + $('#mobile-timer-input').val());
		$('#mobile_timer').show();

	});

	$('#remove-yume-logo').click(function() {

		console.log(selectedPreset);

		if(selectedPreset === 'Mobile - Android (Landscape)') {

		}

		switch(selectedPreset) {
			case 'Mobile - Android (Landscape)':
				$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/ThUPjaLC.png");
			break;
			case 'Mobile - Android (Portrait)':
				$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/IyQieKkl.png");
			break;
			case 'Mobile - Iphone (Landscape)':
				$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/BHFcjDDF.png");
			break;
			case 'Mobile - Iphone (Portrait)':
				$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/TarmFYdY.png");
			break;
			case 'Tablet - Ipad':
				$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/UcvmWFzp.png");
			break;
		}

	});



	// ============== START TEMPLATE SELECTION ==============

	$('#iframe-url-button').click(function(){

		var url = $('#iframe-url-input').val();

		// validations

		if (url === '') {

			alert('Please enter a URL!');
		} else {

		if ( url.substr(0,7) != "http://"){

			console.log(url.substr(0,7));
			url = 'http://' + url;

		}

		$('#iframe-viewport').attr("src", url);

		stepCompleteTemplate();

		// show the next tab, assets
	}

	});

	$('#upload_name').change(function(){

		var selected_file = 'http://' + location.host + $(this).val();
		global_selected_file = selected_file;
		clearIframeBackground();
		$('#iframe-viewport').attr("src", selected_file);
		$('#playerAdditionalMenu2').fadeIn();
		stepCompleteTemplate();
	});

	$('#resize-static').click(function(){
		//showCB  = false;
		$('.guide_cb').fadeOut();

		$('#cb').show();
	    $('#cb-iframe').attr("src", global_selected_file);
	    $('#iframe-viewport').attr("src", 'about:blank');
	    //console.log($('#cb-cdnurl-input').val().naturalHeight);
		//$('#cb-iframe').css({"top": $('.guide_cb').position().top});
		//$('#cb-iframe').css({"left": $('.guide_cb').position().left});
		//$('.guide_cb').css({"z-index": -1});
		$('#resize-static').fadeOut();
		$('#resize-complete').fadeIn();
		$('.guide_video').css({'z-index': '1'});
		$('.guide_cb').css({'z-index': '1'});
		$('#drag-cb').draggable({
			start: function(event, ui) {
				$('#cb-outline').fadeIn();
			},
			stop: function(event, ui) {
				$('#cb-outline').fadeOut();
			}
		});
		$('#drag-cb').resizable({
			aspectRatio: true,
			handles: "nw, ne, sw, se",
			autoHide: true,
			start: function(event, ui) {

				console.log('firing event');
				$('#cb-outline').fadeIn();
			},
			stop: function(event, ui) {

				console.log('firing event');
				$('#cb-outline').fadeOut();
			}
		});
		$('#drag-cb').css({'z-index': '1500', left: '0px', top: '0px', position: 'fixed'});
		//console.log($('#cb-iframe').naturalHeight);
		//$('#cb-iframe').resizable({aspectRatio: true, handles: "nw, ne, sw, se", autoHide: true});
		$('.guide_video').fadeOut();
	});

	$('#resize-complete').click(function(){
		$('.guide_cb').fadeIn();
		$('.guide_video').fadeIn();
		$('.guide_video').css({'z-index': '1000'});
		$('.guide_cb').css({'z-index': '1000'});
		$('#drag-cb').css({'z-index': '999'});

	});

	$("#presetSelect").change(function(){

	    switch($(this).val()) {
	    	case "Mobile - Iphone (Landscape)":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/DYAGjkIN.png");
	    		$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/gDQAcgxQ.png");
  				$('#player_overlay').css({top: '109px', left: '113px'});
  				$('#mobile_timer').css({top: '429px', left: '209px'});
  				selectedPreset = $(this).val();
	    		showCB = false;
		        stepCompleteTemplate();
	    	break;
	    	case "Mobile - Android (Landscape)":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/UJlTQQgc.png");
	    		$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/rZtACoTR.png");
	    		$('#player_overlay').css({top: '122px', left: '116px'});
  				$('#mobile_timer').css({top: '361px', left: '197px'});

  				//$('.additional-icon-images').css({width: '46px', height: '45px'});
  				selectedPreset = $(this).val();
	    		showCB = false;
		        stepCompleteTemplate();
	    	break;
	    	case "Mobile - Android (Portrait)":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/mgnxmSgw.png");
	    		$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/jUPrrwNK.png");
	    		$('#player_overlay').css({top: '174px', left: '42px'});
  				$('#mobile_timer').css({top: '587px', left: '108px'});
  				selectedPreset = $(this).val();
	    		showCB = false;
		        stepCompleteTemplate();
	    	break;
	    	case "Mobile - Iphone (Portrait)":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/DqbIQdwp.png");
	    		$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/ZvBuGWbU.png");
	    		$('#player_overlay').css({top: '160px', left: '20px'});
  				$('#mobile_timer').css({top: '576px', left: '81px'});
  				$('#mobile_timer').css("font-size", "14px");
  				selectedPreset = $(this).val();
	    		showCB = false;
		        stepCompleteTemplate();
	    	break;
	    	case "Mobile - Iphone (Portrait, Landing Page)":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/PIkkVqyE.png");
	    		//$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/OmHRjWEg.png");
	    		//$('#player_overlay').css({top: '122px', left: '116px'});
  				//$('#mobile_timer').css({top: '361px', left: '197px'});
  				selectedPreset = $(this).val();
	    		bannerTemplate = true;
		        stepCompleteTemplate();
	    	break;
	    	case "Tablet - Ipad":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/eDWobzJt.png");
	    		$('#player_overlay').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/nqLleLHp.png");
	    		$('#player_overlay').css({top: '152px', left: '81px'});
  				$('#mobile_timer').css({top: '550px', left: '178px'});
  				$('#ipad-background').show();
	    		selectedPreset = $(this).val();
	    		showCB = false;
		        stepCompleteTemplate();
	    	break;
	    	case "CTV - LG - FIU":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/yszjUgVn.png");
	    		selectedPreset = $(this).val();
	    		bannerTemplate = true;
		        stepCompleteTemplate();
	    	break;
	    	case "CTV - LG - Blank":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/cjsTIjZX.png");
	    		selectedPreset = $(this).val();
	    		showCB = false;
		        stepCompleteTemplate();
	    	break;
	    	case "CTV - Samsung - FIU":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/QRiVniic.png");
	    		selectedPreset = $(this).val();
	    		bannerTemplate = true;
		        stepCompleteTemplate();
	    	break;
	    	case "CTV - Samsung - Blank TV":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/afahwctq.png");
	    		selectedPreset = $(this).val();
	    		showCB = false;
		        stepCompleteTemplate();
	    	break;
	    	case "CTV - General - Blank TV":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/vIwbUmhu.png");
	    		selectedPreset = $(this).val();
	    		showCB = false;
		        stepCompleteTemplate();
	    	break;
	    	case "Vidzone - Menu":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/SmEvfHmG.png");
	    		selectedPreset = $(this).val();
	    		bannerTemplate = true;
		        stepCompleteTemplate();
	    	break;
	    	case "Vidzone - Blank TV":
	    		$('#drag-cb').hide();
	    		$('#iframe-viewport').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/OLzVHsKh.png");
	    		selectedPreset = $(this).val();
	    		showCB = false;
		        stepCompleteTemplate();
	    	break;
	    }

	});

	// PRESET MENU SELECTION



	// ============== CB  ==============


	$('#defaultCB').click(function(){

		if( $('#defaultCB').is(':checked')) {



		$('#cb-iframe').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/IQTDUdrS.jpg");

		} else {

		$('#cb-iframe').attr("src", "http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/CbacdnlR.gif");

		}
	});

	$('#cb-cdnurl-button').click(function(){
		$('#playerAdditionalMenu').fadeIn();
		$('#cb').show();
		$('#drag-cb').show();
	    $('#cb-iframe').attr("src", $('#cb-cdnurl-input').val());
	    console.log($('#cb-cdnurl-input').val().naturalHeight);
		$('#cb-iframe').css({"top": $('.guide_cb').position().top});
		$('#cb-iframe').css({"left": $('.guide_cb').position().left});
		$('.guide_cb').css({"z-index": -1});
		$('#drag-cb').draggable();
		console.log($('#cb-iframe').naturalHeight);
		$('#drag-cb').resizable({aspectRatio: true, handles: "nw, ne, sw, se", autoHide: true});

		moveControls();
	});


	// ============== ICONS  ==============

	$('#icons').click(function(e){

		console.log(e.target.id);

		//console.log($('#iconselect').val());
		console.log('#icons click running');
		$('#icon-set').append('<img class="icons" src="' + $('#iconselect').val() + '">');
		moveIcons();
	});

	$('#add-additional-play').click(function() {
		$('#additional_controls_play').append('<img class="additional-icon-images" src="http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/kHDtLhBi.png">');
		$('#additional_controls_play').append('<img id="play_ctrl" class="additional-icon-images" src="http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/RAPlaSLF.png">');

		switch(selectedPreset) {
			case 'Mobile - Android (Landscape)':
			  	$('#additional_controls_play').css({top: '347px', left: '114px'}).css({});
				$('.additional-icon-images').css({height: '46px', width: '45px'});
			break;
			case 'Mobile - Android (Portrait)':
				$('#additional_controls_play').css({top: '577px', left: '41px'}).css({});
				$('.additional-icon-images').css({height: '39px', width: '40px'});
			break;
			case 'Mobile - Iphone (Landscape)':
				$('#additional_controls_play').css({top: '411px', left: '112px'}).css({});
				$('.additional-icon-images').css({height: '52px', width: '53px'});
			break;
			case 'Mobile - Iphone (Portrait)':
				$('#additional_controls_play').css({top: '566px', left: '19px'}).css({});
				$('.additional-icon-images').css({height: '37px', width: '38px'});
			break;
			case 'Tablet - Ipad':
				$('#additional_controls_play').css({top: '535px', left: '82px'}).css({});
				$('.additional-icon-images').css({height: '50px', width: '51px'});
			break;
		}

	});

	$('#add-additional-pause').click(function() {
		$('#additional_controls_pause').append('<img class="additional-icon-images" src="http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/kHDtLhBi.png">');
		$('#additional_controls_pause').append('<img id="pause_ctrl" class="additional-icon-images" src="http://cdn-01.yumenetworks.com/ym/1M3xT91A8672/215/IUyyBjBl.png">');

ƒ

	});


		$('#add-additional-bigger').click(function(){
		$('.additional-icon-images').css('width', '+=1px');
		$('.additional-icon-images').css('height', '+=1px');
	});

	$('#add-additional-smaller').click(function(){
		$('.additional-icon-images').css('width', '-=1px');
		$('.additional-icon-images').css('height', '-=1px');
	});

	$('#timer-bigger').click(function(){
		$('#mobile_timer').css('font-size', '+=1px');
	});

	$('#timer-smaller').click(function(){
		$('#mobile_timer').css('font-size', '-=1px');
	});

	$('#mobile_icons').click(function(){

		//console.log($('#iconselect_mobile').val());
		console.log('#mobile_icons click running');
		$('#icon-set').append('<img class="icons" src="' + $('#iconselect_mobile').val() + '">');

	});

	$('#icon-bigger').click(function(){
		$('.icons').css('width', '+=1px');
		$('.icons').css('height', '+=1px');
	});

	$('#icon-smaller').click(function(){
		$('.icons').css('width', '-=1px');
		$('.icons').css('height', '-=1px');
	});


	$('#icons-mobile-delete').click(function(){

		$('#icon-set .icons:last').fadeOut(300, function(){

		$(this).remove();

		});


	});

	$('#icons-online-delete').click(function(){

		$('#icon-set .icons:last').fadeOut(300, function(){

		$(this).remove();

		});

	});


	// DRAGGABLE


	$( "#viewport" ).draggable({
     	start: function() {

     	},
     	drag: function() {
 		//console.log($(this).position().top);
 		//console.log($(this).position().left);

	 		$('#leftBlackBox').css('top', $('#viewport').position().top);
			$('#leftBlackBox').css('left', $('#viewport').position().left - $('#leftBlackBox').width());
			$('#rightBlackBox').css('top', $('#viewport').position().top);
			$('#rightBlackBox').css('left', $('#viewport').position().left + $('#viewport').width());


			$('#topBlackBox').css('top', $('#viewport').position().top - $('#topBlackBox').height());
			$('#topBlackBox').css('left', $('#viewport').position().left);
			$('#bottomBlackBox').css('top', $('#viewport').position().top + $('#viewport').height());
			$('#bottomBlackBox').css('left', $('#viewport').position().left);
		},
      	stop: function() {
	 		$('#leftBlackBox').css('top', $('#viewport').position().top);
			$('#leftBlackBox').css('left', $('#viewport').position().left - $('#leftBlackBox').width());
			$('#rightBlackBox').css('top', $('#viewport').position().top);
			$('#rightBlackBox').css('left', $('#viewport').position().left + $('#viewport').width());

			$('#topBlackBox').css('top', $('#viewport').position().top - $('#topBlackBox').height());
			$('#topBlackBox').css('left', $('#viewport').position().left);
			$('#bottomBlackBox').css('top', $('#viewport').position().top + $('#viewport').height());
			$('#bottomBlackBox').css('left', $('#viewport').position().left);

      	}
    });

	//$('#cb').draggable();
	$('#icon-set').draggable();


/*
	$('#cb').hover(function(){
	 	$(this).addClass('cb-hover');
	 	},
	 	function(){
	 	$(this).removeClass('cb-hover');
	});
*/



	$('#video-cdnurl-button').click(function(){
	    $('#video-source').attr("src", $('#video-cdnurl-input').val());
	    video = document.getElementsByTagName('video')[0];
	    video.load();

	    // match height of guides

	    $('#viewport').css({'height': $('.guide_video').height()});
	    $('#viewport').css({"top": $('.guide_video').position().top});

	    console.log( $('.guide_video').width() + ' - ' + $('#viewport').width()  );

	    if ( $('.guide_video').width() < $('#viewport').width()  ) {

	    var middleOfTop = $('.guide_video').position().left + ($('.guide_video').width() / 8);
	    $('#viewport').css({"left": middleOfTop});

		}

	});



	$('#move-controls').click(function(){

		moveControls();

	});



	// ============== WINGS  ==============


	$('#boxes').click(function(){

		var viewportTop = $('.guide_video').position().top;
		var viewportLeft = $('.guide_video').position().left;
		var viewportRight = $('.guide_video').position().left + $('.guide_video').width();


		console.log('right' + viewportRight);
		console.log('left' + viewportLeft);
		console.log('width' + $('.guide_video').width());

		$('body').append('<div id="leftBlackBox"></div>');
		$('body').append('<div id="rightBlackBox"></div>');

		$('#leftBlackBox').css('height', $('.guide_video').height());
		$('#leftBlackBox').css('top', viewportTop);
		$('#leftBlackBox').css('left', viewportLeft - $('#leftBlackBox').width());

		$('#rightBlackBox').css('height', $('.guide_video').height());
		$('#rightBlackBox').css('top', viewportTop);
		$('#rightBlackBox').css('left', viewportRight);

	});

	$('#boxes2').click(function(){

		var viewportTop = $('.guide_video').position().top;
		var viewportLeft = $('.guide_video').position().left;
		var viewportRight = $('.guide_video').position().left + $('.guide_video').width();
		var viewportBottom = $('.guide_video').position().top + $('.guide_video').height();


		$('body').append('<div id="topBlackBox"></div>');
		$('body').append('<div id="bottomBlackBox"></div>');

		$('#topBlackBox').css('width', $('.guide_video').width());
		$('#topBlackBox').css('top', viewportTop - $('#topBlackBox').height());
		$('#topBlackBox').css('left', viewportLeft);

		$('#bottomBlackBox').css('width', $('.guide_video').width());
		$('#bottomBlackBox').css('top', viewportBottom);
		$('#bottomBlackBox').css('left', viewportLeft);

	});


	$('#sideWider').click(function(){

		$('#leftBlackBox').css('width', function(){
		return $(this).width() +5;
		});
		$('#rightBlackBox').css('width', function(){
		return $(this).width() +5;
		});

		$('#leftBlackBox').css('left', function(){
			return $(this).position().left -5;
		});


	});

	$('#sideThinner').click(function(){

		$('#leftBlackBox').css('width', function(){
		return $(this).width() -5;
		});

		$('#rightBlackBox').css('width', function(){
		return $(this).width() -5;
		});

		$('#leftBlackBox').css('left', function(){
			return $(this).position().left +5;
		});


		console.log('clikcing');

	});

	$('#sideTaller').click(function(){

		$('#topBlackBox').css('height', function(){

			return $(this).height() + 5;

		});

		$('#bottomBlackBox').css('height', function(){

			return $(this).height() + 5;

		});

		$('#topBlackBox').css('top', function(){

			return $(this).position().top -5;

		});

	});

	$('#sideShorter').click(function(){

		$('#topBlackBox').css('height', function(){

			return $(this).height() - 5;

		});

		$('#bottomBlackBox').css('height', function(){

			return $(this).height() - 5;

		});

		$('#topBlackBox').css('top', function(){

			return $(this).position().top + 5;

		});

	});

	$('#sidesReset').click(function(){

		$('#leftBlackBox').remove();
		$('#rightBlackBox').remove();

	});

	$('#topsReset').click(function(){
		$('#topBlackBox').remove();
		$('#bottomBlackBox').remove();

	});



	// ============== VAST PARSER  ==============


	$('#vast-url-button').click(function(){

		var vastUrlString = $('#vast-url-input').val();

		$.get(vastUrlString).done(function(data){

			// TOP LEVEL VAST INFORMATION

			var ADS = $(data).find('VAST').children();
			var STR_NUMBER_OF_ADS = ADS.length;

			var STR_VERSION = $(data).find('VAST').attr('version');


			var NUMBER_OF_ADS = 0;


			// END MOBILE CHECK

			$(ADS).each(function(index, element) {

				NUMBER_OF_ADS++;

				// INLINE LEVEL DATA

				var STR_ADSYSTEM = $(this).find('AdSystem').text();
				var STR_ADTITLE = $(this).find('AdTitle').text();
				var STR_DESCRIPTION = $(this).find('Description').text();
				var IMPRESSION_TRACKERS = $(this).find('Impression');
				var STUDY_TRACKERS = $(this).find('Survey');


				var INLINE = $(this).find('InLine');

				// CREATIVES

				var CREATIVES = $(INLINE).find('Creatives').children();

				var creativeParentNumber = 1;

				$(CREATIVES).each(function(index, element){

					$(this).each(function(index, element){

						var STR_TYPE = null;
						var STR_DURATION = null;
						// SUPERR EFFICIENT IFSS!!!!!!!

						if ($(this).find('Linear').length == 1) {
							STR_TYPE = 'Linear Ad';
						} else if ($(this).find('CompanionAds').length == 1) {
							STR_TYPE = 'Companion Banner';
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


						// MEDIA FILES

						var NUM_MEDIAFILES = $(this).find('MediaFiles').length;

						if(NUM_MEDIAFILES !== 0) {

							//$('#ads').append('<h4>MediaFiles</h4><dl class="dl-horizontal" id="media-files-' + creativeParentNumber + '"></dl>');
							var MEDIA_FILES = $($(this)).find('MediaFiles').children();

							$(MEDIA_FILES).each(function(index, element){

								var width = $(this).attr('width');
								var height = $(this).attr('height');
								var bitrate = $(this).attr('bitrate');
								var type = $(this).attr('type');

								//var media_description = type + ', ' + bitrate + 'kbps, ' + width + 'x' + height;
								var media_description = type + '@' + width + 'x' + height;

								if(type == 'video/mp4' || type == 'video/webm') {

								//$('#media-files-' + creativeParentNumber).append('<dt>' + media_description + '</dt><dd>' + $(this).text() + '</dd>');
									$('#mediaFormModal').append('<div class="radio"><label><input type="radio" name="optionsRadios" id="optionsRadios1" value="' + $(this).text() + '" checked>' + media_description + '</label></div>');
								}
							});

						}

						// COMPANION ADS

						var NUM_COMPANIONBANNERS = $(this).find('CompanionAds').length;

						var TALLY_NUM_COMPANIONBANNERS = 1;

						if (NUM_COMPANIONBANNERS !== 0) {

							var COMPANIONBANNERS = $(this).find('CompanionAds').children();

							$(COMPANIONBANNERS).each(function(index, element) {

								var width = $(this).attr('width');
								var height = $(this).attr('height');


								//$('#ads').append('<h4>Companion Ad #' + TALLY_NUM_COMPANIONBANNERS + ' (' + width + 'x' + height + ')</h4><dl class="dl-horizontal" id="comp-' + NUM_COMPANIONBANNERS + '-' + creativeParentNumber + '"></dl>');
								console.log($(this));

								var pieces = $($(this)).children();

								$(pieces).each(function(index,element){

									//$('#comp-' + NUM_COMPANIONBANNERS + '-' + creativeParentNumber).append('<dt>' + element.nodeName + '</dt><dd>' + $(this).text() + '</dd>');
									//console.log(element.nodeName);
								});

								TALLY_NUM_COMPANIONBANNERS++;
							});

						}

					});
					creativeParentNumber++;
				});
			});


			$('#myModal').modal(null);
			$('#video-vast-apply').click(function(){

				// clear the modal, just in case someone is doing this twice

				var selected_video_url = $('input[name=optionsRadios]:checked', '#mediaFormModal').val();
				$('#video-cdnurl-input').val(selected_video_url);

				$('#myModal').modal('hide');
				// success feedback

				$('#video-cdnurl-input-success1').addClass('has-success has-feedback');
				$('#video-cdnurl-input-success2').append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');

			});

		});
	});


	$('#launch-guides').click(function(){

	locked_height = $('.guide_video').height();
	locked_width = $('.guide_video').width();


	launch_guides();

	});

	var DRAGGING = null;


	var DRAG_STARTY = null;
	var DRAG_POS_START = null;


	$('#replay-button').click(function(){

		var placement_id = $('#placementId').val();
		var advertisement_id = $('#advertisementId').val();

		if(placement_id === '') {

			alert('Please enter a placement id!');

		} else {

			yumeAdPlayer(placement_id, locked_width, locked_height, advertisement_id);


		}

	});


	$('#placementIdButton').click(function(){

		$('#playerAdditionalMenu').fadeIn();

		var placement_id = $('#placementId').val();
		var advertisement_id = $('#advertisementId').val();
		if(placement_id === '') {

			alert('Please enter a placement id!');

		} else {

				//magically move stuff into place

			$('.video-wrapper').css({'top': $('.guide_video').position().top});
			$('.video-wrapper').css({'left': $('.guide_video').position().left});
			$('.cb-wrapper').css({'top': $('.guide_cb').position().top});
			$('.cb-wrapper').css({'left': $('.guide_cb').position().left});

			$('.guide_cb').css({'z-index': -1});

			$('.video-wrapper').css({"z-index": 1001});

	  		yumeAdPlayer(placement_id, locked_width, locked_height, advertisement_id);

	  		if(!showCB) {
	  			$('.cb-wrapper').hide();
	  		}


			$('#flvPlayerDiv640').css({"height": locked_height});



			$('.cb-wrapper').draggable({});

			$('.video-wrapper').hover(function(){

		  		$('#flvPlayerDiv640').css({"height": locked_height+27});
		  		$('#flvPlayerDiv640').css('z-index', 1003);
		  		}, function(){

		  		$('#flvPlayerDiv640').css({"height": locked_height});
		  		$('#flvPlayerDiv640').css('z-index', -1);

		 	});

	  		moveControls();

	  //
	  		$('.guide_video').css("background-color", "#000");
	  		$('.guide_video').css("opacity", "1");
	  		$('.guide_video').hide();
	  		stepCompletePlacement();

	  		/*
			switch(selectedPreset) {
				case 'Mobile - Android (Landscape)':
			$('#iframe-viewport').css('z-index', 1002);
				break;
				case 'Mobile - Android (Portrait)':
			$('#iframe-viewport').css('z-index', 1002);
				break;
				case 'Mobile - Iphone (Landscape)':
			$('#iframe-viewport').css('z-index', 1002);
				break;
				case 'Mobile - Iphone (Portrait)':
			$('#iframe-viewport').css('z-index', 1002);
				break;
				case 'Tablet - Ipad':
			$('#iframe-viewport').css('z-index', 1002);
				break;
			}
		*/

		}

	});

	
	function moveIcons() {

		var bottom = $('.guide_video').offset().top + $('.guide_video').height();
		var right = ($('.guide_video').offset().left + $('.guide_video').width())-$('#icon-set').width();

		$('#icon-set').css('top', bottom+5);
		$('#icon-set').css('left', right);
	}


 	$('#button-set-guides').on('click', function () {
		stepCompleteGuides();
		$('.guide_video').fadeTo("slow", 0.8);
		if(showCB) {
			$('.guide_cb').fadeTo("slow", 0.8);
		}
  	});

  	$('#button-step-addons').on('click', function() {

		$('#learning-modal').velocity({
					bottom: "-=140"
				},
				{
					duration: 700,
					easing: 'easeOutQuint',
					complete: function() {

						$('#button-step-addons').fadeOut(100);

						setTimeout(function(){
							stepStartFinal();
						},200);
					}
			});

  	});

	// ============== PRIVATE FUNCTIONS  ==============

	function showLearningModal(title, body) {

		$('#learning-title').text(title);
		$('#learning-body').text(body);
		$('#learning-modal').fadeIn();
		$('#learning-modal').velocity({bottom: "+=140", opacity: "100%"}, {duration: 1000, easing: 'easeOutQuint'});

	}

	function moveControls() {

		var positionFromTop = $('#move-controls').position().top;

		var moveLengthSpeed = 1000;
		var margin = 10;
		if(isShowing === true) {
			$(".dropdown").velocity({ top: (positionFromTop*-1)+margin }, moveLengthSpeed , 'easeOutQuint');
			$("#dropdown-indicator").removeClass('glyphicon-chevron-up');
			$("#dropdown-indicator").addClass('glyphicon-chevron-down');

			isShowing = false;
		} else if(isShowing === false) {
			$(".dropdown").velocity({ top: "0" }, moveLengthSpeed, 'easeOutQuint' );
			$("#dropdown-indicator").removeClass('glyphicon-chevron-down');
			$("#dropdown-indicator").addClass('glyphicon-chevron-up');

			isShowing = true;
		}


	}

	function stepCompletePlacement() {

	$('#learning-modal').velocity({
				bottom: "-=140"
			},
			{
				duration: 700,
				easing: 'easeOutQuint',
				complete: function() {
					console.log('done');

					setTimeout(function(){
						stepStartAddons();
					},200);
				}
		});


	}

	function stepStartAddons() {

		//moveControls();
		setTimeout(function(){
			showLearningModal('Step Four: Ad playback', 'Hover your mouse over the video to access the controls.  Stop the video on the frame you want showcased in your final mock-up.');
		}, 700);

		$('#button-step-addons').fadeIn(1000);

	}

	function stepStartFinal() {
		moveControls();
		$('#myTab a[href="#iconsTab"]').tab('show');
		setTimeout(function(){
			showLearningModal('Final Step: Addons', 'Add icons, if needed, and other additional details to wrap up the scene.');
		}, 700);
	}

	function stepCompleteTemplate() {

		clearIframeBackground();
		
		if(bannerTemplate === true) {

				$('#learning-modal').velocity({
					bottom: "-=140"
				},
				{
					duration: 700,
					easing: 'easeOutQuint',
					complete: function() {
						console.log('done');


					}
			});

			setTimeout(function(){
				stepStartBanner();
			},1000);

			setTimeout(function(){moveControls();},1);
			
			setTimeout(function(){moveControls();},2);

			$('#myTab a[href="#assets"]').tab('show');

			//$('#collapseOne2').hide();
			//$('#collapseTwo3').show();
			$('#collapseOne2').collapse('hide');
			//$('#collapseTwo2').collapse('hide');
			$('#collapseTwo3').collapse('show');
			console.log('new code');

			setTimeout(function(){$('#cb-cdnurl-input').focus();},5);



		} else {


		//moveControls();
		$('#learning-modal').velocity({
					bottom: "-=140"
				},
				{
					duration: 700,
					easing: 'easeOutQuint',
					complete: function() {
						console.log('done');


					}
			});

									setTimeout(function(){
							stepStartGuides();
						},200);

		}

	}

	function stepStartBanner() {

		showLearningModal('Step Two: Insert banners', "Copy and paste a direct link to the banner image you'd like to use.  Resize the banner as necessary and drag it into place.");
		$('#button-step-addons').show();
	}

	function stepStartGuides() {
		moveControls();
		showLearningModal('Step Two: Resize the guides and position them', "The goal here is to completely and accurately mask the video player and companion banner (optional) over the parts you want replaced.  When you're finished, press Save.");

		$('#button-set-guides').fadeIn(2500);

		//moveControls();

		//moveControls();

		setTimeout(function(){launch_guides();}, 700);
	}

	function stepCompleteGuides() {

		$('#learning-modal').velocity({
				bottom: "-=140"
			},
			{
				duration: 700,
				easing: 'easeOutQuint',
				complete: function() {
					console.log('done');

				}
		});

		$('#button-set-guides').fadeOut(100);
		stepStartAssets();

	}

	function stepStartAssets() {

		moveControls();
		setTimeout(function(){
			showLearningModal("Step Three: Creatives", "Entering a Placement ID will make an actual ad request to YFP and grab that campaign's assets for playback.");

		}, 700);

		$('#myTab a[href="#assets"]').tab('show');
		$('#placementId').focus();
	}

	function launch_guides() {

		$('.guide_video').fadeIn(800);

		if(showCB) {
			$('.guide_cb').fadeIn(800);
		}
		// VIDEO GUIDE

		$('.guide_video').draggable({
			start: function(event, ui){


			},
			drag: function(event, ui){

	 		$('#leftBlackBox').css('top', $('.guide_video').position().top);
			$('#leftBlackBox').css('left', $('.guide_video').position().left - $('#leftBlackBox').width());
			$('#rightBlackBox').css('top', $('.guide_video').position().top);
			$('#rightBlackBox').css('left', $('.guide_video').position().left + $('.guide_video').width());


			$('#topBlackBox').css('top', $('.guide_video').position().top - $('#topBlackBox').height());
			$('#topBlackBox').css('left', $('.guide_video').position().left);
			$('#bottomBlackBox').css('top', $('.guide_video').position().top + $('.guide_video').height());
			$('#bottomBlackBox').css('left', $('.guide_video').position().left);


			},
			stop: function(){

	 		$('#leftBlackBox').css('top', $('.guide_video').position().top);
			$('#leftBlackBox').css('left', $('.guide_video').position().left - $('#leftBlackBox').width());
			$('#rightBlackBox').css('top', $('.guide_video').position().top);
			$('#rightBlackBox').css('left', $('.guide_video').position().left + $('.guide_video').width());


			$('#topBlackBox').css('top', $('.guide_video').position().top - $('#topBlackBox').height());
			$('#topBlackBox').css('left', $('.guide_video').position().left);
			$('#bottomBlackBox').css('top', $('.guide_video').position().top + $('.guide_video').height());
			$('#bottomBlackBox').css('left', $('.guide_video').position().left);


				locked_height = $('.guide_video').height();
				locked_width = $('.guide_video').width();


			}
		});

		$(".guide_video").mousemove(function(e) {


		   		$('.guide_video').css('cursor', 'move');



		});

		$('.guide_video').resizable({
			aspectRatio: 16/9,
			maxHeight: 720,
			maxWidth: 1280,
			handles: "nw, ne, sw, se",
			stop: function(){
				locked_height = $('.guide_video').height();
				locked_width = $('.guide_video').width();
				console.log(locked_height + ' ' + locked_width);
			}
		});

		// CB GUIDE

		$('.guide_cb').draggable();


		$('.guide_cb').mousemove(function(e) {

			$('.guide_cb').css('cursor', 'move');

		});

	}
		//$('#myTab a[href="#assets"]').tab('show');


	function clearIframeBackground() {
		$('#iframe-viewport').css('background-image', 'url("")');
		$('#iframe-viewport').css('border', '0px solid #ccc');
	}

	// ========= throw runtime junk here

	if (bowser.name != "Chrome") {
		$('#browser-warning').fadeIn(1000);
	}

	// delaying function calls for aesthetic quality

	setTimeout(function() {
		moveControls();
	}, 400);

	setTimeout(function() {
		showLearningModal('Step One: Setup your template', "Online websites can be mocked up by entering the site URL or a direct link to an image.  For Mobile and CTV, predefined templates have been provided.");
	}, 1000);
	//moveControls();

	$('#mobile_timer').draggable();
	$('#additional_controls_play').draggable();
	$('#additional_controls_pause').draggable();
	$('#additional_controls_replay').draggable();
	$('#file-upload-success').fadeOut(5000);

$('.hover-border').hover(
  function() {
    $( this ).css({border: "1px solid #FF0000"});
  }, function() {
    $( this ).css({border: "0px solid #FF0000"});
  }
);

$(".basic").spectrum({
    color: "#000",
    change: function(color) {

    	$('#text-overlay').css('color', color.toHexString());
        //$("#basic-log").text("change called: " + color.toHexString());
    }
});

});

