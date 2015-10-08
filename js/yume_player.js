

var yume_div_opacity=70;
var yume_dimout_div_zIndex=9999;   
var n_random=Math.floor(Math.random()*100001);var rand_str="&rand="+n_random;


function yumeAdPlayer(id, cwidth, cheight, adid){
  /*Object for banners 
    Need to pass the players object id as the paremeter, indicating that this set of banners belong to this player
  */
  var player1 = new YumePlayer("flash_flv_player");
  player1.banners = {"mediumRectangle":"cb_medrect1_div"};
  player1.iframeBannerUrl = "http://pl.yumenetworks.com/dynamic_banner_iframe.html?domain=86ToVYkLxk";
  player1.floatCb = 'off';
  YumePlayerObject.addPlayer(player1);
  
//  width=cwidth;
//  height=cheight+27;
//  width="710";
//  height="400";

  width="1280"; // 770
  height="720"; // 433

  //

  console.log('cwidth: ' + cwidth);
  console.log('cheight: ' + cheight);



  var skin_swf = "http://www.yume.com/sites/default/files/swf/skin_yume_player_as3_new.swf";
  var so = new SWFObject("http://www.yume.com/sites/default/files/swf/yume_publisher_player_as3.swf", "flash_flv_player", width, height, "8", "#000000");
  so.addParam("allowScriptAccess", "always");
  so.addParam("menu", "false");
  so.addVariable("auto_play", "false");
  so.addVariable("yume_start_time", Number(1));
  so.addVariable("yume_normalscreen_x",Number(0));
  so.addVariable("yume_normalscreen_y",Number(0));
  so.addVariable("yume_normalscreen_width",Number(cwidth));
  so.addVariable("yume_normalscreen_height",Number(cheight));
  so.addVariable("yume_leader_slot","false");
  so.addVariable("yume_preroll_playlist",encodeURIComponent("http://pl.yumenetworks.com/dynamic_preroll_playlist.fmil?domain=86ToVYkLxk&width=1280&height=720&imu=medrect&placement_id=" + id + "&advertisement_id=" + adid));
    //so.addVariable("yume_branding_playlist",encodeURIComponent("http://pl.yumenetworks.com/dynamic_branding_playlist.fmil?domain=86ToVYkLxk&width=480&height=360&imu=medrect&pubchannel=43"));
    //so.addVariable("yume_midroll_playlist",encodeURIComponent("http://pl.yumenetworks.com/dynamic_midroll_playlist.fmil?domain=86ToVYkLxk&width=480&height=360&imu=medrect&pubchannel=43"));
    //so.addVariable("yume_postroll_playlist",encodeURIComponent("http://pl.yumenetworks.com/dynamic_postroll_playlist.fmil?domain=86ToVYkLxk&width=480&height=360&imu=medrect&pubchannel=43"));

  //  so.addVariable("publisher_content_url","http://download.yumenetworks.com/yume/content/yume_dance_video2_as2.swf");
    //so.addVariable("publisher_content_url","http://shadow01.yumenetworks.com/webvideos/ym/231/RmDQAEDT.flv,http://shadow01.yumenetworks.com/webvideos/ym/231/RmDQAEDT.flv");
    // not Use the below line for midroll case //
  so.addVariable("publisher_content_url","http://amedhussaini.com/tools/testing/keyboard_cat.mp4");
  so.addVariable("yume_swf_url", "http://www.yume.com/sites/default/files/swf/as3/yume_player_4x3.swf");
  so.addVariable("yume_library_swf_url", "http://www.yume.com/sites/default/files/swf/yume_ad_library.swf");
  so.addVariable("yume_css_url","example.css");
  so.addVariable("my_skin", skin_swf);
  so.addVariable("yume_set_volume", 100);
  so.addParam("allowFullScreen", "true");
  so.addParam("scale", "scale");
  so.addParam("wmode", "transparent");
  so.write("flvPlayerDiv640");
}