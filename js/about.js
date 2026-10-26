// fill every element on the page having this classname
function setClassText(className, text)
{
	const elements = document.getElementsByClassName(className);
	for (let i = 0; i < elements.length; i++)
	{
		elements[i].innerText = text;
	}
}

//turnrs a count into percentage
function percent(count, total)
{
	return (count / total * 100).toFixed(2) + "%";
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;
	
	//assume the very first one is the latest and earliest
	let earliest = tweet_array[0].time
	let latest = tweet_array[0].time

	// check, update earliest and latest if I find something better.
	for(let i = 0; i < tweet_array.length; ++i)
	{
		if (tweet_array[i].time < earliest)
		{
			earliest = tweet_array[i].time;
		}
		if (tweet_array[i].time > latest)
		{
			latest = tweet_array[i].time;
		}
	}

	// formating date
	const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	//replace the text
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', dateFormat);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-US', dateFormat);

	// tweet categories
	const total = tweet_array.length;

	const completed = tweet_array.filter(function(t) { return t.source == 'completed_event'; });
	const live = tweet_array.filter(function(t) { return t.source == 'live_event'; });
	const achievements = tweet_array.filter(function(t) { return t.source == 'achievement'; });
	const misc = tweet_array.filter(function(t) { return t.source == 'miscellaneous'; });

	// put the count n %
	setClassText('completedEvents', completed.length);
	setClassText('completedEventsPct', percent(completed.length, total));
	setClassText('liveEvents', live.length);
	setClassText('liveEventsPct', percent(live.length, total));
	setClassText('achievements', achievements.length);
	setClassText('achievementsPct', percent(achievements.length, total));
	setClassText('miscellaneous', misc.length);
	setClassText('miscellaneousPct', percent(misc.length, total));

	//part 3 of task 1, user-written tweets

	const writtenTweets = completed.filter(function(t) { return t.written; });
	setClassText('written', writtenTweets.length);
	setClassText('writtenPct', percent(writtenTweets.length, completed.length));

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});