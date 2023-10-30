const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('prova_crud_seq','root','senai',{
    dialect : 'mysql',
    host : 'localhost'
})

// sequelize.authenticate().then(()=>{
//     console.log(`Banco de dados conectado com sucesso`)
// }).catch((err)=>{
//     console.log(`Não foi possível conectar ao Banco de dados`)
// })

module.exports = sequelize