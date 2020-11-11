var bkg = chrome.extension.getBackgroundPage();
var DEFAULT_PROD_TIME = 30;
var DEFAULT_BREAK_TIME = 10;
var urlList = [];
// var urlCount;

// timer variables -  needs to be corrected
var timer;
var prodInterval;
var counter;

//Wait to run your initialization code until the DOM is fully loaded. This is needed
// when wanting to access elements that are later in the HTML than the <script>.
if(document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', afterLoaded);
} else {
    //The DOMContentLoaded event has already fired. Just run the code.
    afterLoaded();
}

function getInputPage() {
	bkg.console.log("start session");
	var inp = document.getElementById("input");
  inp.style.display = "block";
  document.getElementById("start").style.display = "none";
  document.getElementById("session").style.display = "none";
  
  chrome.storage.local.get({'prodTime': DEFAULT_PROD_TIME}, function(data) {
    bkg.console.log("restored prod hours" + data.prodTime);
   	document.getElementById("prodHr").value = data.prodTime;
	});

	chrome.storage.local.get({'breakTime': DEFAULT_BREAK_TIME}, function(data) {
    bkg.console.log("restored break hours" + data.breakTime);
   	document.getElementById("breakHr").value = data.breakTime;
	});

	// chrome.storage.local.get({"state": -1}, function(obj) {
	// 	bkg.console.log("state " + obj.state);
	// 	if (obj.state == -1) {
			
	// 	}
	// });

	// chrome.storage.local.get({'urlList': []}, function(data) {
 //    bkg.console.log("restored urls " + data.urlList);
 //    // urlCount = 0;
 //    data.urlList.forEach(url => addURL(url));
	// });
	
	
	chrome.storage.local.set({'state': 1});
}

function getSessionPage() {
	bkg.console.log("session page");
	document.getElementById("session").style.display = "block";
  document.getElementById("input").style.display = "none";
  document.getElementById("start").style.display = "none";

  // fix this
  timer = document.getElementById("sessionTimer");
  chrome.storage.local.get('prodTime', function(obj) {
		prodInterval = obj.prodTime * 60;
		counter = setInterval(function() {updateTimer();}, 1000);
	});
	
  chrome.storage.local.set({'state': 2});
}

function updateTimer() {
	var remainingSec = prodInterval % 60;
	var minutes = Math.floor(prodInterval / 60);
	if (remainingSec < 10) {
		remainingSec = '0' + remainingSec;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	timer.innerHTML = minutes + ":" + remainingSec;
	if (prodInterval > 0) {
		prodInterval = prodInterval - 1;
		// chrome.storage.local.set({'prodTime': prodInterval});
	} 
	else {
		clearInterval(counter);
		timer.innerHTML = 'Session finished.';
	}
}

function addURL(url) {
	// add to displayed list
	if (url != null) {
		urlList.push(url);
		// urlCount += 1;
	  document.getElementById("urlList").innerHTML += "<li><p>" + url + "</p><span class=\"close\">x</span></li> ";
	  document.getElementById("urlInput").value = "";
		var close = document.getElementsByClassName("close");
		var i;
	  for (i = 0; i < close.length; i++) {
	    close[i].onclick = function() {
				var div = this.parentElement;
	      div.style.display = "none";

	      var urlToDelete = div.getElementsByTagName('p')[0].innerHTML;
				bkg.console.log("deleting " + urlToDelete);
	      delete urlList[urlList.indexOf(urlToDelete)];
	      // urlCount -= 1;
	      // document.getElementById("urlCount").innerHTML = "   URLs added:" + urlCount;
	    }
	  }
	}
}

function saveSessionConfig() {
	var prodHr = document.getElementById("prodHr").value;
	var breakHr = document.getElementById("breakHr").value;

	chrome.storage.local.set({'prodTime': prodHr}, function() {
  	bkg.console.log("saved prod min" + prodHr);
	});
	chrome.storage.local.set({'breakTime': breakHr}, function() {
  	bkg.console.log("saved break min" + breakHr);
	});
	chrome.storage.local.set({'urlList': urlList}, function() {
  	bkg.console.log("saved urlList");

	});
}

function resetApp() {
	document.getElementById("session").style.display = "none";
  document.getElementById("input").style.display = "none";
  document.getElementById("start").style.display = "block";
}
function afterLoaded() {
  // Your initialization code goes here. This is from where your code should start
  // running if it wants to access elements placed in the DOM by your HTML files.

  chrome.storage.local.get({"state": 0}, function(data){
  	bkg.console.log("state restored " + data.state);
  	if (data.state == 1) {
  		getInputPage();
  	}
  	else if (data.state == 2) {
  		getSessionPage();
  	}
  });
  // start page button - page 0
  var setupButt = document.getElementById("setupButton");
	// buttons on input page - page 1
  var addButt = document.getElementById("addBtn");
  var saveUrlButt = document.getElementById("saveUrlOnly");
  var startButt = document.getElementById("startSession");
  // buttons on final page - 2
  var editUrlButt = document.getElementById("editButt");
  var exitButt = document.getElementById("exitButt");
  var resumeSessionButt = document.getElementById("resumeSession");


	setupButt.onclick = getInputPage;

	saveUrlButt.onclick = function() {
		bkg.console.log("updating URL list");
		// chrome.storage.local.set({'state': 2});
		chrome.storage.local.set({'urlList': urlList}, function() {
  		bkg.console.log("saved urlList");
		});
		
		// chrome.storage.local.get('prodTime', function(obj) {
		//     bkg.console.log("Value is " + obj.prodTime);
		// });
	};
	resumeSessionButt.onclick = function() {
		document.getElementById("timeInput").style.display = "block";
		document.getElementById("startSession").style.display = "block";
		resumeSessionButt.style.display = "none";
		getSessionPage();
		chrome.storage.local.get({'urlList': []}, function(data) {
    	bkg.console.log("on resume urls " + data.urlList);
		});
	}
	addButt.onclick = function() {
		var url = document.getElementById("urlInput").value;
		if (url == "") {
			document.getElementById("urlInput").placeholder = "You entered empty string.";
		}
		else {
			addURL(url);
			// document.getElementById("urlCount").innerHTML = "URLs flagged:" + urlCount;
		}
	};
	startButt.onclick = function() {
		saveSessionConfig();
		chrome.storage.local.set({'state': 2});
		getSessionPage();
	};

	editUrlButt.onclick = function() {
		document.getElementById("input").style.display = "block";
		document.getElementById("timeInput").style.display = "none";
		document.getElementById("startSession").style.display = "none";
		document.getElementById("session").style.display = "none";
		resumeSessionButt.style.display = "block";
		chrome.storage.local.get({'urlList': []}, function(data) {
    	bkg.console.log("on edit urls " + data.urlList);
		});
	}
	exitButt.onclick = function() {
		chrome.storage.local.set({'state': 0});
		resetApp();
		chrome.storage.local.get({'urlList': []}, function(data) {
    	bkg.console.log("on exit urls " + data.urlList);
		});
	}
};


