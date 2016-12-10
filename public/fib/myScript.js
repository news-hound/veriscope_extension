
/**
 * @file myScript.js
 * Script to analyze Facebook feed and make connection with the server ;
 *
 * @author Mark Craft, Qinglin Chen
 * @date Fall 2016
 */

var feeds = new Set();

(function(document) {

/**
 * Http request to fbserve.herokuapp.com.
 *
 * @param the text or url to send to the server.
 */
function httpGet(input, type, data) {

	var server = "https://localhost:3001/evaluate";
	var contents = "?ai=true&url=";

	var page;

	if(type=="url") {
		page = decode(input);
	} else {
		page = input;
	}

	page.replace("http:", "http://");

	if (page.substring(0, 5) === "https" || page.substring(0, 4) === "http") {
		var theUrl = server + contents + page;
		//theUrl = theUrl.replace("&", "^");

		console.log("1:" + theUrl)
		fetch(theUrl)
			.then(function(response) {
			  return response.json().then(function(json) {
					console.log("3:" + json["success"])


					var errorImgUrl = chrome.extension.getURL("/public/img/error.png");
					var checkedImgUrl = chrome.extension.getURL("/public/img/checked.png");
					var warningImgUrl = chrome.extension.getURL("/public/img/warning.png");

					var div = document.createElement('div'),
					button = Ladda.create(div);
					data.appendChild(div);

					var score = null

					if(json["success"] === true) {
						const ai_results = json["ai"]
						const score = ai_results["score"]
						const messages = ai_results["messages"]

						for(i = 0; i < messages.length; i++) {
							console.log(messages[i])
				      // var listItem = document.createElement('li');
				      // listItem.innerHTML = '<strong>' + json.products[i].Name + '</strong> can be found in ' + json.products[i].Location + '. Cost: <strong>£' + json.products[i].Price + '</strong>';
				      // myList.appendChild(listItem);
				    }

						if( score >= 90 ) {
							div.innerHTML = `
								<span class='rating'>${score}</span>
								<img src =${checkedImgUrl} class='lens-warning'/>
								`;
						} else {
							div.innerHTML = `
								<span class='rating'>${score}</span>
								<img src =${warningImgUrl} class='lens-warning'/>
								`;
						}

						div.style = "font-weight:bold; position:absolute; background:none; top: 4px; right: 30px; font-size: 20px; color: #444;";

					} else {
						score = Math.floor(Math.random() * 100);

						div.innerHTML = `
								<img src =${errorImgUrl} class='lens-warning'/>
								<span class='rating'>Invalid link</span>
							`;

						div.style = "background-color: #C6C8C2; color: #fff; font-size: 27px; position:absolute; top: 0px; left: 0px; width: 100%; height: 100%; opacity: 0.5;";
					}
			  });
		});
	}
}

/*
 * Parse through Facebook's encoded url for the actual url
 *
 */
function decode(code) {

	var res = "" + code;
	res = res
		.replace("http://l.facebook.com/l.php?u=", "")
		.replace(/%3A/gi, ":")
		.replace(/%F/gi, "/")
		.replace(/%2F/gi, "/");

	var end = res.substr(res.indexOf("^h"), res.length);
	res = res.replace(end, "");
	var end2 = res.substr(res.indexOf("&"), res.length);
	res = res.replace(end2, "");

	return res;
}

/**
 * Receive each Facebook post and analyze texts, urls, pics for validity.
 * Refreshes every second.
 *
 */
setInterval(function() {

	var test = document.getElementsByClassName('_4-u2 mbm _5v3q _4-u8');

	for(var i=0; i<test.length; i++) {

		var data = test[i];

		// Check if feed needs to be modified

		if(!feeds.has(data)) {
			feeds.add(data);

			// Send server requests

			var statement = "";

			var processed = false;


			var linked = test[i].querySelector('._6ks');
			if(!processed && linked != null && linked.querySelector('a')!=undefined) {

				httpGet(linked.querySelector('a').href, "url", data);
				processed = false;
			}


			var link = test[i].querySelector('._5pbx.userContent');
			if(!processed && link != null && link.querySelector('a') != null && link.querySelector('a').href!=undefined) {

				httpGet(link.href, "url", data);
			}


			var picComment = test[i].querySelector('.uiScaledImageContainer._4-ep');

			if(picComment != null && picComment.querySelector('img') != undefined && picComment.querySelector('img').src!=undefined) {


				httpGet(picComment.querySelector('img').src, "image", data);
				processed = false;
			}

			var picPost = test[i].querySelector('._46-h._517g');
			if(!processed && picPost != null  &&  picPost.querySelector('img') != undefined && picPost.querySelector('img').src!=undefined) {

				httpGet(picPost.querySelector('img').src, "image", data);
				processed = false;
			}

			var text = test[i].querySelector('._5pbx.userContent');
			if(!processed && text != null && text.textContent!=undefined) {

				httpGet(text.textContent, "text", data);
				processed = false;
			}

		}
	}

}, 1000);

})(document);
