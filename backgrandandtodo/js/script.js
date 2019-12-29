
var battun =document.getElementById("clickbut");
var text=document.getElementById("additem");
var ul=document.querySelector("ul");

function textlength(){
    return text.value.length;
}
function createlistelement(){
    var li=document.createElement("li");
    li.appendChild(document.createTextNode(text.value));
    ul.appendChild(li);
    text.value="";
}

function addafterClick(){
    if (textlength()>0){
        createlistelement();
    }
}
battun.addEventListener("click",addafterClick);

function addafterEnter(event){
    if (textlength()>0&&event.keyCode===13){
        createlistelement();
    }
}
text.addEventListener("keypress",addafterEnter);
///////////////////////////
var css=document.querySelector("h3");
var color1=document.querySelector(".color1");
var color2=document.querySelector(".color2");
var body= document.querySelector("body");

function setgrdint(){
    body.style.background=
    "linear-gradient(to right,"
    + color1.value
    + ", "
    + color2.value
    + ")";
    css.textContent=body.style.background + ";" ;
}
color1.addEventListener("input",setgrdint);

color2.addEventListener("input",setgrdint);


