// Checking if we are in cart.html or confirmation.html
if (window.location.href.indexOf('cart') != -1) {
  
  const URL = 'http://localhost:3000/api/products';

  fetch(URL)
    .then(response =>
    response.json()
    .then(data => {
      basket = getBasket()

      // Create all HTML product from the API
      for (let i = 0; i < basket.length; i++) {
        let basketProduct = basket[i];
        let actualIndex = searchingIndexInApi(data, basketProduct.id);
        let product = Object.assign(basketProduct, apiDataGathering(data, actualIndex));
        addingProductToHtml (product);
      }

      // Calculate total quantity
      let quantityInput = document.querySelectorAll('.itemQuantity');
      let totalQuantity = calculateQuantity(quantityInput);
      
      let totalQuantityField = document.querySelector('#totalQuantity');
      let totalQuantityNode = document.createTextNode(totalQuantity);
      totalQuantityField.appendChild(totalQuantityNode);
    
      // Calculate total price
      newTotalPrice (quantityInput)
    
      // Modification of quantity from input
      newQuantityInput (quantityInput, totalQuantityField);
    
      // Remove product	
      deleteItem(totalQuantityField);
    }))
    .catch(error => res.status(400).json({error}));
    //--------------------------------------------------------------//


  // Cart order form validation
  let orderForm = document.querySelector('.cart__order__form');
  let testName = /^[a-z- áàâäãåçéèêëğíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËĞÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,30}$/gi;

  orderForm.firstName.addEventListener('change', function(event) {
    validFirstName(event.target.value);
  })

  orderForm.lastName.addEventListener('change', function(event) {
    validLastName(event.target.value);
  })

  orderForm.address.addEventListener('change', function(event) {
    validAdress(event.target.value);
  })

  orderForm.city.addEventListener('change', function(event) {
    validCity(event.target.value);
  })

  orderForm.email.addEventListener('change', function(event) {
    validEmail(event.target.value);
  })
  //--------------------------------------------------------------//

  order ()








  // Collect data from the basket
  function getBasket() {
    if (localStorage.getItem('basket') != null) {
      return JSON.parse(localStorage.getItem('basket'))
    }else{
      return [];
    }
  }

  // Save new data to the basket
  function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
  }

  // Searching the actual couch index from API array
  function searchingIndexInApi (data, id) {
    return i = data.map(couch => couch._id).indexOf(id)
  }
  //--------------------------------------------------------------//

  // Gather actual couch information from right index in API array
  function apiDataGathering (data, i) {
    return {imageLink: data[i].imageUrl, imageAlt: data[i].altTxt, name: data[i].name, price: data[i].price}
  }
  //--------------------------------------------------------------//

  // Adding product data into html
  function addingProductToHtml (product) {
    let cartSheet = document.createElement('article');
    cartSheet.classList.add('cart__item');
    cartSheet.setAttribute('data-id', product.id);
    cartSheet.setAttribute('data-color', product.color);

    let cartItemImage = document.createElement('div');
    cartItemImage.classList.add('cart__item__img');

    let cartSheetImage = document.createElement('img');
    cartSheetImage.setAttribute('src', product.imageLink);
    cartSheetImage.setAttribute('alt', product.imageAlt);

    let cartItemContent = document.createElement('div');
    cartItemContent.classList.add('cart__item__content');

    let cartItemContentDescription = document.createElement('div');
    cartItemContentDescription.classList.add('cart__item__content__description');

    let h2Title = document.createElement('h2');
    let titleNode = document.createTextNode(product.name)
    h2Title.appendChild(titleNode);

    let color = document.createElement('p');
    let colorNode = document.createTextNode(product.color);
    color.appendChild(colorNode);

    let price = document.createElement('p');
    let priceNode = document.createTextNode(product.price + ' €');
    price.appendChild(priceNode);

    let cartItemContentSettings = document.createElement('div');
    cartItemContentSettings.classList.add('cart__item__content__settings');

    let cartItemContentSettingsQuantity = document.createElement('div');
    cartItemContentSettingsQuantity.classList.add('cart__item__content__settings__quantity');

    let productQuantity = document.createElement('p');
    let quantityNode = document.createTextNode('Qté : ');
    productQuantity.appendChild(quantityNode);

    let quantityInput = document.createElement('input');
    quantityInput.classList.add('itemQuantity');
    quantityInput.setAttribute('type', 'number');
    quantityInput.setAttribute('name', 'itemQuantity');
    quantityInput.setAttribute('min', '1');
    quantityInput.setAttribute('max', '100');
    quantityInput.setAttribute('value', product.quantity);

    let cartItemContentSettingsDelete = document.createElement('div');
    cartItemContentSettingsDelete.classList.add('cart__item__content__settings__delete');

    let deleteItem = document.createElement('p');
    deleteItem.classList.add('deleteItem');
    let deleteNode = document.createTextNode('Supprimer');
    deleteItem.appendChild(deleteNode);
    
    document.querySelector('#cart__items').appendChild(cartSheet);
    cartSheet.appendChild(cartItemImage);
    cartSheet.appendChild(cartItemContent);
    cartItemContent.appendChild(cartItemContentDescription);
    cartItemImage.appendChild(cartSheetImage);
    cartItemContentDescription.appendChild(h2Title);
    cartItemContentDescription.appendChild(color);
    cartItemContentDescription.appendChild(price);
    cartItemContent.appendChild(cartItemContentSettings);
    cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
    cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
    cartItemContentSettingsQuantity.appendChild(productQuantity);
    cartItemContentSettingsQuantity.appendChild(quantityInput);
    cartItemContentSettingsDelete.appendChild(deleteItem);
  }
  //--------------------------------------------------------------//


  // Calculate total quantity of couch in basket
  function calculateQuantity (quantityInput) {
    let total = 0;
    for ( let i = 0; i < quantityInput.length; i++) {
      total += parseInt(quantityInput[i].value)
    }
    return total;  
  }
  //--------------------------------------------------------------//

  // Calculate total price for couch in basket
  function calculatePrice(allPrices) {
    let total = 0;
    let quantityInput = document.querySelectorAll('.itemQuantity');
    for ( let i = 0; i < quantityInput.length; i++) {
      total += (parseInt(quantityInput[i].value) * parseInt(allPrices[i].innerText))
    }
    return total;

  }
  //--------------------------------------------------------------//

  // Verify new input for quantity
  function newQuantityInput (quantityInput, totalQuantityField) {
    let originalValue;
    // quantityInput = document.querySelectorAll('.itemQuantity');
    for (let i = 0; i < quantityInput.length; i++) {
      quantityInput[i].addEventListener('focus', function() {
      originalValue = quantityInput[i].value;
      })
      quantityInput[i].addEventListener('change', function(event) {
        if (isNaN(parseInt(event.target.value)) ||
        event.target.value < 1 ||      
        event.target.value > 100) {
          alert('Veuillez rentrer un nombre entre 1 et 100');
          quantityInput[i].value = originalValue;
        }
        quantityInput[i].setAttribute('value', event.target.value);
        modifyQuantityInBasket (quantityInput, i);
        calculateNewQuantity(totalQuantityField);
        newTotalPrice (quantityInput);
      })
    }
  }
  //--------------------------------------------------------------//

  // Calculate new total quantity after modification
  function calculateNewQuantity (totalQuantityField) {
    let quantityInput = document.querySelectorAll('.itemQuantity');
    totalQuantity = calculateQuantity(quantityInput);      
    totalQuantityField.removeChild(totalQuantityField.lastChild);
    totalQuantityNode = document.createTextNode(totalQuantity);
    totalQuantityField.appendChild(totalQuantityNode);
  }
  //--------------------------------------------------------------//

  // Modify total price
  function newTotalPrice (quantityInput) {
    let allPrices = document.querySelectorAll('.cart__item__content__description p:last-child');
    let totalPriceField = document.querySelector('#totalPrice');
    totalPrice = calculatePrice(allPrices);
    totalPriceField.removeChild(totalPriceField.lastChild);
    totalPriceNode = document.createTextNode(totalPrice);
    totalPriceField.appendChild(totalPriceNode);
  }
  //--------------------------------------------------------------//

  // Modify quantity in basket for selected product
  function modifyQuantityInBasket (quantityInput, i) {
    let productHtmlArticle = quantityInput[i].closest('article');
    let productId = productHtmlArticle.dataset.id;
    let productColor = productHtmlArticle.dataset.color;

    let basket = getBasket();
    let foundProduct = basket.filter(p => p.id == productId);
    for (item of foundProduct) {
      if (item.id == productId && item.color == productColor) {
        item.quantity = parseInt(quantityInput[i].value);
        saveBasket(basket);
      }
    }
  }
  //--------------------------------------------------------------//

  // Delete item from page after clicking suppres button
  function deleteItem (totalQuantityField) {
    let deleteButtons = document.querySelectorAll('.deleteItem');
    
    for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', function() {
        let productHtmlArticle = deleteButtons[i].closest('article');
        let productId = productHtmlArticle.dataset.id;
        let productColor = productHtmlArticle.dataset.color;
        productHtmlArticle.remove();

        deleteFromBasket (productId, productColor);
    
        let quantityInput = document.querySelectorAll('.itemQuantity');
        
        newQuantityInput (quantityInput, totalQuantityField);
        calculateNewQuantity(totalQuantityField);
            
        newTotalPrice (quantityInput);
      })
    }
  }
  //--------------------------------------------------------------//

  // Delete item from basket after clicking suppres button
  function deleteFromBasket (productId, productColor) {
    let basket = getBasket();
    for (item of basket) {
      if (item.id == productId && item.color == productColor) {
        basket.splice(basket.indexOf(item), 1);
        saveBasket(basket);
        return
      }
    }
  }
  //--------------------------------------------------------------//

  // Validation of user First Name input
  function validFirstName (input) {
    let errorMsg = document.querySelector('#firstNameErrorMsg')  
    let testFirstName = /^(?![\s-]+)[a-z\s-áàâäãåçéèêëğíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËĞÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,30}$/gi;
    if (!testFirstName.test(input)) {
      errorMsg.innerHTML = 'Veuillez rentrer un nom/prénom valide, entre 2 et 30 charactères';
      orderForm.firstName.value = '';
    }else{
      errorMsg.innerHTML = '';
    }
  }
  //--------------------------------------------------------------//

  // Validation of user Last Name input
  function validLastName (input) {  
    let errorMsg = document.querySelector('#lastNameErrorMsg');
    let testLastName = /^(?![\s-]+)[a-z\s-áàâäãåçéèêëğíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËĞÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,30}$/gi;
    if (!testLastName.test(input)) {
      errorMsg.innerHTML = 'Veuillez rentrer un nom/prénom valide, entre 2 et 30 charactères';
      orderForm.lastName.value = '';
    }else{
      errorMsg.innerHTML = '';
    }
  }
  //--------------------------------------------------------------//

  // Validation of user Adress input
  function validAdress (input) {
    let testAdress = /^(?=.*[a-z]{3,})[a-z0-9-'\sáàâäéèêëîïæœÁÀÂÄÉÈÊËÎÏÆŒ]{0,50}$/gi
    let errorMsg = document.querySelector('#addressErrorMsg');
    if (!testAdress.test(input)) {
      errorMsg.innerHTML = 'Veuillez rentrer une Adresse valide jusqu\'à 50 charactères.';
      orderForm.address.value = '';
    }else{
      errorMsg.innerHTML = '';
    }
  }
  //--------------------------------------------------------------//

  // Validation of user City input
  function validCity (input) {
    let testCity = /^\d{5} (?![-'\s]+)[a-z-'\s]{2,30}$/gi
    let errorMsg = document.querySelector('#cityErrorMsg');
    if (!testCity.test(input)) {
      errorMsg.innerHTML = 'Veuillez rentrer une ville au format valide, exemple "33000 Bordeaux".';
      orderForm.city.value = '';
    }else{
      errorMsg.innerHTML = '';
    }
  }
  //--------------------------------------------------------------//

  // Validation of user Email input
  function validEmail (input) {
    let testEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let errorMsg = document.querySelector('#emailErrorMsg');
    if (!testEmail.test(input)) {
      errorMsg.innerHTML = 'Veuillez rentrer un email valide'
      orderForm.email.value = '';
    }else{
      errorMsg.innerHTML = '';
    }
  }
  //--------------------------------------------------------------//

  // Order actions when cliking on order button
  function order () {
    const orderButton = document.querySelector('#order');

    orderButton.addEventListener('click', function(event) { 
      event.preventDefault();
      let basket = getBasket();
      let contactData = {firstName: orderForm.firstName.value,
        lastName: orderForm.lastName.value,
        address: orderForm.address.value,
        city: orderForm.city.value,
        email: orderForm.email.value};
    
      if (!checkingDataBeforeOrder(basket, contactData)) {
        alert('Veuillez remplir votre panier et renseigner correctement les champs d\'informations avant de passer commande.')
        return;
      }
    
      let basketId = getBasketId(basket);
    
      let data = JSON.stringify({contact: contactData, products: basketId});

      passOrderToApi (data);
    })
  }
  //--------------------------------------------------------------//

  // Checking of data before sending them to API
  function checkingDataBeforeOrder (basket, contactData) {
    if  (basket.length <= 0 ||
      !contactData.firstName ||
      !contactData.lastName ||
      !contactData.address ||
      !contactData.city ||
      !contactData.email) {
    return false;
  }else{return true}
  }
  //--------------------------------------------------------------//

  // Getting all product ID from basket
  function getBasketId (basket) {
    let idArray = [];
    for (let i = 0; i < basket.length; i++) {
      let found = idArray.find(id => id == basket[i].id);
        if (found == undefined) {
          idArray.push(basket[i].id);
        }
    }
    return idArray;
  }
  //--------------------------------------------------------------//

  // Sending contact object and product id to API and sending user to confirmation page
  function passOrderToApi (data) {
    fetch(URL+'/order', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
      })
      .then(response => 
      response.json()
      .then(data => {
        if (!data.orderId) {
          alert('Une erreur est survenue, veuillez contacter le service client.');
        }else{
        document.location.assign(`./confirmation.html?id=${data.orderId}`)
        }
      }))
      .catch(error => {
        res.status(400).json({error});
        alert('Une erreur est survenue, veuillez contacter le service client.');
      });
  }
  //--------------------------------------------------------------//

}else{
  // Getting order ID in the URL
  let URLparams = (new URL(document.location)).searchParams;

  let id = URLparams.get('id');
  //--------------------------------------------------------------//

  let idNode = document.createTextNode(id);
  document.querySelector("#orderId").appendChild(idNode);

  localStorage.clear();
}
