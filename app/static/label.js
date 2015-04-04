var choice = 'None';
var label_post = 'None';
var category = ['Meeting', 'Lecture', 'Study', 'Empty'];
const GENERAL = '#33FFFF';
const CHOSEN = '#FF3300';


// get label_post from he left side

function setvalue(){
	var value = document.getElementById('labelinput').value;
	label_post = value;
	document.getElementById('word1').innerHTML = value;
	document.getElementById('word2').innerHTML = value;
	document.getElementById('open').style.display = 'none';
}

function setdefaultvalue(label){
	label_post = label;
	document.getElementById('word2').innerHTML = label;
	document.getElementById('open').style.display = 'none';
}

function clearchoice(){
	choice = 'None';
	label_post = 'None';
	var elems = document.getElementsByClassName('choice');
	for(i=0; i<elems.length; ++i)
		elems[i].style.backgroundColor = GENERAL;
	document.getElementById('word2').innerHTML = 'Select label';
	document.getElementById('open').style.display = 'none';
}

function setupchoice(div){
	choice = div.getAttribute("value");
	label_post = choice;
	if(choice == 'Others' || choice == 'Integrated')
		document.getElementById('open').style.display = 'block';
	div.style.backgroundColor = CHOSEN;
}

function light(div){
	if(choice == div.getAttribute("value")){
		clearchoice();
	}else{
		clearchoice();
		setupchoice(div);
	}
}

function refreshchoice(){
	choice = 'None';
	label_post = 'None';
	document.getElementById('word1').innerHTML = 'Others';
	document.getElementById('word2').innerHTML = 'Select label';
	document.getElementById('labelinput').value = '';
	clearchoice();
}


// main part

function record(num){
	var pic = document.getElementById('pic');
	$.post("/record/"+pic.getAttribute('value')+"/"+num+"/"+label_post, function(response){
		//console.log(response.pic);
		setpic(response.pic);
	});
	clearchoice();
}

function setpic(newpic){
	picObj = document.getElementById('pic');
	picObj.setAttribute("value", newpic);
	picObj.src = "http://disa.csie.ntu.edu.tw/~janetyc/data/"+newpic.substring(0,8)+"/image_"+newpic+".jpg";
	document.getElementById('time').innerHTML = newpic;
	picObj.onerror = function(){ 
		$.getJSON('/newpic', function(response){
			setpic(response.pic);
		});
	}
}


// initiating
		
function buildupper(){
	category = ['Meeting', 'Lecture', 'Study', 'Empty'];
	
	upper = document.getElementById('upper');
	for(i=0; i<4; ++i){
		choicecontainer = document.createElement("div");
		choicecontainer.setAttribute("class", "choicecontainer");
		middle = document.createElement("div");
		middle.setAttribute("class", "middle choice");
		middle.setAttribute("value", category[i]);
		middle.setAttribute("onclick", "light(this)");
		floater = document.createElement("div");
		floater.setAttribute("class", "floater");
		word = document.createElement("div");
		word.setAttribute("class", "sword");
		word.innerHTML = category[i];
		middle.appendChild(floater);
		middle.appendChild(word);
		choicecontainer.appendChild(middle);
		upper.appendChild(choicecontainer);
	}
}
		
function buildinner(){
	open = document.getElementById('open');
	lastinner = document.getElementById('lastinner');
	for(i=0; i<category.length; ++i){
		innerchoice = document.createElement("div");
		innerchoice.setAttribute("class", "visible-xs innerchoice");
		innerchoice.setAttribute("onclick","setdefaultvalue('"+category[i]+"');");
		floater = document.createElement("div");
		floater.setAttribute("class", "floater");
		word = document.createElement("div");
		word.setAttribute("class", "sword");
		word.innerHTML = category[i];
		innerchoice.appendChild(floater);
		innerchoice.appendChild(word);
		open.insertBefore(innerchoice, lastinner);
	}
}
		
function color(idx){
	depth = (15-idx).toString(16);
	return depth + depth + 'ff' + depth + depth;
}
		
function buildbuttonarea(){
	buttonarea = document.getElementById('buttonarea');
	for(i=0; i<4; ++i){
		line = document.createElement("div");
		line.setAttribute("class", "line");
		for(j=0; j<4; ++j){
			idx = i*4+j; 
			category = document.createElement("div");
			category.setAttribute("class", "category");
			middle = document.createElement("div");
			middle.setAttribute("class", "middle");
			middle.setAttribute("style", "background-color: #"+color(idx));
			middle.setAttribute("onclick", "record("+idx+")");
			floater = document.createElement("div");
			floater.setAttribute("class", "floater");
			word = document.createElement("div");
			word.setAttribute("class", "word");
			word.innerHTML = idx.toString();
			middle.appendChild(floater);
			middle.appendChild(word);
			category.appendChild(middle);
			line.appendChild(category);
		}
		buttonarea.appendChild(line);
	}
}

function buildup(){
	buildupper();
	buildinner();
	buildbuttonarea();
}
