let totalDrunk = 0;
let reminderInterval;
let goal = 0;
const water = document.querySelector('.s');
const weight = document.querySelector('.kg');

//localStorage data
window.addEventListener("load",()=>{
    const savedGoal = localStorage.getItem("goal");
    const savedTotal = localStorage.getItem("totalDrunk");
    const savedFill = localStorage.getItem("fill");
    const savedWeight = localStorage.getItem("weight");

    if(savedGoal && savedTotal){
        goal = Number(savedGoal);
        totalDrunk = Number(savedTotal);
        water.style.height = savedFill;
        weight.value = Number(savedWeight)
        document.querySelector('.water_needed').innerHTML = totalDrunk + " ml";
        document.querySelector('.bt-input').classList.add('show');
        document.querySelector('.remainder').classList.add('show');
    }
});

// more buttons
const buttons = document.querySelectorAll('.bt');
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            let val = Number(button.getAttribute("data-value"));
            if (totalDrunk-val < 0) {
                totalDrunk = 0;
            } else {
                totalDrunk -= val;
            }
            updateFill();
            document.querySelector('.water_needed').innerHTML = totalDrunk+' ml';;
            if(totalDrunk === 0 && goal) alert('You have completed your water intake for today 🎉');
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
            if(totalDrunk>0) alert(`Drink more ${totalDrunk} ml to complete for this day`);
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
        water.style.height = 0 + "%";
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

    water.style.height = 0+"%";
    const btInput = document.querySelector('.bt-input');
    btInput.classList.add('show');
    const timer = document.querySelector('.remainder');
    timer.classList.add('show');
    let toLiter = (Number(weight.value) * 0.033) * 1000;
    totalDrunk = toLiter;
    goal = toLiter;
    document.querySelector('.water_needed').innerHTML = `${totalDrunk}  ml`;;   
    saveData();
}

function updateFill() {
    if(!goal) return;
    let consumed = goal - totalDrunk;
    let percent = (consumed / goal) * 100;    
    water.style.height = percent + "%";
}

function saveData(){
    localStorage.setItem("goal",goal);
    localStorage.setItem("totalDrunk",totalDrunk);
    localStorage.setItem("fill",water.style.height);
    localStorage.setItem("weight",weight.value);
}
