// Countdown Timer Script
function startCountdown(endDate) {
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endDate - now;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Set the end date of the sale (e.g., 47 days from now)
const saleEndDate = new Date();
saleEndDate.setDate(saleEndDate.getDate() + 47); // Adjust the days as needed

// Start the countdown
startCountdown(saleEndDate.getTime());



document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("product-container");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    let productsData = []; // To store products for filtering

    const renderProducts = (products) => {
        productContainer.innerHTML = ""; // Clear existing products
        if (products.length === 0) {
            productContainer.innerHTML = "<p>No products found.</p>";
            return;
        }
        products.forEach(product => {
            const generateStars = (filledStars, filledStarSrc, emptyStarSrc) => {
                let starsHTML = "";
                for (let i = 0; i < 5; i++) {
                    if (i < filledStars) {
                        starsHTML += `<img src="${filledStarSrc}" alt="star">`;
                    } else {
                        starsHTML += `<img src="${emptyStarSrc}" alt="empty star">`;
                    }
                }
                return starsHTML;
            };

            const organicHTML = product.is_organic
                ? `
                    <div class="org">
                        <img src="assets/images/leaf-icon.svg" alt="leaf" />
                        <p>Organic</p>
                    </div>
                  `
                : "";

            const productHTML = `
                <div class="product">
                    <a href="${product.link}">
                        <div class="top">
                            <p>${product.discountPercentage}%</p>
                            <img src="${product.images.heartIcon}" alt="heart">
                        </div>
                        <div class="middle">
                            <img src="${product.images.itemImage}" alt="item">
                        </div>
                        ${organicHTML}
                        <div class="title">
                            <p>${product.title}</p>
                        </div>
                        <div class="rating">
                            <div class="stars">
                                ${generateStars(
                                    product.rating.stars,
                                    product.images.starRating,
                                    "assets/images/empty-star.svg"
                                )}
                            </div>
                            <span>${product.rating.reviews}</span>
                        </div>
                        <div class="rate">
                            <p class="rate">$${product.price.currentRate.toFixed(2)}</p>
                            <p class="discount">$${product.price.originalRate.toFixed(2)}</p>
                        </div>
                        <div class="bottom">
                            <div class="cart">
                                <img src="${product.images.cartIcon}" alt="cart">
                            </div>
                            <p>In Stock</p>
                        </div>
                    </a>
                </div>
            `;

            productContainer.innerHTML += productHTML; // Append each product to the container
        });
    };

    const filterProducts = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = productsData.filter(product =>
            product.title.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts); // Re-render products based on search
    };

    fetch("data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch product data");
            }
            return response.json();
        })
        .then(data => {
            if (!data.products || data.products.length === 0) {
                throw new Error("No products available");
            }

            productsData = data.products; // Store products for filtering
            renderProducts(productsData); // Render initial products

            // Add event listeners for search input and button
            searchInput.addEventListener("input", filterProducts);
            searchButton.addEventListener("click", filterProducts);
        })
        .catch(error => {
            productContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error(error); // Log the error for debugging
        });
});
