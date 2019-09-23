//////////////Zoj O Fard adade varde
var n = parseInt(prompt("enter number"));
var r=n%2;
if (r===0)
{
	alert("N Zoj AST");
}else{
	alert("N fard AST");
}


////////////////////jameh 3e adade varde
s=0;
for ( var i = 0 ; i < 3; i++) {
	var n = parseInt(prompt("enter number"));
	console.log(n); 
	s=s+n;

}	console.log(s);
/////////////////////////////bozrgtarin do adade
var a = parseInt(prompt("enter number"));
var b = parseInt(prompt("enter number"));
if(a===b){
	var a = parseInt(prompt("enter number"));
	var b = parseInt(prompt("enter number"));
}
if(a>b){
	console.log(a);
}else{
	console.log(b);
}

////////////////////////maghsomalyeh
var n = parseInt(prompt("enter number"));
for (var i = 1; i <= n; i++) {
	var r=n%i;
	if (r===0){
		console.log(i);
	}
}
//////////////adade tom
var n = Number(prompt("enter number"));
var s=0;
for (var i = 1; i <= n/2; i++) {
	var r=n%i;
	if (r===0){
		s=s+i;
	}
}
if (s===n){
	console.log("tom ast");
}else{
	console.log("nist");
}
//////////////////////////////adade aval*******************************jkar nmikoneh
var n = Number(prompt("enter number"));
for (var i = 2; i < n; i++) {
	var r=n%i;
	if (r===0){
		console.log("Aval nist");
	}console.log("Aval AST");
}

var n = Number(prompt("enter number"));
var i = 2;
while (i<n){
	var r=n%i;
	if (r===0){
		console.log("Aval nist");
	}else{
		i=i+1;
	}
	console.log("Aval AST");
}

///////////////////////////factoril
var n = Number(prompt("enter number"));
var p=1;
for (var i = 1; i<=n; i++) {
	p=p*i;
}
console.log(p);
////////////////////////tedade argam***************
var n = Number(prompt("enter number"));
var s=0;
var r=0;
var w = 0;
for(var i=0;n>0;i++){
	 r=n%10;
		s=s+r;
		w++;
		n=n/10;
}
console.log("maghmohe"+s);
console.log("argme"+w);

var n = Number(prompt("enter number"));
var s=0;
var r=0;
var w = 0;
do{
	 r=n%10;
		s=s+r;
		w++;
		n=n/10;
}while(n>0)
console.log("maghmohe"+s);
console.log("argme"+w);
/////mabna 10 bea 2
var n = parseInt(prompt("enter number"));
var temp=[];
for(var i=0;n>1;i++){
	i=n/2;
	var r=n%2;
	n=n/2;
	temp.push(r);
}
