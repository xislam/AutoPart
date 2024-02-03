const error404 = document.getElementById("error404");
const header = document.getElementById("header");
const content = document.getElementById("content");
const products = document.getElementById("products");

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
    if (user.is_superuser) {
        error404.classList.add("hidden");
        header.classList.remove("hidden");
        content.classList.remove("hidden")
    } else {
        error404.classList.remove("hidden");
        header.classList.add("hidden");
        content.classList.add("hidden")
    }


    fetch('https://seoulgarage.com/api/orders_admin/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            document.getElementById("counters").textContent = data.length
            data.forEach(element => {
                const div = document.createElement("div");
                div.classList = "w-full cardShadow p-4 lg:h-[170px] rounded-md flex items-center flex-col lg:flex-row justify-between gap-10";

                // Создаем контейнер для фотографий
                const bigContainer = document.createElement("div");
                bigContainer.classList = "flex flex-col gap-4 overflow-hidden  h-full"
                const imageContainer = document.createElement("div");
                imageContainer.id = "image";
                imageContainer.classList = "flex items-center gap-5 overflow-x-scroll md:w-[760px] py-1 h-[150px] rounded-full";

                // Добавляем каждую фотографию в контейнер
                element.product.forEach(product => {
                    const img = document.createElement("img");
                    img.src = product.fotos[0];
                    img.classList = "w-[90px] h-[90px] object-cover rounded-full";
                    imageContainer.appendChild(img);
                });

                // Добавляем информацию о количестве товаров
                const productCountSpan = document.createElement("span");
                productCountSpan.classList = "text-[#043E44] text-xs sm:text-sm";
                productCountSpan.innerHTML = `Количество товаров: <span>${element.product.length}</span>`;
                bigContainer.appendChild(productCountSpan);
                bigContainer.appendChild(imageContainer);
                div.appendChild(bigContainer);

                // Добавляем остальную информацию
                div.innerHTML += `
                    <div class="h-full sm:w-[350px] pr-10 flex flex-col gap-4">
                        <div class="flex justify-between w-full gap-5">
                            <div class="flex flex-col">
                                <span class="text-[#043E44] text-xs sm:text-sm">Заказ оформлен на:</span>
                                <h2 class="text-xl font-medium">${element.name} ${element.surname}</h2>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-[#043E44] text-xs sm:text-sm">Сумма заказа:</span>
                                <span class="text-xl font-medium">${element.total}$</span>
                            </div>
                        </div>
                        <a href="/admin_page/?id=${element.id}" class="font-medium bg-[#C9C9C9] px-4 py-1 rounded-md text-center hover:bg-[#0052cc] hover:text-white">Посмотреть заказ</a>
                    </div>
                `;
                products.appendChild(div);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});