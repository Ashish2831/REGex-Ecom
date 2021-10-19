const getProducts = (categories, category) => {
    return categories[category].map(product =>
            `
                <div class="col-4">
                <a href=/product_details/${product._id}/><img width="200px" height="200px" src="${product.image_url}"></a>
                <h4>${product.name}</h4>
                <div class="rating">
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star-o"></i>
                </div>
                <p>₹ ${product.price}</p>
                </div>
            `
    ).join('')
}

const getCategories = async () => {
    const products_json = await fetch(`/api/v1/products/`);
    const products = (await products_json.json()).products;

    categories = {};

    products.forEach(product => {
        if (categories[product.category]) categories[product.category].push(product);
        else categories[product.category] = [product];
    });

    const productsId = document.getElementById('products');

    let html = "";
    for (let category in categories) {
        html += `
            <h2 style="text-align: center;">${category}</h2>
            <div class="row">
                ${getProducts(categories, category)}
            </div>
        `
    }
    productsId.innerHTML = html;
}

getCategories();