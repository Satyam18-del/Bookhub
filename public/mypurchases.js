async function load(){

    const res=await fetch("/myPurchases");

    const books=await res.json();

    const container=document.getElementById("books");

    container.innerHTML="";

    books.forEach(book=>{

        container.innerHTML+=`

<div class="col-md-4">

<div class="book-card">

<img src="${book.cover}">

<div class="book-content">

<h4>${book.title}</h4>

<p>${book.author}</p>

<p>₹${book.price}</p>

<span class="badge bg-success">

Purchased

</span>

</div>

</div>

</div>

`;

    });

}

load();