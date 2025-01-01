let principleAmount = (document.querySelector("#principle"));
let ratePercent = (document.querySelector("#rate"));
let timeFor = (document.querySelector("#time"));
let button = document.querySelector("#button");

function calculateInterest(){
    let principle =parseInt(principleAmount.value);
    let rate = parseInt(ratePercent.value);
    let time = parseInt(timeFor.value);
    if(isNaN(principle) || isNaN(rate) || isNaN(time)){
        document.querySelector("#resultArea").innerText = `Enter a Positive Number`
    }
    else{
        let part1 = (1+(rate/100));
        let part2 = part1 ** time;
        let interest = principle *((part2)-1);
        document.getElementById("resultArea").innerText=`The total Interest is ${interest.toFixed(2)}`
        console.log(interest.toFixed(2));
    }

}

button.addEventListener("click",calculateInterest);





