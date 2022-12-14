
class WeatherApp {
    // Set Realtime Weather
    async setRealtimeWeather(weatherData){

        // distruckturing data 
        const {humidity, temp, temp_max, temp_min} = weatherData.main;
        const windSpeed = weatherData.wind.speed;
        const description =  weatherData.weather[0].description;


        console.log(weatherData)
        // Set user City
        const userCity = localStorage.getItem('userCity');
        const userCityTag = document.querySelector('#realtime_weather .location')
        userCityTag.innerHTML = userCity;

        // Set description
        const descriptionTag = document.querySelector('#realtime_weather .description')
        descriptionTag.innerHTML = description;

        // Set weather temperature
        const tempTag = document.querySelector('#realtime_weather .temp')
        tempTag.innerHTML = Math.floor(temp);

        // // Set weather icon
        // const weatherImgTag = document.querySelector('#realtime_weather .real-img img')
        // let time = JSON.parse(localStorage.getItem('time'));
        // time = time.hour;
        // console.log(time)
 
        // if(hours > 19 || hours < 6){
        //     weatherImgTag.src = weatherData.night_icon;
        // }else{
        //     weatherImgTag.src = weatherData.day_icon;
        // }
        
        // Set More info ------- access to elements
        const moreInfo = document.querySelector('#more_data_section'),
              maxTempTag = moreInfo.querySelector('#max_temp h4'),
              minTempTag = moreInfo.querySelector('#min_temp h4'),
              humidityTag = moreInfo.querySelector('#humidity h4'),
              windTag = moreInfo.querySelector('#wind h4');

        
        maxTempTag.innerHTML = Math.round(temp_max) + ' °';
        minTempTag.innerHTML = Math.round(temp_min) + ' °';
        humidityTag.innerHTML = humidity;
        windTag.innerHTML = windSpeed;

    }
    // Next hours Weather 
    nextHours(weatherData){
        // access to the time 
        const date = new Date();
        const hours = date.getHours();
        // access to the slider static childs
        const sliderChildes = document.querySelectorAll('.nextHours .swiper-slide');
        
        // Create next hours weathers in slider
        weatherData.forEach((weather, index) => {
            // access slide element
            const slideElement = sliderChildes[index];
            /// access to the weather hours
            let time = (weather.date).split(" ")[1];
            time = time.slice(0,5);
            // set icon by any hours
            let icon = '';
            switch (time) {
                case "18:00":
                    icon = icon = weather.day_icon;;
                    break;
                case "21:00":
                    icon = icon = weather.night_icon;;
                    break;
                case "00:00":
                    icon = icon = weather.night_icon;;
                    break;
                case "03:00":
                    icon = icon = weather.night_icon;;
                    break;
                case "06:00":
                    icon = icon = weather.day_icon;;
                    break;
                case "09:00":
                    icon = icon = weather.day_icon;;
                    break;
                case "12:00":
                    icon = icon = weather.day_icon;;
                    break;
                case "15:00":
                    icon = icon = weather.day_icon;;
                    break;
                default:
                    icon = icon = weather.day_icon;;
                    break;
            }

            /// Access to current time
            let currentTime = '';
            if(hours >= 18 && hours < 21){
                currentTime = '18:00';
            }else if(hours >= 21 && hours < 24){
                currentTime = '21:00';
            }else if(hours >= 24 || hours < 3){
                currentTime = "00:00"
            }else if(hours >= 3 && hours < 6){
                currentTime = '03:00'
            }else if(hours >= 6 && hours < 9){
                currentTime = '06:00'
            }else if(hours >= 9 && hours < 12){
                currentTime = '09:00'
            }else if(hours >= 12 && hours < 15){
                currentTime = '12:00'
            }else if(hours >= 15 && hours < 18){
                currentTime = '15:00'
            }

            // access to tags
            const weatherInfo = slideElement.querySelector('.weather_info'),
                  weatherIcon = slideElement.querySelector('.weather_icon'),
                  weatherTime = slideElement.querySelector('.weather_time');
            // set data
            weatherInfo.innerHTML = weather.weather;
            weatherIcon.src = icon;
            weatherTime.innerHTML = time;
            slideElement.setAttribute('timeId', index)

            // active current time
            if(currentTime === time){
                slideElement.classList.add('active');
            }

            // switching in times
            slideElement.addEventListener('click', () => this.activeThisTime(index));
        });
    }
    //
    activeThisTime(selectedTime){
        
        const weatherData = JSON.parse(localStorage.getItem('weather'))
        console.log(selectedTime);
        // Active time
        (function (){
            // access to the time slides
            const timeSlides = document.querySelectorAll('.nextHours .swiper-slide');
            // unActive last slide
            timeSlides.forEach((slide, index) => {
                if(slide.classList.contains('active')){slide.classList.remove('active')}
            });
            // active new slide
            timeSlides.forEach((slide, index) => {
                if(index === selectedTime){slide.classList.add('active')}
            });
        })()

        this.setRealtimeWeather(weatherData[selectedTime])
    }
    // Set Time and Date
    async setDateAndTime(){
        // Access to user city
        const userCity = localStorage.getItem('userCity');
        // base url and api key
        const url = 'https://api.api-ninjas.com/v1/worldtime?city=';
        const key = 'UugH/GVejG63QV8L9voW/w==AEG2K0kCQF2h4aiG';

        // Get Date and time from Api
        const response = fetch(url + userCity,{
            headers: { 'X-Api-Key': key},
            contentType: 'application/json',
        }).then(res => {
            return res.json()
        }).catch(error => {
            console.log(error);
        })
        // // Set date and time in Local storage
        localStorage.setItem('time', JSON.stringify(await response) )
    
        const time = JSON.parse(localStorage.getItem('time'));

        const {hour , minute , second, day_of_week, date} = await response;
        
        // access to HTML elemnts 
        const dateTag = document.querySelector('#time_and_date .date');
        const timeTag = document.querySelector('#time_and_date .time');

        dateTag.innerHTML = `${day_of_week}    /    ${date}`;
        timeTag.innerHTML = `${ hour }: ${minute} : ${second}`;
    
        // run clock
        this.runClock([hour, minute, second])
    }
    // Run clock
    runClock(timeData){
        // access to the loading classes
        const loadingClasses = document.querySelectorAll(`#time_and_date .loading_frame`);
        // remove classes
        loadingClasses.forEach(currentElement => currentElement.classList.remove('loading_frame'))
        // access to the data
        let hour = Number(timeData[0]),
        minute = Number(timeData[1]),
        seconde = Number(timeData[2]);

        // show values
        let showSeconde = '';
        let showMinute = '';
        let showHour = '';

        // access to the Elements
        const timeTag = document.querySelector('#time_and_date .time');

        setInterval(() => {
            // seconde --------------
            seconde++
            if(seconde > 59){
                seconde = 1;
            }
            // seconde fixer
            if(seconde < 10){
                showSeconde = `0${seconde}`;
            }else{
                showSeconde = seconde;
            }

            // minute ------------------
            if(seconde === 1){
                minute++
            }
            if(minute > 59){
                minute = 1
            }
            // minute fixer
            if(minute < 10){
                showMinute = `0${minute}`;
            }else{
                showMinute = minute;
            }

            // hour ---------------
            if(minute === 1){
                hour++
            }

            // hour fixer
            if(hour < 10){
                showHour = `0${hour}`;
            }else{
                showHour = hour;
            }

            timeTag.innerHTML = `${showHour} : ${showMinute} : ${showSeconde}`
        }, 1000);



    }



}

export default WeatherApp;