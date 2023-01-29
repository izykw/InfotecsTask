import { fetchData } from "./api.js";

const productsList = document.querySelector('.products_list');
const productsCountElement = document.querySelector('.products_count');
const productsCountButton = document.querySelector('.set_products_count');
const productsSortElement = document.querySelector('.products_sort');
const productInfo = document.createElement('div');
productInfo.classList.add('product_info');
const productImage = document.createElement('img');
productImage.classList.add('product_image');

let productsCount = 10;
let products = [];

productsList.addEventListener('mouseover', showProductInfo);
productsList.addEventListener('mouseout', hideProductInfo);
productsList.addEventListener('dragstart', (e) => {
	e.target.classList.add('selected');
});
productsList.addEventListener('dragstart', (e) => {
	e.target.classList.add('selected');
});
productsList.addEventListener('dragend', (e) => {
	e.target.classList.remove('selected');
});
productsList.addEventListener('dragover', dragAndDrop);
productsCountElement.addEventListener('keydown', (e) => {
	if (e.key !== 'Enter') {
		return;
	}

	const count = Number(e.target.value);
	setProductsCount(count);
	addProductsToList();
})
productsCountButton.addEventListener('click', () => {
	const count = Number(productsCountElement.value);
	setProductsCount(count);
	addProductsToList();
})
productsSortElement.addEventListener('change', (e) => {
	sortProducts(e);
	updateProductsList();
})

function addProductsToList() {
	fetchData(productsCount).then(data => {
		// Сохраняем полученные продукты,
		// чтобы при сортировке элементов не делать каждый раз новый запрос.
		products = data.products;
		updateProductsList();
	})
}

function updateProductsList() {
	// Очищаем предыдущий список элементов
	productsList.innerHTML = '';

	products.forEach(({ id, title }) => {
		const listItem = document.createElement('li');
		listItem.classList.add('products_list_item');
		listItem.id = id;
		listItem.textContent = title;
		productsList.appendChild(listItem)
	});
}

function showProductInfo(e) {
	const target = e.target;
	if (target.tagName !== 'li'.toUpperCase()) {
		return;
	}

	const id = Number(target.id);
	const item = products.find((item) => item.id === id);
	const { description, price, rating, brand, thumbnail } = item;

	productInfo.innerText = `
				brand: ${brand}
				rating: ${rating}
				price: ${price}
				description: ${description}
			`;
	productImage.src = thumbnail;
	productInfo.appendChild(productImage);
	productInfo.classList.add('show');
	target.appendChild(productInfo);


	const image = document.createElement('img');
	image.classList.add('product_image');

	const element = document.createElement('div');
	element.classList.add('product_info');
}

function hideProductInfo() {
	productInfo.classList.remove('show');
}

// Не стал использовать события mousedown, mousemove and mouseup,
// так как посчитал, что встроенного api достаточно для данной задачи.
function dragAndDrop(e) {
	e.preventDefault();

	setListItemsDraggable();

	const activeElement = productsList.querySelector('.selected');
	const currentElement = e.target;

	// Проверяем, что событие сработало:
	// 1. Именно на элементе списка
	// 2. И не на том элементе, который мы перемещаем
	const isMovable = activeElement !== currentElement &&
		currentElement.classList.contains('products_list_item');

	if (!isMovable) {
		return;
	}

	const nextElement = getNextElement(e.clientY, currentElement);

	if (nextElement &&
		activeElement === nextElement.previousElementSibling ||
		activeElement === nextElement) {
		return;
	}

	productsList.insertBefore(activeElement, nextElement);
}

function setListItemsDraggable() {
	const listItems = document.querySelectorAll('.products_list_item');

	listItems.forEach(item => {
		item.draggable = true;
	})
}

export function getNextElement(cursorPosition, currentElement) {
	const currentElementCoordinates = currentElement.getBoundingClientRect();
	const currentElementCenter = currentElementCoordinates.y +
		currentElementCoordinates.height / 2;


	return (cursorPosition < currentElementCenter) ?
		currentElement :
		currentElement.nextElementSibling;
}

function setProductsCount(count) {
	if (count < 0 || count > 100) {
		alert('Количество выводимых элементов должно быть в диапазоне от 0 до 100');
		return;
	}
	productsCount = count;
}

function sortProducts(e) {
	const option = e.target.value;

	switch (option) {
		case 'title': {
			products = products.sort((a,b) => {
				// Для сортировки по алфавиту, чтобы не учитывался регистр.
				const firstTitle = a.title.toLowerCase();
				const secondTitle = b.title.toLowerCase();

				if(firstTitle > secondTitle) {
					return 1;
				}
				if(firstTitle < secondTitle) {
					return -1;
				}
				return 0;
			});
			break;
		}
		case 'price': {
			products = products.sort((a, b) =>  a.price - b.price);
			break;
		}
		default: {
			console.log('There is no such case.')
		}
	}
}

addProductsToList();