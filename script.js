$(document).ready(function() {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Classic T-Shirt",
            price: 29.99,
            category: "T-Shirts",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
            description: "Comfortable cotton t-shirt perfect for everyday wear"
        },
        {
            id: 2,
            name: "Designer Jeans",
            price: 89.99,
            category: "Jeans", 
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
            description: "Premium denim jeans with modern fit and style"
        },
        {
            id: 3,
            name: "Summer Dress",
            price: 59.99,
            category: "Dresses",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
            description: "Elegant summer dress perfect for any occasion"
        },
        {
            id: 4,
            name: "Leather Wallet",
            price: 39.99,
            category: "Accessories",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
            description: "Genuine leather wallet with multiple card slots"
        },
        {
            id: 5,
            name: "Polo Shirt",
            price: 45.99,
            category: "T-Shirts",
            image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=300&fit=crop",
            description: "Classic polo shirt for business casual wear"
        },
        {
            id: 6,
            name: "Cocktail Dress",
            price: 99.99,
            category: "Dresses",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
            description: "Stylish cocktail dress for evening events"
        },
        {
            id: 7,
            name: "Skinny Jeans",
            price: 69.99,
            category: "Jeans",
            image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=300&fit=crop",
            description: "Comfortable skinny fit jeans in dark wash"
        },
        {
            id: 8,
            name: "Designer Watch",
            price: 199.99,
            category: "Accessories",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
            description: "Premium designer watch with stainless steel band"
        }
    ];
    localStorage.setItem('allProducts', JSON.stringify(products));


    // Shopping cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let currentCategory = 'All';
    let viewMode = 'grid';

    // Initialize the app
    init();

    function init() {
        displayProducts();
        updateCartUI();
        setupEventListeners();
        updateCartCount();
    }

    function setupEventListeners() {
        // Navigation smooth scroll
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 1000);
            }
        });

        // Hero shop now button
        $('.hero-btn').on('click', function() {
            $('html, body').animate({
                scrollTop: $('#productsContainer').offset().top - 100
            }, 1000);
        });

        // Category filter buttons
        $('[data-category]').on('click', function() {
            $('[data-category]').removeClass('active');
            $(this).addClass('active');
            currentCategory = $(this).data('category');
            displayProducts();
        });

        // View mode toggle
        $('#gridView, #listView').on('click', function() {
            $('#gridView, #listView').removeClass('active');
            $(this).addClass('active');
            viewMode = $(this).attr('id') === 'gridView' ? 'grid' : 'list';
            toggleViewMode();
        });
// wishlist 
function renderWishlist() {
    const wishlistContainer = $('#wishlistItems');
    const emptyMsg = $('#emptyWishlist');
    wishlistContainer.empty();

    if (favorites.length === 0) {
        emptyMsg.show();
        return;
    }
    emptyMsg.hide();

    favorites.forEach(id => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        wishlistContainer.append(`
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price}</p>
                        <button class="btn btn-danger btn-sm remove-wishlist" data-product-id="${product.id}">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `);
    });

    $('.remove-wishlist').on('click', function() {
        const id = parseInt($(this).data('product-id'));
        toggleFavorite(id);
        renderWishlist();
    });
}

