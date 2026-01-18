function changeQty(button, change) {
    const product = button.closest(".product");
    const qtySpan = product.querySelector(".qty");
    let qty = parseInt(qtySpan.innerText);
    
    qty += change;
    if (qty < 1) qty = 1;
    
    qtySpan.innerText = qty;
    
    // Update WhatsApp link
    const productName = product.querySelector("h2").innerText;
    const orderBtn = product.querySelector(".btn");
    const note = document.querySelector('.note-box').value;

    orderBtn.href =
      "https://wa.me/919519171931?text=" +
      encodeURIComponent(`Order :\n${productName}\nQty :  ${qty}\nRoom No :  ${note}`);
  }