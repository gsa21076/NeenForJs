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
  speed: 3,
  traffic: 3
}

// ============== Обработчики событий

// нажатие на кнопку start
start.addEventListener('click', startGame);

// нажатие любой кнопки
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

// =============== Фунции

// определяем кол-во авто на дороге
function getQuantityElements(heightElement) {
  // определяем высоту дороги и делим на высоту элемента
  return document.documentElement.clientHeight / heightElement + 1;
}

//события при старте игры
function startGame() {
  start.classList.add('hide'); // скрытие кнопки старт

  // цикл выводит линии разметки 
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.appendChild(line);
  }
  // цикл выводит авто
  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    // расположение авто хаотично по ширине
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = 'transparent url(./image/enemy2.png) center / cover no-repeat';
    gameArea.appendChild(enemy)
  }

  setting.start = true;        // игра начата
  gameArea.appendChild(car);   // добавление дочернего элемента car
  setting.x = car.offsetLeft;  // координаты авто по оси Х
  setting.y = car.offsetTop;   // координаты авто по оси Y
  requestAnimationFrame(playGame);// анимация игры
}

// управление игрой
function playGame() {
  if (setting.start) {
    moveRoad();
    moveEnemy();
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

// движение дроги
function moveRoad() {
  let lines = document.querySelectorAll('.line');// получаем все линии из документа
  lines.forEach(function (line) {
    line.y += setting.speed / 1.3;// сдвиг вниз
    line.style.top = line.y + 'px';
    //  условие переноса линий вверх
    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  })
}

// движение авто в трафике
function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(function (itemcar) {
    itemcar.y += setting.speed / 2;
    itemcar.style.top = itemcar.y + 'px';
    if (itemcar.y >= document.documentElement.clientHeight) {
      itemcar.y = -100 * setting.traffic;
      itemcar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}
