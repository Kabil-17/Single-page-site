let totalDrunk = 0;
let reminderInterval = null;
let goal = 0;
let percent;
let mileStone = 0;

const water = document.querySelector('.s');
const weight = document.querySelector('.kg');
const timerInput = document.querySelector('.timer');
const reminderStatus = document.querySelector('.reminder-status');
const onboarding = document.querySelector('.onboarding');
const app = document.querySelector('.app');
const reminderPart = document.querySelector('.reminder-part');


//localStorage data
window.addEventListener("load", () => {
    const savedGoal = localStorage.getItem("goal");
    const savedTotal = localStorage.getItem("totalDrunk");
    const savedMileStone = localStorage.getItem("mileStone");
    const savedStreak = localStorage.getItem("streakCount");
    // streak restore
    if (savedStreak) {
    document.querySelector(".streak-counter").textContent = savedStreak;
    }

    if (savedGoal && savedTotal) {
        goal = Number(savedGoal);
        totalDrunk = Number(savedTotal);
        mileStone = Number(savedMileStone);

        onboarding.style.display = "none";
        reminderPart.style.display = "block";

        updateFill();
        updateText();
        document.querySelector('.percent').textContent = percent + '%';
    } else {
        onboarding.style.display = "block";
        app.classList.add("hidden");
    }
});

// water buttons
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
            setRemainder.disabled = false;
            reminderStatus.textContent = '';
            clearInterval(reminderInterval);
        }
        saveData();
    });
});

//toggle reminder
const toggleReminder = document.querySelector(".toggle");
const reminderBlock = document.querySelector(".reminder-block");
toggleReminder.addEventListener("click", () => {
    reminderBlock.style.display = "flex";
    toggleReminder.style.display = "none";
})

// Set Reminder
const setRemainder = document.querySelector('.set');
setRemainder.addEventListener("click", () => {
    let time = Number(timerInput.value) * 60000;

    if (!time || time <= 0 || totalDrunk <= 0) {
        showMessage("Set a valid reminder time!");
        return;
    }

    reminderInterval = setInterval(() => {
        if (totalDrunk > 0) showMessage(`💧 Drink ${totalDrunk} ml to reach your goal`);
    }, time);
    timerInput.disabled = true;
    setRemainder.disabled = true;
    reminderStatus.textContent = `You'll be reminded every ${timerInput.value} min`;
    showMessage('Reminder Set Successfully');
});

//reset button 
const resetButton = document.querySelector('.reset');
resetButton.addEventListener("click", () => {
    clearInterval(reminderInterval);
    reminderInterval = null;

    timerInput.disabled = false;
    setRemainder.disabled = false;
    reminderStatus.textContent = "";

    showMessage("Reminder reset");
});

// Start Over Button
const startOver = document.querySelector('.start-over');
startOver.addEventListener("click", () => {
    if (reminderInterval) {
        clearInterval(reminderInterval);
        reminderInterval = null;
    }
    goal = 0;
    water.style.width = 0 + "%";
    totalDrunk = 0;
    mileStone = 0;
    confettiShown = false;
    document.querySelector('.kg').value = "";
    document.querySelector('.timer').value = "";
    document.querySelector('.percent').textContent = " ";
    updateText();

    localStorage.removeItem("goal");
    localStorage.removeItem("totalDrunk");
    localStorage.removeItem("fill");
    localStorage.removeItem("weight");
    localStorage.removeItem("mileStone");

    timerInput.disabled = false;
    setRemainder.disabled = false;
    reminderStatus.textContent = "";

    onboarding.style.display = "block";
    reminderPart.style.display = "none";

});

//calculate
const calculate = document.querySelector('.cal');
calculate.addEventListener("click", () => {
    if (!weight.value || isNaN(weight.value)) {
        showMessage("Please enter your weight!");
        return;
    }

    goal = Math.floor((Number(weight.value) * 0.033) * 1000);
    totalDrunk = goal;
    saveData();

    onboarding.style.display = "none";

    reminderPart.style.display = "block";

    clearInterval(reminderInterval);
    reminderInterval = null;
    document.querySelector('.timer').value = "";

    water.style.width = 0 + "%";

    // document.querySelector('.bt-input').classList.add('show');
    // document.querySelector('.remainder').classList.add('show');

    updateText();
    updateFill();
    weight.value = '';
});

//progress bar
function updateFill() {
    if (!goal) return;

    let consumed = goal - totalDrunk;
    percent = Math.floor((consumed / goal) * 100);
    document.querySelector('.percent').textContent = percent + "%";

    // if (totalDrunk <= 0) water.style.width = 0 + "%";
    water.style.width = percent + "%";
    progressMotivation(percent);

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

function progressMotivation(progress){
    if(progress >= 10 && mileStone < 10){
        showMessage("Let's get started 💧");
        mileStone = 10;
    }
    else if(progress >= 30 && mileStone < 30){
        showMessage("Good start! Keep going 👍");
        mileStone = 30;
    }
    else if(progress >= 50 && mileStone < 50){
        showMessage("🔥 Halfway there!");
        mileStone = 50;
    }
    else if(progress >= 70 && mileStone < 70){
        showMessage("Almost there 💪");
        mileStone = 70;
    }
    else if(progress >= 85 && mileStone < 85){
        showMessage("YEAHH! there are just few cups come on🔥🔥");
        mileStone = 85;
    }
    else if(progress >= 100 && mileStone < 100){
        showConfetti();
        showMessage("🎉 Daily goal completed! Great job!");
        mileStone = 100;
        updateDailyStreak();
    }
    localStorage.setItem("mileStone",mileStone);
}

//ripple effect
document.querySelectorAll('.buttons').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

        button.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
});

//streak logic
function updateDailyStreak(){
    const today = new Date().toISOString().split('T')[0];
    let streak = Number(localStorage.getItem("streakCount")||0);
    const lastdate = localStorage.getItem("lastCompletedDate");

    if(!lastdate){
        streak = 1;
    }else{
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);
        const yDate = yesterday.toISOString().split('T')[0];

        if((lastdate === today)) return 
        else if(lastdate === yDate) streak++;
        else streak = 1;
    }
    document.querySelector(".streak-counter").textContent = streak;
    localStorage.setItem("streakCount",streak);
    localStorage.setItem("lastCompletedDate",today);

}