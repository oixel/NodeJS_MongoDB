// Allows all allowed roles to be passed in
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // If no request, or if request but does not have roles, give unsuccessful request error
        if (!req?.roles) return res.sendStatus(401);

        // Create a array from all the inputted allowed roles
        const rolesArray = [...allowedRoles];

        // Create a map of (role, bool) setting the roles present in the request
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);

        // If no true result, then user does not have authorized role
        if (!result) return res.sendStatus(401);

        next();
    }

}

module.exports = verifyRoles;