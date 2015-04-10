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
	document.getElementById('open').style.display = 'none';
}

function setdefaultvalue(label){
	label_post = label;
	document.getElementById('open').style.display = 'none';
}

function clearchoice(){
	choice = 'None';
	label_post = 'None';
	var elems = document.getElementsByClassName('choice');
	for(i=0; i<elems.length; ++i)
		elems[i].style.backgroundColor = GENERAL;
	document.getElementById('open').style.display = 'none';
}

function setupchoice(div){
	choice = div.getAttribute("value");
	label_post = choice;
	if(choice == 'Others')
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
	document.getElementById('labelinput').value = '';
	clearchoice();
}


// main part

var progress = 0;
var timestamp;

function record(){
	if(label_post == 'None'){
		alert('Choose a label');
		return;
	}
	var timediff = new Date().getTime() - timestamp;
	var pic = document.getElementById('pic');
	$.post("/record/"+pic.getAttribute('value')+"/"+label_post+"/"+timediff, function(response){
		//console.log(response.pic);
		setpic(response.pic);
	});
	clearchoice();
}

function show(s){
	++progress;
	return '('+progress+'/400)  '+s.substring(0,4)+'/'+s.substring(4,6)+'/'+s.substring(6,8)+' '+s.substring(9,11)+':'+s.substring(11,13);
}

function setpic(newpic){
	picObj = document.getElementById('pic');
	picObj.setAttribute("value", newpic);
	picObj.src = "http://disa.csie.ntu.edu.tw/~janetyc/data/"+newpic.substring(0,8)+"/image_"+newpic+".jpg";
	document.getElementById('time').innerHTML = show(newpic);
	timestamp = new Date().getTime();
	/*
	picObj.onerror = function(){ 
		$.getJSON('/newpic', function(response){
			setpic(response.pic);
		});
	}
	*/
}


// initiating
		
function buildup(){
	upper = document.getElementById('upper');
	for(i=0; i<category.length; ++i){
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
