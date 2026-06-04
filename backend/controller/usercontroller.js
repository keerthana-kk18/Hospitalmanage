import User from '../models/users.js';
import generatetoken from '../utils/generatetoken.js';
import Doctor from '../models/doctor.js';
import bcrypt from 'bcrypt';

export const signup=async(req,res)=>{
    try{
        const{name,email,password,confirmpassword}=req.body;
        if(!name||!email||!password||!confirmpassword){
            return res.status(400).json({message:'All fields are required'})
        }
        if(password!==confirmpassword){
            return res.status(400).json({message:'Password does not match'})
        }
        const cleanemail=email.toLowerCase().trim();
        const userexist=await User.findOne({email:cleanemail})
        if(userexist){
            return res.status(400).json({message:'User already exists'})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(password,salt)
        const newuser=new User({name,email:cleanemail,password:hashedpassword})
        await newuser.save()
        const token=generatetoken(newuser._id,newuser.role)
        res.status(200).json({
            message:'User signup successfully',
            user:{id:newuser._id, name:newuser.name, email:newuser.email, role:newuser.role},
            token:token
        }) 
    }catch(error){
        res.status(500).json({message:'Signup error', error:error.message})
    }
}

export const login=async(req,res)=>{
    try{
        const{email,password}=req.body
        const cleanemail=email.toLowerCase().trim();
        let account=await User.findOne({email:cleanemail});

        if(!account){
            account=await Doctor.findOne({email:cleanemail}); 
        }
        if(!account){
            return res.status(401).json({message:'Invalid email or password'})
        }
        const match=await bcrypt.compare(password,account.password)
        if(!match){
            return res.status(401).json({message:'Invalid email or password'})
        }
        const token=generatetoken(account._id,account.role)  
        res.status(200).json({message:'Login successful', user:{id:account._id, name:account.name || account.fullname, email:account.email, role:account.role}, token:token})
    }catch(error){
        res.status(500).json({message:'Login error', error:error.message})
    }
}

export const updateprofile=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const userid=req.user.id;
        let updatefield={};

        if(name){
            updatefield.name=name.trim()
        }
        if(email){
            const cleanemail=email.toLowerCase().trim();
            const emailexists=await User.findOne({email:cleanemail,_id:{$ne:userid}})
            if(emailexists){
                return res.status(400).json({message:'This email is already taken'})
            }
            updatefield.email=cleanemail
        }
        if(password){
            const salt=await bcrypt.genSalt(10);
            updatefield.password=await bcrypt.hash(password,salt)
        }
        const updateduser=await User.findByIdAndUpdate(userid,updatefield,{returnDocument:'after'})
        if(!updateduser){
            return res.status(404).json({message:'User not found'})
        }
        res.status(200).json({
            message:'Profile updated succesfully', user:{id:updateduser._id, name:updateduser.name, email:updateduser.email, role:updateduser.role}
        })
    }catch(error){
        res.status(500).json({message:'Internal server error', error:error.message})
    }
}