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

    orderBtn.href =
      "https://wa.me/919519171931?text=" +
      encodeURIComponent(`I want to order ${qty} x ${productName}`);
  }
