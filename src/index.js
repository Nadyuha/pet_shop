const API_URL = 'https://half-lacy-rock.glitch.me';
const buttons = document.querySelectorAll('.store__category-button');
const productList = document.querySelector('.store__list');
const cartButton = document.querySelector('.store__cart-button');
const cartCount = cartButton.querySelector('.store__cart-cnt');
const modalOverlay = document.querySelector('.modal-overlay');
const cartItemsList = document.querySelector('.modal__cart-items');
const modalCloseButton = document.querySelector('.modal-overlay__close-button');
const preloader = document.querySelector('.preloader__block');
const cartTotalPriceElement = document.querySelector('.modal__cart-price');
const cartForm = document.querySelector('.modal__cart-form');

const orderMessageElement = document.createElement('div');
orderMessageElement.classList.add('order-message');

const orderMessageText = document.createElement('p');
// orderMessageText.textContent = '';
orderMessageText.classList.add('order-message__text');

const orderMessageCloseButton = document.createElement('button');
orderMessageCloseButton.classList.add('order-message__close-button');
orderMessageCloseButton.textContent = "Закрыть";

orderMessageElement.append(orderMessageText, orderMessageCloseButton);

orderMessageCloseButton.addEventListener('click', () => {
    orderMessageElement.remove();
})


// orderMessageElement.innerHTML = `
// `



const createProductCart = (product) => {
    const productCart = document.createElement('li');
    productCart.classList.add('store__item');
    productCart.innerHTML = `
    <article class="store__product product">
        <img src="${API_URL}${product.photoUrl}" alt="${product.name}" width="388px" height="261px" class="product__image">
        <h3 class="product__title">${product.name}</h3>
        <p class="product__price">${product.price}&nbsp;₽</p>
        <button class="product__btn-add-cart" data-id="${product.id}">Заказать</button>
    </article>
    `
    return productCart;
}

const renderProducts = (products) => {
    productList.textContent = "";
    products.forEach(product => {
        const productCart = createProductCart(product);
        // console.log(product);
        productList.append(productCart);
    });
}

const fetchProductByCategory = async (category) => {
    try {
        preloader.style.display ='flex';
        const response = await fetch(`${API_URL}/api/products/category/${category}`);
        preloader.style.display ='none';
        if(!response.ok) {
            throw new Error(response.status)
        }

        const products = await response.json()
        
        renderProducts(products);
    }
    catch(err) {
        console.log(`Ошибка запроса товаров: ${err}`);
    }
};

const fetchCartItems = async (ids) => {
    try {
        const response = await fetch(`${API_URL}/api/products/list/${ids.join(",")}`)
        
        if(!response.ok) {
            throw new Error(response.status)
        }

        return await response.json()
    } catch (error) {
        console.error(`Ошибка запроса товаров для корзины: ${error}`);
        return [];
    }
};

const changeCategory = (event) => {
    const target = event.target;
    const category = target.textContent;

    buttons.forEach(button => {
        button.classList.remove('store__category-button--active');
    });

    target.classList.add('store__category-button--active');
    fetchProductByCategory(category);
}

buttons.forEach(button => {
    button.addEventListener('click', changeCategory);
    if(button.classList.contains('store__category-button--active')) {
        fetchProductByCategory(button.textContent);
    }
});

const calculateTotalPrice = (cartItems, products) => cartItems.reduce((acc, item) => {
    const product = products.find(prod => prod.id === item.id);
    return acc + product.price * item.count;
}, 0)

