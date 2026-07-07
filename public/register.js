alert("register.js loaded");
async function register(){

const username=document.getElementById("username").value.trim();

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value;

const confirm=document.getElementById("confirm").value;

const msg=document.getElementById("msg");

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!username || !email || !password || !confirm){

msg.innerHTML="Please fill all fields.";

return;

}

if(!emailRegex.test(email)){

msg.innerHTML="Invalid email format.";

return;

}

if(password!==confirm){

msg.innerHTML="Passwords do not match.";

return;

}

const res=await fetch("/register",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

username,

email,

password

})

});

const data=await res.json();

msg.innerHTML=data.message;

if(data.success){

setTimeout(()=>{

window.location="login.html";

},1500);

}

}