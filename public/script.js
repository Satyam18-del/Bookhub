const api = "/books";

let currentUser = "";

// ================= LOGIN CHECK =================

fetch("/check")
.then(res => res.json())
.then(data => {

    if(!data.loggedIn){

        window.location = "login.html";
        return;

    }

    fetch("/currentUser")
    .then(res => res.json())
    .then(user => {

        currentUser = user.username;

        loadBooks();

    });

});


// ================= SEARCH =================

document.addEventListener("DOMContentLoaded",()=>{

    const search=document.getElementById("search");

    search.addEventListener("keyup",function(){

        const value=this.value.toLowerCase();

        document.querySelectorAll(".book-card").forEach(card=>{

            const title=card.querySelector(".book-title").innerText.toLowerCase();

            if(title.includes(value)){

                card.parentElement.style.display="block";

            }else{

                card.parentElement.style.display="none";

            }

        });

    });

});


// ================= LOAD BOOKS =================

async function loadBooks(){

    const res=await fetch(api);

    const books=await res.json();

    const container=document.getElementById("bookContainer");

    container.innerHTML="";

    books.forEach(book=>{

        let deleteButton="";

        if(book.owner===currentUser){

            deleteButton=`

            <button
                class="btn btn-danger delete-btn mt-2"
                onclick="deleteBook(${book.id})">

                Delete

            </button>

            `;

        }

        container.innerHTML+=`

<div class="col-lg-4 col-md-6">

    <div class="book-card">

        <img src="${book.cover}" alt="${book.title}">

        <div class="book-content">

            <h4 class="book-title">

                ${book.title}

            </h4>

            <p class="author">

                Author: ${book.author}

            </p>

            <p>

                <b>Seller:</b> ${book.owner}

            </p>

            <div class="rating">

                ⭐⭐⭐⭐⭐

            </div>

            <div class="price">

                ₹${book.price}

            </div>

            <span class="badge bg-success mb-3">

                ${book.status}

            </span>

            <button
                class="buy-btn"
                onclick="buyBook(
                    ${book.id},
                    '${book.title}',
                    '${book.price}',
                    '${book.cover}'
                )">

                🛒 Buy Now

            </button>

            ${deleteButton}

        </div>

    </div>

</div>

`;

    });

}


// ================= ADD BOOK =================

async function addBook(){

    const title=document.getElementById("title").value;

    const author=document.getElementById("author").value;

    const price=document.getElementById("price").value;

    const cover=document.getElementById("cover").files[0];

    if(!title || !author || !price || !cover){

        alert("Please fill all fields.");

        return;

    }

    const formData=new FormData();

    formData.append("title",title);

    formData.append("author",author);

    formData.append("price",price);

    formData.append("cover",cover);

    const response=await fetch("/books",{

        method:"POST",

        body:formData

    });

    const result=await response.json();

    alert(result.message);

    document.getElementById("title").value="";

    document.getElementById("author").value="";

    document.getElementById("price").value="";

    document.getElementById("cover").value="";

    loadBooks();

}


// ================= DELETE =================

async function deleteBook(id){

    if(confirm("Delete this book?")){

        await fetch("/books/"+id,{

            method:"DELETE"

        });

        loadBooks();

    }

}


// ================= BUY =================

function buyBook(id,title,price,image){

    localStorage.setItem("bookId",id);

    localStorage.setItem("bookTitle",title);

    localStorage.setItem("bookPrice",price);

    localStorage.setItem("bookImage",image);

    window.location="payment.html";

}


// ================= LOGOUT =================

async function logout(){

    await fetch("/logout");

    window.location="login.html";

}