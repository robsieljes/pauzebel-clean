window.onload = function(){
	// Global variables
	var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

	// Load times JSON file from server, later file will be loaded to parse all data
	function loadJSON(callback) {   
		var xobj = new XMLHttpRequest();
	    xobj.overrideMimeType("application/json");
		xobj.open('GET', 'alarmTimes.json', true);
		xobj.onreadystatechange = function () {
	      if (xobj.readyState == 4 && xobj.status == "200") {
	     	callback(xobj.responseText);
	      }
		};
	xobj.send(null);  
	}

	// Load sounds JSON file from server, later file will be loaded to parse all data
	function loadJSONSounds(callback) {   
		var xobj = new XMLHttpRequest();
	    xobj.overrideMimeType("application/json");
		xobj.open('GET', 'sounds.json', false);
		xobj.onreadystatechange = function () {
	      if (xobj.readyState == 4 && xobj.status == "200") {
	     	callback(xobj.responseText);
	      }
		};
	xobj.send(null);  
	}

	// Function to click on save and check if time and days are not empty
	document.getElementById("save").onclick = function(){
		var timeToSet = document.getElementById("timeToSet").value;
		var daysFilled = false;
		for(i = 0; i < 7; i++){
			if(document.getElementById(days[i] + "Input").checked){
				daysFilled = true;
			}
		}
		if(timeToSet == 0){
			alert("Vul een tijd in!");
		}
		if(daysFilled == false){
			alert("Vul minimaal 1 dag in!");
		}
		if(daysFilled == true && timeToSet != 0){
			for(i = 0; i < 7; i++){
				if(document.getElementById(days[i] + "Input").checked){
					writeDay(days[i], timeToSet, true);
				}
			}
			location.reload();
		}
	}

	// Check all + uncheck all function
	document.getElementById("checkTrue").onclick = function(){checkAll("timeForm", true)};
	document.getElementById("checkFalse").onclick = function(){checkAll("timeForm", false)};
	
	function checkAll(formname, checktoggle){
	  var checkboxes = new Array(); 
	  checkboxes = document[formname].getElementsByTagName('input');
	 
	  for (var i=0; i<checkboxes.length; i++) {
	    if (checkboxes[i].type == 'checkbox') {
	      checkboxes[i].checked = checktoggle;
	    }
	  }
	}

	// Function to write data to database
	function writeDay(day, time, addremove){
		var xhr = new XMLHttpRequest();
		var url = "/input";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function () {
		    if (xhr.readyState === 4 && xhr.status === 200) {
		        //var json = JSON.parse(xhr.responseText);
		    }
		};
		var postString = "day=" + day + "&time=" + time + "&addRem=" + addremove;
		xhr.send(postString);
	}

	// Function to append days to HTML from local JSON file
	loadJSON(function(response) {
		// Parse JSON string into object
		var times_days = JSON.parse(response);
		var totalArray = [];
		var j = 0;
		for (var i = 0; i < 7; i++) {
			if(times_days[days[i]] == ""){
				continue;
			}
			else{
				times_days[days[i]].forEach(function(time){
					var div = document.createElement("BUTTON");
					var content = document.createTextNode(time);
					var timeElem = time;
					var list = document.createElement("DIV");
					var day = days[i];
					div.setAttribute("type", "button")
					div.setAttribute("class", "time");
					div.appendChild(content);
					div.appendChild(list);
					div.addEventListener("click", deleteTime);
					div.addEventListener("mouseover", addClassTrashcan);
					div.addEventListener("mouseout", delClassTrashcan);
					totalArray[j] = [day, timeElem, div];
					j++;
				});
			}
			
		};
		// totalArray is array with all elements, down here it is sorted on time
		totalArray = totalArray.sort();
		for(var i = 0; i < totalArray.length; i++){
			var divAppendTo = totalArray[i][0];
			document.getElementById(divAppendTo).appendChild(totalArray[i][2])
		}
	});
	
	// Delete time from database and from HTML for realtime
	function deleteTime(){
		var time = this.textContent;
		var day = this.parentNode.id;
		if(confirm("Weet je zeker dat je de tijd wil verwijderen?")){
			writeDay(day, time, false);
			this.style.display = "none";
			location.reload();
		}
		else{
			alert("Tijd niet verwijderd")
		}
	}

	// Make trashcan visible with class
	function addClassTrashcan(){
		var child = this.childNodes[1];
		child.className = " trash-solid icon";
	}

	// Make trashcan invisible with class
	function delClassTrashcan(){
		var child = this.childNodes[1];
		child.classList.remove("trash-solid");
		child.classList.remove("icon");
	}

	// Make input for SSID and password visible when clicking on wifi settings
	document.getElementById("wifi").onclick = function(){
	    var x = document.getElementById("wifisettings");
	    console.log(x.style.display);
		if (x.style.display === "none" || x.style.display === "") {
	    	x.style.display = "block";
	    }
	    else {
	        x.style.display = "none";
	    }
	}

	// Action to save WiFi settings to server
	document.getElementById("savewifi").onclick = function(){
		var x = document.getElementById("wifisettings");
		var ssid = document.getElementById("ssid").value;
		var password = document.getElementById("password").value;
		x.style.display = "none";
		var xhr = new XMLHttpRequest();
		var url = "/input";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		var postString = "ssid=" + ssid + "&pass=" + password;
		xhr.send(postString);
	}

	// Get sounds from server
	loadJSONSounds(function(response) {
		var sounds = JSON.parse(response);
		var select = document.getElementById("sounds");
		for(var i = 0; i < sounds["sounds"].length; i++){
			var el = document.createElement("option");
			el.textContent = i + 1;
			el.value = sounds["sounds"][i];
			select.appendChild(el);
		}
	});

	// Save selected sound
	document.getElementById("saveSound").onclick = function(){
		var sound = document.getElementById("sounds").value;
		var xhr = new XMLHttpRequest();
		var url = "/input";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		var postString = "sound=" + sound;
		xhr.send(postString);
	}

	// Upload sound to server
	document.getElementById("uploadSound").onclick = function(){
		var soundUpload = document.getElementById("soundToUpload").files[0];
		var allowToUpload = false;
		console.log(soundUpload.size)
		loadJSONSounds(function(response) {
			var soundsOnServer = JSON.parse(response);
			for(var i = 0; i < soundsOnServer["sounds"].length; i++){
				// Check if name/file already exists
				if(soundUpload.name == soundsOnServer["sounds"][i]){
					alert("Bestandsnaam bestaat al");
					allowToUpload = true;
					break;
				}
				// Check size of upload in bytes
				else if(soundUpload.size >= 10000000){
					alert("Bestand is te groot");
					allowToUpload = true;
					break;
				}
			}
		});
		if(!allowToUpload){
			alert('File is allowed to upload');
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "/upload", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send("soundFile=" + soundUpload);
		}
	}	
   
}

