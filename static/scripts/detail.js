const description = document.getElementById("description")
const detail = document.getElementById("detail")
const text = document.getElementById("text")
const details = document.getElementById("details")
const btn_add = document.getElementById("btn_add")

let count = 0
let totalCount = 1
let isfav = null

description.addEventListener("click", () => {
    text.classList.remove("hidden")
    details.classList.add("hidden")
    description.classList.add("botomsbr")
    detail.classList.remove("botomsbr")
})

detail.addEventListener("click", () => {
    text.classList.add("hidden")
    details.classList.remove("hidden")
    description.classList.remove("botomsbr")
    detail.classList.add("botomsbr")
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
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    var username = getSecureCookie('userData');
    let user = JSON.parse(username);
    console.log(user)

    let token = user ? {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.access_token,
    } : {
        'Content-Type': 'application/json',
    }

    function handleInfos(id) {
        fetch(`https://seoulgarage.com/api/products/${id}/`, {
            method: 'GET',
            headers: token,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.is_favorite) {
                    document.getElementById("like").classList.remove('text-[#E3E5EE]')
                    document.getElementById("like").classList.add('text-black')
                } else {
                    document.getElementById("like").classList.remove('text-black')
                    document.getElementById("like").classList.add('text-[#E3E5EE]')
                }

                data.product.fotos.forEach(element => {
                    let div = document.createElement("swiper-slide")
                    div.innerHTML = `
                    <a href=${element} data-fancybox="gallerys"><img src = ${element} class="block w-full h-[380px] object-cover rounded-md" alt = "..." ></a>`
                    document.getElementById("popular").appendChild(div);
                });

                text.textContent = data.product.product_information
                document.getElementById("mainTitle").textContent = data.product.name_product
                if (!data.product.new_price) {
                    document.getElementById("new_price").textContent = data.product.old_price + '$'
                } else {
                    document.getElementById("old_price").textContent = data.product.old_price + '$'
                    document.getElementById("new_price").textContent = data.product.new_price + '$'
                }
                isfav = data.product.is_favorite
                document.getElementById("number_det").textContent = data.product.detail_number
                document.getElementById("vin").textContent = data.product.v_i_n
                document.getElementById("code").textContent = data.product.code_product
                document.getElementById("color").textContent = data.product.external_color
                document.getElementById("year").textContent = data.product.model_year
                document.getElementById("mainPhoto").src = data.product.fotos[0]
                document.getElementById("photo1").src = data.product.fotos[1]
                document.getElementById("photo2").src = data.product.fotos[2]
                document.getElementById("photo3").src = data.product.fotos[3]
                document.getElementById("mainBlock").href = data.product.fotos[0]
                document.getElementById("block1").href = data.product.fotos[1]
                document.getElementById("block2").href = data.product.fotos[2]
                document.getElementById("block3").href = data.product.fotos[3]

                data.product.fotos.splice(4).forEach((item) => {
                    let a = document.createElement("a");
                    a.setAttribute("data-fancybox", "gallery");
                    a.classList = "absolute top-0 left-0"
                    a.href = item
                    a.innerHTML = `
                        <img src=${item} id="photo3" class="w-[180px] md:w-[250px] lg:w-[180px] h-[144px] hidden  md:h-[200px] lg:h-[144px]" alt="">
                    `
                    document.getElementById("galleries").appendChild(a)
                })

                document.getElementById('btn_add').addEventListener('click', () => {
                    console.log('mnknasfjak')
                    data.product.new_price ?
                        toggleProduct(data.product.id, data.product.name_product, data.product.new_price, data.product.fotos[0])
                        :
                        toggleProduct(data.product.id, data.product.name_product, data.product.old_price, data.product.fotos[0])
                })

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

                function handleLoad() {
                    if (count === totalCount / 4) {
                        return;
                    } else {
                        document.getElementById("similarProd").innerHTML = ""
                        const optionObj = {
                            car_info__car_name__icontains: data.product.car_info.car_name,
                            page: ++count,
                            page_size: 4
                        }
                        console.log(optionObj)
                        const queryString = Object.keys(optionObj)
                            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(optionObj[key]))
                            .join('&');
                        const api = 'https://seoulgarage.com/api/products_s/?' + queryString;
                        fetch(api, {
                            method: 'GET',
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                totalCount = data.count
                                data.results.forEach((element) => {
                                    const div = document.createElement("div")
                                    div.classList = "flex flex-col gap-4 overflow-hidden w-[768px] md:w-[300px] lg:w-[380px] shadow-sm rounded-md pb-12 relative"
                                    div.innerHTML = `
                                <a href="/detail.html?id=${element.id}">
                                    <img src=${element.fotos[0]} class="w-[768px] md:w-[300px] lg:w-[380px] sm:h-[380px] h-[280px] md:h-[300px] lg:h-[380px] hover:opacity-80 object-cover rounded-md" alt="product">
                                </a>
                                <h3 class="text-lg px-2 sm:text-xl font-semibold">${element.name_product}</h3>
                                <p class="px-2">${element.product_information.split("").slice(0, 20).join("")}...</p>
                                <div class="flex items-center gap-6 absolute left-2 bottom-3">
                                    <span class="text-[#F11313] font-bold text-xl">${element.new_price ? element.new_price : element.old_price}$</span>
                                    <span class="text-[#7A859E] line-through ${element.new_price ? "" : "hidden"}">${element.old_price}$</span>
                                </div>
                                `
                                    document.getElementById("similarProd").appendChild(div)
                                })
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    }
                }

                function handleLoadPrev() {
                    if (count === 1) {
                        return;
                    } else {
                        document.getElementById("similarProd").innerHTML = ""
                        const optionObj = {
                            car_info__car_name__icontains: data.product.car_info.car_name,
                            page: --count,
                            page_size: 4
                        }
                        console.log(optionObj)
                        const queryString = Object.keys(optionObj)
                            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(optionObj[key]))
                            .join('&');
                        const api = 'https://seoulgarage.com/api/products_s/?' + queryString;
                        fetch(api, {
                            method: 'GET',
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                data.results.forEach((element) => {
                                    const div = document.createElement("div")
                                    div.classList = "flex flex-col gap-4 overflow-hidden w-[768px] md:w-[300px] lg:w-[380px] shadow-sm rounded-md pb-12 relative"
                                    div.innerHTML = `
                                <a href="/detail.html?id=${element.id}">
                                    <img src=${element.fotos[0]} class="w-[768px] md:w-[300px] lg:w-[380px] sm:h-[380px] h-[280px] md:h-[300px] lg:h-[380px] hover:opacity-80 object-cover rounded-md" alt="product">
                                </a>
                                <h3 class="text-lg px-2 sm:text-xl font-semibold">${element.name_product}</h3>
                                <p class="px-2">${element.product_information.split("").slice(0, 20).join("")}...</p>
                                <div class="flex items-center gap-6 absolute left-2 bottom-3">
                                    <span class="text-[#F11313] font-bold text-xl">${element.new_price ? element.new_price : element.old_price}$</span>
                                    <span class="text-[#7A859E] line-through ${element.new_price ? "" : "hidden"}">${element.old_price}$</span>
                                </div>
                                `
                                    document.getElementById("similarProd").appendChild(div)
                                })
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    }
                }
                handleLoad()
                document.getElementById("next").addEventListener("click", handleLoad)
                document.getElementById("prev").addEventListener("click", handleLoadPrev)

            })
            .catch(error => {
                console.error('Произошла ошибка:', error);
            });
    }
    handleInfos(id)

    document.getElementById("like").addEventListener('click', () => {
        if (document.getElementById("like").classList.contains('text-black')) {
            const apiUrl = `https://seoulgarage.com/api/favorite_delete/${isfav}/`;
            fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.access_token,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    if (response.status === 204) {
                        console.log('Resource deleted successfully.');

                        return;
                    }
                    return response.json();
                })
                .then(data => {
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    handleInfos(id)
                })
        } else {
            if (user) {
                const url = 'https://seoulgarage.com/api/favorite_products/';
                let obj = {
                    product: id
                }

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user.access_token,
                    },
                    body: JSON.stringify(obj),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Успешный ответ:', data);
                        document.getElementById("like").classList.add("text-black")
                        handleInfos(id)
                    })
                    .catch(error => {
                        console.error('Произошла ошибка:', error);
                    });
            } else {
                window.location.href = '/signin.html'
            }
        }

    })

});