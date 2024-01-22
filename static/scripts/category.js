document.addEventListener("DOMContentLoaded", function () {
    const categoris = document.getElementById("categoris")
    const mobcat = document.getElementById("mobcat")
    const search = document.getElementById("search")
    const btnSearch = document.getElementById("btnSearch")
    const errorValid = document.getElementById("errorValid")

    fetch("https://seoulgarage.com/api/categories/")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(element => {
                const div = document.createElement("div");
                div.classList = "font-semibold uppercase cursor-pointer w-full w-[500px]";
                div.innerHTML = `
                    <p onclick="prodLink('${element.name}')" class="text-center w-[500px]">${element.name}</p>
                `
                categoris.appendChild(div);
            });

            data.forEach((item) => {
                const li = document.createElement("li")
                li.classList = "uppercase text-end"
                li.textContent = item.name
                li.setAttribute("onclick", `prodLink('${item.name + ','}')`)
                mobcat.appendChild(li)
            })
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });

    window.prodLink = function (value) {
        console.log(value)
        const object = {
            car_info__car_name__icontains: "",
            model_year__gte: "",
            model_year__lte: "",
            name_product: value,
            page: 1,
            page_size: 16
        }

        console.log(object)

        setSecureCookie('filterItem', JSON.stringify(object), 30)
        window.location.href = "/products.html"
    }

    btnSearch.addEventListener("click", () => {
        if (search.value.trim() === "") {
            errorValid.classList.remove("hidden")
            return;
        } else {
            errorValid.classList.add("hidden")
            const object = {
                name_product__icontains: search.value,
                page: 1,
                page_size: 16,
            }

            console.log(object)

            setSecureCookie('searchItem', JSON.stringify(object), 30)
            window.location.href = "/products.html"
        }
    })
});