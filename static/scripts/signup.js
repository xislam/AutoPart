const cart = document.getElementById("cart");
const cartBlock = document.getElementById("cartBlock");
const cartIcon = document.getElementById("cartIcon");
const closeCart = document.getElementById("closeCart");

// authorization
const namE = document.getElementById("name");
const surenamE = document.getElementById("surename");
const date = document.getElementById("date");
const emailauth = document.getElementById("email");
const passwordauth = document.getElementById("password");
const btn_auth = document.getElementById("btn_auth");
const number_phone = document.getElementById("number_phone");
const customCheckbox = document.getElementById("customCheckbox")
const rec = document.getElementById("rec")

// errors
const passErr = document.getElementById("passErr")
const emailErr = document.getElementById("emailErr")
const nameErr = document.getElementById("nameErr")
const surnameErr = document.getElementById("surnameErr")
const phoneErr = document.getElementById("phoneErr")
const dateErr = document.getElementById("dateErr")

cartIcon.addEventListener("click", () => {
    cart.classList.remove("hidden")
    cart.classList.add("flex")
    cartBlock.classList.add("animate-right")
    cartBlock.classList.remove("animate-left")
})

closeCart.addEventListener("click", () => {
    cartBlock.classList.remove("animate-right")
    cartBlock.classList.add("animate-left")
    setTimeout(() => {
        cart.classList.add("hidden")
        cart.classList.add("flex")
    }, 500)
})

// authorization
number_phone.addEventListener('input', function (event) {
    var input = event.target;
    var value = input.value;

    if (!/^\d$|\+$/.test(event.key)) {
        event.preventDefault();
    }
    var numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 0 && numericValue[0] !== '+') {
        input.value = '+' + numericValue;
    } else {
        input.value = numericValue;
    }
});

date.addEventListener('keydown', function (event) {
    var input = event.target;
    var key = event.key;

    if (!/[\d-]/.test(key) && key !== 'Backspace') {
        event.preventDefault();
        return;
    }

    var value = input.value.replace(/-/g, '');
    var formattedDate = '';

    if (value.length > 0) {
        formattedDate = value.slice(0, 4) + (value.length > 4 ? '-' + value.slice(4, 6) : '') + (value.length > 6 ? '-' + value.slice(6, 8) : '');
    }

    input.value = formattedDate;
});

btn_auth.addEventListener("click", () => {
    if (namE.value.trim() === '') {
        nameErr.classList.remove("hidden")
        return;
    }
    if (surenamE.value.trim() === '') {
        surnameErr.classList.remove("hidden")
        return;
    }
    if (date.value.trim() === '') {
        dateErr.classList.remove("hidden")
        return;
    }
    if (number_phone.value.trim() === '') {
        phoneErr.classList.remove("hidden")
        return;
    }
    if (emailauth.value.trim() === '') {
        emailErr.classList.remove("hidden")
        return;
    }
    if (passwordauth.value.trim() === '') {
        passErr.classList.remove("hidden")
        return;
    }
    const url = 'https://seoulgarage.com/api/api/register/';
    const auth_obj = {
        phone_number: number_phone.value,
        name: namE.value,
        surname: surenamE.value,
        role: 'user',
        email: emailauth.value,
        birthday: date.value,
        password: passwordauth.value
    }
    if (customCheckbox.checked === false && rec.checked === false) {
        return;
    }



    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(auth_obj)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Успешный ответ:', data);
            setSecureCookie('userData', JSON.stringify(data), 30);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });

    setTimeout(() => {
        window.location.href = 'api/signin_html/'
    }, 1000)
})