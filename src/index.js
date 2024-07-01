import { fetchProductByCategory } from "./js/api";
import { addToCart } from "./js/cart";
import { renderProducts } from "./js/dom";

const buttons = document.querySelectorAll('.store__category-button');
const productList = document.querySelector('.store__list');
const preloader = document.createElement('div');
preloader.classList.add('preloader__block')
preloader.innerHTML = `
<div class="preload__img">
<svg class="preload__img-svg" width="100" height="100" viewbox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.0002 50.0005C14.0002 69.8825 30.1182 86.0005 50.0002 86.0005C69.8822 86.0005 86.0002 69.8825 86.0002 50.0005C86.0002 30.1185 69.8823 14.0005 50.0003 14.0005C45.3513 14.0005 40.9082 14.8815 36.8282 16.4865" stroke="#e47537" stroke-width="8" stroke-miterlimit="10" stroke-linecap="round"/>
</svg>
</div>
`
document.body.append(preloader)

const init = () => {
    const changeCategory = async ({target}) => {
        const category = target.textContent;
    
        buttons.forEach(button => {
            button.classList.remove('store__category-button--active');
        });
    
        target.classList.add('store__category-button--active');
        const products = await fetchProductByCategory(category,preloader);
        renderProducts(products, productList);
    }
    
    buttons.forEach((button) => {
        button.addEventListener('click', changeCategory);
        if(button.classList.contains('store__category-button--active')) {
            changeCategory({target: button});
        }
    });
    
    productList.addEventListener('click', ({ target }) => {
        if(target.closest('.product__btn-add-cart')) {
            const productId = target.dataset.id
    
            addToCart(productId)
        }
    })
}

init();


