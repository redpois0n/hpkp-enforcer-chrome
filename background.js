// Default max-age 6 months in seconds
var max_age = "15570000";

chrome.webRequest.onHeadersReceived.addListener(
	function(details) {
		var url = new URL(details.url);
		
		var json = localStorage[url.hostname];
		
		if (json != undefined && url.protocol === "https:") {
			var pins = JSON.parse(json);
			
			for (var i = 0; i < details.responseHeaders.length; i++) {
				if (details.responseHeaders[i].name.toLowerCase() === "public-key-pins")
				return { };
			}
			
			var header = "";
			
			for (var pin in pins) {
				header += "pin-sha256=\"" + pin + "\"; ";
			}
			
			header += "max-age=" + max_age;

			details.responseHeaders.push({
				"name": "Public-Key-Pins",
				"value": header
			});
			
			delete localStorage[url.hostname];
		}

		return { responseHeaders: details.responseHeaders };
	},
	{
		urls: ["https://*/*"],
		types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
	},
	["blocking", "responseHeaders" ]
);
