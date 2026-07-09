import { useEffect, useState } from "react";

export default function InstallButton(){

const [prompt,setPrompt]=useState<any>(null);

useEffect(()=>{

window.addEventListener("beforeinstallprompt",(e:any)=>{

e.preventDefault();

setPrompt(e);

});

},[]);

const install=async()=>{

if(prompt){

prompt.prompt();

await prompt.userChoice;

setPrompt(null);

}

};

return(

<button onClick={install}>

Install App

</button>

);

}
