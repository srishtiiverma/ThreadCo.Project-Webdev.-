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
    localStorage.setItem(
        "buyNowProduct",
        JSON.stringify({
            name: name,
            price: price
        })
    );

    window.location.href = "checkout.html";
}

function updateCartCount() {
    const cartLink = document.getElementById("hey");

    if (cartLink) {
        cartLink.textContent = "Cart(" + cart.length + ")";
    }
}

function getPrice(product) {
    const priceText =
        product.querySelector("p strong")?.textContent || "";

    return Number(priceText.replace(/[^\d]/g, ""));
}

document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();

    const applyButton = document.getElementById("apply-filters");
    const clearButton = document.getElementById("clear-filters");

    if (!applyButton) return;

    applyButton.addEventListener("click", function () {

        const selectedCategories = Array.from(
            document.querySelectorAll('input[name="category"]:checked')
        ).map(function (checkbox) {
            return checkbox.value.toLowerCase();
        });

        const minPrice =
            Number(document.getElementById("price-min")?.value) || 0;

        const maxPrice =
            Number(document.getElementById("price-max")?.value) || Infinity;

        const sortValue =
            document.getElementById("sort")?.value || "popular";

        const products = Array.from(
            document.querySelectorAll("#products .grid article")
        );

        products.forEach(function (product) {

            const category =
                product.querySelector("p span")?.textContent
                    .trim()
                    .toLowerCase() || "";

            const price = getPrice(product);

            let categoryMatch = true;

            if (selectedCategories.length > 0) {

                categoryMatch = selectedCategories.some(function (selected) {

                    if (selected === "tshirts") {
                        return category.includes("t-shirt") ||
                               category.includes("tshirt");
                    }

                    if (selected === "hoodies") {
                        return category.includes("hoodie");
                    }

                    if (selected === "cargo") {
                        return category.includes("cargo");
                    }

                    if (selected === "caps") {
                        return category.includes("cap");
                    }

                    if (selected === "accessories") {
                        return category.includes("tote") ||
                               category.includes("accessor");
                    }

                    return false;
                });
            }

            const priceMatch =
                price >= minPrice && price <= maxPrice;

            product.style.display =
                categoryMatch && priceMatch ? "" : "none";
        });

        const grid = document.querySelector("#products .grid");

        const visibleProducts = products.filter(function (product) {
            return product.style.display !== "none";
        });

        if (sortValue === "price-low") {

            visibleProducts.sort(function (a, b) {
                return getPrice(a) - getPrice(b);
            });

        } else if (sortValue === "price-high") {

            visibleProducts.sort(function (a, b) {
                return getPrice(b) - getPrice(a);
            });
        }

        visibleProducts.forEach(function (product) {
            grid.appendChild(product);
        });
    });

    if (clearButton) {

        clearButton.addEventListener("click", function () {

            document
                .querySelectorAll('input[name="category"]')
                .forEach(function (checkbox) {
                    checkbox.checked = false;
                });

            document.getElementById("price-min").value = "";
            document.getElementById("price-max").value = "";
            document.getElementById("sort").value = "popular";

            document
                .querySelectorAll("#products .grid article")
                .forEach(function (product) {
                    product.style.display = "";
                });
        });
    }
});
