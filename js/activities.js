function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	// only complete tweet need the feature, so look at everyone and add those completed
	const completed = [];
	for (let i = 0; i < tweet_array.length; ++i)
	{
		const tweet = tweet_array[i];

		if (tweet.source == 'completed_event')
		{
			completed.push(tweet);
		}
	}

	const counts = {};

	for (let i = 0; i < completed.length; i++)
	{
		const type = completed[i].activityType;
		if (counts[type] === undefined)
		{
			counts[type] = 1;  // first time seeing this type
		}
		else{
			counts[type] ++; // counting
		}
	}

	const activityCounts = [];
	for (const type in counts)
	{
		const howMany = counts[type];
		const record = {
			activityType: type,
			count: howMany
		};

		activityCounts.push(record);
	}

	activityCounts.sort(function(a, b) { return b.count - a.count; });

	document.getElementById('numberActivities').innerText = activityCounts.length;
	document.getElementById('firstMost').innerText = activityCounts[0].activityType;
	document.getElementById('secondMost').innerText = activityCounts[1].activityType;
	document.getElementById('thirdMost').innerText = activityCounts[2].activityType;

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCounts
	  },
	  "mark": "bar",
	  "encoding": {
		"x":
		{
			"field": "activityType", "type": "nominal", "sort": "-y", "title": "activity type"
		},
		"y":
		{
			"field": "count", "type": "quantitative", "title": "number of tweets"
		}
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	const top3 = [activityCounts[0].activityType, activityCounts[1].activityType, activityCounts[2].activityType];
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const distanceData = [];
	for (let i = 0; i < completed.length; ++i)
	{
		const t = completed[i];
		if (top3.includes(t.activityType))
		{
			distanceData.push({
				activityType: t.activityType,
				distance: t.distance,
				day: dayNames[t.time.getDay()]
			});
		}
	}


	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distance by day of the week for the three most tweeted activities.",
		"data": {
			"values": distanceData
		},
		"mark": "point",
		"encoding": {
			"x": { "field": "day", "type": "nominal", "sort": dayNames, "title": "time (day)" },
			"y": { "field": "distance", "type": "quantitative", "title": "distance" },
			"color": { "field": "activityType", "type": "nominal" }
		}
	};


	distance_aggregated_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Mean distance by day of the week for the three most tweeted activities.",
		"data": {
			"values": distanceData
		},
		"mark": "point",
		"encoding": {
			"x": { "field": "day", "type": "nominal", "sort": dayNames, "title": "time (day)" },
			"y": { "aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean of distance" },
			"color": { "field": "activityType", "type": "nominal" }
		}
	};

	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', distance_aggregated_spec, {actions:false});

	const allDiv = document.getElementById('distanceVis');
	const meanDiv = document.getElementById('distanceVisAggregated');
	const button = document.getElementById('aggregate');

	allDiv.style.display = 'block';
	meanDiv.style.display = 'none';
	button.innerText = 'Show means';

	button.addEventListener('click', function() {
		if (allDiv.style.display == 'none') 
		{
			allDiv.style.display = 'block';
			meanDiv.style.display = 'none';
			button.innerText = 'Show means';
		}
		// switching bettween mean and dot.
		else 
		{
			allDiv.style.display = 'none';
			meanDiv.style.display = 'block';
			button.innerText = 'Show all activities';
		}
	});

	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});