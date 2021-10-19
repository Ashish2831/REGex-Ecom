const updateCartTotal = () => {
    total = 150;
    const totalPrice = document.getElementById("total_price");
    const cartProductsTr = document.getElementsByClassName('cart_products_tr');
    Array.from(cartProductsTr).forEach(cartProductTr => {
        const subTotal = cartProductTr.getElementsByTagName('td')[2].innerHTML.replace('₹', '');
        total += parseFloat(subTotal);
    });
    totalPrice.innerHTML = total;
}

const updateQuantity = (event, id, price) => {
    const quantity = event.target.value;
    const subTotal = document.getElementById(id);
    subTotal.innerHTML = "₹ " + quantity * price;
    updateCartTotal();
}

const removeCartProduct = (id) => {
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    cart.splice(cart.indexOf(id), 1);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    displayCartProducts();
} 

const displayCartProducts = async () => {
    const cart = sessionStorage.getItem('cart');

    const cartProducts = document.getElementById('cart_products');
    if (cart !== null) {
        const response = await fetch(`/cart/${cart}/`);
        const products = (await response.json()).cart_products;
        if (products.length !== 0) {
            const html = products.map(product =>
                `                
                    <tr class="cart_products_tr">
                        <td>
                            <div class="cart-info">
                                <img class="product_image" src="${product.image_url}">
                                <div>
                                    <p class="product_name">${product.name}</p>
                                    <small>Price: ₹ <span class="product_price">${product.price}</span></small>
                                    <br>
                                    <a style="cursor: pointer;" onclick="removeCartProduct('${product._id}');">Remove</a>
                                </div>
                            </div>
                        </td>
                        <td><input class="product_quantity" onchange="updateQuantity(event, '${product._id}', '${product.price}');" type="number" value="1" min="1" max="10"></td>
                        <td id="${product._id}">₹ ${product.price}</td>
                    </tr>
                `
            ).join('')

            cartProducts.innerHTML = `
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Subtotal</th>
                                        </tr>

                                        ${html}
                                    `
        } else {
            const totalPriceTable = document.getElementsByClassName("total-price")[0];
            totalPriceTable.style.display = 'none';

            cartProducts.innerHTML = `
                                        <img width="100%" height="100%" src="https://www.apnashopping.in/assets/img/payment/Empty-Cart.jpg">
                                     `
        }
    } else {
        const totalPriceTable = document.getElementsByClassName("total-price")[0];
        totalPriceTable.style.display = 'none';

        cartProducts.innerHTML = `
                                    <img width="100%" height="100%" src="https://www.apnashopping.in/assets/img/payment/Empty-Cart.jpg">
                                 `
    }
    updateCartTotal();
}

displayCartProducts();