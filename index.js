const express = require('express')
const app = express()
const hbs = require('express-handlebars')
const conn = require('./db/conn')
const Gerente = require('./models/Gerente')
const Setor = require('./models/Setor')
const Atividade = require('./models/Atividade')

const port = 3000
const hostname = 'localhost'

let log = false
let nome_gerente = ``

// ========== express ===========
app.use(express.urlencoded({extends:true}))
app.use(express.json())
app.use(express.static('public'))
// ========== handlebars ===========
app.set('view engine','handlebars')
app.engine('handlebars',hbs.engine())
// ============= CRUD SETOR ================

// =============== LOGIN =================
app.post('/', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha

    const pesquisa_cadastrar = await Gerente.findOne({raw:true, where : {email:email,senha:senha}})

    if(pesquisa_cadastrar == null){
        res.render('home',{log})
        console.log('Usuário não encontrado')
    }else if(pesquisa_cadastrar.email == email && pesquisa_cadastrar.senha == senha){
        log = true
        nome_gerente = pesquisa_cadastrar.email
        res.render('home',{log,nome_gerente})
        console.log('Usuário encontrado')
    }else{
        res.render('home',{log})
        console.log('Usuário não encontrado')
    }
})
// ================ ATIVIDADE ==================
// =========== ATIVIDADE ATUALIZAR =============
app.post('/atividade_atualizar', async (req,res)=>{
    const num_atividade = Number(req.body.num_atividade)
    const nome_atividade = req.body.nome_atividade
    const setorId = Number(req.body.setorId)

    const atividade_pesquisa_atualizar = await Atividade.findOne({raw:true, where : {num_atividade:num_atividade}})

    if(atividade_pesquisa_atualizar !== null){
        const dados_atividade = {
            num_atividade : num_atividade,
            nome_atividade : nome_atividade,
            setorId : setorId
        }
        if((typeof num_atividade == 'number')&&(typeof nome_atividade == 'string')&&(typeof setorId == 'number')){
            await Atividade.update(dados_atividade,{where:{num_atividade:num_atividade}})
            console.log(dados_atividade)
            console.log(`Atividade Atualizado`)
            res.render('atividade_listar',{log,nome_gerente})
        }else{
            console.log(`Atividade Não Atualizado`)
            res.render('atividade_listar',{log,nome_gerente})
        }
    }else{
        console.log(`Atividade Não Atualizado`)
        res.render('atividade_listar',{log,nome_gerente})
    }
})
// =========== ATIVIDADE APAGAR =============
app.post('/atividade_apagar', async (req,res)=>{
    const num_atividade = Number(req.body.num_atividade)

    const pesquisa_apagar = await Atividade.findOne({raw:true, where : {num_atividade:num_atividade}})

    if(num_atividade == null){
        res.render('home',{log,nome_gerente})
        console.log('Tipo de dado inválido para apagar')
    }else if(pesquisa_apagar.num_atividade == num_atividade){
        Atividade.destroy({raw:true,where:{num_atividade}})
        res.render('atividade_listar',{log,nome_gerente})
        console.log('Tipo de dado válido para apagar')
    }else{
        res.render('home',{log,nome_gerente})
        console.log('Tipo de dado inválido para apagar')
    }
})
// =========== ATIVIDADE CADASTRAR ============
app.post('/atividade_cadastrar', async (req,res)=>{
    const num_atividade = Number(req.body.num_atividade)
    const nome_atividade = req.body.nome_atividade
    const setorId = Number(req.body.setorId)

    if(num_atividade == null || nome_atividade == null || setorId == null){
        res.render('home',{log,nome_gerente})
        console.log('Tipo de dado inválido para cadastrar')
    }else if(typeof num_atividade == 'number' && typeof nome_atividade == 'string' && typeof setorId == 'number'){
        Atividade.create({num_atividade,nome_atividade,setorId})
        res.render('setor_listar',{log,nome_gerente})
        console.log('Tipo de dado válido para cadastrar')
    }else{
        res.render('home',{log,nome_gerente})
        console.log('Tipo de dado inválido para cadastrar atividade')
    }
})
// =========== ATIVIDADE LISTAR ============
app.get('/atividade_listar', async (req,res)=>{
    const dados_atividade = await Atividade.findAll({raw:true})
    res.render('atividade_listar',{log,dados_atividade:dados_atividade,nome_gerente})
    console.log(dados_atividade)
})
// ================ SETOR ==================
// =========== SETOR ATUALIZAR =============
app.post('/setor_atualizar', async (req,res)=>{
    const num_setor = Number(req.body.num_setor)
    const nome_setor = req.body.nome_setor
    const gerenteId = Number(req.body.gerenteId)

    const setor_pesquisa_atualizar = await Setor.findOne({raw:true, where : {num_setor:num_setor}})

    if(setor_pesquisa_atualizar !== null){
        const dados_setor = {
            num_setor : num_setor,
            nome_setor : nome_setor,
            gerenteId : gerenteId
        }
        if((typeof num_setor === 'number')&&(typeof nome_setor === 'string')&&(typeof gerenteId === 'number')){
            await Setor.update(dados_setor, {where: {num_setor:num_setor}})
            console.log(dados_setor)
            console.log(`Setor Atualizado`)
            res.render('setor_listar', {log,nome_gerente})
        }else{
            console.log(`Setor NÃO Atualizado`)
            res.render('setor_listar', {log,nome_gerente})
        }
    }else{
        console.log(`Setor NÃO Atualizado`)
        res.render('setor_listar', {log,nome_gerente})
    }

    
})
// =========== SETOR APAGAR =============
app.post('/setor_apagar', async (req,res)=>{
    const num_setor = Number(req.body.num_setor)

    const pesquisa_apagar = await Setor.findOne({raw:true, where : {num_setor:num_setor}})

    if(num_setor == null){
        res.render('home',{log,nome_gerente})
        console.log('Tipo de dado inválido para apagar')
    }else if(pesquisa_apagar.num_setor == num_setor){
        Setor.destroy({raw:true,where:{num_setor}})
        res.render('setor_listar',{log,nome_gerente})
        console.log('Tipo de dado válido para apagar')
    }else{
        res.render('home',{log,nome_gerente})
        console.log('Tipo de dado inválido para apagar')
    }
})
// =========== SETOR CADASTRAR ============
app.post('/setor_cadastrar', async (req,res)=>{
    const num_setor = Number(req.body.num_setor)
    const nome_setor = req.body.nome_setor
    const gerenteId = Number(req.body.gerenteId)

    if(num_setor == null || nome_setor == null || gerenteId == null){
        res.render('home',{log,nome_gerente})
        console.log('Tipo de dado inválido para cadastrar')
    }else if(typeof num_setor == 'number' && typeof nome_setor == 'string' && typeof gerenteId == 'number'){
        Setor.create({num_setor,nome_setor,gerenteId})
        res.render('setor_listar',{log,nome_gerente})
        console.log('Tipo de dado válido para cadastrar')
    }else{
        res.render('home',{log,nome_gerente})
        console.log('Tipo de dado inválido para cadastrar')
    }
})
// =========== SETOR LISTAR ============
app.get('/setor_listar', async (req,res)=>{
    const dados = await Setor.findAll({raw:true})
    res.render('setor_listar',{log,dados:dados,nome_gerente})
    console.log(dados)
})
// ============= SETOR ===============
app.get('/setor_apagar',(req,res)=>{
    res.render('setor_apagar',{log,nome_gerente})
})
app.get('/setor_cadastrar',(req,res)=>{
    res.render('setor_cadastrar',{log,nome_gerente})
})
app.get('/setor_atualizar',(req,res)=>{
    res.render('setor_atualizar',{log,nome_gerente})
})
app.get('/setor',(req,res)=>{
    res.render('setor',{log,nome_gerente})
})
// =========== ATIVIDADE =============
app.get('/atividade_apagar',(req,res)=>{
    res.render('atividade_apagar',{log,nome_gerente})
})
app.get('/atividade_cadastrar',(req,res)=>{
    res.render('atividade_cadastrar',{log,nome_gerente})
})
app.get('/atividade_atualizar',(req,res)=>{
    res.render('atividade_atualizar',{log,nome_gerente})
})
app.get('/atividade',(req,res)=>{
    res.render('atividade',{log,nome_gerente})
})
// ============= LOGOUT ================
app.get('/logout',(req,res)=>{
    log = false
    nome_gerente = ``
    res.render('home',{log,nome_gerente})
})
app.get('/',(req,res)=>{
    nome_gerente = ``
    res.render('home',{log,nome_gerente})
})
// =================================
conn.sync().then(()=>{
    app.listen(port,hostname,()=>{
        console.log(`Servidor ${hostname} rodando em ${port}`)
    })
}).catch((err)=>{
    console.log(`Servidor não está rodando devido ao erro ${err}`)
})
// =================================