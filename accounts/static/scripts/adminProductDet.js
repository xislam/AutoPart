const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

var username = getSecureCookie('userData');
let user = JSON.parse(username);
console.log(user)
console.log(id)

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

document.getElementById("open_modal").addEventListener('click', () => {
    document.getElementById("modal").classList.remove("hidden")
    document.getElementById("modal").classList.add("flex")
})

document.getElementById("close_modal").addEventListener('click', () => {
    document.getElementById("modal").classList.add("hidden")
    document.getElementById("modal").classList.remove("flex")
})

document.addEventListener('DOMContentLoaded', function () {
    handleData()
})

function handleData() {
    document.getElementById("count").textContent = id;
    fetch(`https://seoulgarage.com/api/orders_admin/${id}/`, {
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
            document.getElementById("names").textContent = data.name + " " + data.surname
            document.getElementById("city").textContent = data.city
            document.getElementById("adress").textContent = data.address
            document.getElementById("add_adress").textContent = data.additional_address
            document.getElementById("create_date").textContent = data.create_date.slice(0, 10)
            document.getElementById("phone").textContent = data.phone
            document.getElementById("status").textContent = data.status
            document.getElementById("totalSum").textContent = data.total + "$"
            document.getElementById("placeProd").innerHTML = ""
            document.getElementById("counter").textContent = data.product.length
            data.product.forEach(item => {
                const div = document.createElement("div");
                div.classList = "w-full flex gap-6 shadow-md rounded-md flex-col sm:flex-row p-3 sm:h-[180px]";
                div.innerHTML = `
                    <a href="/api/detail/?id=${item.id}" id="twoPhoto">
                        <img src=${item.fotos[0]} id="productImg" class="w-full rounded-md hover:opacity-80 sm:w-[220px] h-[350px] sm:h-[150px] object-cover cursor-pointer" alt="img">
                    </a>
                    <div class="flex flex-col gap-4 relative h-full pb-12 w-full">
                        <h2 class="text-lg font-semibold">${item.name_product}</h2>
                        <p class="text-sm text-[#313141]">${item.product_information.split("").slice(0, 40).join("")}</p>
                        <div class="flex items-center justify-between w-full absolute bottom-2">
                            <span class="text-[#F11313] font-bold text-xl">${item.new_price ? item.new_price : item.old_price}$</span>
                            <span class="text-[#7A859E] line-through ${item.new_price ? "" : "hidden"}">${item.old_price}$</span>
                        </div>
                        <a href="/api/detail/?id=${item.id}" class="px-7 text-center rounded-md py-1 text-white font-medium bg-[#0052cc] absolute bottom-3 right-3">Посмотреть</a>
                    </div>
                `;
                document.getElementById("placeProd").appendChild(div);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

document.getElementById("btn_save").addEventListener("click", () => {
    if (document.getElementById("select_status").value === '') {
        return
    }
    const patchData = {
        status: document.getElementById("select_status").value
    };

    fetch(`https://seoulgarage.com/api/orders_admin/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(patchData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети или сервера');
            }
            return response.json();
        })
        .then(data => {
            console.log('Данные успешно обновлены:', data);
            document.getElementById("modal").classList.add("hidden")
            document.getElementById("modal").classList.remove("flex")
            handleData()
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });

})

document.getElementById("delete_btn").addEventListener("click", () => {
    fetch(`https://seoulgarage.com/api/orders_admin/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.access_token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети или сервера');
            }
            if (response.status === 204) { // Проверка на пустой ответ
                return null;

            }
            return response.json();
        })
        .then(data => {

        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        })
        .finally(() => window.location.href = '/api/admin_order')

})