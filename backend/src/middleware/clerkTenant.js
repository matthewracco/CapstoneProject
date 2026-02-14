const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");


const requireAuth = ClerkExpressRequireAuth()


function requireTenant(req, res, next){
    const { userId, orgId} = req.auth || {}

    if (!userId) return res.status(401).json({error: 'unauthorized'})
     
    if(!orgId) {
        return res.status(400).json({
            error: 'No organization selected (tenant missing). Use a Clerk Organization !',
        })
    }    

    req.user = {userId}
    req.tenantId = orgId
    next()
}

module.exports = { requireAuth, requireTenant}