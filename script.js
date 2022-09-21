'use strict';

const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const form = document.querySelector('form');

// Функция анимации

function animate({ timing, draw, duration }) {
  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // вычисление текущего состояния анимации
    let progress = timing(timeFraction);

    draw(progress); // отрисовать её

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

// Плавный скрол

body.addEventListener('click', (e) => {
    if (
      e.target.matches('.nav ul li .header__link--page')) {
      e.preventDefault();
      
      const item = e.target.closest('a');
      const itemId = item.getAttribute('href').substring(1);

      document.getElementById(itemId).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    } 
  });

// Открытие модального окна

const handelModal = () => {
  modal.classList.toggle('modal-show');
};

body.addEventListener('click', (e) => {
  if (
    e.target.closest('.header__button') ||
    e.target.closest('.adress__button')
  ) {
    handelModal();

    animate({
      duration: 500,
      timing(timeFraction) {
        return Math.pow(timeFraction, 2);
      },
      draw(progress) {
        modal.style.opacity = progress;
      },
    });
    body.classList.add('fixed-page');
  } else if (e.target.closest('.form__button--modal')) {
    animate({
      duration: 500,
      timing(timeFraction) {
        return Math.pow(timeFraction, 2);
      },
      draw(progress) {
        modal.style.opacity = 1 - progress;
      },
    });
    setTimeout(handelModal, 1000);
    body.classList.remove('fixed-page');
  } else if (!e.target.closest('.form')) {
    animate({
        duration: 500,
        timing(timeFraction) {
          return Math.pow(timeFraction, 2);
        },
        draw(progress) {
          modal.style.opacity = 1 - progress;
        },
      });
      setTimeout(modal.classList.remove('modal-show'), 1000);
      body.classList.remove('fixed-page');
  }
});

//  Заполнение полей формы

const inputName = form.querySelector('[type = text]');
const inputTel = form.querySelector('[type = tel]');
const textarea = form.querySelector('[name = subject]');

inputName.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^А-Яа-я]/g, '');
});

inputTel.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^\d/+\-\()]/, '');
});

//  Отправка формы

const dataForm = {};
const formElements = form.querySelectorAll('input');

const statusBlock = document.createElement('div');
const loadText = 'Загрузка..';
const errorText = 'Ошибка..';
const succsessText = 'Данные отправлены';

const validete = (list) => {
  let isError = false;

  if (inputName.value.trim().length >= 2) {
    inputName.style.border = 'none';
  } else {
    isError = true;
    inputName.classList.add('form__error');
  }

  if (inputTel.value.trim().length >= 6) {
    inputTel.style.border = 'none';
  } else {
    isError = true;
    alert('В ведите номер телефона не короче 6 символов и не длиннее 16');
    inputTel.classList.add('form__error');
  }
  return isError;
};

const sendData = (data) => {
  return fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  }).then((res) => res.json());
};

const submitForm = () => {
  statusBlock.textContent = loadText;
  form.append(statusBlock);

  if (!validete(formElements)) {
    dataForm.name = inputName.value;
    dataForm.tel = inputTel.value;

    if (textarea.value) {
      dataForm.textarea = textarea.value;
    }

    sendData(dataForm)
      .then((data) => {
        statusBlock.textContent = succsessText;

        const cleanStatusBlock = () => {
          statusBlock.textContent = '';
        };

        const closeForm = () => {
          modal.classList.remove('modal-show');
        };

        setTimeout(cleanStatusBlock, 1500);
        setTimeout(closeForm, 2000);

        formElements.forEach((input) => {
          input.value = '';
        });

        textarea.value = ''
      })
      .catch(() => {
        statusBlock.textContent = errorText;
      });
  } else {
    statusBlock.textContent = '';
    alert('Данные не валидны');
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitForm();
});


// СЛАЙДЕР

// const swiper = new Swiper('.swiper', {
//   // Optional parameters
//   slidesPerView: 1,
//   loop: true,

//   // If we need pagination
//   pagination: {
//     el: '.swiper-pagination',
//   },

//   // Navigation arrows  
// });
