const addToCart = (id) => {
    let cart = JSON.parse(sessionStorage.getItem('cart'));

    if (cart === null) {
        cart = [id];
        alert("Product added to the cart!!");
    } else {
        if (cart.includes(id) === false) {
            cart.push(id);
            alert("Product added to the cart!!");
        } else alert("Product already exist in the cart!!");
    };
    sessionStorage.setItem('cart', JSON.stringify(cart));
}