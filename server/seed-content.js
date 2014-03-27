var KEYWORDS = "learn"; // add keywords separated by spaces.

/*************************************/
// Posts = new Meteor.Collection("posts");

Meteor.publish("posts", function () {
  return Posts.find({}, {sort: {time: -1}, limit:25});
});

var twitter = Meteor.require('twitter'),
	util = Meteor.require('util'),
	twit = new twitter({
    consumer_key: 'wyir0dDuntZkbXF0jQps8w',
    consumer_secret: 'hrWA0pEoGGD9DiJf1tanhkgYOCNwFL7yN6L8QCc3Nc',
    access_token_key: '2389016353-maPa5ax7R3VcXnFBROMb8HPEwJsO64So62dAHnK',
    access_token_secret: 'iKuvsT3tZd0Mk8ACUCfi6KzeN3Fvbr5EnyzDyHIlUgrrA'
});

Meteor.startup(function () {

  var insertTweet = Meteor.bindEnvironment(function(tweet) {
    Posts.insert(tweet);
  });

	function getTweets(callback){
		twit.stream("statuses/filter", {
		  track: KEYWORDS, 'lang':'en'
		  }, function(stream) {
		    stream.on('data', function(data) {
  		    var tweet = {};
	    		tweet.text = data.text;
          tweet.time = new Date(Date.parse(data.created_at));
          tweet.avatar = data.user.profile_image_url;

          if(data.entities.media){
            console.log(data.entities.media[0].media_url);    
            tweet.img = data.entities.media[0].media_url;
          }

          insertTweet(tweet);

        	// console.log(data); // full tweet
		    });
		});
	}

	getTweets(function(){
		console.log('done');
	});
});