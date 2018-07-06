window.onload = function(){
	// Global variables
	var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

	// Load JSON files (alartimes.json and sounds.json) from server, later file will be loaded to parse all data
	function loadJSON(url, callback) {   
		var xobj = new XMLHttpRequest();
	    xobj.overrideMimeType("application/json");
		xobj.open('GET', url, false);
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
		xhr.open("POST", "/input", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && xhr.readyState === 200){
				xhr.send("day=" + day + "&time=" + time + "&addRem=" + addremove);
				// Geen alert, anders wordt het wel heul irritant
			}
			else{
				alert("Tijd opslaan is mislukt");
			}
		}
	}

	// Function to append days to HTML from local JSON file
	loadJSON('alarmTimes.json', function(response) {
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

	// Make trashcan invisible with remove class
	function delClassTrashcan(){
		var child = this.childNodes[1];
		child.classList.remove("trash-solid");
		child.classList.remove("icon");
	}

	// Make settings visible and invisible when clicking on and off
	var settingsElem = document.getElementById("settings");
	function settingsVisible(){
	    settingsElem.style.display = "block";
	}
	function settingsInvisible(){
		settingsElem.style.display = "none";
	}

	// Make settings visible when clicking on settings
	document.getElementById("settingsButton").onclick = function (){settingsVisible()};
	document.getElementById("close").onclick = function (){settingsInvisible()};
	document.addEventListener("click", function(event) {
		if(event.target.closest("#settings")) {
			return;
		}
		settingsInvisible();
	}, true);

	// Action to save WiFi settings to server
	document.getElementById("savewifi").onclick = function(){
		var ssid = document.getElementById("ssid").value;
		var password = document.getElementById("password").value;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/input", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && xhr.readyState === 200){
				xhr.send("ssid=" + ssid + "&pass=" + password);
				alert("WiFi instellingen zijn opgeslagen!")
				settingsInvisible();
			}
			else{
				alert("WiFi instellingen opslaan is mislukt");
			}
		}
	}

	// Get sounds from server
	loadJSON('sounds.json', function(response) {
		var sounds = JSON.parse(response);
		var select = document.getElementById("sounds");
		for(var i = 0; i < sounds["sounds"].length; i++){
			var el = document.createElement("option");
			el.textContent = i + 1;
			el.value = sounds["sounds"][i];
			select.appendChild(el);
		}
	});

	// Save selected sound is select list changes
	document.getElementById("sounds").onchange = function(){
		var sound = document.getElementById("sounds").value;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/input", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && xhr.readyState === 200){
				xhr.send("sound=" + sound);
				alert("Geluid is opgeslagen!")
			}
			else{
				alert("Geluid opslaan is mislukt");
			}
		}
	}

	// Test the sound when click on testSound button
	document.getElementById("testSound").onclick = function(){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/playsound", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && xhr.readyState === 200){
				xhr.send();
			}
			else{
				alert("Kan geluid niet testen");
			}
		}
	}


	// Upload sound to server
	document.getElementById("uploadSound").onclick = function(){
		var soundUpload = document.getElementById("soundToUpload").files[0];
		var allowToUpload = true;
		console.log(soundUpload.type)
		loadJSON("sounds.json", function(response) {
			var soundsOnServer = JSON.parse(response);
			for(var i = 0; i < soundsOnServer["sounds"].length; i++){
				// Check if name/file already exists
				if(soundUpload.name == soundsOnServer["sounds"][i]){
					alert("Bestandsnaam bestaat al");
					allowToUpload = false;
					break;
				}
				// Check size of upload in bytes
				else if(soundUpload.size >= 10000000){
					alert("Bestand is te groot");
					allowToUpload = false;
					break;
				}
				// Check if uploaded file is .wav type
				else if (soundUpload.type !== "audio/wav"){
					alert("Bestand is van het verkeerde type, kies een bestand dat eindigt op .wav");
					allowToUpload = false;
					break;
				}
			}
		});
		if(allowToUpload){
			alert('File is allowed to upload');
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "/upload", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.onreadystatechange = function(){
				if(xhr.readyState === 4 && xhr.readyState === 200){
					xhr.send("soundFile=" + soundUpload);
					alert("Bestand is geupload!");
				}
				else{
					alert("Bestand uploaden is mislukt");
				}
			}
		}
	}	
   
}

