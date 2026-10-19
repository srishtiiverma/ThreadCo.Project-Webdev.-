let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(name + " added to cart!");
}

function buyNow(name, price) {
    localStorage.setItem("buyNowProduct", JSON.stringify({
        name: name,
        price: price
    }));

    window.location.href = "checkout.html";
}

function updateCartCount() {
    const cartLinks = document.querySelectorAll(
        'a[href="cart.html"], #hey'
    );

    cartLinks.forEach(function(cartLink) {
        cartLink.textContent = "Cart(" + cart.length + ")";
    });
}


document.addEventListener("DOMContentLoaded", function() {

    updateCartCount();

    const applyButton = document.getElementById("apply-filters");
    const clearButton = document.getElementById("clear-filters");
    const sortSelect = document.getElementById("sort");

    const productGrid = document.querySelector("#products .grid");

    if (!productGrid) {
        return;
    }

    function getProducts() {
        return Array.from(
            productGrid.querySelectorAll("article")
        );
    }

    function getPrice(product) {
        const priceElement = product.querySelector("p strong");

        if (!priceElement) {
            return 0;
        }

        return Number(
            priceElement.textContent.replace(/[^\d]/g, "")
        );
    }

    function getCategory(product) {
        const span = product.querySelector("p span");

        if (!span) {
            return "";
        }

        return span.textContent.trim().toLowerCase();
    }

    function categoryMatches(product, selectedCategories) {

        if (selectedCategories.length === 0) {
            return true;
        }

        const category = getCategory(product);

        return selectedCategories.some(function(value) {

            if (value === "tshirts") {
                return category.includes("tshirt") ||
                       category.includes("t-shirt");
            }

            if (value === "hoodies") {
                return category.includes("hoodie");
            }

            if (value === "cargo") {
                return category.includes("cargo");
            }

            if (value === "caps") {
                return category.includes("cap");
            }

            if (value === "accessories") {
                return category.includes("accessor") ||
                       category.includes("tote");
            }

            return false;
        });
    }

    function applyFilters() {

        const selectedCategories = Array.from(
            document.querySelectorAll(
                'input[name="category"]:checked'
            )
        ).map(function(checkbox) {
            return checkbox.value;
        });

        const minInput = document.getElementById("price-min");
        const maxInput = document.getElementById("price-max");

        const minPrice = Number(minInput.value) || 0;
        const maxPrice = Number(maxInput.value) || Infinity;
