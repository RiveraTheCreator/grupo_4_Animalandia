const express = require('express');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
//Declaracion de manejadores de las rutas
const mainRoutes = require('./routes/main.js');
const productsRoutes = require('./routes/products.js');
const usersRoutes = require('./routes/users.js');

//Bases de datos
const DB = require('./database/models');
const OP = DB.Sequelize.Op;

const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');
const publicPath = path.resolve(__dirname, './public');
const app = express();
app.use(express.static(publicPath));
//Middlewares
    //Middleware session
app.use(session({
    secret: 'Little secret',
    resave: false,
    saveUninitialized: false
}))
    //Middleware de aplicacion locals
app.use(userLoggedMiddleware);


//Declaración de uso de EJS
app.set("view engine","ejs");
//MiddleWares
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Derivación a manejadores de rutas
app.use('/', mainRoutes);
app.use('/productos', productsRoutes);
app.use('/usuarios',usersRoutes);

//------------APIS-------------------
app.get('/api/users', (req, res) => {
    DB.Users
    .findAll()
    .then(users => {
        //console.log(users);
       let newData =  users.map(user=>{
            delete user.dataValues.u_password;
            delete user.dataValues.picture;
            delete user.dataValues.phone;
            delete user.dataValues.streetName;
            delete user.dataValues.country;
            delete user.dataValues.postalCode;
            return {
                ...user.dataValues, 
                detail:`/api/users/${user.dataValues.user_id}`
            }
        })
        console.log(newData);
        return res.status(200).json({
            total: users.length,
            data: newData,
            status: 200
        })
    })
});

app.get('/api/users/:id', (req, res) => {
    DB.Users
    .findByPk(req.params.id)
    .then(user => {
        delete user.dataValues.u_password;
        delete user.dataValues.picture;
        console.log(user);
        return res.status(200).json({
            data: {
                ...user.dataValues,
                picture:'https://www.thepeakid.com/wp-content/uploads/2016/03/default-profile-picture.jpg'
            },
            status: 200
        })
    })
});

app.get('/api/products', (req, res) => {
    DB.Products
    .findAll()
    .then(products => {
        return res.status(200).json({
            total: products.length,
            data: products,
            status: 200
        })
        
    })
});

app.get('/api/products/:id', (req, res) => {
    DB.Products
    .findByPk(req.params.id)
    .then(product => {
        delete product.dataValues.image_p;
        let newData = product.dataValues;
        return res.status(200).json({
            data: {
                ...newData,
                picture:'http://www.clker.com/cliparts/c/W/h/n/P/W/generic-image-file-icon-hi.png',
            },
            status: 200
        })
    })
});

app.get('/api/categories', (req, res) => {
    DB.Categories
    .findAll()
    .then(categories => {
        return res.status(200).json({
            total: categories.length,
            data: categories,
            status: 200
        })
    })
});

//Error 404
app.use((req,res,next)=>{
    res.status(404).send('ERROR 404 Ruta no encontrada');
    next();
});

//Montar el servidor
app.listen(3002, ()=>{console.log('Server Arriba');});