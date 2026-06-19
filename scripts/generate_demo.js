const fs = require('fs');

function generateConfirmation(orderData, items) {
    const template = fs.readFileSync('templates/conferma-ordine.md', 'utf8');
    
    let rows = '';
    items.forEach(item => {
        rows += '| ' + item.sku + ' | ' + item.title + ' | ' + item.quantity + ' | ' + item.price.toFixed(2) + ' € | ' + (item.quantity * item.price).toFixed(2) + ' € |\n';
    });

    return template
        .replace('{{ORDER_ID}}', orderData.id)
        .replace('{{ORDER_DATE}}', orderData.date)
        .replace('{{CUSTOMER_NAME}}', orderData.customerName)
        .replace('{{SHIPPING_ADDRESS}}', orderData.shippingAddress)
        .replace('{{ORDER_ITEMS_ROWS}}', rows)
        .replace('{{TOTAL_AMOUNT}}', orderData.total.toFixed(2));
}

const mockOrder = {
    id: 'ORD-20260619-001',
    date: '2026-06-19',
    customerName: 'Mario Rossi',
    shippingAddress: 'Via Milano 1, 20121 Milano',
    total: 350.50
};

const mockItems = [
    { sku: 'AC200.0073', title: 'Amber glass jar 200ml', quantity: 10, price: 0.65 },
    { sku: 'SC200.0400', title: 'Cristal plastic bottle 200ml', quantity: 5, price: 0.45 }
];

console.log(generateConfirmation(mockOrder, mockItems));
