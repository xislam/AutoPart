const closeModal = document.getElementById("closeModal")
const modal = document.getElementById("modal")
const orderBtn = document.getElementById("orderBtn")
const spinner = document.getElementById("spinner")
const productsItem = document.getElementById("productsItem")
const names = document.getElementById("names")
const surnames = document.getElementById("surnames")
const address = document.getElementById("address")
const address1 = document.getElementById("address1")
const city = document.getElementById("city")
const phone = document.getElementById("phone")
const agree = document.getElementById("agree")


closeModal.addEventListener('click', () => {
    modal.classList.add("hidden")
    modal.classList.remove("flex")
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
    console.log(user)

    if (user) {
        fetch('http://195.49.210.86/api/profile/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                names.value = data.name
                surnames.value = data.surname
                phone.value = data.phone_number
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    function toggleProduct(productId, productName, productPrice, productPhoto) {
        const cartItems = getCookies("cartItems") || [];
        const productIndex = findProductIndex(cartItems, productId);

        if (productIndex === -1) {
            cartItems.push({
                id: productId,
                name: productName,
                price: productPrice,
                photo: productPhoto,
            });
        } else {
            cartItems.splice(productIndex, 1);
        }

        setCookies("cartItems", cartItems);

    }

    function findProductIndex(cartItems, productId) {
        return cartItems.findIndex(item => item.id === productId);
    }

    function getCookies(name) {
        const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
            const [cookieName, cookieValue] = cookie.split("=");
            acc[cookieName] = cookieValue;
            return acc;
        }, {});

        return cookies[name] ? JSON.parse(cookies[name]) : null;
    }

    function setCookies(name, value) {
        document.cookie = `${name}=${JSON.stringify(value)}; expires=Thu, 01 Jan 2030 00:00:00 UTC; path=/`;
    }
    let products = []

    function updateCart() {
        const cartItems = getCookies("cartItems") || [];
        cartItems.forEach((item) => {
            if (!products.includes(item.id)) {
                products.push(item.id);
            }
        });
        let totalSum = 0;

        productsItem.innerHTML = "";
        cartItems.forEach(item => {
            const div = document.createElement("div");
            div.classList = "pb-8 flex items-start flex-col sm:flex-row gap-5 lg:gap-[60px]";
            div.innerHTML = `
            <img src=${item.photo} class="w-[240px] h-[192px] object-cover" alt="">
            <div class="flex flex-col gap-6">
                <h2 class="font-medium text-lg text-[#313141]">${item.name}</h2>
                <span class="font-bold">${item.price}$</span>
                <button class="bg-[#406EC7] text-white rounded py-2 px-10" onclick="toggleProduct(${item.id},'${item.name}',${item.price},'${item.photo}')">Удалить из корзины</button>
            </div>
        `;
            productsItem.appendChild(div);
            totalSum += +item.price;
        });
        document.getElementById("priceTotal").textContent = totalSum + '$'
        document.getElementById("itemSum").textContent = cartItems.length
    }

    updateCart();
    setInterval(() => {
        updateCart();
    }, 1000)

    orderBtn.addEventListener('click', () => {
        const cartItems = getCookies("cartItems") || [];
        let total = 0;
        cartItems.forEach((item) => {
            total += Math.ceil(item.price)
        })

        let obj = {
            neme: names.value,
            surname: surnames.value,
            address: address.value,
            additional_address: address1.value,
            city: city.value,
            phone: phone.value,
            total: total,
            product: products,
            status: 'в_обработке'
        }
        console.log(obj)

        const url = 'http://195.49.210.86/api/orders/';

        if (agree.checked) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
            setCookies("cartItems", []);
            spinner.classList.remove("hidden")
            spinner.classList.add("flex")
            setTimeout(() => {
                modal.classList.remove("hidden")
                modal.classList.add("flex")
                spinner.classList.add("hidden")
                spinner.classList.remove("flex")
            }, 2000)
        }


    })
});
