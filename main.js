// ============= получение элементов


const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div');// создаем новый элемент

car.classList.add('car'); // добавление класса
// кнопки управления
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

// параметры игры
const setting = {
  start: false,
  score: 0,
  speed: 3
}

// ============== Обработчики событий

// нажатие на кнопку start
start.addEventListener('click', startGame);

// нажатие любой кнопки
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

// =============== Фунции

//события при старте игры
function startGame() {
  start.classList.add('hide'); // скрытие кнопки старт
  setting.start = true;        // игра начата
  gameArea.appendChild(car);   // добавление дочернего элемента car
  setting.x = car.offsetLeft;  // координаты авто по оси Х
  setting.y = car.offsetTop;   // координаты авто по оси Y
  requestAnimationFrame(playGame);// анимация игры
}

// управление игрой
function playGame() {
  if (setting.start) {
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }
    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + 'px';//передаем в дом дерево св-во
    car.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  }
}

// нажатие кнопки управления
function startRun(event) {
  event.preventDefault();  // отмена скролла на странице
  console.log(event.key);  // какая клавиша нажата
  keys[event.key] = true;
}

// кнопка управления отжата
function stopRun(event) {
  event.preventDefault();  // отмена скролла на странице
  keys[event.key] = false;
}

