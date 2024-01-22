const productImg = document.getElementById("productImg");
const filters = document.getElementById("filters")
const filtersBlock = document.getElementById("filtersBlock")
const closeFilter = document.getElementById("closeFilter")
const openFilter = document.getElementById("openFilter")
const oneFilter = document.getElementById("oneFilter")
const moreFilter = document.getElementById("moreFilter")
const closeOneFilter = document.getElementById("closeOneFilter")

// filter
const mark = document.getElementById("mark")
const model = document.getElementById("model")
const part = document.getElementById("part")
const startDate = document.getElementById("startDate")
const endDate = document.getElementById("endDate")
const btnShow = document.getElementById("btnShow")

const selectedValues = [];
let count = 0;
let totalCount = 1;

let nexter = '';
let prever = '';


var userfil = getSecureCookie('filterItem');
let filterData = JSON.parse(userfil);
console.log(filterData)

var username = getSecureCookie('userData');
let user = JSON.parse(username);
console.log(user)

var searchValue = getSecureCookie('searchItem');
let search = JSON.parse(searchValue);
console.log(search)

let tokens = user ? {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + user.access_token,
} : {
    'Content-Type': 'application/json',
}


openFilter.addEventListener("click", () => {
    filters.classList.remove("hidden")
    filters.classList.add("flex")
    filtersBlock.classList.add("animate-right")
    filtersBlock.classList.remove("animate-left")
})

closeFilter.addEventListener("click", () => {
    filtersBlock.classList.remove("animate-right")
    filtersBlock.classList.add("animate-left")
    setTimeout(() => {
        filters.classList.add("hidden")
        filters.classList.add("flex")
    }, 500)
})

moreFilter.addEventListener('click', () => {
    oneFilter.classList.add("flex")
    oneFilter.classList.remove("hidden")
    oneFilter.classList.add("animate-right")
    oneFilter.classList.remove("animate-left")
})

