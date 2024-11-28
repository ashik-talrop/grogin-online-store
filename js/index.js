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

const saleEndDate = new Date();
saleEndDate.setDate(saleEndDate.getDate() + 47); 

startCountdown(saleEndDate.getTime());

document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("product-container");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    let productsData = []; 

    const renderProducts = (products) => {
        productContainer.innerHTML = ""; 
        if (products.length === 0) {
            productContainer.innerHTML = "<p>No products found.</p>";
            return;
        }
        products.forEach(product => {
            const generateStars = (filledStars, filledStarSrc, emptyStarSrc) => {
                let starsHTML = "";
                for (let i = 0; i < 5; i++) {
                    starsHTML += `<img src="${i < filledStars ? filledStarSrc : emptyStarSrc}" alt="star">`;
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
                    <a href="single-page.html?id=${product.id}">
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

            productContainer.innerHTML += productHTML; 
        });
    };

    const filterProducts = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = productsData.filter(product =>
            product.title.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts); 
    };

    fetch("data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch product data");
            }
            return response.json();
        })
        .then(data => {
            productsData = data.products; 
            renderProducts(productsData); 

            searchInput.addEventListener("input", filterProducts);
            searchButton.addEventListener("click", filterProducts);
        })
        .catch(error => {
            productContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error(error); 
        });
});


document.addEventListener("DOMContentLoaded", () => {
    const productSection = document.querySelector(".prod-section");
    const relatedProductsContainer = document.querySelector(".related-products .products");

    const renderStars = (stars) => {
        let starHTML = "";
        for (let i = 0; i < 5; i++) {
            starHTML += `<img src="${i < stars ? "assets/images/star.svg" : "assets/images/empty-star.svg"}" alt="star">`;
        }
        return starHTML;
    };

    const renderProductDetails = (product) => {
        const itemImage = productSection.querySelector(".image .banana img");
        itemImage.src = product.images.itemImage;
        itemImage.alt = product.title;

        productSection.querySelector(".image p").textContent = `${product.discountPercentage}%`;

        const organicDiv = productSection.querySelector(".orgg");
        organicDiv.style.display = product.is_organic ? "flex" : "none";

        productSection.querySelector(".details h1").textContent = product.title;

        const starsContainer = productSection.querySelector(".reviesandrating .star");
        starsContainer.innerHTML = renderStars(product.rating.stars);

        productSection.querySelector(".reviesandrating p").textContent = product.rating.stars.toFixed(1);
        productSection.querySelector(".reviesandrating span").textContent = product.rating.reviews;

        productSection.querySelector(".price h6").textContent = `$${product.price.currentRate.toFixed(2)}`;
        productSection.querySelector(".price p").textContent = `$${product.price.originalRate.toFixed(2)}`;
    };

    const renderRelatedProducts = (products, topProductId) => {
        const filteredProducts = products
            .filter(product => product.id !== topProductId)  
            .slice(0, 6);  

        filteredProducts.forEach((product) => {
            const productHTML = `
                <div class="product">
                    <a href="${product.link}">
                        <div class="top">
                            <p>${product.discountPercentage}%</p>
                            <img src="${product.images.heartIcon}" alt="heart">
                        </div>
                        <div class="middle">
                            <img src="${product.images.itemImage}" alt="${product.title}">
                        </div>
                        <div class="title">
                            <p>${product.title}</p>
                        </div>
                        <div class="rating">
                            <div class="stars">
                                ${renderStars(product.rating.stars)}
                            </div>
                            <span>${product.rating.reviews} reviews</span>
                        </div>
                        <div class="rate">
                            <p class="rate">$${product.price.currentRate.toFixed(2)}</p>
                            <p class="discount">$${product.price.originalRate.toFixed(2)}</p>
                        </div>
                        <div class="bottom">
                            <div class="cart">
                                <img src="${product.images.cartIcon}" alt="cart">
                            </div>
                            <p>${product.is_organic ? "Organic" : "In Stock"}</p>
                        </div>
                    </a>
                </div>
            `;
            relatedProductsContainer.innerHTML += productHTML;
        });
    };

    const getProductID = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("id");
    };

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const productID = getProductID();
            const product = data.products.find(p => p.id === productID);
            if (product) {
                renderProductDetails(product);
                renderRelatedProducts(data.products, product.id);  
            } else {
                productSection.innerHTML = "<p>Product not found.</p>";
            }
        })
        .catch(error => {
            productSection.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error(error);
        });
});


document.addEventListener("DOMContentLoaded", () => {
    const relatedProductsContainer = document.querySelector(".related-products .products");

    const renderStars = (stars) => {
        let starHTML = "";
        for (let i = 0; i < 5; i++) {
            starHTML += `<img src="${i < stars ? "assets/images/star.svg" : "assets/images/empty-star.svg"}" alt="star">`;
        }
        return starHTML;
    };

    const renderRelatedProducts = (products, topProductId) => {
        const filteredProducts = products
            .filter(product => product.id !== topProductId)  
            .slice(0, 6);  

        filteredProducts.forEach((product) => {
            const productHTML = `
                <div class="product">
                    <a href="${product.link}">
                        <div class="top">
                            <p>${product.discountPercentage}%</p>
                            <img src="${product.images.heartIcon}" alt="heart">
                        </div>
                        <div class="middle">
                            <img src="${product.images.itemImage}" alt="${product.title}">
                        </div>
                        <div class="title">
                            <p>${product.title}</p>
                        </div>
                        <div class="rating">
                            <div class="stars">
                                ${renderStars(product.rating.stars)}
                            </div>
                            <span>${product.rating.reviews} reviews</span>
                        </div>
                        <div class="rate">
                            <p class="rate">$${product.price.currentRate.toFixed(2)}</p>
                            <p class="discount">$${product.price.originalRate.toFixed(2)}</p>
                        </div>
                        <div class="bottom">
                            <div class="cart">
                                <img src="${product.images.cartIcon}" alt="cart">
                            </div>
                            <p>${product.is_organic ? "Organic" : "In Stock"}</p>
                        </div>
                    </a>
                </div>
            `;
            relatedProductsContainer.innerHTML += productHTML;
        });
    };
});

document.addEventListener('DOMContentLoaded', function () {
    const filterSection = document.querySelector('.filter-section');
    const closeButton = document.querySelector('.close-filter-btn');
    const toggleButton = document.querySelector('.filter-button button');

    closeButton.addEventListener('click', function (event) {
        event.preventDefault(); 
        filterSection.classList.remove('active'); 
        if (toggleButton) toggleButton.textContent = 'Filter'; 
    });

    function handleToggleButton() {
        if (filterSection.classList.contains('active')) {
            filterSection.classList.remove('active');
            toggleButton.textContent = 'Filter';
        } else {
            filterSection.classList.add('active');
            toggleButton.textContent = 'Close Filter';
        }
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', handleToggleButton);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const dissSearch = document.querySelector(".diss-search");
    const inputDiv = document.querySelector(".header .input");

    const toggleSearchBar = () => {
        if (inputDiv.style.display === "none" || inputDiv.style.display === "") {
            inputDiv.style.display = "flex"; 
        } else {
            inputDiv.style.display = "none"; 
        }
    };

    const applyToggleForSmallScreens = () => {
        if (window.matchMedia("(max-width: 980px)").matches) {
            dissSearch.addEventListener("click", toggleSearchBar);
        } else {
            dissSearch.removeEventListener("click", toggleSearchBar);
            inputDiv.style.display = ""; 
        }
    };

    applyToggleForSmallScreens();
    window.addEventListener("resize", applyToggleForSmallScreens);
});


