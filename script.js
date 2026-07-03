const questions = [
  {
    tag: "GitHub",
    text: "Что такое GitHub?",
    answers: [
      "Онлайн-место для проекта, файлов и истории изменений",
      "Программа для рисования сайта",
      "Папка на рабочем столе",
      "Кнопка запуска компьютера"
    ],
    correct: 0
  },
  {
    tag: "Git",
    text: "Зачем нужен Git?",
    answers: [
      "Чтобы хранить историю изменений проекта",
      "Чтобы покупать подписку",
      "Чтобы вводить капчу",
      "Чтобы открывать почту"
    ],
    correct: 0
  },
  {
    tag: "Репозиторий",
    text: "Что такое репозиторий?",
    answers: [
      "Отдельное место проекта на GitHub",
      "Пароль от Google",
      "Окно с сообщениями",
      "Случайная картинка для проверки"
    ],
    correct: 0
  },
  {
    tag: "GitHub Pages",
    text: "Что делает GitHub Pages?",
    answers: [
      "Показывает сайт по ссылке из файлов проекта",
      "Удаляет проект",
      "Проверяет, человек ли вы",
      "Заменяет все картинки на странице"
    ],
    correct: 0
  },
  {
    tag: "Token",
    text: "Что важно помнить про GitHub token?",
    answers: [
      "Это личный ключ доступа, его нельзя показывать другим",
      "Это название папки проекта",
      "Это бесплатная картинка для сайта",
      "Это обычный текст для заголовка"
    ],
    correct: 0
  },
  {
    tag: "Codex",
    text: "Чем Codex отличается от обычного чата?",
    answers: [
      "Он может работать с файлами проекта и вносить изменения",
      "Он нужен только для выбора картинок",
      "Он заменяет GitHub Pages",
      "Он хранит пароль от почты"
    ],
    correct: 0
  },
  {
    tag: "Команда",
    text: "Что такое команда в терминале?",
    answers: [
      "Точная инструкция для компьютера",
      "Название сайта",
      "Адрес электронной почты",
      "Любая кнопка на клавиатуре"
    ],
    correct: 0
  },
  {
    tag: "Терминал",
    text: "Где обычно выполняют текстовые команды?",
    answers: [
      "В терминале",
      "В корзине",
      "В фотогалерее",
      "В календаре"
    ],
    correct: 0
  },
  {
    tag: "Папка проекта",
    text: "Что лежит в папке проекта?",
    answers: [
      "Файлы сайта или приложения",
      "Только письма из почты",
      "Только музыка",
      "Капча"
    ],
    correct: 0
  },
  {
    tag: "Капча",
    text: "Для чего нужна капча?",
    answers: [
      "Чтобы проверить, что действие выполняет настоящий человек",
      "Чтобы хранить файлы проекта",
      "Чтобы написать HTML",
      "Чтобы включить подписку"
    ],
    correct: 0
  }
];

const intro = document.querySelector("#intro");
const quiz = document.querySelector("#quiz");
const result = document.querySelector("#result");
const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");
const againBtn = document.querySelector("#againBtn");
const nextBtn = document.querySelector("#nextBtn");
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#scoreText");
const progressBar = document.querySelector("#progressBar");
const questionTag = document.querySelector("#questionTag");
const questionText = document.querySelector("#questionText");
const answers = document.querySelector("#answers");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");

let currentIndex = 0;
let score = 0;
let selected = false;

function shuffleOptions(question) {
  const options = question.answers.map((answer, index) => ({
    answer,
    isCorrect: index === question.correct
  }));

  return options.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  currentIndex = 0;
  score = 0;
  selected = false;
  intro.classList.add("is-hidden");
  result.classList.add("is-hidden");
  quiz.classList.remove("is-hidden");
  renderQuestion();
}

function renderQuestion() {
  const question = questions[currentIndex];
  selected = false;
  nextBtn.disabled = true;
  progressText.textContent = `Вопрос ${currentIndex + 1} из ${questions.length}`;
  scoreText.textContent = `${score} правильных`;
  progressBar.style.width = `${(currentIndex / questions.length) * 100}%`;
  questionTag.textContent = question.tag;
  questionText.textContent = question.text;
  answers.innerHTML = "";

  shuffleOptions(question).forEach((option) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.type = "button";
    button.textContent = option.answer;
    button.addEventListener("click", () => chooseAnswer(button, option.isCorrect));
    answers.append(button);
  });
}

function chooseAnswer(button, isCorrect) {
  if (selected) {
    return;
  }

  selected = true;
  nextBtn.disabled = false;
  if (isCorrect) {
    score += 1;
    button.classList.add("correct");
  } else {
    button.classList.add("wrong");
    [...answers.children].find((item) => {
      const question = questions[currentIndex];
      return question.answers[question.correct] === item.textContent;
    }).classList.add("correct");
  }

  [...answers.children].forEach((item) => {
    item.disabled = true;
  });

  scoreText.textContent = `${score} правильных`;
}

function showResult() {
  quiz.classList.add("is-hidden");
  result.classList.remove("is-hidden");
  progressBar.style.width = "100%";

  if (score === questions.length) {
    resultTitle.textContent = `${score}/${questions.length}: отлично`;
    resultText.textContent = "Все ответы верные. Можно смело переходить к GitHub Pages и публикации сайта.";
  } else if (score >= 8) {
    resultTitle.textContent = `${score}/${questions.length}: хороший результат`;
    resultText.textContent = "База уже есть. Стоит еще раз повторить токен, репозиторий и разницу между GitHub и Git.";
  } else {
    resultTitle.textContent = `${score}/${questions.length}: нужно повторить`;
    resultText.textContent = "Это нормально для старта. Пройдите карточки сверху и попробуйте еще раз.";
  }
}

function goNext() {
  if (currentIndex === questions.length - 1) {
    showResult();
    return;
  }

  currentIndex += 1;
  renderQuestion();
}

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
againBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", goNext);
