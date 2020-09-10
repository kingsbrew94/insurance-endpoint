/**
 * @author K.B. Brew <kingsleybrew@gmail.com>
 * @description End point for calculating motor or insurance
 * @version 1.0
 */

const 

    express             = require('express'),
    app                 = express(), 
    url                 = require('url'),
    connection          = require('./connection'),
    InsuranceCalculator = require('./calculator'),
    schemas             = require('./schemas')
;

// Handles post request

app.post('/calculate_insurance', (req, res) => {

    /**
     * @todo makes response content type to be in json
     */

    res.writeHead(200,{'Content-Type': 'text/json'});

    const 
        /**
         * @var params
         * @todo holds parsed query in an object format
         */

        params 

            /**
             * @todo parses request query
             */

        = url.parse(req.url,true).query,
        /**
         *  @var paramsTypePassed
         *  @todo holds test results for parameters 
         */

        paramsTypePassed 

        /** 
         * @todo  
         *  Test whether parameters are provided or of valid valid type
         */

        =  (typeof params.type !== 'undefined' && typeof params.type === 'string') 
        &&  
            (typeof params.car_id !== 'undefined' && typeof params.car_id === 'string')
    ;

    if(paramsTypePassed) {

        /**
         * @var params.type
         * @todo Holds optimized parameter type text
         */
        params.type 

        /**
         * @todo Assigns optimized parameter type text
         */
        = 

        /* 
         * optimize parameter type text
        */
        params.type.replace(/\s+/,' ');

        // initializes connection to the database  
        connection(async (md) => {
            await 
            // Intializes calculation
            initCalculation(res,params,md)
        });
        return;
    }
    res.send(JSON.stringify({error : "Invalid request: check if appropriate parameters was provided"}));
})
app.listen(process.env.PORT || 3000);

/**
 * 
 * @param {*} res 
 * @param {*} params 
 * @param {*} md 
 * @todo Intializes calculations
 */
async function initCalculation(res,params,md) {
     await (new InsuranceCalculator(params,schemas(md))).calculateInsurance(res);    
}

module.exports.app = app;
