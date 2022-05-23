// Getting product ID in the URL
let URLparams = (new URL(document.location)).searchParams;

let id = URLparams.get('id');
//--------------------------------------------------------------//

// Create product from the API
fetch(`http://localhost:3000/api/products/${id}`)
  .then(response =>
    response.json()
  .then(data => {
    let apiPproduct = createProduct(data);
    addingProductToHtml(apiPproduct);
  })
  )
  .catch(error => res.status(400).json({error}));

let = basketProduct = {id: id, quantity: 0, color: ''}
//--------------------------------------------------------------//
    
changeQuantity();
changeColor();
	
document.querySelector('#addToCart')
	.addEventListener("click", function () {
		if (basketProduct.color == '' || basketProduct.quantity == 0) {
			alert('Veuillez choisir une couleur et une quantité valide');
			return;
		}else{
			addToBasket(basketProduct)
		}
});

// Create a product with API data
function createProduct (data) {
  return {imageLink: data.imageUrl, imageAlt: data.altTxt, name: data.name, description: data.description, colors: data.colors, price: data.price}
}
//--------------------------------------------------------------//

// Create a product sheet in HTML
function addingProductToHtml (product) {

  let image = document.createElement("img");
  image.setAttribute('src', product.imageLink);
  image.setAttribute('alt', product.imageAlt);
  document.querySelector('.item__img').appendChild(image);

  let titleNode = document.createTextNode(product.name);
    document.querySelector('#title').appendChild(titleNode);

  let priceNode = document.createTextNode(product.price);
    document.querySelector('#price').appendChild(priceNode);

  let descriptionNode = document.createTextNode(product.description);
  document.querySelector('#description').appendChild(descriptionNode);

  for (let color of product.colors) {
    let option = document.createElement('option');
    option.setAttribute('value', color);
    let colorNode = document.createTextNode(color);
    option.appendChild(colorNode);
    document.querySelector('#colors').appendChild(option)
  }
}
//--------------------------------------------------------------//

// Manage the quantity change from input field with security if quantity > 100 and input =/= int
function changeQuantity() {
  document.querySelector('#quantity')
    .addEventListener('change', function(event) {
      if (isNaN(parseInt(event.target.value)) ||
      parseInt(event.target.value) < 0 ||
      parseInt(event.target.value) > 100) {
        alert('Veuillez rentrer un nombre entre 1 et 100.');
        basketProduct.quantity = 0;
        document.querySelector('#quantity').value = 0;
      }else{
        basketProduct.quantity = parseInt(event.target.value);
      }
    });
}
//--------------------------------------------------------------//

// Manage the color change from input field
function  changeColor() {
  document.querySelector('#colors')
      .addEventListener('change', function(event) {
        basketProduct.color = event.target.value;
      });
}
//--------------------------------------------------------------//

// Checking if product is already in basket : if yes, increase is quantity (max 100), if no, add new product in the basket.
// If a product in the basket as same ID but different color, add new product after it.
function addToBasket(product) {
  let basket = getBasket();
  let foundProduct = basket.filter(p => p.id == product.id);
  let sameIdAlreadyInBasket = false;
  let indexForNewProduct = 0;
  
  if (foundProduct.length != 0) {
    for (items of foundProduct) {
      if (items.id == product.id && items.color == product.color) {
        if ((items.quantity + product.quantity) > 100) {
          alert(`Attention, 100 produits maximum. Quantité actuel : ${items.quantity}.`);
          return;
        }else{
          items.quantity += product.quantity;
          saveBasket(basket);
          return;
        }
      }else{
        sameIdAlreadyInBasket = true;
        indexForNewProduct = basket.map((item) => item.id).indexOf(product.id);
      }
    }
  }
  if (sameIdAlreadyInBasket) {
    basket.splice(indexForNewProduct + 1, 0, product)
  }else{
    basket.push(product);
  }
  saveBasket(basket);
}
//--------------------------------------------------------------//

// Collect data from the basket, if basket is empty, return an empty array
function getBasket() {
  if (localStorage.getItem('basket') != null) {
    return JSON.parse(localStorage.getItem('basket'))
  }else{
    return [];
  }
}
//--------------------------------------------------------------//

// Save new data to the basket
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}
//--------------------------------------------------------------//
