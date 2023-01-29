export function fetchData(count) {
	return (fetch(`https://dummyjson.com/products?limit=${count}`)
		.then(res => res.json()))
		.catch(err => console.error(err));
}