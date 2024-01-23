const info = document.getElementById("info")
const history = document.getElementById("history")
const wish = document.getElementById("wish")
const wishes = document.getElementById("wishes")
const infos = document.getElementById("infos")
const historys = document.getElementById("historys")
const infoTab = document.getElementById("infoTab")
const save_btn = document.getElementById("save_btn")

info.addEventListener("click", () => {
    info.classList.add("botomsbr")
    history.classList.remove("botomsbr")
    wish.classList.remove("botomsbr")
    wishes.classList.add("hidden")
    historys.classList.add("hidden")
    infos.classList.remove("hidden")
})


wish.addEventListener("click", () => {
    info.classList.remove("botomsbr")
    history.classList.remove("botomsbr")
    wish.classList.add("botomsbr")
    wishes.classList.remove("hidden")
    historys.classList.add("hidden")
    infos.classList.add("hidden")
})

history.addEventListener("click", () => {
    info.classList.remove("botomsbr")
    history.classList.add("botomsbr")
    wish.classList.remove("botomsbr")
    wishes.classList.add("hidden")
    historys.classList.remove("hidden")
    infos.classList.add("hidden")
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
    console.log(user.access_token)

    // Получение истории данных
    fetch('https://seoulgarage.com/api/orders_list/', {
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
            console.log('Response data:', data);
            data.forEach(element => {
                const div = document.createElement("div")
                div.classList = "flex items-center justify-between flex-wrap gap-2";
                div.innerHTML = `
                <div class="w-[300px] md:w-[450px] lg:w-[500px] font-medium">
                    <span class="font-normal text-[#313141] mb-2">Продукт</span>
                    <p>${element.products}</p>
                </div>
                <div class="font-semibold">
                    <span class="font-normal text-[#313141] mb-2">Цена</span>
                    <p>${element.total}$</p>
                </div>
                <div class="w-[150px] font-medium ">
                    <span class="font-normal text-[#313141] mb-2">Статус</span>
                    <div class="flex items-center gap-4">
                        <svg width="24" height="24" class="w-6 h-6 rotate" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47716 6.47716 2 12 2C17.5229 2 22 6.47716 22 12C22 17.5229 17.5229 22 12 22C6.47716 22 2 17.5229 2 12Z" fill="#E4CFFF" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11 3C11 2.44772 11.4477 2 12 2C17.5229 2 22 6.47716 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4C11.4477 4 11 3.55228 11 3Z" fill="#8C50DF" />
                        </svg>
                        <span>${element.status}</span>
                    </div>
                </div>
                `
                historys.appendChild(div)
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // получение данных профиля
    fetch('https://seoulgarage.com/api/profile/', {
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
            document.getElementById("name").value = data.name
            document.getElementById("surname").value = data.surname
            document.getElementById("email").value = data.email
            document.getElementById("phone").value = data.phone_number
            document.getElementById("date").value = data.birthday
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function handleFav() {
        fetch('https://seoulgarage.com/api/favorite_products_list/', {
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
                wishes.innerHTML = ''
                window.handleDelete = function (id) {
                    console.log(id)
                    // ваша логика удаления
                    fetch(`https://seoulgarage.com/api/favorite_delete/${id}/`, {
                        method: 'DELETE',
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
                            console.log('Response data:', data);
                            // Возможно, добавить какую-то логику для обработки успешного удаления
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            // Возможно, добавить какую-то логику для обработки ошибки удаления
                        })
                        .finally(() => {
                            handleFav(); // Вызывается в любом случае, даже после ошибки
                        });
                }
                console.log('Response data:', data);
                data.forEach((item) => {
                    let div = document.createElement("div")
                    div.classList = "flex items-center justify-between flex-wrap gap-4 p-2"
                    div.innerHTML = `
                        <div class="w-[300px] md:w-[450px] lg:w-[500px] font-medium ">
                            <span class="font-normal text-[#313141] mb-2">Продукт</span>
                            <p>${item.product_info.name_product}</p>
                        </div>
                        <div class="font-semibold ">
                            <span class="font-normal text-[#313141] mb-2">Цена</span>
                            <p>${item.product_info.new_price ? item.product_info.new_price : item.product_info.old_price}$</p>
                        </div>
                        <div class="sm:w-[120px] font-medium flex flex-col items-center" onclick="handleDelete(${item.id})">
                            <span class="font-normal text-[#313141] mb-2">Избранный</span>
                            <svg width="25" height="24" class="text-black cursor-pointer" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.96 2.49312C15.7488 2.16628 16.5943 1.99805 17.4482 1.99805C18.302 1.99805 19.1475 2.16628 19.9363 2.49312C20.725 2.81991 21.4416 3.29885 22.0451 3.9026C22.6489 4.50615 23.1281 5.22306 23.4549 6.01173C23.7818 6.80054 23.95 7.64602 23.95 8.49987C23.95 9.35372 23.7818 10.1992 23.4549 10.988C23.1281 11.7768 22.6491 12.4934 22.0453 13.097L13.2053 21.937C12.8147 22.3275 12.1816 22.3275 11.7911 21.937L2.95106 13.097C1.73183 11.8778 1.04688 10.2241 1.04688 8.49987C1.04688 6.77562 1.73183 5.12199 2.95106 3.90277C4.17029 2.68354 5.82392 1.99858 7.54817 1.99858C9.27242 1.99858 10.926 2.68354 12.1453 3.90277L12.4982 4.25566L12.8509 3.90293C13.4545 3.29911 14.1713 2.81994 14.96 2.49312ZM17.4482 3.99805C16.857 3.99805 16.2717 4.11451 15.7256 4.34079C15.1795 4.56707 14.6833 4.89873 14.2654 5.31681L13.2053 6.37698C12.8147 6.7675 12.1816 6.7675 11.7911 6.37698L10.7311 5.31698C9.8869 4.47282 8.74198 3.99858 7.54817 3.99858C6.35435 3.99858 5.20943 4.47282 4.36527 5.31698C3.52112 6.16114 3.04688 7.30606 3.04688 8.49987C3.04688 9.69369 3.52112 10.8386 4.36527 11.6828L12.4982 19.8157L20.6311 11.6828C21.0491 11.2649 21.381 10.7685 21.6072 10.2224C21.8335 9.67633 21.95 9.091 21.95 8.49987C21.95 7.90875 21.8335 7.32341 21.6072 6.77731C21.381 6.23121 21.0493 5.73504 20.6312 5.31715C20.2133 4.89906 19.7168 4.56707 19.1707 4.34079C18.6246 4.11451 18.0393 3.99805 17.4482 3.99805Z" fill="currentColor" />
                                <path d="M11.8642 19.7501C12.04 19.9166 12.2691 19.9999 12.4982 19.9999C12.7273 19.9999 12.9563 19.9155 13.1321 19.7501L20.8109 12.5057C21.8994 11.454 22.4982 10.0565 22.4982 8.56864C22.4982 7.08082 21.8994 5.68211 20.8109 4.63161C18.5673 2.46026 14.9139 2.46026 12.6679 4.63161C12.6097 4.68671 12.5539 4.74416 12.4982 4.80396C12.4436 4.74416 12.3854 4.68671 12.3273 4.62926C10.0824 2.45674 6.42908 2.45674 4.18423 4.62926C3.09695 5.68094 2.49817 7.07965 2.49817 8.56747C2.49817 10.0553 3.09695 11.454 4.19271 12.5139L11.8642 19.7501Z" fill="currentColor" />
                            </svg>
                        </div>
                `
                    wishes.appendChild(div)
                })
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Получение избранных продуктов
    fetch('https://seoulgarage.com/api/favorite_products_list/', {
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
            console.log('Response data:', data);
            data.forEach((item) => {
                window.handleDelete = function (id) {
                    console.log(id)
                    // ваша логика удаления
                    fetch(`https://seoulgarage.com/api/favorite_delete/${id}/`, {
                        method: 'DELETE',
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
                            console.log('Response data:', data);
                            // Возможно, добавить какую-то логику для обработки успешного удаления
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            // Возможно, добавить какую-то логику для обработки ошибки удаления
                        })
                        .finally(() => {
                            handleFav(); // Вызывается в любом случае, даже после ошибки
                        });
                }
                let div = document.createElement("div")
                div.classList = "flex items-center justify-between flex-wrap gap-4 p-2"
                div.innerHTML = `
                        <div class="w-[300px] md:w-[450px] lg:w-[500px] font-medium ">
                            <span class="font-normal text-[#313141] mb-2">Продукт</span>
                            <p>${item.product_info.name_product}</p>
                        </div>
                        <div class="font-semibold ">
                            <span class="font-normal text-[#313141] mb-2">Цена</span>
                            <p>${item.product_info.new_price ? item.product_info.new_price : item.product_info.old_price}$</p> 
                        </div>
                        <div class="sm:w-[120px] font-medium flex flex-col items-center">
                            <span class="font-normal text-[#313141] mb-2">Избранный</span>
                            <svg width="25" height="24" class="text-black cursor-pointer" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" onclick="handleDelete(${item.id})">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.96 2.49312C15.7488 2.16628 16.5943 1.99805 17.4482 1.99805C18.302 1.99805 19.1475 2.16628 19.9363 2.49312C20.725 2.81991 21.4416 3.29885 22.0451 3.9026C22.6489 4.50615 23.1281 5.22306 23.4549 6.01173C23.7818 6.80054 23.95 7.64602 23.95 8.49987C23.95 9.35372 23.7818 10.1992 23.4549 10.988C23.1281 11.7768 22.6491 12.4934 22.0453 13.097L13.2053 21.937C12.8147 22.3275 12.1816 22.3275 11.7911 21.937L2.95106 13.097C1.73183 11.8778 1.04688 10.2241 1.04688 8.49987C1.04688 6.77562 1.73183 5.12199 2.95106 3.90277C4.17029 2.68354 5.82392 1.99858 7.54817 1.99858C9.27242 1.99858 10.926 2.68354 12.1453 3.90277L12.4982 4.25566L12.8509 3.90293C13.4545 3.29911 14.1713 2.81994 14.96 2.49312ZM17.4482 3.99805C16.857 3.99805 16.2717 4.11451 15.7256 4.34079C15.1795 4.56707 14.6833 4.89873 14.2654 5.31681L13.2053 6.37698C12.8147 6.7675 12.1816 6.7675 11.7911 6.37698L10.7311 5.31698C9.8869 4.47282 8.74198 3.99858 7.54817 3.99858C6.35435 3.99858 5.20943 4.47282 4.36527 5.31698C3.52112 6.16114 3.04688 7.30606 3.04688 8.49987C3.04688 9.69369 3.52112 10.8386 4.36527 11.6828L12.4982 19.8157L20.6311 11.6828C21.0491 11.2649 21.381 10.7685 21.6072 10.2224C21.8335 9.67633 21.95 9.091 21.95 8.49987C21.95 7.90875 21.8335 7.32341 21.6072 6.77731C21.381 6.23121 21.0493 5.73504 20.6312 5.31715C20.2133 4.89906 19.7168 4.56707 19.1707 4.34079C18.6246 4.11451 18.0393 3.99805 17.4482 3.99805Z" fill="currentColor" />
                                <path d="M11.8642 19.7501C12.04 19.9166 12.2691 19.9999 12.4982 19.9999C12.7273 19.9999 12.9563 19.9155 13.1321 19.7501L20.8109 12.5057C21.8994 11.454 22.4982 10.0565 22.4982 8.56864C22.4982 7.08082 21.8994 5.68211 20.8109 4.63161C18.5673 2.46026 14.9139 2.46026 12.6679 4.63161C12.6097 4.68671 12.5539 4.74416 12.4982 4.80396C12.4436 4.74416 12.3854 4.68671 12.3273 4.62926C10.0824 2.45674 6.42908 2.45674 4.18423 4.62926C3.09695 5.68094 2.49817 7.07965 2.49817 8.56747C2.49817 10.0553 3.09695 11.454 4.19271 12.5139L11.8642 19.7501Z" fill="currentColor" />
                            </svg>
                        </div>
                `
                wishes.appendChild(div)
            })
        })
        .catch(error => {
            console.error('Error:', error);
        });

    save_btn.addEventListener('click', () => {
        var username = getSecureCookie('userData');
        let user = JSON.parse(username);
        let apiUrl = 'https://seoulgarage.com/api/profile/';

        let userUpdateData = {
            birthday: document.getElementById("date").value,
            email: document.getElementById("email").value,
            surname: document.getElementById("surname").value,
            name: document.getElementById("name").value,
            phone_number: document.getElementById("phone").value,
            password: document.getElementById("password").value
        };

        let userUpdateDatas = {
            birthday: document.getElementById("date").value,
            email: document.getElementById("email").value,
            surname: document.getElementById("surname").value,
            name: document.getElementById("name").value,
            phone_number: document.getElementById("phone").value,
        };

        const passwordVal = document.getElementById("password").value === '' ? userUpdateDatas : userUpdateData
        console.log(passwordVal)

        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`
            },
            body: JSON.stringify(passwordVal)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('PATCH request successful. Response:', data);
            })
            .catch(error => {
                console.error('Error during PATCH request:', error);
                // Handle errors
            });
    });

});