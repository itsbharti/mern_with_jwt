const JWT = require('jsonwebtoken')

// router level middleware function to check if the user is authenticated or not

const jwtAuth = (req, res, next) => {
    // get cookie token(jwt token generated using json.sign() from the req)
    const token = (req.cookies && req.cookies.token) || null

    // return err if the token is not present
    if(!token) {
        return res.status(400).json({message: 'Unauthenticated'})
    }
    // verify the token
    try{
        const payload = JWT.verify(token, process.env.SECRET)
        req.user = {id:payload.id, email:payload.email}
    }catch {
        // return err response
        return res.status(400).json({success:false, message:'Unauthenticated'})
        
    }

    next()
}