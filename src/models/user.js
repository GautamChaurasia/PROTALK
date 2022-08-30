const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const mong = require("mongoose");

const userSchema = new mong.Schema({
    name:{
        type:String,
        required:true
    }, 
    email:{
        type:String,
        unique: true,
        required:true
    }, 
    pwd:{
        type:String,
        required:true
    },
    pic:{
        type: "String",
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
    },
    {
        timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.pwd);
  };

userSchema.methods.genToken = async function() {
    try{
        const maxToken = 3
        let token = jwt.sign({email: this.email}, process.env.SECRET_KEY)
        if(this.tokens.length===maxToken) this.tokens.shift()
        this.tokens = this.tokens.concat({token})
        await this.save()
        return token
    }catch(e) {
        return "Server Error! Couldn't generate token"
    }
}

userSchema.pre("save", async function (next) {
    if (!this.isModified) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.pwd = await bcrypt.hash(this.pwd, salt);
  });

const user = mong.model("user", userSchema);

module.exports = user;