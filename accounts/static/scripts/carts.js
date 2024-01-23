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