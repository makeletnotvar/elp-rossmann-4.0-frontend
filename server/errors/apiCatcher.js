const { ValidationError } = require("yup");
const { HTTP_STATUS_CODE } = require("../constants/httpStatusCodes");
const { Forbidden, BadRequest, InternalServerError } = require("./errors");

/**
 * 
 * @param {Error} err 
 * @param {Response(Express)} res 
 */
const apiCatcher = (err, res) => {
    console.error(err);
    
    if(err instanceof Forbidden){
        res.status(HTTP_STATUS_CODE.FORBIDDEN).send({ message: err });
    }

    if(err instanceof BadRequest){
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({message: err });    
    }

    if(err instanceof InternalServerError){
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({message: err });    
    }

    if (err instanceof ValidationError) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: err.message });
    }
}

module.exports = apiCatcher;