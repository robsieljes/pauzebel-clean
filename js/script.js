window.onload = function(){
	// Load JSON file from server
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

	// Function to click on save and check if time and days are not empty
	document.getElementById("save").onclick = function(){
		var timeToSet = document.getElementById("timeToSet").value;
		var days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
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
		}
		//location.reload();
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

	// Create unique ID for key 
	function myUniqueID(){
  		return Math.random().toString(36).slice(2);
	}

	// Function to write data to database
	function writeDay(day, time, addremove){
		//console.log(day, time, addremove);
		var xhr = new XMLHttpRequest();
		var url = "index.html";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
		    if (xhr.readyState === 4 && xhr.status === 200) {
		    	//console.log(xhr.responseText);
		        //var json = JSON.parse(xhr.responseText);
		    }
		};
		xhr.send(day, time, addremove);
	}

	// Function to append days to HTML from local JSON file
	function getDays(){
		loadJSON(function(response) {
		// Parse JSON string into object
			var times_days = JSON.parse(response);
			var totalArray = [];
			var j = 0;
			var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
			for (var i = 0; i < 7; i++) {
				times_days[days[i]].forEach(function(time){
					var div = document.createElement("BUTTON");
					var content = document.createTextNode(time);
					var timeElem = time;
					var list = document.createElement("DIV");
					var day = days[i];
					//div.setAttribute("id", days[i]);
					div.setAttribute("type", "button")
					div.setAttribute("class", "time");
					div.appendChild(content);
					div.appendChild(list);
					div.addEventListener("click", deleteTime);
					div.addEventListener("mouseover", addClass);
					div.addEventListener("mouseout", delClass);
					totalArray[j] = [day, timeElem, div];
					j++;
				});
				
			};
			totalArray = totalArray.sort();
			for(var i = 0; i < totalArray.length; i++){
				var divAppendTo = totalArray[i][0];
				document.getElementById(divAppendTo).appendChild(totalArray[i][2])
			}
		});
	}
	getDays();
	
	// Delete time from database and from HTML for realtime
	function deleteTime(){
		var time = this.textContent;
		var day = this.parentNode.id;
		if(confirm("Weet je zeker dat je de tijd wil verwijderen?")){
			writeDay(day, time, false);
			this.style.display = "none";
		}
		else{
			alert("Tijd niet verwijderd")
		}
	}

	// Make trashcan visible with class
	function addClass(){
		var child = this.childNodes[1];
		child.className = " trash-solid icon";
	}

	// Make trashcan invisible with class
	function delClass(){
		var child = this.childNodes[1];
		child.classList.remove("trash-solid");
		child.classList.remove("icon");
	}
}

