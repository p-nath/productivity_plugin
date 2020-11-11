// console.log("background running");
// chrome.browserAction.onClicked.addListener(setup);

// function setup() {
// 	noCanvas();
// 	let userinput = select('#name');
// 	userinput.input(sendText);
// 	function sendText() {
// 	//Value got from input field in popup
// 		let message = userinput.value();
// 		//Sending message to content
// 		// chrome.tabs.query({active: true,currentWindow:true}, function(tabs) {
// 		// 	chrome.tabs.sendMessage(tabs[0].id,message);
// 		// });
// 		alert("")
// 	}
// }


// document.addEventListener('DOMContentLoaded', function() {
//     var checkPageButton = document.getElementById('button');
//     checkPageButton.addEventListener('click', function() {
  
//       chrome.tabs.getSelected(null, function(tab) {
//         alert("Hello..! It's my first chrome extension.");
//       });
//     }, false);
//   }, false);