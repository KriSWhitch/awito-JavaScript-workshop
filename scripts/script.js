'use sctrict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item'); 
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const modalFileInput = document.querySelector('.modal__file-input');
const modalFileBtn = document.querySelector('.modal__file-btn');
const modalImageAdd = document.querySelector('.modal__image-add');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements].filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

const infoPhoto = {};

//Функции 

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

//Отвечает за блокировку отправления формы и за отображение предупреждающей надписи

const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
}

//Функция закрытия модального окна

const closeModal = event => {
    const target = event.target;

    if (target.closest('.modal__close') || target.classList.contains('modal') || event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModal);
        modalSubmit.reset();
        modalImageAdd.src = srcModalImage;
        modalFileBtn.textContent = textFileBtn;
        checkForm();
    } 
};

const renderCard = () => {
    catalog.textContent = '';
    dataBase.forEach((item, i) => {
        catalog.insertAdjacentHTML('beforeend', `
        <li class="card" data-id="${i}">
            <img class="card__image" src="data:image/jpeg; base64,${item.image}" alt="test">
            <div class="card__description">
                <h3 class="card__header">${item.nameItem}</h3>
                <div class="card__price">${item.costItem} ₽</div>
            </div>
        </li>
    `)
    });
};


//Обработчики событий

modalFileInput.addEventListener('change', event => {
    const target = event.target;
    const reader = new FileReader();
    const file = target.files[0];
    
    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);

    reader.addEventListener('load', event => {
        if ( infoPhoto.size < 300000 ) {
            modalFileBtn.textContent = infoPhoto.filename;
            infoPhoto.base64 = btoa(event.target.result);
            modalImageAdd.src = `data:image/jpeg; base64,${infoPhoto.base64}`;
        } else {
            modalFileBtn.textContent = 'Файл превысил размер в 300кб';
            modalFileInput.value = '';
            checkForm();
        }
    })
});

modalSubmit.addEventListener('input', checkForm);


modalSubmit.addEventListener('submit', event => {
    //Отключает стандартное поведение браузера - не перезагружает страницу после отправки формы
    event.preventDefault();

    const itemObj = {};

    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    }
    itemObj.image = infoPhoto.base64;
    dataBase.push(itemObj);
    modalSubmit.reset();
    closeModal({target: modalAdd});
    saveDB();
    renderCard();
});

//Модальное окно при нажатии на кнопку подачи объявления

addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModal);
})

modalAdd.addEventListener('click', closeModal);


//Модальное окно при нажатии на карточку

catalog.addEventListener('click', event => {
    const target = event.target;

    if ( target.closest('.card') ) {
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});

modalItem.addEventListener('click', closeModal);


renderCard();