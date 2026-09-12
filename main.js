
document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {

    const list = document.querySelector(".produkter");
    
    if (list) {
        fetchProducts();
    }

    const deleteList = document.querySelector(".delete-list"); 

    if (deleteList) {
        fetchProducts(); 
    }
}

async function fetchProducts() {

    let result = await fetch("http://localhost:5034/webshop/products", {
        method: "GET"
    });

    let data = await result.json();

    renderProductlist(data);
    renderDeletelist(data); 

};

function renderProductlist(products) {

    const selectedList = document.querySelector(".produkter")

    if (!selectedList) return;

    selectedList.innerHTML = ""; //Tömmer listan innan ny rendering

    products.forEach((product) => {

        selectedList.innerHTML += `
        <article class="produkt">
            <h3 class="p-namn">${product.productName}</h3>
            <p class="p-beskrivning">${product.description}</p>
            <p class="p-pris">${product.productPrice} kr</p>
        </article>
        `
    });
}; 

function renderDeletelist(products) {

    const selectedList = document.querySelector(".delete-list")

    if (!selectedList) return;

    selectedList.innerHTML = ""; //Tömmer listan innan ny rendering

    products.forEach((product) => {

        selectedList.innerHTML += `
        <article class="delete-produkt">
            <div class="information">
                <p class="p-namn"><strong>${product.productName}</strong></p>
                <p class="p-beskrivning">${product.description}</p>
                <p class="p-pris">${product.productPrice} kr</p>
            </div>
            <button class="submitBtn" type="submit">Ta bort produkt</button>
        </article>
        `
    });
};