const popular = document.getElementById("popular")

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://seoulgarage.com/api/popular_products/', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            data.forEach(element => {
                console.log(data)
                const div = document.createElement("swiper-slide")
                div.innerHTML = `
                <div class="flex flex-col gap-4 overflow-hidden" >
                <a href="/detail.html?id=${element.id}">
                    <img src=${element.fotos[0]} class="w-[200px] hover:opacity-80 h-[200px] sm:w-[380px] sm:h-[380px] object-cover rounded-md" alt="product">
                </a>
                <h3 class="text-lg sm:text-xl font-semibold">${element.name_product}</h3>
                <p class="pl-2">${element.product_information.split("").slice(0, 20).join("")}</p>
                <div class="flex items-center gap-6">
                    <span class="text-[#F11313] font-bold text-xl">${element.new_price ? element.new_price : element.old_price}$</span>
                    <span class="text-[#7A859E] line-through ${element.new_price ? "" : "hidden"}">${element.old_price}$</span>
                </div>
                </div>
                `
                popular.appendChild(div)
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});