// JavaScript Document
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=[];
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=[]; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

// Tab for Forecast
function openTerm(evt, termName) {
    // Declare all variables
    var i, tabcontent1, tablinks1;

    // Get all elements with class="tabcontent" and hide them
    tabcontent1 = document.getElementsByClassName("tabcontent1");
    for (i = 0; i < tabcontent1.length; i++) {
        tabcontent1[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
     tablinks1 = document.getElementsByClassName("tablinks1");
    for (i = 0; i < tablinks1.length; i++) {
        tablinks1[i].className = tablinks1[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
     document.getElementById(termName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Tab for Observations left
function openMinl(evt, minlName) {
    // Declare all variables
    var i, tabcontent2, tablinks2;

    // Get all elements with class="tabcontent" and hide them
    tabcontent2 = document.getElementsByClassName("tabcontent2");
    for (i = 0; i < tabcontent2.length; i++) {
        tabcontent2[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
     tablinks2 = document.getElementsByClassName("tablinks2");
    for (i = 0; i < tablinks2.length; i++) {
        tablinks2[i].className = tablinks2[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
     document.getElementById(minlName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Tab for Observations right
function openMinr(evt, minrName) {
    // Declare all variables
    var i, tabcontent2, tablinks3;

    // Get all elements with class="tabcontent" and hide them
    tabcontent2 = document.getElementsByClassName("tabcontent2");
    for (i = 0; i < tabcontent2.length; i++) {
        tabcontent2[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
     tablinks3 = document.getElementsByClassName("tablinks3");
    for (i = 0; i < tablinks3.length; i++) {
        tablinks3[i].className = tablinks3[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
     document.getElementById(minrName).style.display = "block";
    evt.currentTarget.className += " active";
}

function attatchString(target, fullTarget, delimiter) {

	if (fullTarget == "") {
		fullTarget = target;
	} else {
		fullTarget += delimiter + target;
	}

	return fullTarget;
}