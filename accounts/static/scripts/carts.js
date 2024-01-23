function findProductIndex(cartItems, productId) {
    return cartItems.findIndex(item => item.id === productId);
}

function setCookies(name, value) {
    document.cookie = `${name}=${JSON.stringify(value)}; expires=Thu, 01 Jan 2030 00:00:00 UTC; path=/`;
}

window.toggleProduct = function (productId) {
    console.log(productId)
    const cartItems = getCookies("cartItems") || [];
    const productIndex = findProductIndex(cartItems, productId);


    cartItems.splice(productIndex, 1);

    setCookies("cartItems", cartItems);

}


function updateCart() {
    const cartItems = getCookies("cartItems") || [];
    const cartItemsElement = document.getElementById("cartsProduct");
    const totalElement = document.getElementById("totalCost");

    cartItemsElement.innerHTML = "";

    if (cartItems.length > 0) {
        document.getElementById("totalIcon").innerText = cartItems.length
    } else {
        cartItemsElement.innerHTML = "Корзина пуста";
        document.getElementById("totalIcon").innerText = cartItems.length
    }

    let total = 0;
    cartItems.forEach(item => {
        const div = document.createElement("div");
        div.classList = "pb-8 flex items-start flex-col sm:flex-row gap-[60px] relative"
        div.innerHTML = `
            <img src=${item.photo} class="w-[240px] h-[192px] object-cover rounded-md" alt="">
            <div class="flex flex-col gap-6">
                <h2 class="font-medium text-lg text-[#313141]">${item.name}</h2>
                <span class="font-bold">${item.price}$</span>
                <button onclick="toggleProduct('${item.id}')" class="bg-[#406EC7] w-[200px] text-white rounded py-2 px-10 hover:opacity-80 cursor-pointer">Удалить</button>
            </div>

        `
        cartItemsElement.appendChild(div);
        total += +item.price;
    });

    totalElement.textContent = `${total}$`;
}

function getCookies(name) {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [cookieName, cookieValue] = cookie.split("=");
        acc[cookieName] = cookieValue;
        return acc;
    }, {});

    return cookies[name] ? JSON.parse(cookies[name]) : null;
}

setInterval(() => {
    updateCart()
}, 1000)


document.getElementById("linkOrder").addEventListener("click", () => {
    window.location.href = '/api/orderpage'
})


function getSecureCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];

        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }

        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
        }
    }

    return null;
}

document.addEventListener('DOMContentLoaded', function () {
    var username = getSecureCookie('userData');
    let user = JSON.parse(username);

    if (user) {
        document.getElementById("profile").classList.remove("hidden")
        document.getElementById("sign2").classList.add("hidden")
        document.getElementById("sign1").classList.add("hidden")
        document.getElementById("auth2").classList.add("hidden")
        document.getElementById("auth1").classList.add("hidden")
    } else {
        document.getElementById("profile").classList.add("hidden")
        document.getElementById("sign2").classList.remove("hidden")
        document.getElementById("sign1").classList.remove("hidden")
        document.getElementById("auth2").classList.remove("hidden")
        document.getElementById("auth1").classList.remove("hidden")
    }

    document.getElementById("profile").addEventListener('click', () => {
        window.location.href = "/api/profile_html/"
    })
});
