const checkout = (event) => {
    event.preventDefault();

    const address = document.getElementById('address');
    const number = document.getElementById('number');
    const city = document.getElementById('city');
    const country = document.getElementById('country');
    const state = document.getElementById('state');
    const zip = document.getElementById('zip');

    const card_name = document.getElementById('cname');
    const card_number = document.getElementById('ccnum');
    const month = document.getElementById('expmonth');
    const year = document.getElementById('expyear');
    const cvv = document.getElementById('cvv');

    const cartProducts = document.getElementsByClassName('cart_products_tr');
    const totalPrice = document.getElementById('total_price');

    Array.from(cartProducts).forEach(async (cartProduct, index) => {
        const name = cartProduct.getElementsByClassName('product_name')[0];
        const price = cartProduct.getElementsByClassName('product_price')[0];
        const quantity = cartProduct.getElementsByClassName('product_quantity')[0];
        const image = cartProduct.getElementsByClassName('product_image')[0].getAttribute('src');
        const cart = JSON.parse(sessionStorage.getItem('cart'));

        const response = await fetch(`/api/v1/order/new/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "itemPrice": parseFloat(price.innerHTML) / parseInt(quantity.innerHTML),
                "shippingPrice": 150,
                "totalPrice": totalPrice.innerHTML,
                "orderItems": [{
                    "product": cart[index],
                    "name": name.innerHTML,
                    "price": price.innerHTML,
                    "image": image,
                    "quantity": quantity.value
                }],
                "shippingInfo": {
                    "address": address.value,
                    "city": city.value,
                    "state": state.value,
                    "country": country.value,
                    "pinCode": parseInt(zip.value),
                    "phoneNo": parseInt(number.value)
                },
                "paymentInfo": {
                    "name": card_name.value,
                    "card_number": card_number.value,
                    "month_exp": month.value,
                    "year_exp": year.value,
                    "cvv": cvv.value
                }
            }),
        });
    })

    sessionStorage.setItem('cart', JSON.stringify([]));
}

const redirect = () => {
    window.location.href = "/products/";
}
