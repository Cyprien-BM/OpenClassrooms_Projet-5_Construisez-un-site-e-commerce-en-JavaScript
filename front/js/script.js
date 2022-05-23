fetch('http://localhost:3000/api/products')
  .then(response =>
    response.json()
  .then(data => {
    for (let i = 0; i < data.length; i++) {
    let product = createProduct(data, i);
		if (product == 'missing data') {
			console.log(`Missing data from data[${i}]`)
		}else{
    	addingProductToHtml(product);
		}
    }
  }))
  .catch(error => res.status(400).json({error}));


// Create a product with API data but checking first if all data are there
function createProduct (data, i) {
	if (!data[i].name || 
    !data[i].imageUrl || 
    !data[i].altTxt || 
    !data[i].name || 
    !data[i].description ||
    !data[i].price) {
		return "missing data"
	}
  return {id: data[i]._id, 
    imageLink: data[i].imageUrl, 
    imageAlt: data[i].altTxt, 
    name: data[i].name, 
    description: data[i].description}
}
//--------------------------------------------------------------//

// Create a product sheet in HTML
function addingProductToHtml(product) {
  // a element
  let productCard = document.createElement("a");
  productCard.setAttribute('href', `./product.html?id=${product.id}`);
  
  //article element
  let article = document.createElement("article");
  
  //img element
  let image = document.createElement("img");
  image.setAttribute('src', product.imageLink);
  image.setAttribute('alt', product.imageAlt);
  
  //h3 element
  let h3Title = document.createElement("h3");
  h3Title.classList.add('productName');
  let textNode = document.createTextNode(product.name)
  h3Title.appendChild(textNode);
  
  //p element
  let paragraph = document.createElement("p");
  paragraph.classList.add('productDescription')
  textNode = document.createTextNode(product.description);
  paragraph.appendChild(textNode);
  
  //adding elements to html
  let itemsSection = document.querySelector('#items');

  itemsSection.appendChild(productCard);
  productCard.appendChild(article);
  article.appendChild(image);
  article.appendChild(h3Title);
  article.appendChild(paragraph);
}
//--------------------------------------------------------------//