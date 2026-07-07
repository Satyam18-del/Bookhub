// ================= LOAD BOOK DETAILS =================

document.getElementById("bookTitle").innerText =
localStorage.getItem("bookTitle");

document.getElementById("bookPrice").innerText =
localStorage.getItem("bookPrice");

document.getElementById("bookImage").src =
localStorage.getItem("bookImage");


// ================= PAYMENT =================

async function payNow(){

    const customer=document.getElementById("customer").value;

    const phone=document.getElementById("phone").value;

    const address=document.getElementById("address").value;

    const payment=document.getElementById("payment").value;

    if(customer=="" || phone=="" || address==""){

        alert("Please fill all details.");

        return;

    }

    localStorage.setItem("customer",customer);

    localStorage.setItem("phone",phone);

    localStorage.setItem("address",address);

    localStorage.setItem("paymentMethod",payment);

    // ================= SAVE PURCHASE =================

    const response = await fetch(

        "/purchase/" + localStorage.getItem("bookId"),

        {

            method:"POST"

        }

    );

    const data = await response.json();

    if(data.success){

        window.location="success.html";

    }else{

        alert(data.message);

    }

}