console.clear();

// On load, check and update badge from LocalStorage or cookies
window.onload = function() {
    updateCartFromStorage();
    if (document.cookie.indexOf(',counter=') >= 0) {
        let counter = document.cookie.split(',')[1].split('=')[1];
        document.getElementById("badge").innerHTML = counter;
    }
};

// Function to update cart items from LocalStorage
function updateCartFromStorage() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalAmount = 0;
    let counter = cart.length;
    
    document.getElementById("totalItem").innerHTML = `Total Items: ${counter}`;
    
    cart.forEach(item => {
        dynamicCartSection(item, item.quantity);
        totalAmount += item.price * item.quantity;
    });
    
    amountUpdate(totalAmount);
}

// Function to add item to the cart and persist it in LocalStorage
function addToCart(product, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;  // If item exists, update the quantity
    } else {
        product.quantity = quantity;  // Set quantity if new item
        cart.push(product);
    }

    // Update LocalStorage and the cart display
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartFromStorage();
}

// Function to remove item from the cart and update LocalStorage
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);  // Remove item

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartFromStorage();  // Re-render cart after removal
}

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN THE CART
function dynamicCartSection(ob, itemCounter) {
    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';
    boxContainerDiv.appendChild(boxDiv);

    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxDiv.appendChild(boxImg);

    let boxh3 = document.createElement('h3');
    let h3Text = document.createTextNode(ob.name + ' × ' + itemCounter);
    boxh3.appendChild(h3Text);
    boxDiv.appendChild(boxh3);

    let boxh4 = document.createElement('h4');
    let h4Text = document.createTextNode('Amount: Rs ' + ob.price * itemCounter);
    boxh4.appendChild(h4Text);
    boxDiv.appendChild(boxh4);

    cartContainer.appendChild(boxContainerDiv);
    cartContainer.appendChild(totalContainerDiv);

    return cartContainer;
}

let totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

let totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement('h2');
let h2Text = document.createTextNode('Total Amount');
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount) {
    let totalh4 = document.createElement('h4');
    let totalh4Text = document.createTextNode('Amount: Rs ' + amount);
    totalh4.id = 'toth4';
    totalh4.appendChild(totalh4Text);
    totalDiv.appendChild(totalh4);
    totalDiv.appendChild(buttonDiv);
}

let buttonDiv = document.createElement('div');
buttonDiv.id = 'button';
totalDiv.appendChild(buttonDiv);

let buttonTag = document.createElement('button');
buttonDiv.appendChild(buttonTag);

let buttonLink = document.createElement('a');
buttonLink.href = '/orderPlaced.html?';
buttonTag.appendChild(buttonLink);

let buttonText = document.createTextNode('Place Order');
buttonTag.onclick = function() {
    console.log("clicked");
    clearCart();  // Clear cart on order placement
};

// Clear cart function
function clearCart() {
    localStorage.removeItem('cart');  // Clear the cart from LocalStorage
    document.cookie = "counter=0";  // Optionally reset counter cookie
    document.getElementById("cartContainer").innerHTML = '<p>Your cart is empty.</p>';
    amountUpdate(0);  // Reset total
    console.log('Cart cleared');
}

// Backend call 
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status == 200) {
        contentTitle = JSON.parse(this.responseText);

        let counter = Number(document.cookie.split(',')[1].split('=')[1]);
        document.getElementById("totalItem").innerHTML = 'Total Items: ' + counter;

        let item = document.cookie.split(',')[0].split('=')[1].split(" ");
        let totalAmount = 0;
        for (let i = 0; i < counter; i++) {
            let itemCounter = 1;
            for (let j = i + 1; j < counter; j++) {
                if (Number(item[j]) === Number(item[i])) {
                    itemCounter += 1;
                }
            }
            totalAmount += Number(contentTitle[item[i] - 1].price) * itemCounter;
            dynamicCartSection(contentTitle[item[i] - 1], itemCounter);
            i += (itemCounter - 1);
        }
        amountUpdate(totalAmount);
    }
};

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
httpRequest.send();
