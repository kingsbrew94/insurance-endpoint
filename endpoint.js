/**
 * @class EndPoint
 * @author K.B. Brew <kingsleybrew@gmail.com>
 * @version 1.0
 */

module.exports = class Endpoint {
    /**
     * @param {*} params 
     * @param {*} mongoose 
     */
    constructor(params,mongoose) {
        this.params   = params;
        this.md       = mongoose;
        
        this.payload  = {
            type           : 'Unknown',
            insurance_price: 'none', 
            car_id         : 'Unknown'
        };
        // Stores cloud data locally
        this.store   = {};
    }

    /**
     * @method setStore
     * 
     */
    async setStore() {
        const 
            store 
            /**
             * Assings the blue print for the local store
             *  */
            = this.storeSchema()
        ;

        await 

         /**
          *  Fetches all vehicle categories from cloud
          */

        this.md.CarCategories.find({}).exec((err,data) => {
            store.vehicles.categories         = data;
            if(err) store.vehicles.categories = [];
        });

        await 

        /**
          *  Fetches all cars from cloud
          */

        this.md.Cars.find({}).exec((err,data) => {
            store.vehicles.cars                  = data;
            if(err) store.vehicles.cars          = [];
        });

        await 

        /**
         *  Fetches all third party tariffs data from cloud
         */

        this.md.ThirdPartyTariffs.find({}).exec((err,data) => {
            store.thirdPartyTariffs            = data;
            if(err) store.thirdPartyTariffs    = [];
        });

        await 

        /**
         *  Fetches all comprehensive tariffs data from cloud
         */

        this.md.ComprehensiveTariffs.find({}).exec((err,data) => {
            store.comprehensiveTariffs         = data;
            if(err) store.comprehensiveTariffs = [];
        });

        await 

        /**
         *  Fetches all owners data from cloud
         */

        this.md.Owners.find({}).exec((err,data) => {
            store.owners                        = data;
            if(err) store.owners                = [];            
        });

        await

        /**
         *  Fetches all data rates for fleet discount
         */

        this.md.FleetDiscounts.find({}).exec((err,data) => {
            store.fleetDiscounts                = data;
            if(err) store.fleetDiscounts        = [];
        });

        await 
        
        /**
         *  Fetches all vehicle age data rates from cloud
         */

        this.md.VehicleAgeRates.find({}).exec((err,data) => {
            store.vehicleAgeRates               = data;
            if(err) store.vehicleAgeRates       = [];
        });

        await 

        /**
         *  Fetches all no cliam discount rates from cloud
         */

        this.md.NCDS.find({}).exec((err,data) => {
            store.ncds                         = data;
            if(err) store.ncds                 = [];
        });

        await

        /**
         *  Fetches all the appropriate insured vehicles age limit usages
         */

        this.md.InsuranceVehicleAges.find({}).exec((err,data) => {
            store.insuranceVehicleAges          = data;
            if(err) store.insuranceVehicleAges  = [];
        });

        await 

        /**
         *  Fetches driving and experiences data from cloud
         */

        this.md.DrivingAndExperiences.find({}).exec((err,data) => {
            store.drivingAndExperiences         = data;
            if(err) store.drivingAndExperiences = [];
        });

        
        await 

        /**
         *  Fetches types of insurances data from cloud
         */

        this.md.InsuranceTypes.find({}).exec((err,data) => {
            store.insuranceTypes                = data;
            if(err) store.insuranceTypes        = [];
        });

        await 

        /**
         *  Fetches the appropriate cubic capacity loading date rates
         */

        this.md.CCLoadings.find({}).exec((err,data) => {
            store.ccLoadings                = data;
            if(err) store.ccLoadings        = [];
        });

        await 

        /**
         *  Fetches other appropriate given insurance data
         */

        this.md.Insurances.find({}).exec((err,data) => {
            store.insurances                    = data;
            if(err) store.insurances            = [];
            this.store = store;
        });
    }

    /**
     * @method getStore
     * @returns object
     * @todo Get the local cloud data
     */

    getStore() { return this.store; }

    /**
     * @method carIdExists
     * @returns boolean
     * @todo  Checks whether the request car id actually exists in the local store
     */

    carIdExists() {
        
        return (
        typeof 
            this.store.vehicles.cars.find !== 'undefined' &&
        typeof 
            this.store.vehicles.cars.find(data => data.car_id === this.params.car_id)
            !==
            'undefined'
        );
    }

    /**
     * @method storeSchema
     * @returns object
     * @todo Defines a blue print for the local store
     */

    storeSchema() {
        return {            
            vehicles             : {
                cars             : Array,
                categories       : Array
            },
            thirdPartyTariffs    : Array,
            comprehensiveTariffs : Array,
            owners               : Array,
            fleetDiscounts       : Array,
            vehicleAgeRates      : Array,
            ncds                 : Array,
            insuranceVehicleAges : Array,
            insuranceTypes       : Array,
            insurances           : Array,
            drivingAndExperiences: Array,
            ccLoadings           : Array
        }
    }

    /**
     * @method storeIsOccupied
     * @returns boolean
     * @todo  Check if store is not empty
     */

    storeIsOccupied() {

        return (
            /** Check if each store is of an object type */

            typeof this.store.vehicles.cars        === 'object' &&
            typeof this.store.vehicles.categories  === 'object' &&
            typeof this.store.thirdPartyTariffs    === 'object' &&
            typeof this.store.comprehensiveTariffs === 'object' &&
            typeof this.store.owners               === 'object' &&
            typeof this.store.fleetDiscounts       === 'object' &&
            typeof this.store.vehicleAgeRates      === 'object' &&
            typeof this.store.ncds                 === 'object' &&
            typeof this.store.insuranceVehicleAges === 'object' &&
            typeof this.store.insuranceTypes       === 'object' &&
            typeof this.store.insurances           === 'object' &&
            typeof this.store.drivingAndExperiences=== 'object' &&
            typeof this.store.ccLoadings           === 'object' &&

            /** Check length of each store */

            this.store.vehicles.cars.length        > 0 &&
            this.store.vehicles.categories.length  > 0 &&
            this.store.thirdPartyTariffs.length    > 0 &&
            this.store.comprehensiveTariffs.length > 0 &&
            this.store.owners.length               > 0 &&
            this.store.fleetDiscounts.length       > 0 &&
            this.store.vehicleAgeRates.length      > 0 &&
            this.store.ncds.length                 > 0 &&
            this.store.insuranceVehicleAges.length > 0 &&
            this.store.insuranceTypes.length       > 0 &&
            this.store.insurances.length           > 0 &&
            this.store.drivingAndExperiences.length> 0 &&
            this.store.ccLoadings.length           > 0 

        );
    }
}

