module.exports = (sequelize, dataTypes) => {
    let alias = "Carrito";
    
    let cols = {
        order_id:{
            type: dataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: dataTypes.INTEGER.UNSIGNED
        },
        total_items: {
            type: dataTypes.INTEGER
        },
        total_amount: {
            type: dataTypes.FLOAT
        },
        carrito_date: {
            type: dataTypes.DATE
        }
    };
    
    let config = {
        tableName: "carrito",
        timestamps: false
    }
    
    const Carrito = sequelize.define(alias, cols, config);


    return Carrito;
}