const cart = document.getElementById("cart");
const cartBlock = document.getElementById("cartBlock");
const cartIcon = document.getElementById("cartIcon");
const closeCart = document.getElementById("closeCart");

// sign in
const signLogin = document.getElementById("signLogin")
const signPass = document.getElementById("signPass")
const signBtn = document.getElementById("signBtn")


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

signLogin.addEventListener('input', function (event) {
    var input = event.target;
    var value = input.value;

    if (event.inputType === 'deleteContentBackward') {
        return;
    }

    var firstChar = value.charAt(0);

    if (/^\d$/.test(firstChar)) {
        input.value = '+' + value;
    }
});


// sign in
signBtn.addEventListener("click", () => {
    if (signLogin.value.trim() && signPass.value.trim()) {
        signLogin.classList.remove("border-[#F11313]")
        signPass.classList.remove("border-[#F11313]")
        const url = ' https://seoulgarage.com/api/login/';
        const auth_obj = {
            identifier: signLogin.value,
            password: signPass.value
        }
        console.log(auth_obj)

        function setSecureCookie(name, value, days) {
            var secureFlag = location.protocol === 'https:' ? '; Secure' : '';
            var expires = '';

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toUTCString();
            }

            document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + secureFlag;
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
                console.log(data);
                setSecureCookie('userData', JSON.stringify(data), 30);
                setTimeout(() => {
                    window.location.href = '/index.html'
                }, 1000)
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    } else {
        if (signLogin.value === "") {
            signLogin.classList.add("border-[#F11313]")
        }
        if (signPass.value === "") {
            signPass.classList.add("border-[#F11313]")
        }
    }
})