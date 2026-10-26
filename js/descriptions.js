let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

		//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet)
	{
		return new Tweet(tweet.text, tweet.created_at);
	});

	writtenTweets = [];
	for (let i = 0; i < tweet_array.length; ++i)
	{
		if(tweet_array[i].written) writtenTweets.push(tweet_array[i]);
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	const searchBox = document.getElementById('textFilter');

	searchBox.addEventListener('input', function() {
	const searchText = searchBox.value;

	// adding table
	const tableBody = document.getElementById('tweetTable');

	// empty the search box ==> reset
	if(searchText == '')
	{
		tableBody.innerHTML = ''; // table aka task 2 part 3
		document.getElementById('searchCount').innerText = 0;
		document.getElementById('searchText').innerText = '';
		return;
	}

	// we should normalize query, ignore uppercase and lower case so convert everything to lowercase

	const lowerSearch = searchText.toLowerCase();
	const matches = [];

	for (let i = 0; i < writtenTweets.length; ++i)
	{
		if (writtenTweets[i].writtenText.toLowerCase().includes(lowerSearch)) matches.push(writtenTweets[i]);

	}
	 // table row for every match
	let row = '';
	for (let i = 0; i < matches.length; i++)
		{
			row+= matches[i].getHTMLTableRow(i+1) // row # start at 1
		}
	tableBody.innerHTML = row;

	document.getElementById('searchCount').innerText = matches.length;
	document.getElementById('searchText').innerText = searchText;
});
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});