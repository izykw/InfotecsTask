import { fetchData } from "./api.js";

let listItemsCount = 10;
let sortBy = 'price';
let data = [];

function addListItems() {
	fetchData(listItemsCount)
		.then(res => res.json())
		.then(({ products }) => {
			// Сохраняем полученные продукты,
			// чтобы при сортировке элементов не делать каждый раз новый запрос.
			data = products;
			const list = document.querySelector('.products_list');
			products.forEach(({ id, title }) => {
				const listItem = document.createElement('li');
				listItem.classList.add('products_list_item');
				listItem.id = id;
				listItem.textContent = title;
				list.appendChild(listItem);
			})
			dragAndDrop();
		});
}

function showListItemInfo() {
	const list = document.querySelector('.products_list');
	const productInfoElement = document.querySelector('.products_info');
	const productImage = document.querySelector('.products_image');

	list.addEventListener('mouseover', (e) => {
		const target = e.target;
		if (target.tagName !== 'li'.toUpperCase()) {
			return;
		}
		const id = Number(target.id);
		const item = data.find((item) => item.id === id);
		const { description, price, rating, brand, thumbnail } = item;
		productInfoElement.innerText = `
				brand: ${brand}
				rating: ${rating}
				price: ${price}
				description: ${description}
			`;
		const productImage = document.createElement('img');
		productImage.classList.add('products_image');
		productImage.src = thumbnail;
		productInfoElement.appendChild(productImage);
		productInfoElement.classList.add('show');
	})

	list.addEventListener('mouseout', () => {
		productInfoElement.classList.remove('show');
	})
}

// Не стал использовать события mousedown, mousemove and mouseup,
// так как посчитал, что встроенного api достаточно для данной задачи.
function dragAndDrop() {
	const list = document.querySelector('.products_list');
	const listItems = document.querySelectorAll('.products_list_item');

	listItems.forEach(item => {
		item.draggable = true;
	})

	list.addEventListener('dragstart', (e) => {
		e.target.classList.add('selected');
	})

	list.addEventListener('dragend', (e) => {
		e.target.classList.remove('selected');
	})

	list.addEventListener('dragover', (e) => {
		e.preventDefault();

		const activeElement = list.querySelector('.selected');
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

		list.insertBefore(activeElement, nextElement);
	})
}

function getNextElement(cursorPosition, currentElement) {
	const currentElementCoordinates = currentElement.getBoundingClientRect();
	const currentElementCenter = currentElementCoordinates.y +
		currentElementCoordinates.height / 2;


	return (cursorPosition < currentElementCenter) ?
		currentElement :
		currentElement.nextElementSibling;
}

addListItems();
showListItemInfo();
