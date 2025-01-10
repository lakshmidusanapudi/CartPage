document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');

    const fetchCartData = async () => {
        try {
            console.log("Fetching cart data...");
            const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
            
            console.log("Response status:", response.status);
        
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const cartData = await response.json();
            console.log("Fetched cart data:", cartData);
            let subtotal = 0;
            cartItemsContainer.innerHTML = ''; 
        
            cartData.items.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                subtotal += itemSubtotal;
        
                // Create table row for each item
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img src="${item.image}" alt="${item.title}" class="product-image" >
                    </td>
                    <td class="product-name">${item.title}</td>
                    <td>₹${item.price.toLocaleString('en-IN')}</td>
                    <td><input type="number" value="${item.quantity}" class="quantity" data-id="${item.id}" data-price="${item.price}"></td>
                    <td class="item-subtotal">₹${itemSubtotal.toLocaleString('en-IN')}</td>
                    <td><i class="fa-solid fa-trash delete-icon" data-id="${item.id}"></i></td>
                `;
                cartItemsContainer.appendChild(row);
            });
        
            // Update the subtotal and total
            subtotalElement.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
            totalElement.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        
            // Add event listener for quantity changes
            cartItemsContainer.addEventListener('input', (event) => {
                if (event.target.classList.contains('quantity')) {
                    const quantityInput = event.target;
                    const productId = quantityInput.dataset.id;
                    const productPrice = parseFloat(quantityInput.dataset.price);
                    const newQuantity = parseInt(quantityInput.value, 10);
        
                    if (newQuantity >= 0) {
                        // Update item subtotal
                        const newItemSubtotal = productPrice * newQuantity;
                        const itemSubtotalElement = quantityInput.closest('tr').querySelector('.item-subtotal');
                        itemSubtotalElement.textContent = `₹${newItemSubtotal.toLocaleString('en-IN')}`;
        
                        // Update the cart subtotal and total
                        let newSubtotal = 0;
                        document.querySelectorAll('.quantity').forEach(input => {
                            const price = parseFloat(input.dataset.price);
                            const quantity = parseInt(input.value, 10);
                            newSubtotal += price * quantity;
                        });
        
                        subtotalElement.textContent = `₹${newSubtotal.toLocaleString('en-IN')}`;
                        totalElement.textContent = `₹${newSubtotal.toLocaleString('en-IN')}`;
                    }
                }
            });
        
            // Add event listener for delete icon
            cartItemsContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('delete-icon')) {
                    const deleteIcon = event.target;
                    const productId = deleteIcon.dataset.id;
        
                    // Find the row to delete
                    const rowToDelete = deleteIcon.closest('tr');
                    rowToDelete.remove();
        
                    // Recalculate the subtotal and total
                    let newSubtotal = 0;
                    document.querySelectorAll('.quantity').forEach(input => {
                        const price = parseFloat(input.dataset.price);
                        const quantity = parseInt(input.value, 10);
                        newSubtotal += price * quantity;
                    });
        
                    subtotalElement.textContent = `₹${newSubtotal.toLocaleString('en-IN')}`;
                    totalElement.textContent = `₹${newSubtotal.toLocaleString('en-IN')}`;
                }
            });
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
        
        
    };

    
    fetchCartData();

})
function toggleNav() {
    const nav = document.querySelector('.header .nav');
    nav.classList.toggle('show');
}