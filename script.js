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
    const cartLink = document.getElementById("hey");

    if (cartLink) {
        cartLink.textContent = "Cart(" + cart.length + ")";
    }
}

document.addEventListener("DOMContentLoaded", updateCartCount);
document.getElementById("apply-filters").addEventListener("click", function () {
    const selectedCategories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map(checkbox => checkbox.value.toLowerCase());

    const minPrice = Number(document.getElementById("price-min").value) || 0;
    const maxPrice = Number(document.getElementById("price-max").value) || Infinity;

    const sortValue = document.getElementById("sort").value;

    const products = Array.from(document.querySelectorAll("#products .grid article"));

    products.forEach(product => {
        const categoryText = product.querySelector("p span")?.textContent.toLowerCase() || "";

        const priceText = product.querySelector("p:nth-of-type(2) strong")?.textContent || "";
        const price = Number(priceText.replace(/[^\d]/g, ""));

        const categoryMatch =
            selectedCategories.length === 0 ||
            selectedCategories.some(category => categoryText.includes(category));

        const priceMatch = price >= minPrice && price <= maxPrice;

        product.style.display = categoryMatch && priceMatch ? "" : "none";
    });

    const grid = document.querySelector("#products .grid");

    const visibleProducts = products.filter(
        product => product.style.display !== "none"
    );

    if (sortValue === "price-low") {
        visibleProducts.sort((a, b) => getPrice(a) - getPrice(b));
    } 
    else if (sortValue === "price-high") {
        visibleProducts.sort((a, b) => getPrice(b) - getPrice(a));
    }

    visibleProducts.forEach(product => grid.appendChild(product));
});


function getPrice(product) {
    const priceText = product.querySelector("p:nth-of-type(2) strong")?.textContent || "";
    return Number(priceText.replace(/[^\d]/g, ""));
}


document.getElementById("apply-filters").addEventListener("click", function () {

    const selectedCategories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map(checkbox => checkbox.value);

    const minPrice = Number(document.getElementById("price-min").value) || 0;
    const maxPrice = Number(document.getElementById("price-max").value) || Infinity;

    const products = Array.from(
        document.querySelectorAll("#products .grid article")
    );

    products.forEach(product => {

        const category = product.querySelector("p span")?.textContent
            .trim()
            .toLowerCase();

        const priceText = product.querySelector("p strong")?.textContent || "";
        const price = Number(priceText.replace(/[^\d]/g, ""));

        let categoryMatch = true;

        if (selectedCategories.length > 0) {
            categoryMatch = selectedCategories.some(value => {

                if (value === "tshirts") {
                    return category.includes("tshirt") || category.includes("t-shirt");
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
                    return category.includes("tote") || category.includes("accessor");
                }

                return false;
            });
        }

        const priceMatch = price >= minPrice && price <= maxPrice;

        product.style.display =
            categoryMatch && priceMatch ? "" : "none";
    });
});


document.getElementById("clear-filters").addEventListener("click", function () {

    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById("price-min").value = "";
    document.getElementById("price-max").value = "";
    document.getElementById("sort").value = "popular";

    document.querySelectorAll("#products .grid article").forEach(product => {
        product.style.display = "";
    });
});