$('#wishlistLink').on('click', function(e) {
    e.preventDefault();
    renderWishlist();
    $('#wishlistModal').modal('show');
});



        // Search functionality
        $('#searchInput').on('input', function() {
            const searchTerm = $(this).val().toLowerCase();
            displayProducts(searchTerm);
        });

        // Cart functionality
        $('#checkoutBtn').on('click', function() {
            if (cart.length > 0) {
                populateCheckoutModal();
                $('#cartOffcanvas').offcanvas('hide');
                $('#checkoutModal').modal('show');
            }
        });

        $('#clearCartBtn').on('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                saveCart();
                updateCartUI();
                updateCartCount();
            }
        });

        // Complete order
        $('#completeOrderBtn').on('click', function() {
            const form = $('#checkoutForm')[0];
            if (form.checkValidity()) {
                completeOrder();
            } else {
                form.reportValidity();
            }
        });

        // Contact form
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            const formData = {
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                subject: $('#subject').val(),
                message: $('#message').val()
            };
            
            // Simulate form submission
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });

        // Deal cards click animation
        $('.deal-card').on('click', function() {
            $(this).addClass('animate-fadeInUp');
            setTimeout(() => {
                $(this).removeClass('animate-fadeInUp');
            }, 600);
        });
    }

    function displayProducts(searchTerm = '') {
        const container = $('#productsContainer');
        container.empty();

        let filteredProducts = products;

        // Filter by category
        if (currentCategory !== 'All') {
            filteredProducts = products.filter(p => p.category === currentCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.description.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredProducts.length === 0) {
            container.html(`
                <div class="col-12 text-center py-5">
                    <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                    <h3 class="text-muted">No products found</h3>
                    <p class="text-muted">Try adjusting your search or filter criteria</p>
                </div>
            `);
            return;
        }

        filteredProducts.forEach(product => {
            const isFavorite = favorites.includes(product.id);
            const productHtml = `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card product-card h-100" data-testid="product-card-${product.id}">
                        <div class="position-relative">
                            <img src="${product.image}" class="card-img-top product-image" alt="${product.name}" data-testid="product-image-${product.id}">
                            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-product-id="${product.id}" data-testid="favorite-${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                            <div class="product-overlay">
                                <button class="btn btn-primary btn-sm quick-add" data-product-id="${product.id}" data-testid="quick-add-${product.id}">
                                    <i class="fas fa-shopping-cart me-1"></i>Quick Add
                                </button>
                            </div>
                        </div>
                        <div class="card-body product-info d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title product-title mb-0" data-testid="product-name-${product.id}">${product.name}</h5>
                                <span class="badge product-category" data-testid="product-category-${product.id}">${product.category}</span>
                            </div>
                            <p class="card-text product-description text-muted" data-testid="product-description-${product.id}">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center mt-auto">
                                <div>
                                    <span class="product-price" data-testid="product-price-${product.id}">$${product.price}</span>
                                    <div class="product-rating">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                </div>
                                <button class="btn btn-primary btn-add-cart" data-product-id="${product.id}" data-testid="add-to-cart-${product.id}">
                                    <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(productHtml);
        });

        // Add event listeners for dynamically created elements
        $('.btn-add-cart, .quick-add').on('click', function() {
            const productId = parseInt($(this).data('product-id'));
            addToCart(productId);
        });

        $('.favorite-btn').on('click', function() {
            const productId = parseInt($(this).data('product-id'));
            toggleFavorite(productId);
        });

        // Apply current view mode
        toggleViewMode();
    }

    function toggleViewMode() {
        const container = $('#productsContainer');
        if (viewMode === 'list') {
            container.addClass('list-view');
        } else {
            container.removeClass('list-view');
        }
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        saveCart();
        updateCartUI();
        updateCartCount();
        
        // Show success feedback
        showToast('Item added to cart!', 'success');
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
        updateCartCount();
    }

    function updateQuantity(productId, quantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = quantity;
                saveCart();
                updateCartUI();
                updateCartCount();
            }
        }
    }

    function toggleFavorite(productId) {
        const index = favorites.indexOf(productId);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(productId);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Update UI
        const btn = $(`.favorite-btn[data-product-id="${productId}"]`);
        btn.toggleClass('active');
        
        const action = favorites.includes(productId) ? 'added to' : 'removed from';
        showToast(`Item ${action} favorites!`, 'info');
    }

    function updateCartUI() {
        const cartItems = $('#cartItems');
        const cartSummary = $('#cartSummary');
        const emptyCart = $('#emptyCart');

        if (cart.length === 0) {
            emptyCart.show();
            cartSummary.hide();
            cartItems.html(`
                <div class="text-center py-5" id="emptyCart">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Your cart is empty</p>
                </div>
            `);
            return;
        }

        emptyCart.hide();
        cartSummary.show();

        let cartHtml = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            cartHtml += `
                <div class="cart-item d-flex align-items-center" data-testid="cart-item-${item.id}">
                    <img src="${item.image}" class="cart-item-image me-3" alt="${item.name}">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">$${item.price.toFixed(2)} each</small>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="ms-3">
                        <div class="fw-bold">$${itemTotal.toFixed(2)}</div>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        cartItems.html(cartHtml);

        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        $('#cartSubtotal').text(`$${subtotal.toFixed(2)}`);
        $('#cartTax').text(`$${tax.toFixed(2)}`);
        $('#cartTotal').text(`$${total.toFixed(2)}`);
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        $('#cartCount').text(count);
        
        if (count > 0) {
            $('#cartCount').show();
        } else {
            $('#cartCount').hide();
        }
    }

    function populateCheckoutModal() {
        const checkoutItems = $('#checkoutItems');
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        let itemsHtml = '';
        cart.forEach(item => {
            itemsHtml += `
                <div class="d-flex justify-content-between align-items-center mb-2" data-testid="checkout-item-${item.id}">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" width="40" height="40" class="rounded me-2" alt="${item.name}">
                        <div>
                            <div class="fw-medium" data-testid="checkout-item-name-${item.id}">${item.name}</div>
                            <small class="text-muted" data-testid="checkout-item-quantity-${item.id}">Qty: ${item.quantity}</small>
                        </div>
                    </div>
                    <span class="fw-bold" data-testid="checkout-item-total-${item.id}">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });

        checkoutItems.html(itemsHtml);
        $('#checkoutSubtotal').text(`$${subtotal.toFixed(2)}`);
        $('#checkoutTax').text(`$${tax.toFixed(2)}`);
        $('#checkoutTotal').text(`$${total.toFixed(2)}`);
    }

    function completeOrder() {
        // Generate order number
        const orderNumber = 'ORD-' + Date.now();
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        updateCartCount();
        
        // Close checkout modal
        $('#checkoutModal').modal('hide');
        
        // Show success modal
        $('#orderNumber').text(orderNumber);
        $('#successModal').modal('show');
        
        // Reset checkout form
        $('#checkoutForm')[0].reset();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function showToast(message, type = 'success') {
        const toastHtml = `
            <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        // Create toast container if it doesn't exist
        if (!$('#toastContainer').length) {
            $('body').append('<div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;"></div>');
        }
        
        const toastElement = $(toastHtml);
        $('#toastContainer').append(toastElement);
        
        const toast = new bootstrap.Toast(toastElement[0]);
        toast.show();
        
        // Remove toast after it's hidden
        toastElement.on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }

    // Make functions globally accessible
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
    
    // Navbar scroll effect
    $(window).scroll(function() {
        const navbar = $('.navbar');
        if ($(window).scrollTop() > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
    });

    // Add some CSS for navbar scroll effect
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .navbar.scrolled {
                backdrop-filter: blur(20px);
                background: rgba(139, 92, 246, 0.95) !important;
            }
        `)
        .appendTo('head');

    // Smooth animations for elements coming into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);

    // Observe elements when they come into view
    setTimeout(() => {
        $('.product-card, .deal-card').each(function() {
            observer.observe(this);
        });
    }, 100);
});