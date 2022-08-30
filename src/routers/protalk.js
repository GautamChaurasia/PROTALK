const user = require(`../models/user`);
const router = require("express").Router();

router.post("/register", async (req, res) => {
    try{
        const {name, email, pwd} = req.body
        if (!name || !email || !pwd) {
            res.status(400);
            throw new Error("Please Enter All the Fields");
        }

        let userDets = await user.findOne({email}, {__v:0});
        if(userDets===null){
            let userentry = user(req.body);
            await userentry.save();
            res.status(201).send("User is Registered successfully");
        }
        else res.status(409).send("Email already registered with another user");
    }catch(e){
        console.log(e)
        res.status(400).send("Resgistration failed, please try Again");
    }
});

router.post("/login", async (req, res)=>{
    try{
        const {email, pwd} = req.body
        let userdisp = await user.findOne({email}, {__v:0});
        if (userdisp && (await userdisp.matchPassword(pwd))){
            const token = await userdisp.genToken();
            res.cookie("btoken", token, {
                expires: new Date(Date.now()+1200000), // 20 mins
                sameSite: 'none',
                secure: true,
                httpOnly: true
            })
            res.status(200).send('Login Successful');
            }
        else{
            res.status(404).send('Invalid Credentials');
        }
    }catch(e){
        console.log(e)
        res.status(400).send("Oops! Please retry");
    }
});

router.get("/logout", (req, res)=>{
    res.clearCookie(
        'btoken', {sameSite: 'none', secure: true,}
        ).send('Cookies cleared');
    });
    
// router.get("/home", auth, (req, res)=>{
//     res.status(200).send(req.rst);
// });

// router.post("/search", async (req, res)=>{
//     let {name} = req.body
//     // console.log(new RegExp(name))
//     try{
//         let userdisp = await user.find({name: new RegExp(`^${name}`, 'i')}, {pwd:0, __v:0});        
//         res.status(200).send(userdisp);
//     }catch(e){
//         res.status(400).send("Oops! Something went wrong");
//     }
// });

// router.post("/transfer", async (req, res)=>{
//     let {from, to, amt} = req.body
//     // console.log(from, to, amt)
//     try{
//         let from_bal = await account.findOne({email: from}, {_id:0, balance:1});
//         let to_bal = await account.findOne({email: to}, {_id:0, balance:1});
//         from_bal = parseInt(from_bal.balance) - parseInt(amt); to_bal = parseInt(to_bal.balance) + parseInt(amt)
//         // console.log(from_bal, to_bal)
//         let fm_stat = await account.updateOne({email: from}, {$set:{balance:from_bal}});
//         let to_stat = await account.updateOne({email: to}, {$set:{balance:to_bal}});
//         // account.save()
//         res.status(200).send('Transaction Successful');
//     }catch(e){
//         res.status(400).send("Oops! Something went wrong");
//     }
// });


module.exports = router;