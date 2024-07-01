export const API_URL = 'https://half-lacy-rock.glitch.me';

// const fetchData = async (endpoint, option = {}) => {
//     try {
//         const response = await fetch(`${API_URL}${endpoint}`, option);
//         if(!response.ok) {
//             throw new Error(response.status)
//         }
//         return await response.json();
//     } catch (error) {
//         console.error(`Ошибка запроса: ${error}`)
//     }
// }



export const fetchProductByCategory = async (category, preloader) => {
    try {
        preloader.style.display = 'flex'
        const response = await fetch(`${API_URL}/api/products/category/${category}`);
        preloader.style.display ='none';
        if(!response.ok) {
            throw new Error(response.status)
        }

        const products = await response.json()
        
        return products;
    }
    catch(err) {
        console.log(`Ошибка запроса товаров: ${err}`);
    }
};

export const fetchCartItems = async (ids) => {
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

export const submitOrder = async (storeId, products) => {

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

            return await response.json();

    } catch(error) {
        console.error(`Ошибка оформления заказа: ${error}`)
    }
}