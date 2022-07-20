let socket = io.connect();
var today = new Date();

function renderproducto(prodData) {
	let html = prodData
		.map(function (elem, index) {
			return `<tr>
                    <td>${elem.title}</td>
					<td>${elem.price}</td>
					<td><img src=${elem.thumbnail} width=40 height=40></td>
					</tr>`;
		})
		.join(" ");
	document.getElementById("ProductList").innerHTML = html;
}
socket.on("productos", function (prodData) {
	renderproducto(prodData);
});

function addproducto(e) {
	let producto = {
		title: document.getElementById("title").value,
		price: document.getElementById("price").value,
		thumbnail: document.getElementById("thumbnail").value,
	};
	socket.emit("new-producto", producto);
	document.getElementById("formProd").reset();
	return false;
}

function render(data) {
	var html = data
		.map(function (elem, index) {
			return `<div><strong style="color:#008B8B">${
				elem.email
			}</strong> <span style="color:#660000">[${today.toLocaleString("en-US")}]</span>:
				<em style="color:#5072A7">${elem.text}</em></div>`;
		})
		.join(" ");
	document.getElementById("messages").innerHTML = html;
}
socket.on("messages", function (data) {
	render(data);
});

function addMessage(e) {
	var mensaje = {
		email: document.getElementById("email").value,
		text: document.getElementById("texto").value,
	};
	socket.emit("new-message", mensaje);
	document.getElementById("formMess").reset();
	return false;
}
