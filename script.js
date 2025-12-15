let totalDrunk = 0;
let reminderInterval;
let goal = 0;
let percent;
const water = document.querySelector('.s');
const weight = document.querySelector('.kg');
const timerInput = document.querySelector('.timer');
const reminderStatus = document.querySelector('.reminder-status');


//localStorage data
window.addEventListener("load", () => {
    const savedGoal = localStorage.getItem("goal");
    const savedTotal = localStorage.getItem("totalDrunk");
    const savedFill = localStorage.getItem("fill");

    if (savedGoal && savedTotal) {
        goal = Number(savedGoal);
        totalDrunk = Number(savedTotal);
        updateFill();
        updateText();
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
        updateText();
        if (totalDrunk === 0 && goal) {
            showMessage("🎉 Daily goal completed! Great job!");
            document.querySelector('.water_needed').innerHTML = '0 ml';
            document.querySelector('.percent').textContent = " ";
             showConfetti();
        }
        saveData();
    });
});

// Set Reminder
const setRemainder = document.querySelector('.set');
setRemainder.addEventListener("click", () => {
    let time = Number(timerInput.value) * 60000;

    if (!time || time <= 0 || totalDrunk <= 0) {
        showMessage("Set a valid reminder time!");
        return;
    }
    clearInterval(reminderInterval);

    reminderInterval = setInterval(() => {
        if (totalDrunk > 0) showMessage(`💧 Drink ${totalDrunk} ml to reach your goal`);
    }, time);
    timerInput.disabled = true;
    setRemainder.disabled = true;
    reminderStatus.textContent = `You'll be reminded every ${timerInput.value} min`;
    showMessage('Reminder Set Successfully');
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
    document.querySelector('.percent').textContent = " ";
    updateText();
    
    localStorage.removeItem("goal");
    localStorage.removeItem("totalDrunk");
    localStorage.removeItem("fill");
    localStorage.removeItem("weight");

    timerInput.disabled = false;
    setRemainder.disabled = false;
    calculate.disabled = false;
    reminderStatus.textContent = "";

});
const calculate = document.querySelector('.cal');
calculate.addEventListener("click",()=> {
    if (!weight.value || isNaN(weight.value)) {
        showMessage("Please enter your weight!");
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

    updateText();
    weight.value = '';
    saveData();
    calculate.disabled = true;
});

//progress bar
function updateFill() {
    if (!goal) return;

    let consumed = goal - totalDrunk;
    percent = Math.floor((consumed / goal) * 100);
    document.querySelector('.percent').textContent = percent + "%";

    if (totalDrunk <= 0) water.style.width = 0 + "%";
    else water.style.width = percent + "%";

    if (percent > 0 && percent <= 30) water.style.backgroundColor = "#ff0000";
    else if (percent > 30 && percent <= 60) water.style.backgroundColor = "#ffa500";
    else if (percent > 60 && percent <= 80) water.style.backgroundColor = "#cefe31";
    else water.style.backgroundColor = "#22C55E";
}

//localStorage
function saveData() {
    localStorage.setItem("goal", goal);
    localStorage.setItem("totalDrunk", totalDrunk);
    localStorage.setItem("fill", water.style.width);
}

//text update
function updateText() {
    if (!goal) {
        document.querySelector('.water_needed').innerHTML = "0 ml";
        return;
    }
    const consumed = goal - totalDrunk;
    document.querySelector('.water_needed').innerHTML = `${consumed} / ${goal} ml`;
}

//toast
const message = document.querySelector('.message');

function showMessage(text, duration = 2500) {
    message.textContent = text;
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show')
    }, duration);
}

let confettiShown = false;

function showConfetti() {
    if (confettiShown) return;
    confettiShown = true;

    const container = document.querySelector('.confetti-container');

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti');

        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
        piece.style.animationDelay = Math.random() * 0.5 + 's';

        container.appendChild(piece);

        setTimeout(() => piece.remove(), 3000);
    }
}

