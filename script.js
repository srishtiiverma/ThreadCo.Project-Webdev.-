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

    window.location.href = "cart.html";
}

function updateCartCount() {
    const cartLink = document.getElementById("hey");

    if (cartLink) {
        cartLink.textContent = "Cart(" + cart.length + ")";
    }
}

document.addEventListener("DOMContentLoaded", updateCartCount);
