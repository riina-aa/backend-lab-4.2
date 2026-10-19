//Väntar på att allting laddas klart innan kod körs
document.addEventListener("DOMContentLoaded", () => {
    init();
});

//Startar igång funktionerna
function init() {

    changeMenu()

    const list = document.querySelector(".produkter");

    if (list) {
        fetchUserProducts();
    }

    const deleteList = document.querySelector(".delete-list");

    if (deleteList) {
        fetchAdminProducts();
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

    if (registerForm) {
        registerForm.addEventListener("submit", registerUser)
    }

    const productForm = document.querySelector("#productForm");

    if (productForm) {
        productForm.addEventListener("submit", addProducts)
    }
}

//Hämtar alla publika produkter
async function fetchUserProducts() {

    let result = await fetch("http://localhost:5034/webshop/products", {
        method: "GET"
    });

    let data = await result.json();

    renderProductlist(data);
};

//Hämtar alla adminprodukter
async function fetchAdminProducts() {

    const token = localStorage.getItem("webshop-token");

    let result = await fetch("http://localhost:5034/webshop/admin/products", {
        method: "GET",
        headers: {
            authorization: "Bearer " + token
        }
    });

    let data = await result.json();

    renderDeletelist(data);
};

//Renderar de publika produkterna på startsidan
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

//Renderar listan för admingränssnittet
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
                <p class="p-pris">Inköpspris: ${product.purchasePrice} kr</p>
                <p class="p-pris">Försäljningspris: ${product.productPrice} kr</p>
            </div>
            <button data-id="${product._id}" class="submitBtn deleteBtn" type="button">Ta bort produkt</button>
        </article>
        `
    });

    const deleteButtons = document.querySelectorAll(".deleteBtn");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;

            deleteProducts(id);
        })
    })
};

//Ändrar menyn beroende på om man är inloggad eller inte
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

//Loggar in användare
async function loginUser(e) {

    e.preventDefault();

    //Hämtar värden
    let userInput = document.querySelector("#loginUsername").value;
    let passwordInput = document.querySelector("#loginPassword").value;

    //Kontrollerar värden
    if (!userInput || !passwordInput) {

        const errorContainer = document.querySelector(".login-felmeddelanden");

        errorContainer.innerHTML = `
            <p>Du måste fylla i användarnamn och lösenord</p>
        `;

        return;
    };

    //Bakar ihop värden
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

        //Vid lyckad inloggning så omdirigeras man till adminsidan
        if (resp.ok) {
            const data = await resp.json();
            localStorage.setItem("webshop-token", data.response.token);
            window.location.href = "admin.html"
        } else {
            const data = await resp.json();

            document.querySelector(".login-felmeddelanden").innerHTML = `
                <p>${data.message}</p>
            `;
        }

    } catch (error) {
        throw error;
    }



}

//Registrera användare 
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
        } else {
            const data = await resp.json();

            errorContainer.innerHTML = `
                <p>${data.message}</p>
             `;
        }

    } catch (error) {
        throw error;
    }
};

//Lägger till produkter
async function addProducts(e) {

    e.preventDefault();

    let pName = document.querySelector("#productName").value;
    let pDescription = document.querySelector("#beskrivning").value;
    let salesPrice = document.querySelector("#produktPris").value;
    let purchasePrice = document.querySelector("#purchasePris").value;
    const messageContainer = document.querySelector(".produkt-meddelanden");

    if (!pName || !pDescription || !salesPrice || !purchasePrice) {
        messageContainer.innerHTML = `
        <p>Du måste fylla i alla fält</p>
        `

        return;
    }

    let product = {
        productName: pName,
        description: pDescription,
        productPrice: salesPrice,
        purchasePrice: purchasePrice

    }

    const token = localStorage.getItem("webshop-token"); //Hämtar token för att komma åt skyddad route

    //En fetch med en authorization-header 
    try {
        const resp = await fetch("http://localhost:5034/webshop/products", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + token
            },
            body: JSON.stringify(product)
        });

        if (resp.ok) {
            const data = await resp.json();

            messageContainer.innerHTML = `
            <p>${data.message}</p>
            `
            setTimeout(() => {
                messageContainer.innerHTML = "";
            }, 3000);
            
            const productForm = document.querySelector("#productForm");

            productForm.reset();
        }

    } catch (error) {
        console.log(error)
    }

    fetchAdminProducts();
};

//Funktion för att radera produkter
async function deleteProducts(id) {

    const token = localStorage.getItem("webshop-token"); //Hämtar token för att komma åt skyddad route

    try {
        const response = await fetch(`http://localhost:5034/webshop/products/${id}`, {
            method: "DELETE",
            headers: {
                authorization: "Bearer " + token
            }
        });

        if (response.ok) {
            fetchAdminProducts();
        }

    } catch (error) {
        console.log(error);
    }

}