closeOneFilter.addEventListener('click', () => {
    oneFilter.classList.remove("animate-right")
    oneFilter.classList.add("animate-left")
    setTimeout(() => {
        oneFilter.classList.remove("flex")
        oneFilter.classList.add("hidden")
    }, 500)
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

document.addEventListener('DOMContentLoaded', function () {
    // фильтр
    fetch('https://seoulgarage.com/api/carmakes/')
        .then(response => response.json())
        .then(data => {
            data.forEach(function (value) {
                var optionElement = document.createElement("option");
                optionElement.value = value.make;
                optionElement.text = value.make;
                mark.add(optionElement);
            });
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });

    mark.addEventListener("change", () => {
        const url = 'https://seoulgarage.com/api/carnames/';

        const car_make__make = 'car_make__make';
        const paramValue = mark.value;

        const fullUrl = `${url}?${encodeURIComponent(car_make__make)}=${encodeURIComponent(paramValue)}`;

        fetch(fullUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                model.innerHTML = ''
                let opt = document.createElement("option")
                opt.value = "";
                opt.text = "Выберите модель";
                model.appendChild(opt)
                data.forEach(function (value) {
                    var optionElement = document.createElement("option");
                    optionElement.value = value.car_name;
                    optionElement.text = value.car_name;
                    model.add(optionElement);
                });
            })
            .catch(error => {
                console.error('Произошла ошибка:', error);
            });

        fetch('https://seoulgarage.com/api/categories/')
            .then(response => response.json())
            .then(data => {
                data.forEach(function (value) {
                    var optionElement = document.createElement("option");
                    optionElement.value = value.name;
                    optionElement.text = value.name;
                    part.add(optionElement);
                });
            })
            .catch(error => {
                console.error('Произошла ошибка:', error);
            });
    });
});

function handleMouseEnter() {
    const productImg = this.querySelector("#productImg");
    const productImg1 = this.querySelector("#productImg1");
    productImg.classList.add("hidden");
    productImg1.classList.remove("hidden");
}

function handleMouseLeave() {
    const productImg = this.querySelector("#productImg");
    const productImg1 = this.querySelector("#productImg1");
    productImg.classList.remove("hidden");
    productImg1.classList.add("hidden");
}

function cardData(data) {
    data.results.forEach((item) => {
        const div = document.createElement("div");
        div.classList = "w-full sm:w-[220px] flex flex-col gap-6 shadow-sm rounded-md p-3 ";
        div.innerHTML = `
                    <a href="/detail.html?id=${item.id}" id="twoPhoto">
                        <img src=${item.fotos[0]} id="productImg" class="w-full rounded-md hover:opacity-80 sm:w-[220px] h-[350px] sm:h-[220px] object-cover cursor-pointer" alt="img">
                        <img src=${item.fotos[1]} id="productImg1" class="w-full rounded-md hover:opacity-80 sm:w-[220px] h-[350px] sm:h-[220px] object-cover cursor-pointer hidden" alt="img">
                    </a>
                    <div class="flex flex-col gap-4 relative h-full pb-12">
                        <h2 class="text-lg font-semibold">${item.name_product}</h2>
                        <p class="text-sm text-[#313141]">${item.product_information.split("").slice(0, 40).join("")}</p>
                        <div class="flex items-center justify-between w-full absolute bottom-2">
                            <span class="text-[#F11313] font-bold text-xl">${item.new_price ? item.new_price : item.old_price}$</span>
                            <span class="text-[#7A859E] line-through ${item.new_price ? "" : "hidden"}">${item.old_price}$</span>
                            <svg width="28" height="28" onclick="${item.is_favorite ? `deleteFavorite('${item.is_favorite}')` : `addFavorite('${item.id}')`}" class="cursor-pointer ${item.is_favorite ? 'text-black' : 'text-[#E3E5EE]'}" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8726 2.90864C17.7929 2.52732 18.7793 2.33105 19.7755 2.33105C20.7716 2.33105 21.758 2.52732 22.6783 2.90864C23.5984 3.28989 24.4344 3.84866 25.1386 4.55303C25.8429 5.25718 26.4021 6.09356 26.7833 7.01368C27.1647 7.93396 27.3609 8.92036 27.3609 9.91652C27.3609 10.9127 27.1647 11.8991 26.7833 12.8194C26.4021 13.7396 25.8432 14.5756 25.1388 15.2798L14.8254 25.5931C14.3698 26.0488 13.6311 26.0488 13.1755 25.5931L2.86217 15.2798C1.43974 13.8574 0.640625 11.9281 0.640625 9.91652C0.640625 7.90489 1.43974 5.97566 2.86217 4.55323C4.28461 3.13079 6.21384 2.33168 8.22546 2.33168C10.2371 2.33168 12.1663 3.13079 13.5888 4.55323L14.0005 4.96494L14.412 4.55342C15.1162 3.84896 15.9524 3.28993 16.8726 2.90864ZM19.7755 4.66439C19.0858 4.66439 18.4029 4.80027 17.7658 5.06426C17.1287 5.32825 16.5498 5.71518 16.0623 6.20295L14.8254 7.43981C14.3698 7.89542 13.6311 7.89542 13.1755 7.43981L11.9388 6.20314C10.954 5.21829 9.61825 4.66501 8.22546 4.66501C6.83268 4.66501 5.49694 5.21829 4.51209 6.20314C3.52724 7.18799 2.97396 8.52373 2.97396 9.91652C2.97396 11.3093 3.52724 12.645 4.51209 13.6299L14.0005 23.1183L23.4888 13.6299C23.9766 13.1424 24.3637 12.5633 24.6277 11.9262C24.8917 11.2891 25.0276 10.6062 25.0276 9.91652C25.0276 9.22687 24.8917 8.54398 24.6277 7.90686C24.3637 7.26974 23.9768 6.69088 23.489 6.20334C23.0015 5.71557 22.4222 5.32825 21.7851 5.06426C21.148 4.80026 20.4651 4.66439 19.7755 4.66439Z" fill="currentColor"/>
                                <path d="M13.2609 23.0418C13.4659 23.2361 13.7332 23.3332 14.0005 23.3332C14.2677 23.3332 14.535 23.2347 14.7401 23.0418L23.6986 14.59C24.9685 13.363 25.6671 11.7325 25.6671 9.99675C25.6671 8.26096 24.9685 6.62913 23.6986 5.40354C21.0811 2.8703 16.8188 2.8703 14.1984 5.40354C14.1306 5.46783 14.0655 5.53485 14.0005 5.60461C13.9368 5.53485 13.8689 5.46783 13.8011 5.40081C11.1821 2.8662 6.91986 2.8662 4.30087 5.40081C3.03238 6.62776 2.3338 8.25959 2.3338 9.99538C2.3338 11.7312 3.03238 13.363 4.31077 14.5995L13.2609 23.0418Z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                `;
        document.getElementById("placeProd").appendChild(div);
        const productCard = div.querySelector("#twoPhoto");
        productCard.addEventListener("mouseenter", handleMouseEnter);
        productCard.addEventListener("mouseleave", handleMouseLeave);
    })
}


async function handleUpdateData(token, filters, name) {
    try {
        console.log(name);
        filters.name_product = name;
        const queryString = Object.keys(filters)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(filters[key]))
            .join('&');
        const api = 'https://seoulgarage.com/api/products/?' + queryString;

        const response = await fetch(api, {
            method: 'GET',
            headers: token
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        document.getElementById("placeProd").innerHTML = "";
        document.getElementById("product_total").textContent = data.count;

        if (data) {
            nexter = data.nexter
            prever = data.previous
            totalCount = data.count
            cardData(data)
            function handleLoad() {
                if (count === totalCount / 4) {
                    return;
                } else {
                    const optionObj = {
                        car_info__car_name__icontains: filterData.car_info__car_name__icontains === "" ? '' : data.product.car_info.car_name,
                        page: ++count,
                        page_size: 16
                    }
                    const queryString = Object.keys(optionObj)
                        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(optionObj[key]))
                        .join('&');
                    const api = 'https://seoulgarage.com/api/products/?' + queryString;
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
                            document.getElementById("placeProd").innerHTML = "";
                            cardData(data)
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
                    const optionObj = {
                        car_info__car_name__icontains: filterData.car_info__car_name__icontains === "" ? '' : data.product.car_info.car_name,
                        page: --count,
                        page_size: 16
                    }
                    const queryString = Object.keys(optionObj)
                        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(optionObj[key]))
                        .join('&');
                    const api = 'https://seoulgarage.com/api/products/?' + queryString;
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
                            document.getElementById("placeProd").innerHTML = "";
                            cardData(data)
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            }

            document.getElementById("next").addEventListener("click", handleLoad)
            document.getElementById("prev").addEventListener("click", handleLoadPrev)
        } else {
            document.getElementById("placeProd").innerText = "Ничего не найдено";
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleUpdateDataSearch(token, filters) {
    try {
        console.log(filters);
        const queryString = Object.keys(filters)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(filters[key]))
            .join('&');
        const api = 'https://seoulgarage.com/api/products_s/?' + queryString;

        const response = await fetch(api, {
            method: 'GET',
            headers: token
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        document.getElementById("placeProd").innerHTML = "";
        document.getElementById("product_total").textContent = data.count;

        if (data) {
            nexter = data.nexter
            prever = data.previous
            totalCount = data.count
            cardData(data)
            function handleLoad() {
                if (count === totalCount / 4) {
                    return;
                } else {
                    const optionObj = {
                        name_product__icontains: search.name_product__icontains,
                        page: ++count,
                        page_size: 16
                    }
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
                            document.getElementById("placeProd").innerHTML = "";
                            cardData(data)
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
                    const optionObj = {
                        name_product__icontains: search.name_product__icontains,
                        page: --count,
                        page_size: 16
                    }
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
                            document.getElementById("placeProd").innerHTML = "";
                            cardData(data)
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            }
            document.getElementById("next").addEventListener("click", handleLoad)
            document.getElementById("prev").addEventListener("click", handleLoadPrev)
        } else {
            document.getElementById("placeProd").innerText = "Ничего не найдено";
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleCategory() {
    try {
        var userfil = getSecureCookie('filterItem');
        let filterData = JSON.parse(userfil);
        const resultArray = selectedValues.map(item => item.trim());
        console.log(resultArray)

        if (filterData.car_info__car_name__icontains.trim() === "" && filterData.name_product.trim() === "") {
            document.getElementById("categor").innerHTML = ''
            setSecureCookie('filterItem', JSON.stringify(""), 30);
            const response = await fetch('https://seoulgarage.com/api/products_category/');
            const data = await response.json();
            console.log(data);

            data.splice(0, 10).forEach(element => {
                const div = document.createElement("div");
                div.classList = "flex items-center justify-between";
                div.innerHTML = `
                    <div class="flex items-center gap-5">
                        <input type="checkbox" class="min-w-5" name=${element.name} id=${element.name} value=${element.name.split(" ").join("?")}>
                        <label for=${element.name}></label>
                        <span>${element.name}</span>
                    </div>
                    <span>(${element.product_count})</span>
                `;

                const checkbox = div.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', function () {
                    if (checkbox.checked) {
                        console.log(checkbox.value.split("?").join(" "))
                        selectedValues.push(checkbox.value.split("?").join(" "));
                        handleUpdateData(tokens, filterData, resultArray.join(""));
                    } else {
                        const index = selectedValues.indexOf(checkbox.value.split("?").join(" "));
                        console.log(index);
                        if (index !== -1) {
                            selectedValues.splice(index, 1);
                        }
                    }
                    console.log('Выбранные значения:', selectedValues);
                });

                document.getElementById("categor").appendChild(div);
            });
            data.forEach(element => {
                const div = document.createElement("div");
                div.classList = "flex items-center justify-between";
                div.innerHTML = `
                    <div class="flex items-center gap-5">
                        <input type="checkbox" class="min-w-5" name=${element.name} id=${element.name} value=${element.name.split(" ").join("?")}>
                        <label for=${element.name}></label>
                        <span>${element.name}</span>
                    </div>
                    <span>(${element.product_count})</span>
                `;

                const checkbox = div.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', function () {
                    if (checkbox.checked) {
                        console.log(checkbox.value.split("?").join(" "))
                        selectedValues.push(checkbox.value.split("?").join(" "));
                        handleUpdateData(tokens, filterData, resultArray.join(""));
                    } else {
                        const index = selectedValues.indexOf(checkbox.value.split("?").join(" "));
                        console.log(index);
                        if (index !== -1) {
                            selectedValues.splice(index, 1);
                        }
                    }
                    console.log('Выбранные значения:', selectedValues);
                });

                document.getElementById("filtBlock").appendChild(div);
            });
        } else {
            setSecureCookie('searchItem', JSON.stringify(""), 30);
            document.getElementById("categor").innerHTML = ''
            const response = await fetch(`https://seoulgarage.com/api/products_category/?car_name=${filterData.car_info__car_name__icontains}`);
            const data = await response.json();
            console.log(data);

            data.splice(0, 10).forEach(element => {
                const div = document.createElement("div");
                div.classList = "flex items-center justify-between";
                div.innerHTML = `
                    <div class="flex items-center gap-5">
                        <input type="checkbox" class="w-5" name=${element.name} id=${element.name} value=${element.name.split(" ").join("?")}>
                        <label for=${element.name}></label>
                        <span>${element.name}</span>
                    </div>
                    <span>(${element.product_count})</span>
                `;

                const checkbox = div.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', function () {
                    if (checkbox.checked) {
                        console.log(checkbox.value.split("?").join(" "))
                        selectedValues.push(checkbox.value.split("?").join(" "));
                        handleUpdateData(tokens, filterData, resultArray.join(""));
                    } else {
                        const index = selectedValues.indexOf(checkbox.value.split("?").join(" "));
                        console.log(index);
                        if (index !== -1) {
                            selectedValues.splice(index, 1);
                        }
                    }
                    console.log('Выбранные значения:', selectedValues);
                });

                document.getElementById("categor").appendChild(div);
            });
            data.forEach(element => {
                const div = document.createElement("div");
                div.classList = "flex items-center justify-between";
                div.innerHTML = `
                    <div class="flex items-center gap-5">
                        <input type="checkbox" class="min-w-5" name=${element.name} id=${element.name} value=${element.name.split(" ").join("?")}>
                        <label for=${element.name}></label>
                        <span>${element.name}</span>
                    </div>
                    <span>(${element.product_count})</span>
                `;

                const checkbox = div.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', function () {
                    if (checkbox.checked) {
                        console.log(checkbox.value.split("?").join(" "))
                        selectedValues.push(checkbox.value.split("?").join(" "));
                        handleUpdateData(tokens, filterData, resultArray.join(""));
                    } else {
                        const index = selectedValues.indexOf(checkbox.value.split("?").join(" "));
                        console.log(index);
                        if (index !== -1) {
                            selectedValues.splice(index, 1);
                        }
                    }
                    console.log('Выбранные значения:', selectedValues);
                });

                document.getElementById("filtBlock").appendChild(div);
            });
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

if (filterData) {
    handleCategory()
    handleUpdateData(tokens, filterData, filterData.name_product)
} else {
    handleUpdateDataSearch(tokens, search)
}

function preload() {
    if (filterData) {
        handleUpdateData(tokens, filterData, filterData.name_product)
    } else {
        handleUpdateDataSearch(tokens, search)
    }
}

btnShow.addEventListener("click", () => {
    var username = getSecureCookie('userData');
    let user = JSON.parse(username);

    let tokens = user ? {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.access_token,
    } : {
        'Content-Type': 'application/json',
    }
    const object = {
        car_info__car_name__icontains: model.value,
        model_year__gte: startDate.value,
        model_year__lte: endDate.value,
        name_product: part.value,
        page: 1,
        page_size: 16
    }

    const queryString = Object.keys(object)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(object[key]))
        .join('&');
    const api = 'https://seoulgarage.com/api/products/?' + queryString;
    fetch(api, {
        method: 'GET',
        headers: tokens
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            document.getElementById("placeProd").innerHTML = ""
            document.getElementById("product_total").textContent = data.results.length
            if (data.results.length > 0) {
                cardData(data)
            } else {
                document.getElementById("placeProd").innerText = "Ничего не найдено"
            }


            handleCategory()

        })
        .catch(error => {
            console.error('Error:', error);
        });
})

const deleteFavorite = (id) => {
    const apiUrl = `https://seoulgarage.com/api/favorite_delete/${id}/`;
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
            console.log('Resource deleted successfully.');
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            preload();
        });
};

const addFavorite = (productId) => {
    const favUrl = 'https://seoulgarage.com/api/favorite_products/';
    if (user) {
        const obj = {
            product: productId
        };

        fetch(favUrl, {
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

            })
            .catch(error => {
                console.error('Произошла ошибка:', error);
            })
            .finally(() => preload());
    } else {
        window.location.href = '/signin.html';
    }
};


