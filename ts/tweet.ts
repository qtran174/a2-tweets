class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted"))
        {
            return "completed_event";
        }

        if (this.text.startsWith("Watch my") || this.text.includes("#RKLive"))
        {
            return "live_event";
        }

        if (this.text.startsWith("Achieved") || this.text.includes("#FitnessAlerts") || this.text.includes("set a goal"))
        {
            return "achievement";
        }
        return "miscellaneous";
    }

    // helper function for the getters, simply return the text the user type themselves
    private get userText():string
    {
        if (this.source != 'completed_event') return "";

        // cut off the link and the hashtag
        let t = this.text;
        const linkStart = t.indexOf("http");
        if (linkStart != -1)
        {
            t = t.substring(0, linkStart);
        }

        if (t.includes("Check it out!")) return "";

        // after " - ", it's the user's own input
        const dash = t.indexOf(" - ");
        if (dash == -1) return "";
        const typed = t.substring(dash + 3).trim();

        if (typed == "TomTom MySports Watch") return "";

        return typed;
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return this.userText.length > 0;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.userText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        
        const words = this.text.split(/\s+/);
        let i = 3; //starts after just compled a

        if (!isNaN(parseFloat(words[3])) && (words[4] == "km" || words[4] == "mi")) //skip the # n the  unit
        {
            i = 5;
        }

        // collect words until the end
        const nameWords:string[] = [];

        while (i < words.length && words[i] != "with" && words[i] != "-" && words[i] != "in" && !words[i].startsWith("http"))
        {
            nameWords.push(words[i]);
            i++;
        }
        return  nameWords.join(" ");
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet

        const words = this.text.split(/\s+/);
        const amount = parseFloat(words[3]);

        if (isNaN(amount)) return 0;

        if (words[4] == "km") return amount / 1.609; //converting to mi
        if (words[4] == "mi") return amount;

        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity

        const safeText = this.text.replace(/</g, "&lt;");
        const textWithLinks = safeText.replace(/https?:\/\/\S+/g, '<a href="$&" target="_blank">$&</a>');

        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + textWithLinks + "</td></tr>";
    }
}