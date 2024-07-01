import {API_URL} from './api';
import { calculateTotalPrice } from './cart';

const cartTotalPriceElement = document.querySelector('.modal__cart-price');

export const createOrderMessage = (id) => {
    const orderMessageElement = document.createElement('div');
    orderMessageElement.classList.add('order-message');

    const orderMessageText = document.createElement('p');
    // orderMessageText.textContent = '';
    orderMessageText.textContent = `Ваш заказ оформлен номер заказ ${id}. 
                                    Вы можете забрать его завтра после 12:00`
    orderMessageText.classList.add('order-message__text');

    const orderMessageCloseButton = document.createElement('button');
    orderMessageCloseButton.classList.add('order-message__close-button');
    orderMessageCloseButton.textContent = "Закрыть";

    orderMessageElement.append(orderMessageText, orderMessageCloseButton);

    orderMessageCloseButton.addEventListener('click', () => {
        orderMessageElement.remove();
    })
    return orderMessageElement;
}

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

export const renderProducts = (products, productList) => {
    productList.textContent = "";
    if(products) {
        products.forEach((product) => {
            const productCard = createProductCart(product);
            productList.append(productCard);
        });
    }
}

export const renderCartItems = (cartItemsList, cartItems, products) => {
    cartItemsList.textContent = '';

    products.forEach((product) => {
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

    if(totalPrice === 0) {
        const btn = document.querySelector('.modal__cart-button');
        btn.setAttribute('disabled', true)
        btn.style.cursor = "not-allowed"
    }
};