const jwt = require('jsonwebtoken')
const user = require('../models/user')
const account = require('../models/account')
const dotenv = require('dotenv')

dotenv.config()

const auth = async (req, res, next) => {
    try{
        const recd = req.cookies.btoken
        const v_stat = jwt.verify(recd, process.env.SECRET_KEY)
        const usr_back = await user.findOne({email:v_stat.email, "tokens.token":recd}, {_id:0, pwd:0, tokens:0, __v:0})
        const acc_back = await account.findOne({email:v_stat.email}, {_id:0, email:0, __v:0})
        if(!usr_back || !acc_back){ throw new Error('User not found') }
        req.rst = {...usr_back._doc, bal:acc_back.balance}
        next()
    }catch(err){
        // console.log(err)
        res.status(401).send("Unauthorized Token!")
    }
}
 
module.exports = auth;