let appState = {
  theme: localStorage.getItem('theme') || 'dark',
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  groceries: JSON.parse(localStorage.getItem('groceries')) || [],
  fund: parseFloat(localStorage.getItem('fund')) || 0
};

let timerInterval = null;
let timerSeconds = 0;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTimer();
  initTasks();
  initFamily();
});

function initTheme() {
  document.body.setAttribute('data-theme', appState.theme);
  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', appState.theme);
    localStorage.setItem('theme', appState.theme);
  });
}

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.tab-panel');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

function initTimer() {
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startTimerBtn');
  const stopBtn = document.getElementById('stopTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');

  startBtn.addEventListener('click', () => {
    if (!timerInterval) {
      timerInterval = setInterval(() => {
        timerSeconds++;
        let hrs = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
        let mins = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
        let secs = String(timerSeconds % 60).padStart(2, '0');
        display.textContent = `${hrs}:${mins}:${secs}`;
      }, 1000);
    }
  });

  stopBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 0;
    display.textContent = "00:00:00";
  });
}

function initTasks() {
  const form = document.getElementById('taskForm');
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('taskPriority');
  const list = document.getElementById('taskList');

  function renderTasks() {
    list.innerHTML = '';
    appState.tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>[${task.priority}] ${task.name}</span>
        <button class="btn btn-danger" onclick="deleteTask(${index})">Done</button>
      `;
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    appState.tasks.push({ name: input.value, priority: priority.value });
    localStorage.setItem('tasks', JSON.stringify(appState.tasks));
    input.value = '';
    renderTasks();
  });

  window.deleteTask = function(index) {
    appState.tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(appState.tasks));
    renderTasks();
  };

  renderTasks();
}

function initFamily() {
  const groceryForm = document.getElementById('groceryForm');
  const groceryInput = document.getElementById('groceryInput');
  const groceryList = document.getElementById('groceryList');
  const fundForm = document.getElementById('fundForm');
  const fundInput = document.getElementById('fundInput');
  const fundAmount = document.getElementById('fundAmount');
  const fundProgress = document.getElementById('fundProgress');

  function renderGroceries() {
    groceryList.innerHTML = '';
    appState.groceries.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item}</span>
        <button class="btn btn-secondary" onclick="deleteGrocery(${index})">Bought</button>
      `;
      groceryList.appendChild(li);
    });
  }

  function renderFund() {
    fundAmount.textContent = `$${appState.fund.toFixed(2)}`;
    let percentage = Math.min((appState.fund / 1000) * 100, 100);
    fundProgress.style.width = `${percentage}%`;
  }

  groceryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    appState.groceries.push(groceryInput.value);
    localStorage.setItem('groceries', JSON.stringify(appState.groceries));
    groceryInput.value = '';
    renderGroceries();
  });

  window.deleteGrocery = function(index) {
    appState.groceries.splice(index, 1);
    localStorage.setItem('groceries', JSON.stringify(appState.groceries));
    renderGroceries();
  };

  fundForm.addEventListener('submit', (e) => {
    e.preventDefault();
    appState.fund += parseFloat(fundInput.value);
    localStorage.setItem('fund', appState.fund);
    fundInput.value = '';
    renderFund();
  });

  renderGroceries();
  renderFund();
}