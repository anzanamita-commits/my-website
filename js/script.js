// ====================================================
// 1. АКТУАЛЬНЫЙ ГОД В ПОДВАЛЕ
// ====================================================
const yearEl = document.querySelector('#year');
yearEl.textContent = new Date().getFullYear();


// ====================================================
// 2. ПЕРЕКЛЮЧЕНИЕ ТЁМНОЙ ТЕМЫ
//    JS переключает класс на <html>, а стили описаны в CSS
// ====================================================
const themeBtn = document.querySelector('#theme-toggle');

themeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');

    const isDark = document.documentElement.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
});


// ====================================================
// 3. ОТПРАВКА ФОРМЫ БЕЗ ПЕРЕЗАГРУЗКИ СТРАНИЦЫ
// ====================================================
const form = document.querySelector('form');
const statusMsg = document.querySelector('#form-status');

form.addEventListener('submit', (event) => {
    event.preventDefault();        // отменяем перезагрузку

    const name = document.querySelector('#name').value.trim();

    statusMsg.textContent = `Спасибо, ${name}! Сообщение отправлено.`;
    statusMsg.classList.add('visible');

    form.reset();                  // очищаем поля
});


// ====================================================
// 4. КНОПКА «НАВЕРХ» ПОЯВЛЯЕТСЯ ПРИ ПРОКРУТКЕ
// ====================================================
const upBtn = document.querySelector('#to-top');

window.addEventListener('scroll', () => {
    upBtn.classList.toggle('visible', window.scrollY > 400);
});

upBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
// --- ОЗВУЧКА ТЕКСТА ---
document.addEventListener('DOMContentLoaded', () => {
    const speakBtn = document.getElementById('speak-btn');
    if (!speakBtn) return;

    // Проверяем поддержку синтеза речи
    if (!('speechSynthesis' in window)) {
        speakBtn.style.display = 'none';
        console.warn('Ваш браузер не поддерживает синтез речи.');
        return;
    }

    let isSpeaking = false;

    // Функция для сбора текста со страницы (только основные разделы, без навигации и подвала)
    function getPageText() {
        const main = document.querySelector('main');
        if (!main) return '';

        // Клонируем main, чтобы не менять оригинал
        const clone = main.cloneNode(true);

        // Удаляем элементы, которые не нужно озвучивать (например, формы, кнопки)
        const elementsToRemove = clone.querySelectorAll('form, button, .header-controls, #to-top');
        elementsToRemove.forEach(el => el.remove());

        // Получаем текст, заменяя множественные пробелы и переносы
        let text = clone.innerText
            .replace(/\s+/g, ' ') // множественные пробелы -> один
            .replace(/(\d+)\s*\./g, '$1.') // убираем пробел перед точкой после цифр (для списков)
            .trim();

        return text;
    }

    // Остановить озвучку
    function stopSpeaking() {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        speakBtn.textContent = '🔊';
        speakBtn.classList.remove('speaking');
        speakBtn.title = 'Озвучить текст';
    }

    // Начать озвучку
    function startSpeaking() {
        const text = getPageText();
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU'; // Русский язык
        utterance.rate = 1;       // Скорость
        utterance.pitch = 1;      // Тон

        utterance.onstart = () => {
            isSpeaking = true;
            speakBtn.textContent = '⏹️';
            speakBtn.classList.add('speaking');
            speakBtn.title = 'Остановить озвучку';
        };

        utterance.onend = () => {
            stopSpeaking();
        };

        utterance.onerror = (event) => {
            console.error('Ошибка озвучки:', event);
            stopSpeaking();
        };

        window.speechSynthesis.speak(utterance);
    }

    // Обработчик клика по кнопке
    speakBtn.addEventListener('click', () => {
        if (isSpeaking) {
            stopSpeaking();
        } else {
            // Если уже что-то говорит (например, после паузы), сбрасываем
            window.speechSynthesis.cancel();
            startSpeaking();
        }
    });

    // Останавливаем озвучку при уходе со страницы (опционально)
    window.addEventListener('beforeunload', () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
        }
    });
});
// Отправка формы через скрытый iframe (без перезагрузки)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        // НЕ отменяем отправку (убираем preventDefault), 
        // но отправляем форму в скрытый iframe
        contactForm.target = 'hidden_iframe'; 
        
        formStatus.textContent = 'Отправка...';
        formStatus.style.color = '#666';

        // Через 1.5 секунды показываем "Спасибо" (время, за которое Formspree примет данные)
        setTimeout(function() {
            formStatus.textContent = 'Спасибо! Ваше сообщение отправлено.';
            formStatus.style.color = 'green';
            contactForm.reset(); // Очищаем поля
            
            // Возвращаем обычное поведение формы
            contactForm.target = ''; 
        }, 1500);
    });
}
// --- МАСШТАБИРОВАНИЕ ТЕКСТА ---
let currentFontSize = 100; // Начальный размер в процентах (100%)

const btnIncrease = document.getElementById('font-increase');
const btnDecrease = document.getElementById('font-decrease');

if (btnIncrease && btnDecrease) {
    // Увеличение текста
    btnIncrease.addEventListener('click', () => {
        if (currentFontSize < 150) { // Ограничитель (максимум 150%)
            currentFontSize += 10;
           document.body.style.zoom = currentFontSize + '%';
        }
    });

    // Уменьшение текста
    btnDecrease.addEventListener('click', () => {
        if (currentFontSize > 70) { // Ограничитель (минимум 70%)
            currentFontSize -= 10;
            document.body.style.zoom = currentFontSize + '%';



        }
    });
}
