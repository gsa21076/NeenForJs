// ============= получение элементов
// start_easy">Легкий</div>
//   < div class="start start_midle" > Средний</ >
//     <div class="start start-hard
const MAX_ENEMY = 8;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div');// создаем новый элемент


// -----звук игры
const audio = document.createElement('audio');// создали элемент для аудио
audio.src = './audio/audio.mp3';// путь к файлу
audio.type = 'audio/mp3'; // указываем тип
audio.style.cssText = `position: absolute; top: -100opx; `;// убираем из видимой области
audio.volume = 0.2;// громкость
audio.loop = true; //цикличность воспроизведения

// ---звук аварии
const crash = document.createElement('audio');
crash.src = './audio/crash.mp3';
crash.type = 'audio.mp3';
crash.style.cssText = `position: absolute; top: -200opx; `;// убираем из видимой области
crash.volume = 0.2;// громкость


car.classList.add('car'); // добавление класса
// кнопки управления
const keys = {
  w: false,
  s: false,
  a: false,
  d: false
};

// параметры игры
const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3
}

// считывание рекорда
let maxScore = localStorage.getItem('maxScore');
console.log(maxScore);
if (maxScore == null) {
  maxScore = 0;
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
  audio.play();
  gameArea.innerHTML = '';

  // цикл выводит линии разметки 
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.append(line);
  }
  // цикл выводит авто
  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    // расположение авто хаотично по ширине
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url(./image/enemy${randomEnemy}.png) center / cover no-repeat`;
    gameArea.append(enemy)
  }
  setting.score = 0;
  setting.start = true;        // игра начата
  gameArea.append(car);   // добавление дочернего элемента car
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  document.body.append(audio);  // добавление аудио на стрпаницу
  setting.x = car.offsetLeft;  // координаты авто по оси Х
  setting.y = car.offsetTop;   // координаты авто по оси Y
  requestAnimationFrame(playGame);// анимация игры
}

// управление игрой
function playGame() {
  if (setting.start) {
    setting.score++;
    // Считывание рекорда из localStorage
    let maxScore = localStorage.getItem('maxScore');

    score.textContent = '  MAX_SCORE :' + maxScore + '  SCORE :' + setting.score;

    if (setting.score > 1000 && setting.score < 10000) {
      setting.traffic = 2;
    }
    if (setting.score > 10000) {
      setting.traffic = 1;
    }
    moveRoad();
    moveEnemy();

    // проверка, что-бы не выезжала с дороги
    if (keys.a && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.d && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }
    if (keys.w && setting.y > 0) {
      setting.y -= setting.speed;
    }
    if (keys.s && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
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
  if (keys.hasOwnProperty(event.key)) {  // условие исключения других клавиш
    keys[event.key] = true;  // какая клавиша нажата
  }

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
  let enemy = document.querySelectorAll('.enemy');//получаем все авто со страницы
  enemy.forEach(function (itemcar) {   // перебираем все авто
    //---получаем размеры и позиции авто
    let carRect = car.getBoundingClientRect();
    let enemyRect = itemcar.getBoundingClientRect();
    // ---условия аварии
    if (carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
      setting.start = false;
      audio.pause();
      crash.play();
      start.classList.remove('hide');
      start.style.top = score.offsetHeight;
      // преобразование строки в число
      maxScore = Number(maxScore);
      // сравнегие с предыдущим рекордом
      if (setting.score > maxScore) {
        localStorage.setItem('maxScore', setting.score);

      }
    }


    itemcar.y += setting.speed / 2;
    itemcar.style.top = itemcar.y + 'px';
    if (itemcar.y >= document.documentElement.clientHeight) {
      itemcar.y = -100 * setting.traffic;
      itemcar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}
