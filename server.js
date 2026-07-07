const multer = require("multer");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: "bookstore",
    resave: false,
    saveUninitialized: true,
  })
);

const db = new sqlite3.Database("./database.db");

db.run(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
email TEXT UNIQUE,
password TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS books(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    price INTEGER,
    cover TEXT,
    owner TEXT,
    buyer TEXT,
    status TEXT DEFAULT 'Available'
)
`);
// Create default user
db.get("SELECT * FROM users WHERE username='admin'", (err, row) => {

    if(!row){

        db.run(

            "INSERT INTO users(username,email,password) VALUES(?,?,?)",

            [

                "admin",

                "admin@bookhub.com",

                "1234"

            ]

        );

    }

});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });
// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, row) => {
      if (row) {
        req.session.user = username;
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});
app.post("/register", (req, res) => {

    const { username, email, password } = req.body;

    db.get(

        "SELECT * FROM users WHERE username=? OR email=?",

        [username, email],

        (err, row) => {

            if(row){

                return res.json({

                    success:false,

                    message:"Username or Email already exists."

                });

            }

            db.run(

                "INSERT INTO users(username,email,password) VALUES(?,?,?)",

                [username,email,password],

                function(err){

                    if(err){

                        return res.json({

                            success:false,

                            message:"Registration Failed"

                        });

                    }

                    res.json({

                        success:true,

                        message:"Registration Successful"

                    });

                }

            );

        }

    );

});
// Check Login
app.get("/check", (req, res) => {

  if (req.session.user) {

    res.json({ loggedIn: true });

  } else {

    res.json({ loggedIn: false });

  }

});


// ================= CURRENT USER =================

app.get("/currentUser", (req, res) => {

    res.json({

        username: req.session.user

    });

});


// ================= LOGOUT =================

app.get("/logout", (req, res) => {

  req.session.destroy();

  res.json({ message: "Logged Out" });

});
// Books
app.get("/books", (req, res) => {

    db.all(

        "SELECT * FROM books WHERE status='Available'",

        (err, rows) => {

            res.json(rows);

        }

    );

});
app.post("/purchase/:id", (req, res) => {

    if(!req.session.user){

        return res.status(401).json({

            success:false,

            message:"Please login."

        });

    }

    db.run(

        "UPDATE books SET buyer=?, status='Sold' WHERE id=?",

        [

            req.session.user,

            req.params.id

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    success:false,

                    message:err.message

                });

            }

            res.json({

                success:true,

                message:"Purchase Successful"

            });

        }

    );

});
app.get("/myPurchases", (req, res) => {

    db.all(

        "SELECT * FROM books WHERE buyer=?",

        [

            req.session.user

        ],

        (err, rows)=>{

            res.json(rows);

        }

    );

});
app.post("/books", upload.single("cover"), (req, res) => {

    const { title, author, price } = req.body;

    if (!req.file) {

        return res.status(400).json({

            message: "Please upload a cover image."

        });

    }

    const cover = "/uploads/" + req.file.filename;

    const owner = req.session.user;

    db.run(

        "INSERT INTO books(title, author, price, cover, owner) VALUES(?,?,?,?,?)",

        [title, author, price, cover, owner],

        function(err){

            if(err){

                return res.status(500).json({

                    success:false,

                    message:err.message

                });

            }

            res.json({

                success:true,

                message:"Book Added Successfully"

            });

        }

    );

});
app.delete("/books/:id", (req, res) => {
  db.run(
    "DELETE FROM books WHERE id=?",
    [req.params.id],
    () => {
      res.json({ message: "Deleted" });
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});