window.addEventListener('load',()=>{

let long;
let lat;
let temperatureDescription = document.querySelector('.temperature-description');
let temperatureDegree = document.querySelector('.temperature-degree');
let locationTimezone = document.querySelector('.location-timezone');
const temperatureSection = document.querySelector('.temperature');
const temperatureSpan = document.querySelector('.temperature span');
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            console.log(position);
            
            long=position.coords.longitude;
            lat=position.coords.latitude;
            
            const proxy = 'https://cors-anywhere.herokuapp.com';
            const api =`${proxy}/https://api.darksky.net/forecast/1b861bf2032b585a2402aa2aa2e7afc1/${lat},${long}`;

       
            fetch(api)
            .then(response => {
                
               return response.json();
            }) 

            .then(data =>
                
                {
                    console.log(data);
                    //taking data from API

            const {temperature,summary,icon} =data.currently;
            //DOM replacements
            temperatureDegree.textContent =temperature;
            temperatureDescription.textContent = summary;
            locationTimezone.textContent=data.timezone;
            
            //conversion formula
            let celcius = (temperature - 32 )* (5/9);
            setIcons(icon,document.querySelector('.icon'));

            //converting degrees
            temperatureSection.addEventListener('click',()=> {
                    if(temperatureSpan.textContent== "F")
                    {
                        temperatureSpan.textContent= "C";
                        temperatureDegree.textContent = Math.floor(celcius);
                    }
                    else
                    {
                    temperatureSpan.textContent = "F";
                    temperatureDegree.textContent = temperature;
                    }

            });

       
                });
       
        });


    }

function setIcons(icon,iconID){

    const skycons= new Skycons({color:"white"})
    const  currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID,Skycons[currentIcon]);



}


});