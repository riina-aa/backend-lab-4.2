
document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {

    changeMenu()

    const list = document.querySelector(".produkter");

    if (list) {
        fetchProducts();
    }

    const deleteList = document.querySelector(".delete-list");

    if (deleteList) {
        fetchProducts();
    }

    const loginBtn = document.querySelector("#login-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "login.html"
        });
    }

    const loginForm = document.querySelector(".loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", loginUser)
    }

    const registerForm = document.querySelector(".registerForm"); 

    if(registerForm) {
        registerForm.addEventListener("submit", registerUser)
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

function changeMenu() {

    const menu = document.querySelector(".menu")

    if (localStorage.getItem("webshop-token")) {
        menu.innerHTML = `
            <li><a href="index.html">Hem</a></li>
            <li><a href="admin.html">Admin</a></li>
            <li><button class="submitBtn" id="logout-btn">Logga ut</button></li>
        `
    } else {
        menu.innerHTML = `
            <li><a href="index.html">Hem</a></li>
            <li><button class="submitBtn" id="login-btn">Logga in</button></li>
        `
    }

    const logoutBtn = document.querySelector("#logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("webshop-token");
            window.location.href = "login.html"
        });
    };
};

async function loginUser(e) {

    e.preventDefault();

    let userInput = document.querySelector("#loginUsername").value;
    let passwordInput = document.querySelector("#loginPassword").value;

    if (!userInput || !passwordInput) {

        const errorContainer = document.querySelector(".login-felmeddelanden");

        errorContainer.innerHTML = `
            <p>Du måste fylla i användarnamn och lösenord</p>
        `;

        return;
    };

    let user = {
        username: userInput,
        password: passwordInput
    }

    try {
        const resp = await fetch("http://localhost:5034/webshop/login", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (resp.ok) {
            const data = await resp.json();

            localStorage.setItem("webshop-token", data.token);
            window.location.href = "admin.html"
        }

    } catch (error) {
        throw error;
    }



}

async function registerUser(e) {

    e.preventDefault();

    let userInput = document.querySelector("#registerUsername").value;
    let passwordInput = document.querySelector("#registerPassword").value;
    const errorContainer = document.querySelector(".register-felmeddelanden"); 

    if (!userInput || !passwordInput) {

        errorContainer.innerHTML = `
            <p>Du måste fylla i användarnamn och lösenord</p>
        `;

        return;
    };

    let user = {
        username: userInput,
        password: passwordInput
    }

    try {
        const resp = await fetch("http://localhost:5034/webshop/register", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (resp.ok) {
            const data = await resp.json();
            
            errorContainer.innerHTML = `
            <p>${data.message}</p>
            `
        } 

    } catch (error) {
        throw error;
    }
}; 

