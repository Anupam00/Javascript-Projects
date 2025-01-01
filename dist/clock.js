const data = new Date();
const getHours = data.toLocaleTimeString().split(":")[0];
const getMinutes = data.getMinutes();
const getSeconds = data.getSeconds();

document.getElementById('hours').innerHTML = `${getHours}`;
document.getElementById('minutes').innerHTML = `${getMinutes}`;
document.getElementById('seconds').innerHTML = `${getSeconds}`;

setInterval(()=> window.location.reload(), 1000);


