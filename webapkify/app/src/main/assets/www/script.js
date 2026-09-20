/* ============================================================
   🐱 CATCALCULATOR — полный скрипт с звуками
   ============================================================ */

/* ============================================================
   0. 🔊 ЗВУКИ
   ============================================================ */
const sounds = {
  click: new Audio('sounds/click.mp3'),
  meow:  new Audio('sounds/meow.mp3'),
  rain:  new Audio('sounds/rain.mp3'),
};

// Предзагрузка
Object.values(sounds).forEach(s => {
  s.preload = 'auto';
});

// Громкость
sounds.click.volume = 0.3;
sounds.meow.volume  = 0.6;
sounds.rain.volume  = 0.4;

// Настройка звука (вкл/выкл) с сохранением в localStorage
let soundEnabled = localStorage.getItem('sound') !== 'off';

/**
 * Проигрывает звук по имени.
 * Безопасно — игнорирует ошибки автовоспроизведения.
 */
function playSound(name) {
  if (!soundEnabled) return;
  try {
    const sound = sounds[name];
    if (!sound) return;
    sound.currentTime = 0;       // сброс, если уже играет
    sound.play().catch(() => {}); // игнорируем блокировку автовоспроизведения
  } catch (e) {
    // игнорируем
  }
}

/* ============================================================
   1. 🐱 ЗАГРУЗКА: лоадер → калькулятор
   ============================================================ */
const loader = document.getElementById('loader');
const app = document.getElementById('app');
const catLoaderEmoji = document.getElementById('cat-loader');

// Меняем мордочку котика во время загрузки
const loaderCats = ['🐱', '😺', '😸', '😻', '😽', '😼'];
let loaderCatIndex = 0;
const loaderInterval = setInterval(() => {
  loaderCatIndex = (loaderCatIndex + 1) % loaderCats.length;
  catLoaderEmoji.textContent = loaderCats[loaderCatIndex];
}, 400);

// Через 2 секунды скрываем лоадер и показываем калькулятор
window.addEventListener('load', () => {
  setTimeout(() => {
    clearInterval(loaderInterval);
    loader.classList.add('is-hidden');
    app.classList.add('is-visible');
  }, 2000);
});

/* ============================================================
   2. 🌙 ТЕМА
   ============================================================ */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-toggle__icon');

const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  playSound('click');

  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ============================================================
   3. 🎨 АКЦЕНТ
   ============================================================ */
const accentPicker = document.getElementById('accent-picker');
const accentDots = accentPicker.querySelectorAll('.accent-dot');

const savedAccent = localStorage.getItem('accent') || 'orange';
document.documentElement.setAttribute('data-accent', savedAccent);
updateActiveDot(savedAccent);

accentPicker.addEventListener('click', (e) => {
  const dot = e.target.closest('.accent-dot');
  if (!dot) return;

  playSound('click');

  const accent = dot.dataset.accent;
  document.documentElement.setAttribute('data-accent', accent);
  localStorage.setItem('accent', accent);
  updateActiveDot(accent);
});

function updateActiveDot(accent) {
  accentDots.forEach(dot => {
    dot.classList.toggle('is-active', dot.dataset.accent === accent);
  });
}

/* ============================================================
   4. 🔊 КНОПКА ЗВУКА
   ============================================================ */
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = soundToggle.querySelector('.sound-toggle__icon');

function updateSoundIcon() {
  soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
}
updateSoundIcon();

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('sound', soundEnabled ? 'on' : 'off');
  updateSoundIcon();

  // Короткий клик для подтверждения
  if (soundEnabled) {
    playSound('click');
  }
});

/* ============================================================
   5. 🧮 КАЛЬКУЛЯТОР
   ============================================================ */
const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = calculator.querySelector('.calculator__display');

const getKeyType = (key) => {
  const { action } = key.dataset;
  if (!action) return 'number';
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) return 'operator';
  return action;
};

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  if (operator === 'add') return firstNum + secondNum;
  if (operator === 'subtract') return firstNum - secondNum;
  if (operator === 'multiply') return firstNum * secondNum;
  if (operator === 'divide') return firstNum / secondNum;
};

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent;
  const keyType = getKeyType(key);
  const { firstValue, modValue, operator, previousKeyType } = state;

  if (keyType === 'number') {
    return displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'
      ? keyContent
      : displayedNum + keyContent;
  }

  if (keyType === 'decimal') {
    if (!displayedNum.includes('.')) return displayedNum + '.';
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.';
    return displayedNum;
  }

  if (keyType === 'operator') {
    return firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }

  if (keyType === 'clear') return 0;

  if (keyType === 'calculate') {
    return firstValue
      ? previousKeyType === 'calculate'
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }
};

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } = calculator.dataset;

  calculator.dataset.previousKeyType = keyType;

  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.firstValue = firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayedNum;
  }

  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = '';
    calculator.dataset.modValue = '';
    calculator.dataset.operator = '';
    calculator.dataset.previousKeyType = '';
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
      ? modValue
      : displayedNum;
  }
};

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);

  Array.from(key.parentNode.children)
    .forEach(k => k.classList.remove('is-depressed'));

  if (keyType === 'operator') key.classList.add('is-depressed');

  if (keyType === 'clear' && key.textContent !== 'AC') {
    key.textContent = 'AC';
  }

  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]');
    clearButton.textContent = 'CE';
  }
};

keys.addEventListener('click', e => {
  if (!e.target.matches('button')) return;

  playSound('click');   // 🔊 звук нажатия

  const key = e.target;
  const displayedNum = display.textContent;
  const resultString = createResultString(key, displayedNum, calculator.dataset);

  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
});

/* ============================================================
   6. 🐱 КОТИК: клики, анимации, дождик
   ============================================================ */
const catBtn = document.getElementById('cat-btn');
const catEmoji = catBtn.querySelector('.cat-btn__emoji');
const catRain = document.getElementById('cat-rain');

const catAnimations = ['is-shaking', 'is-spinning'];
let catClickCount = 0;
const RAIN_TRIGGER = 3;

catBtn.addEventListener('click', () => {
  catClickCount++;

  playSound('meow');       // 🔊 мяуканье
  playRandomCatAnimation();

  if (catClickCount >= RAIN_TRIGGER) {
    catClickCount = 0;
    playSound('rain');     // 🔊 звук дождя
    startCatRain();
  }
});

function playRandomCatAnimation() {
  catAnimations.forEach(cls => catEmoji.classList.remove(cls));
  void catEmoji.offsetWidth;
  const randomAnim = catAnimations[Math.floor(Math.random() * catAnimations.length)];
  catEmoji.classList.add(randomAnim);
}

catEmoji.addEventListener('animationend', () => {
  catAnimations.forEach(cls => catEmoji.classList.remove(cls));
});

function startCatRain() {
  const DROP_COUNT = 40;
  const DURATION_MIN = 1500;
  const DURATION_MAX = 3500;
  const catFaces = ['🐱', '😺', '😸', '😻', '😽', '🐈', '🐈‍⬛', '😼'];

  for (let i = 0; i < DROP_COUNT; i++) {
    const drop = document.createElement('span');
    drop.className = 'cat-drop';
    drop.textContent = catFaces[Math.floor(Math.random() * catFaces.length)];
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDelay = Math.random() * 500 + 'ms';
    const duration = DURATION_MIN + Math.random() * (DURATION_MAX - DURATION_MIN);
    drop.style.animationDuration = duration + 'ms';
    drop.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';

    catRain.appendChild(drop);
    drop.addEventListener('animationend', () => drop.remove());
  }
}