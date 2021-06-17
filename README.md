
Welcome to Blog101, a blog built with express backend, Nextjs and bootstrap in the frontend.


**1 - Clone the project:**

    git clone https://github.com/yons101/blog.git
    cd blog

**2 - Install dependencies**

    npm install
    cd ./frontend | npm install
    

**3 - Setup database and env:**

    in config/config.json
    create .env file in root folder with content:
    ACCESS_TOKEN_SECRET=YOUR_TOKEN

**4 - Migrate, seed:**

    npm run migrate
    
**5 - Serve express Backend:**

    npm run start
    
**6 - Serve Nextjs Frontend**

    npm run dev


**_Technologies and packages used:_**

Backend :

    express, jsonwebtoken, mysql2, sequilize, bcryptjs, cors, faker, nodemon

Frontend:

    NextJs, react-paginate, react-bootstrap-sweetalert, Bootstrap 5

