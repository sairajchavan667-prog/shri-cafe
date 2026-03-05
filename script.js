let cart = [];

// Load cart from localStorage on page load
window.onload = function(){
    const loader = document.getElementById("loader");
    if(loader){
        loader.style.display = "none";
    }

    const stored = localStorage.getItem("cart");
    if(stored) cart = JSON.parse(stored);

    updateCart();
}

function searchFood(){
    let input = document.getElementById("search").value.toLowerCase().trim();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card=>{
        let title = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = (title.includes(input) || input === "") ? "block" : "none";
    });
}

// Add to cart with quantity support
function addToCart(item, price) {
    const existing = cart.find(p => p.item === item);
    if(existing){
        existing.qty += 1;
    } else {
        cart.push({item, price, qty:1});
    }
    let cartButton = document.querySelector(".cart-btn");

cartButton.classList.add("shake");

setTimeout(()=>{
cartButton.classList.remove("shake");
},300);
    saveCart();
    updateCart();
}

// Update cart popup
function updateCart() {
    let cartItems = document.getElementById("cart-items");
    let cartCount = document.getElementById("cart-count");
    let cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((product, index)=>{
        total += product.price * product.qty;
        cartItems.innerHTML += `
        <li>
            ${product.item} - ₹${product.price} x ${product.qty} = ₹${product.price*product.qty}
            <br><button onclick="changeQty(${index}, -1)">➖</button>
            <button onclick="changeQty(${index}, 1)">➕</button>
            <button onclick="removeItem(${index})">❌</button>
        </li>`;
    });

    cartCount.innerText = cart.reduce((sum,p)=>sum+p.qty, 0);
    cartTotal.innerText = total;
}

// Change quantity
function changeQty(index, delta){
    cart[index].qty += delta;
    if(cart[index].qty <= 0) cart.splice(index,1);
    saveCart();
    updateCart();
}

// Remove single item
function removeItem(index){
    cart.splice(index,1);
    saveCart();
    updateCart();
}

// Save cart in localStorage
function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
}
function clearCart(){
    cart = [];
    saveCart();
    updateCart();
}
// Toggle cart popup
function toggleCart(){
    document.getElementById("cart-popup").classList.toggle("active");
}

// Checkout via WhatsApp
function checkout(){

    let name = document.getElementById("cust-name").value;
    let address = document.getElementById("cust-address").value;
    let number = document.getElementById("cust-number").value;

    if(cart.length === 0){
        alert("Cart is empty!");
        return;
    }

    if(name === "" || address === "" || number === "" ){
        alert("Please enter name and address and number");
        return;
    }

    let message = "New Order\n\n";
    message += "Name: " + name + "\n";
    message += "Address: " + address + "\n";
     message += "Number: " + number + "\n\n";

    let total = 0;

    cart.forEach(item=>{
        message += `${item.item} - ₹${item.price} x ${item.qty} = ₹${item.price*item.qty}\n`;
        total += item.price * item.qty;
    });

    message += "\nTotal: ₹"+total;

    window.open("https://wa.me/918857082324?text="+encodeURIComponent(message));

    alert("Order Sent Successfully!");

   

showSuccess();

    clearCart();
}
function showSuccess(){
document.getElementById("success-popup").style.display="flex";
}

function closeSuccess(){
document.getElementById("success-popup").style.display="none";
}
function addReview(){

let name = document.getElementById("review-name").value;
let text = document.getElementById("review-text").value;

if(name === "" || text === ""){
alert("Please fill all fields");
return;
}

let reviewBox = document.createElement("div");
reviewBox.classList.add("review-box");

reviewBox.innerHTML = `
<p>⭐⭐⭐⭐⭐</p>
<strong>${name}</strong>
<p>${text}</p>
`;

document.getElementById("review-list").prepend(reviewBox);

document.getElementById("review-name").value = "";
document.getElementById("review-text").value = "";
}