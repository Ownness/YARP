﻿let tunningComponents = [];
let tattooZones = [];
let selectedOptions = [];
let categories = [];
let store = {};
let purchasedAmount = 1;
let multiplier = 0.0;
let selected = null;
let drawable = null;

function populateSelectorOptions(file, id, selector, optionsJson) {
	// Inicializamos los valores
	selected = null;

	// Obtenemos la lista de objetos a mostrar
	let s_options = JSON.parse(optionsJson.replace(/\r?\n|\r/g, ''));
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Añadimos la cabecera del menú
	header.textContent = selector;

	for(let i = 0; i < s_options.length; i++) {
		// Obtenemos el objeto en curso
		let option = s_options[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-description');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = option.id;
		itemPrice.innerHTML = option.description;

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != null) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					previousSelected.classList.remove('active-item');
				}

				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');

				// Guardamos el nuevo índice seleccionado
				selected = i;
			}
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
	}

	// Añadimos los botones
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	purchaseButton.textContent = 'Select';
	cancelButton.textContent = 'Exit';

	// Ponemos la función para cada elemento
	purchaseButton.onclick = (function() {
		// Mandamos la acción de compra si ha seleccionado algo
		if(selected != null) {
			mp.trigger('yarp:cefTrigger', 'selectSelectorOption', file, id, s_options[selected].id);
		}
	});

	cancelButton.onclick = (function() {
		// Cerramos la ventana de compra
		mp.trigger('yarp:cefTrigger', 'destroyBrowser', 'menu');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateSaleItems(id, category, itemsJson) {
	// Inicializamos los valores
	purchasedAmount = 1;
	selected = null;

	// Obtenemos la lista de objetos a mostrar
	let items = JSON.parse(itemsJson.replace(/\r?\n|\r/g, ''));
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	let list = [];

	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}

	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}

	// Añadimos la cabecera del menú
	header.textContent = category;

	for (key in items){
		list.push(items[key]);
	}
	for(let i = 0; i < list.length; i++) {
		// Obtenemos el objeto en curso
		let item = list[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let imageContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let addSubstractContainer = document.createElement('div');
		let itemImage = document.createElement('img');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');
		let itemAdd = document.createElement('span');
		let itemSubstract = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		imageContainer.classList.add('item-image');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container', 'hidden');
		amountTextContainer.classList.add('item-amount-desc-container');
		addSubstractContainer.classList.add('item-add-substract-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');
		itemAdd.classList.add('item-adder');
		itemSubstract.classList.add('item-substract', 'hidden');

		// Añadimos el contenido de cada elemento
		itemImage.src = '../img/inventory/' + item._model + '.png';
		itemDescription.textContent = item._name;
		itemPrice.innerHTML = '<b>Price: </b>$' +item.price;
		itemAmount.innerHTML = '<b>Amount: </b>' + purchasedAmount;
		itemAdd.textContent = '+';
		itemSubstract.textContent = '-';

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != null) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					let previousAmountNode = findFirstChildByClass(previousSelected, 'item-amount-container');
					previousSelected.classList.remove('active-item');
					previousAmountNode.classList.add('hidden');
				}

				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				let currentAmountNode = findFirstChildByClass(currentSelected, 'item-amount-container');
				currentSelected.classList.add('active-item');
				currentAmountNode.classList.remove('hidden');

				// Guardamos el nuevo índice seleccionado
				purchasedAmount = 1;
				selected = i;

				// Actualizamos el texto del elemento
				itemAmount.innerHTML = '<b>Amount: </b>' + purchasedAmount;
				document.getElementsByClassName('item-adder')[selected].classList.remove('hidden');
				document.getElementsByClassName('item-substract')[selected].classList.add('hidden');
			}
		});

		itemAdd.onclick = (function() {
			// Sumamos una unidad
			purchasedAmount++;

			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[selected];
			let substractButton = document.getElementsByClassName('item-substract')[selected];

			if(purchasedAmount == item.amount) {
				// Ha llegado al máximo
				adderButton.classList.add('hidden');
			} else if(substractButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				substractButton.classList.remove('hidden');
			}

			// Actualizamos la cantidad
			let amountSpan = document.getElementsByClassName('item-amount-description')[selected];
			amountSpan.innerHTML = '<b>Amount: </b>' + purchasedAmount;
		});

		itemSubstract.onclick = (function() {
			// Restamos una unidad
			purchasedAmount--;

			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[selected];
			let substractButton = document.getElementsByClassName('item-substract')[selected];

			if(purchasedAmount == 1) {
				// Ha llegado al mínimo
				substractButton.classList.add('hidden');
			} else if(adderButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				adderButton.classList.remove('hidden');
			}

			// Actualizamos la cantidad
			let amountSpan = document.getElementsByClassName('item-amount-description')[selected];
			amountSpan.innerHTML = '<b>Amount: </b>' + purchasedAmount;
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(imageContainer);
		itemContainer.appendChild(infoContainer);
		imageContainer.appendChild(itemImage);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
		itemAmountContainer.appendChild(addSubstractContainer);
		addSubstractContainer.appendChild(itemSubstract);
		addSubstractContainer.appendChild(itemAdd);
	}

	// Añadimos los botones
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	purchaseButton.textContent = 'Buy';
	cancelButton.textContent = 'Back';

	// Ponemos la función para cada elemento
	purchaseButton.onclick = (function() {
		// Mandamos la acción de compra si ha seleccionado algo
		if(selected != null) {
			mp.trigger('yarp:cefTrigger', 'purchaseSaleItem', id, list[selected]._id, purchasedAmount);
		}
	});

	cancelButton.onclick = (function() {
		// Cerramos la ventana de compra
		populateSaleCategories(id);
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateSaleCategories(id,saleJson) {
	// Inicializamos las opciones
	selected = null;

	// Añadimos el título al menú
	let header = document.getElementById('header');
	if (saleJson) {
		sale = JSON.parse(saleJson.replace(/\r?\n|\r/g, ''));
	}
	header.textContent = id;

	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	let list = [];
	for (key in sale){
		list.push(key);
	}

	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}

	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}

	for(let i = 0; i < list.length; i++) {
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = list[i];

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Seleccionamos el elemento pulsado
			selected = i;

			// Mostramos la página de componentes
			populateSaleItems(id, list[selected], JSON.stringify(sale[list[selected]]));
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}

	// Añadimos el botón
	let exitButton = document.createElement('div');

	// Añadimos las clases al botón
	exitButton.classList.add('single-button', 'cancel-button');

	// Añadimos el texto de los botones
	exitButton.textContent = 'Exit';

	exitButton.onclick = (function() {
		// Cerramos la ventana de compra
		mp.trigger('yarp:cefTrigger', 'destroyBrowser', 'menu');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(exitButton);
}

function populateTunningMenu(tunningComponentsJSON) {
	// Añadimos el título al menú
	let header = document.getElementById('header');
	header.textContent = 'Menú de modificaciones';

	// Obtenemos la lista de componentes
	tunningComponents = JSON.parse(tunningComponentsJSON.replace(/\r?\n|\r/g, ''));

	// Mostramos el menú principal
	populateTunningHome();
}

function populateTunningHome() {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Inicializamos las opciones
	selected = null;
	drawable = null;

	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}

	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}

	for(let i = 0; i < tunningComponents.length; i++) {
		// Obtenemos el objeto en curso
		let group = tunningComponents[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = group.desc;

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Seleccionamos el elemento pulsado
			selected = i;

			// Mostramos la página de componentes
			populateTunningComponents();
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}

	// Añadimos el botón
	let exitButton = document.createElement('div');

	// Añadimos las clases al botón
	exitButton.classList.add('single-button', 'cancel-button');

	// Añadimos el texto de los botones
	exitButton.textContent = 'Salir';

	exitButton.onclick = (function() {
		// Cerramos la ventana de compra
		mp.trigger('yarp:cefTrigger', 'destroyBrowser', 'menu');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(exitButton);
}

function populateTunningComponents() {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}

	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}

	for(let i = 0; i < tunningComponents[selected].components.length; i++) {
		// Obtenemos el componente
		let component = tunningComponents[selected].components[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = component.desc;
		itemPrice.innerHTML = '<b>Precio unitario: </b>' + tunningComponents[selected].products + '$';

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(drawable !== i) {
				// Miramos si había algún elemento seleccionado
				if(drawable != null) {
					let previousSelected = document.getElementsByClassName('item-row')[drawable];
					previousSelected.classList.remove('active-item');
				}

				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');

				// Guardamos el nuevo índice seleccionado
				drawable = i;

				// Actualizamos el tunning del vehículo
				mp.trigger('yarp:cefTrigger', 'addVehicleComponent', tunningComponents[selected].slot, drawable);
			}
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
	}

	// Añadimos los botones
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	purchaseButton.textContent = 'Comprar';
	cancelButton.textContent = 'Atrás';

	// Ponemos la función para cada elemento
	purchaseButton.onclick = (function() {
		// Mandamos la acción de compra si ha seleccionado algo
		if(selected != null) {
			//mp.trigger('yarp:cefTrigger', 'purchaseItem', selected, purchasedAmount);
		}
	});

	cancelButton.onclick = (function() {
		// Volvemos al inicio
		populateTunningHome();
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateFastfoodOrders(ordersJson, distancesJson) {
	// Obtenemos la lista de pedidos
	let fastfoodOrders = JSON.parse(ordersJson.replace(/\r?\n|\r/g, ''));
	let distances = JSON.parse(distancesJson.replace(/\r?\n|\r/g, ''));
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Añadimos la cabecera del menú
	header.textContent = 'Pedidos de comida rápida';

	for(let i = 0; i < fastfoodOrders.length; i++) {
		// Obtenemos el objeto en curso
		let order = fastfoodOrders[i];

		// Calculamos el precio del pedido
		let amount = order.pizzas * PRICE_PIZZA + order.hamburgers * PRICE_HAMBURGER + order.sandwitches * PRICE_SANDWICH;

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = 'Pedido #' + order.id;
		itemPrice.innerHTML = '<b>Pedido: </b>' + amount + '$';
		itemAmount.innerHTML = '<b>Distancia: </b>' + parseFloat(distances[i] / 1000).toFixed(2) + 'km';

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != null) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					previousSelected.classList.remove('active-item');
				}

				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');

				// Guardamos el nuevo índice seleccionado
				selected = i;
			}
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
	}

	// Añadimos los botones
	let deliverButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	deliverButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	deliverButton.textContent = 'Entregar';
	cancelButton.textContent = 'Salir';

	// Ponemos la función para cada elemento
	deliverButton.onclick = (function() {
		// Entregamos el pedido seleccionado
		if(selected != null) {
			mp.trigger('yarp:cefTrigger', 'deliverFastfoodOrder', fastfoodOrders[selected].id);
		}
	});

	cancelButton.onclick = (function() {
		// Cerramos la ventana de pedidos
		mp.trigger('yarp:cefTrigger', 'destroyBrowser', 'menu');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(deliverButton);
	options.appendChild(cancelButton);
}

function populateCrimesMenu(crimesJson, selectedCrimes) {
	// Obtenemos el nodo contenedor
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Añadimos el texto de cabecera y obtenemos la lista de delitos
	let crimesArray = JSON.parse(crimesJson.replace(/\r?\n|\r/g, ''));
	header.textContent = 'Lista de delitos';
	selectedOptions = [];

	if(selectedCrimes.length > 0) {
		// Obtenemos los delitos
		let crimes = JSON.parse(selectedCrimes.replace(/\r?\n|\r/g, ''));

		for(let i = 0; i < crimes.length; i++) {
			// Añadimos el delito
			selectedOptions.push(crimes[i]);
		}
	}

	for(let i = 0; i < crimesArray.length; i++) {
		// Obtenemos el componente
		let crime = crimesArray[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');

		for(let c = 0; c < selectedOptions.length; c++) {
			if(JSON.stringify(crime) === JSON.stringify(selectedOptions[c])) {
				// Marcamos el delito como aplicable
				itemContainer.classList.add('active-item');
				selectedOptions.splice(c, 1);
				selectedOptions.push(crime);
				break;
			}
		}

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = crime.crime;
		itemPrice.innerHTML = '<b>Multa: </b>' + crime.fine + '$';
		itemAmount.innerHTML = '<b>Tiempo: </b>' + crime.jail + 'min.';

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selectedOptions.indexOf(crime) === -1) {
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');

				// Guardamos el índice seleccionado
				selectedOptions.push(crime);
			} else {
				// Eliminamos la selección del elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.remove('active-item');

				// Eliminamos el índice seleccionado
				selectedOptions.splice(selectedOptions.indexOf(crime), 1);
			}
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
	}

	// Añadimos los botones
	let applyButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	applyButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	applyButton.textContent = 'Inculpar';
	cancelButton.textContent = 'Salir';

	// Ponemos la función para cada elemento
	applyButton.onclick = (function() {
		// Entregamos el pedido seleccionado
		if(selectedOptions.length > 0) {
			mp.trigger('yarp:cefTrigger', 'applyCrimes', JSON.stringify(selectedOptions));
		}
	});

	cancelButton.onclick = (function() {
		// Cerramos la ventana de pedidos
		mp.trigger('yarp:cefTrigger', 'destroyBrowser', 'menu');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(applyButton);
	options.appendChild(cancelButton);
}

function populateCharacterList(charactersJson) {
	// Obtenemos el nodo contenedor
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Obtenemos la lista de jugadores
	charactersJson = charactersJson.replace(/\r?\n|\r/g, '');
	let characters = JSON.parse(charactersJson.replace(/\r?\n|\r/g, ''));

	// Añadimos el texto de cabecera
	header.textContent = 'Character list';
	for(id in characters) {
		// Obtenemos el componente
		let character = characters[id];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');
		itemDescription.setAttribute('style', 'white-space: pre;');
		if (character.job == null) {
			character.job = 'Citizen';
		}
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = `${character._id}, ${character._age}\r\n${character.job}`;

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Cargamos el personaje
			mp.trigger('yarp:cefTrigger', 'loadCharacter', character._id);
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}

	// Añadimos los botones
	//if (Object.keys(characters).length < 5){
		let createButton = document.createElement('div');

		// Añadimos las clases a cada botón
		createButton.classList.add('single-button', 'accept-button');

		// Añadimos el texto de los botones
		createButton.textContent = 'New character';

		// Ponemos la función para cada elemento
		createButton.onclick = (function() {
			// Mostramos el menú de creación de personaje
			mp.trigger('yarp:cefTrigger', 'showCharacterCreationMenu');
		});

		// Ordenamos la jerarquía de elementos
		options.appendChild(createButton);
	//}
}

function populateTattooMenu(tattooZoneArray, businessName, priceMultiplier) {
	// Añadimos el título al menú
	let header = document.getElementById('header');
	header.textContent = businessName;

	// Obtenemos las listas de tatuajes
	tattooZones = JSON.parse(tattooZoneArray.replace(/\r?\n|\r/g, ''));
	multiplier = priceMultiplier;

	// Mostramos el menú principal
	populateTattooHome();
}

function populateTattooHome() {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Inicializamos las opciones
	selected = null;
	drawable = null;

	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}

	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}

	for(let i = 0; i < tattooZones.length; i++) {
		// Obtenemos la zona en curso
		let zone = tattooZones[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = zone;

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Seleccionamos el elemento pulsado
			selected = i;

			// Cargamos la lista de tatuajes de la zona
			mp.trigger('yarp:cefTrigger', 'getZoneTattoos', i);
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}

	// Añadimos el botón
	let exitButton = document.createElement('div');

	// Añadimos las clases al botón
	exitButton.classList.add('single-button', 'cancel-button');

	// Añadimos el texto de los botones
	exitButton.textContent = 'Salir';

	exitButton.onclick = (function() {
		// Salimos del menú
		mp.trigger('yarp:cefTrigger', 'exitTattooShop');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(exitButton);
}

function populateZoneTattoos(zoneTattooJson) {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Parseamos el JSON
	let zoneTattooArray = JSON.parse(zoneTattooJson.replace(/\r?\n|\r/g, ''));

	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}

	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}

	for(let i = 0; i < zoneTattooArray.length; i++) {
		// Obtenemos el componente
		let tattoo = zoneTattooArray[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = tattoo.name;
		itemPrice.innerHTML = '<b>Precio: </b>' + Math.round(tattoo.price * multiplier) + '$';

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(drawable !== i) {
				// Miramos si había algún elemento seleccionado
				if(drawable != null) {
					let previousSelected = document.getElementsByClassName('item-row')[drawable];
					previousSelected.classList.remove('active-item');
				}

				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');

				// Guardamos el nuevo índice seleccionado
				drawable = i;

				// Actualizamos los tatuajes
				mp.trigger('yarp:cefTrigger', 'addPlayerTattoo', drawable);
			}
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
	}

	// Añadimos los botones
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	purchaseButton.textContent = 'Comprar';
	cancelButton.textContent = 'Atrás';

	// Ponemos la función para cada elemento
	purchaseButton.onclick = (function() {
		// Mandamos la acción de compra si ha seleccionado algo
		if(selected != null) {
			mp.trigger('yarp:cefTrigger', 'purchaseTattoo', selected, drawable);
		}
	});

	cancelButton.onclick = (function() {
		// Volvemos al inicio
		populateTattooHome();

		// Limpiamos los tatuajes no comprados
		mp.trigger('yarp:cefTrigger', 'clearTattoos');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateHairdresserMenu(faceOptionsJson, selectedFaceJson, businessName) {
	// Obtenemos la lista de opciones
	let faceOptions = JSON.parse(faceOptionsJson.replace(/\r?\n|\r/g, ''));
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Añadimos la cabecera del menú
	header.textContent = businessName;
	selectedOptions = JSON.parse(selectedFaceJson.replace(/\r?\n|\r/g, ''));

	for(let i = 0; i < faceOptions.length; i++) {
		// Obtenemos el objeto en curso
		let face = faceOptions[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let addSubstractContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemAmount = document.createElement('span');
		let itemAdd = document.createElement('span');
		let itemSubstract = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		addSubstractContainer.classList.add('item-add-substract-container');
		itemDescription.classList.add('item-description');
		itemAmount.classList.add('item-amount-description');
		itemAdd.classList.add('item-adder');
		itemSubstract.classList.add('item-substract');

		// Miramos si hay que ocultar los controles
		if(selectedOptions[i] == face.minValue) {
			itemSubstract.classList.add('hidden');
		} else if(selectedOptions[i] == face.maxValue) {
			itemAdd.classList.add('hidden');
		}

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = face.desc;
		itemAmount.innerHTML = '<b>Tipo: </b>' + selectedOptions[i];
		itemAdd.textContent = '+';
		itemSubstract.textContent = '-';

		itemAdd.onclick = (function() {
			// Sumamos una unidad
			selectedOptions[i]++;

			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[i];
			let substractButton = document.getElementsByClassName('item-substract')[i];

			if(selectedOptions[i] == face.maxValue) {
				// Ha llegado al máximo
				adderButton.classList.add('hidden');
			} else if(substractButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				substractButton.classList.remove('hidden');
			}

			// Actualizamos el tipo
			let amountSpan = document.getElementsByClassName('item-amount-description')[i];
			amountSpan.innerHTML = '<b>Tipo: </b>' + selectedOptions[i];

			// Actualizamos la apariencia
			mp.trigger('yarp:cefTrigger', 'updateFacialHair', i, selectedOptions[i]);
		});

		itemSubstract.onclick = (function() {
			// Restamos una unidad
			selectedOptions[i]--;

			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[i];
			let substractButton = document.getElementsByClassName('item-substract')[i];

			if(selectedOptions[i] == face.minValue) {
				// Ha llegado al mínimo
				substractButton.classList.add('hidden');
			} else if(adderButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				adderButton.classList.remove('hidden');
			}

			// Actualizamos el tipo
			let amountSpan = document.getElementsByClassName('item-amount-description')[i];
			amountSpan.innerHTML = '<b>Tipo: </b>' + selectedOptions[i];

			// Actualizamos la apariencia
			mp.trigger('yarp:cefTrigger', 'updateFacialHair', i, selectedOptions[i]);
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
		itemAmountContainer.appendChild(addSubstractContainer);
		addSubstractContainer.appendChild(itemAdd);
		addSubstractContainer.appendChild(itemSubstract);
	}

	// Añadimos los botones
	let acceptButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	acceptButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	acceptButton.textContent = 'Aceptar';
	cancelButton.textContent = 'Salir';

	// Ponemos la función para cada elemento
	acceptButton.onclick = (function() {
		// Guardamos los cambios
		mp.trigger('yarp:cefTrigger', 'applyHairdresserChanges');
	});

	cancelButton.onclick = (function() {
		// Cancelamos el peinado y cerramos la ventana de pedidos
		mp.trigger('yarp:cefTrigger', 'cancelHairdresserChanges');
		mp.trigger('yarp:cefTrigger', 'destroyBrowser', 'menu');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(acceptButton);
	options.appendChild(cancelButton);
}

function populateTownHallMenu(townHallOptionsJson) {
	// Obtenemos la lista de opciones
	let townHallOptions = JSON.parse(townHallOptionsJson.replace(/\r?\n|\r/g, ''));
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Añadimos la cabecera del menú
	header.textContent = 'Trámites del ayuntamiento';
	selected = null;

	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}

	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}

	for(let i = 0; i < townHallOptions.length; i++) {
		// Obtenemos el objeto en curso
		let townHall = townHallOptions[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = townHall.desc;

		if(townHall.price > 0) {
			// Si tiene precio, lo mostramos
			itemPrice.innerHTML = '<b>Precio: </b>' + townHall.price + '$';
		}

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != null) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					previousSelected.classList.remove('active-item');
				}

				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');

				// Guardamos el nuevo índice seleccionado
				selected = i;

				// Cambiamos el texto del botón
				let leftButton = document.getElementsByClassName('accept-button')[0];
				leftButton.textContent = townHall.price > 0 ? 'Pagar' : 'Comprobar';
			}
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
	}

	// Añadimos los botones
	let acceptButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	acceptButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	acceptButton.textContent = 'Pagar';
	cancelButton.textContent = 'Salir';

	// Ponemos la función para cada elemento
	acceptButton.onclick = (function() {
		if(selected != null) {
			// Ejecutamos la acción seleccionada
			mp.trigger('yarp:cefTrigger', 'executeTownHallOperation', selected);
		}
	});

	cancelButton.onclick = (function() {
		// Cerramos la ventana del ayuntamiento
		mp.trigger('yarp:cefTrigger', 'destroyBrowser', 'menu');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(acceptButton);
	options.appendChild(cancelButton);
}

function populateFinesMenu(finesJson) {
	// Obtenemos la lista de opciones
	let finesList = JSON.parse(finesJson.replace(/\r?\n|\r/g, ''));
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	selectedOptions = [];

	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}

	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}

	for(let i = 0; i < finesList.length; i++) {
		// Obtenemos el objeto en curso
		let fine = finesList[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = fine.reason;
		itemPrice.innerHTML = '<b>Cantidad: </b>' + fine.amount + '$';
		itemAmount.innerHTML = '<b>Fecha: </b>' + fine.date.split(' ')[0];

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selectedOptions.indexOf(fine) === -1) {
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');

				// Guardamos el índice seleccionado
				selectedOptions.push(fine);
			} else {
				// Eliminamos la selección del elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.remove('active-item');

				// Eliminamos el índice seleccionado
				selectedOptions.splice(selectedOptions.indexOf(fine), 1);
			}
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
	}

	// Añadimos los botones
	let acceptButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	acceptButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	acceptButton.textContent = 'Pagar';
	cancelButton.textContent = 'Atrás';

	// Ponemos la función para cada elemento
	acceptButton.onclick = (function() {
		if(selectedOptions.length > 0) {
			// Pagamos las multas del jugador
			mp.trigger('yarp:cefTrigger', 'payPlayerFines', JSON.stringify(selectedOptions));
		}
	});

	cancelButton.onclick = (function() {
		// Volvemos al índice del ayuntamiento
		mp.trigger('yarp:cefTrigger', 'backTownHallIndex');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(acceptButton);
	options.appendChild(cancelButton);
}

function populatePoliceControlsMenu(policeControlJson) {
	// Obtenemos la lista de opciones
	let policeControls = JSON.parse(policeControlJson.replace(/\r?\n|\r/g, ''));
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');

	// Añadimos la cabecera del menú
	header.textContent = 'Controles policiales';

	for(let i = 0; i < policeControls.length; i++) {
		// Obtenemos el objeto en curso
		let control = policeControls[i];

		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');

		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');

		// Añadimos el contenido de cada elemento
		itemDescription.textContent = control;

		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != null) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					previousSelected.classList.remove('active-item');
				}

				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');

				// Guardamos el nuevo índice seleccionado
				selected = i;
			}
		});

		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}

	// Añadimos los botones
	let acceptButton = document.createElement('div');
	let cancelButton = document.createElement('div');

	// Añadimos las clases a cada botón
	acceptButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');

	// Añadimos el texto de los botones
	acceptButton.textContent = 'Cargar';
	cancelButton.textContent = 'Salir';

	// Ponemos la función para cada elemento
	acceptButton.onclick = (function() {
		// Procesamos la opción y borramos el navegador
		mp.trigger('yarp:cefTrigger', 'proccessPoliceControlAction');
		mp.trigger('yarp:cefTrigger', 'destroyBrowser', 'menu');
	});

	cancelButton.onclick = (function() {
		// Cerramos la ventana de controles
		mp.trigger('yarp:cefTrigger', 'destroyBrowser', 'menu');
	});

	// Ordenamos la jerarquía de elementos
	options.appendChild(acceptButton);
	options.appendChild(cancelButton);
}

function findFirstChildByClass(element, className) {
	let foundElement = null, found;
	function recurse(element, className, found) {
		for (let i = 0; i < element.childNodes.length && !found; i++) {
			let el = element.childNodes[i];
			let classes = el.className != undefined? el.className.split(' ') : [];
			for (let j = 0, jl = classes.length; j < jl; j++) {
				if (classes[j] == className) {
					found = true;
					foundElement = element.childNodes[i];
					break;
				}
			}
			if(found)
				break;
			recurse(element.childNodes[i], className, found);
		}
	}
	recurse(element, className, false);
	return foundElement;
}
