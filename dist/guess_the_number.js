let user = document.querySelector('#guess');
let button =  document.querySelector('#btn');
let buttonReset = document.querySelector('#btnReset');
let randomNum = randomNumber();

function checkGuess(){
    let userNumber = parseInt(user.value);
    if(isNaN(userNumber)){
        document.querySelector("#result").innerText = `Enter a valid Positive number`;
        user.value = document.querySelector('#guess').innerText= null;

    }
    else{
        if(userNumber===randomNum){
            document.querySelector('#result').innerText = `Your Guess is correct`;
        }
        else{
            document.querySelector('#result').innerText = `Your Guess is incorrect.Try again`;
            user.value = document.querySelector('#guess').innerText= null;
        }
    }
}

function randomNumber(){
    const random = Math.random();
    const randomNo =parseInt((random*100).toFixed(0)) ;
    console.log(randomNo);
    return randomNo;
}


try{
    button.addEventListener("click",checkGuess);
    buttonReset.addEventListener("click",()=> {
        randomNum = randomNumber();
        document.querySelector('#result').innerText = `Number is Reset. Guess Now!`
    });
}catch(e){
    console.error(e);
}
