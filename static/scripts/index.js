const categories = document.getElementById("categories")
const openCat1 = document.getElementById("openCat1")
const openCat2 = document.getElementById("openCat2")
const closeCat = document.getElementById("closeCat")
const catblock = document.getElementById("catblock")
const cart = document.getElementById("cart")
const cartBlock = document.getElementById("cartBlock")
const cartIcon = document.getElementById("cartIcon")
const closeCart = document.getElementById("closeCart")


// burger
const open_burger = document.getElementById("open_burger")
const burger = document.getElementById("burger")
const burblock = document.getElementById("burblock")
const closeBurger = document.getElementById("closeBurger")

openCat1.addEventListener("click", () => {
    categories.classList.remove("hidden")
    categories.classList.add("flex")
    catblock.classList.add("animate-right")
    catblock.classList.remove("animate-left")
})

openCat2.addEventListener("click", () => {
    categories.classList.remove("hidden")
    categories.classList.add("flex")
    catblock.classList.add("animate-right")
    catblock.classList.remove("animate-left")
})

closeCat.addEventListener("click", () => {
    catblock.classList.remove("animate-right")
    catblock.classList.add("animate-left")
    setTimeout(() => {
        categories.classList.add("hidden")
        categories.classList.add("flex")
    }, 500)
})

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

open_burger.addEventListener("click", () => {
    burger.classList.remove("hidden")
    burger.classList.add("flex")
    burblock.classList.remove("animatL")
    burblock.classList.add("animateR")
})

closeBurger.addEventListener("click", () => {
    burblock.classList.add("animateL")
    burblock.classList.remove("animateR")
    setTimeout(() => {
        burger.classList.add("hidden")
        burger.classList.add("flex")
    }, 500)
})

// Сохраняем в куки
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

