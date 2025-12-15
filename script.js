let totalDrunk = 0;
let reminderInterval;
let goal = 0;
const water = document.querySelector('.s');
const weight = document.querySelector('.kg');

//localStorage data
window.addEventListener("load", () => {
    const savedGoal = localStorage.getItem("goal");
    const savedTotal = localStorage.getItem("totalDrunk");
    const savedFill = localStorage.getItem("fill");

    if (savedGoal && savedTotal) {
        goal = Number(savedGoal);
        totalDrunk = Number(savedTotal);
        water.style.width = savedFill;
        document.querySelector('.water_needed').innerHTML = `${goal - totalDrunk}/${goal}  ml`;
        document.querySelector('.bt-input').classList.add('show');
        document.querySelector('.remainder').classList.add('show');
    }
});

// more buttons
const buttons = document.querySelectorAll('.bt');
buttons.forEach(button => {
    button.addEventListener("click", function () {
        let val = Number(button.getAttribute("data-value"));
        if (totalDrunk - val <= 0) {
            totalDrunk = 0;
        } else {
            totalDrunk -= val;
        }
        updateFill();
        document.querySelector('.water_needed').innerHTML = totalDrunk + ' ml';;
        if (totalDrunk === 0 && goal) alert('You have completed your water intake for today 🎉');
        saveData();
    });
});

// Set Reminder
const setRemainder = document.querySelector('.set');
setRemainder.addEventListener("click", () => {
    let time = Number(document.querySelector('.timer').value) * 60000;

    if (!time || totalDrunk <= 0) {
        alert("Enter valid time or you already completed your water intake!");
        return;
    }
    clearInterval(reminderInterval);
    reminderInterval = setInterval(() => {
        if (totalDrunk > 0) alert(`Drink more ${totalDrunk} ml to complete for this day`);
    }, time);
});

// Reset Button
const resetBtn = document.querySelector('.reset');
resetBtn.addEventListener("click", () => {
    if (reminderInterval) {
        clearInterval(reminderInterval);
        reminderInterval = null;
    }
    goal = 0;
    water.style.width = 0 + "%";
    totalDrunk = 0;
    document.querySelector('.kg').value = "";
    document.querySelector('.timer').value = "";
    document.querySelector('.water_needed').innerHTML = "0 ml";
    localStorage.removeItem("goal");
    localStorage.removeItem("totalDrunk");
    localStorage.removeItem("fill");
    localStorage.removeItem("weight")
});

function calculate() {
    if (!weight.value || isNaN(weight.value)) {
        alert("Enter your weight!");
        return;
    }
    clearInterval(reminderInterval);
    reminderInterval = null;
    document.querySelector('.timer').value = "";

    water.style.width = 0 + "%";

    document.querySelector('.bt-input').classList.add('show');
    document.querySelector('.remainder').classList.add('show');

    goal = Math.floor((Number(weight.value) * 0.033) * 1000);
    totalDrunk = goal;

    document.querySelector('.water_needed').innerHTML = `0/${goal}  ml`;
    weight.value = '';
    saveData();
}

//progress bar
function updateFill() {
    if (!goal) return;

    let consumed = goal - totalDrunk;
    let percent = Math.floor((consumed / goal) * 100);

    if(totalDrunk<=0) water.style.width = 0 + "%";
    else water.style.width = percent + "%";

    if(percent > 0 && percent<=30) water.style.backgroundColor= "#ff0000";
    else if(percent > 30 && percent <=60) water.style.backgroundColor = "#ffa500";
    else if(percent > 60 && percent <= 80) water.style.backgroundColor = "#cefe31";
    else water.style.backgroundColor = "#07ce07";
}

//localStorage
function saveData() {
    localStorage.setItem("goal", goal);
    localStorage.setItem("totalDrunk", totalDrunk);
    localStorage.setItem("fill", water.style.width);
}