const renderCartItems = async () => {
    cartItemsList.textContent = '';
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]" );
    const products = JSON.parse(localStorage.getItem('cartProductDetails') || "[]" );

    products.forEach(product => {
        const cartItem = cartItems.find((item) => item.id === product.id);
        if(!cartItem) {
            return;
        }
        const listItem = document.createElement('li');
        listItem.classList.add('modal__cart-item')
        listItem.innerHTML = `
                        <img src="${API_URL}${product.photoUrl}" alt="${product.name}" class="modal__cart-item-image">
                        <h3 class="modal__cart-item-title">${product.name}</h3>
                        <div class="modal__cart-item-count">
                            <button class="modal__btn modal__minus" data-id=${product.id}>-</button>
                            <span class="modal__count">${cartItem.count}</span>
                            <button class="modal__btn modal__plus" data-id=${product.id}>+</button>
                        </div>
                        <p class="modal__cart-item-price">${product.price * cartItem.count}&nbsp;₽</p>
        `
        cartItemsList.append(listItem);
    })

    const totalPrice = calculateTotalPrice(cartItems, products);
    cartTotalPriceElement.innerHTML = `${totalPrice}&nbsp;₽`
};

cartButton.addEventListener('click', async () => {
    modalOverlay.style.display = 'flex';
    console.log();
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]" );
    const ids = cartItems.map(item => item.id);
    
    if(!ids.length) {
        cartItemsList.textContent = "";
        const listItem = document.createElement('li');
        listItem.textContent = 'Корзина пуста';
        cartItemsList.append(listItem);
            if(listItem.textContent = 'Корзина пуста') {
                const btn = document.querySelector('.modal__cart-button');
                btn.setAttribute('disabled', true)
                btn.style.cursor = "not-allowed"
            }
        return;
    }

    const products = await fetchCartItems(ids);
    localStorage.setItem('cartProductDetails', JSON.stringify(products));

    renderCartItems();
});

modalOverlay.addEventListener('click', ({target}) => {
    if(target === modalOverlay ||
    target.closest('.modal-overlay__close-button')) {
        modalOverlay.style.display = 'none';
    };
});

const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]" );
    cartCount.textContent = cartItems.length;
}

updateCartCount();

const addToCart = (productId) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || "[]" );
    const existingItem = cartItems.find((item) => item.id === productId);

    if(existingItem) {
        existingItem.count +=1;
    } else {
        cartItems.push({id: productId, count: 1})
    }
    //cartItems.push(productName);
    localStorage.setItem('cartItems',JSON.stringify(cartItems));
    updateCartCount();
};

productList.addEventListener('click', ({ target }) => {
    if(target.closest('.product__btn-add-cart')) {
        //const productCard = target.closest('.store__product');
        const productId = target.dataset.id//target.data.id
        //const productName = productCard.querySelector('.product__title').textContent

        //addToCart(productName)

        addToCart(productId)
    }
})

const updateCartItem = (productId, change) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || []);
    const itemIndex = cartItems.findIndex(item => item.id === productId);

    if(itemIndex !== -1) {
        cartItems[itemIndex].count += change;

        if(cartItems[itemIndex].count <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        updateCartCount();
        renderCartItems();
    }
}

cartItemsList.addEventListener('click', ({target}) => {
        if(target.classList.contains('modal__plus')) {
            const productId = target.dataset.id;
            updateCartItem(productId, 1)
        }

        if(target.classList.contains('modal__minus')) {
            const productId = target.dataset.id;
            updateCartItem(productId, -1)
        }
})

const submitOrder = async (e) => {
    e.preventDefault();

    const storeId = cartForm.store.value;
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || []);

    const products = cartItems.map(({id, count}) => ({
        id,
        quantity: count,
    }))

    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({storeId, products}),
        });

        if(!response.ok) {
            throw new Error(response.status);
        };

        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartProductDetails');

        const { orderId } = await response.json();

        orderMessageText.textContent = `Ваш заказ оформлен номер заказ ${orderId}. 
                                        Вы можете забрать его завтра после 12:00`

        document.body.append(orderMessageElement);
        modalOverlay.style.display = 'none';
        updateCartCount();

    } catch(error) {
        console.error(`Ошибка оформления заказа: ${error}`)
    }
}

cartForm.addEventListener('submit', submitOrder)
