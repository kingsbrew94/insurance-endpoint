/**
 * @author K.B. Brew <kingsleybrew@gmail.com>
 * @version 1.0
 */

const 
    EndPoint      = require('./endpoint'),
    ThirdParty    = require('./thirdparty'),
    Comprehensive = require('./comprehensive')
;


module.exports =
  /** 
   * @class Calculator
   * @extends EndPoint
   */

class Calculator extends EndPoint {

    /**
     * 
     * @param {*} params 
     * @param {*} mongoose 
     */
    constructor(params,mongoose) {
        
        super(params, mongoose);
    }

   async calculateInsurance(response) {
        const 
            typeIsThirdParty 
            
            /**
             *  Assigns optimal test result for thirty part type
             */   
            = 
            /(?:^THIRD\s+PARTY$)/.test(this.params.type.toUpperCase()),

            typeIsComprehensive 
            /**
             *  Assigns optimal test result for comprehensive type
             */   

            = /(?:^COMPREHENSIVE$)/.test(this.params.type.toUpperCase())
        ;

        if
        /**
         * Check if third party type test passes 
         */
        (typeIsThirdParty) {
            // Await data and set a store
            await this.setStore(); 

            // Awaits store to be populated then initializes calculation

            this.awaitResult(() => this.calculateThirdPartyPremium(),response);
        } else if
        /**
         * Check if comprehensive type test passes 
         */
        (typeIsComprehensive) {
            await this.setStore();
            this.awaitResult(() => this.calculateComprehensivePremium(),response);
        } else 
          /** Executes if type test fails */
        {
          /** Show response to inidicate that test for the types failed */
           typeof response === 'function'? response(this.payload): response.end(JSON.stringify(this.payload));
        }
    
    }

    /**
     * @param {*} callback 
     * @param {*} res 
     * @todo Awaits store to be populated then initializes calculation
     */

    awaitResult(callback,res) {
        const timer = setInterval(() => {

            this.store = this.getStore(); // Gets local store

            if
             /**
              * checks if store is populated
              */
            (Object.keys(this.store).length > 0) {
                if
                /**
                 * Checks if the requested car id exists
                 */
                (this.carIdExists()) {
                    if 
                    /**
                    * Checks if store is populated with data
                    */
                   (this.storeIsOccupied()) {
                        this.payload
                        = 
                        /**
                         * Executes calculations and returns a payload as response
                         */
                        callback(); 
                   } else {
                       this.payload
                       =
                       /**
                        * Assign an error flag payload
                        */
                       {
                           error: 'Unable to get insurance price payload: Your network may be slow'
                       };
                   }
                }

                /**
                 *  Show response of a payload
                 */
                typeof res === 'function'? res(this.payload): res.end(JSON.stringify(this.payload));
                clearInterval(timer);
            }
        });
    }

    /**
     * @method calculateThirdParty Premium
     * @returns object payload
     */

    calculateThirdPartyPremium() {
        const   
            thirdParty
            /**
             * Assigns an object of Third Party class
             * */   
            = new ThirdParty(this.store,this.params),

            totalPremium 
            /**
             *  Assigns the result of the insurance price 
             * */   
            = (
                thirdParty.getBasicPremium() -
                thirdParty.getLessValue()  
            ) + thirdParty.getSumOfOtherLoadings()
        ;
        
        return {
            type           : this.params.type.toString(),
            insurance_price: totalPremium.toFixed(2).toString(),
            car_id         : thirdParty.getCarId().toString()
        };
    }

    /**
     * @method calculateComprehensivePremium
     * @returns object payload
     */

    calculateComprehensivePremium() {
        const 
            comprehensive 
            /**
             * Assigns an object of Comprehensive class
             * */   
            = new Comprehensive(this.store,this.params),

            totalPremium  
            /**
             *  Assigns the result of the insurance price 
             * */   
            = (
                comprehensive.getComprehensiveBasic() - 
                comprehensive.getComprehensiveLess()
            ) + comprehensive.getSumOfComprehensiveOtherLoading()
        ;

        return {
            type           : this.params.type.toString(),
            insurance_price: totalPremium.toFixed(2).toString(),
            car_id         : comprehensive.getCarId().toString()
        };
    }
}