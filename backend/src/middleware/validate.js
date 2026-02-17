function validate(schema, where = "body") {
    return(req, res, next) => {
        try {
            const parsed = schema.parse(req[where])
            req[where] = parsed
            next()
        } catch (err) {
            return res.status(400).json({
                error: 'validation Failed',
                details:err.error?.map(e => ({
                    path:e.path.join("."),
                    message: e.message
                })) || [],
            })
        }
    }
}

module.exports = validate