'use sctrict';

const dataBase = [];

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item'); 
const modalBtnWarning = document.querySelector('.modal__btn-warning');

const elementsModalSubmit = [...modalSubmit.elements].filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

//Функции закрытия модального окна

const closeModal = function(event) {
    const target = event.target;

    if ( target.closest('.modal__close') || target === this ) {
        this.classList.add('hide');
        if (this === modalAdd) {
            modalSubmit.reset();
        }
    }
};

// Использование стрелочной функции
// const closeModal = event => {
//     const target = event.target;

//     if ( target.closest('.modal__close') || target === modalAdd || target === modalItem ) {
//         modalAdd.classList.add('hide');
//         modalItem.classList.add('hide');
//         modalSubmit.reset();
//     }
// };

const closeModalEscape = event => {
    if (event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModalEscape);
    }
};


//События для кнопки

//Отвечает за блокировку отправления формы и за отображение предупреждающей надписи

modalSubmit.addEventListener('input', () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
});


modalSubmit.addEventListener('submit', event => {
    //Отключает стандартное поведение браузера - не перезагружает страницу после отправки формы
    event.preventDefault();

    const itemObj = {};

    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    }

    dataBase.push(itemObj);
    modalSubmit.reset();
    
});

//Модальное окно при нажатии на кнопку подачи объявления

addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModalEscape);
})

modalAdd.addEventListener('click', closeModal);


//Модальное окно при нажатии на карточку

catalog.addEventListener('click', event => {
    const target = event.target;

    if ( target.closest('.card') ) {
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModalEscape);
    }
});

modalItem.addEventListener('click', closeModal);


