export function fetchData(count) {
	return fetch(`https://dummyjson.com/products?limit=${count}`)
}