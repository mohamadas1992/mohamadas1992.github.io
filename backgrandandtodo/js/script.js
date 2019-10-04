
// var database =[
//     {
//         username:"kazem",
//         password:"1234"
//     },
//     {
//         username:"sally",
//         password:"6666"
//     },
//     {
//         username:"andrei",
//         password:"7777"
//     }];
// var newsfeed=[
//     {
// 		username: "Bobby",
// 		timeline: "So tired from all that learning!"
//     },
//     {
// 		username: "Sally",
// 		timeline: "Javascript is sooooo cool!"
//     },
//     {
//         username: "Mitch",
// 		timeline: "Javascript is preeetyy cool!"
//     }
// ];
// var usernameP=prompt("Enter username:");
// var passwordP=prompt("Enter pass:");

// function userValid(user,pass) {
//     for(var i=0;i<database.length;i++){
//         if(database[i].username===user&&
//             database[i].password===pass){
//             return true;
//         }
//     }
//     return false;
// }
// function singdIn(user,pass){
//     if(userValid(user,pass)){
//         console.log(newsfeed);
//     }else{
//         alert("wrong pass or user");
//     }

// }
// singdIn(usernameP,passwordP);
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


