/**
 * @author K.B. Brew <kingsleybrew@gmail.com>
 * @version 1.0
 */

module.exports = class ThirdParty {
 /**
  * 
  * @param {object} store 
  * @param {object} params 
  */

    constructor(store, params) {
        this.dataStore 
        /**
         *  Assign local stores 
         * */
        = store;

        this.params    
        /**
         * Assign request parameters
         */
        = params;

        this.yearLimit 
        /*
         * Assign the initial year limit according to records
         * for calculating old age loading 
        */= 2015;
    }

    /** 
     * @method getVehicleType
     * @todo Returns the type of vehicle
     * @returns string
     */

    getVehicleType() {
        const 
            category 
            /** Assign the kind of car*/
            = this.getType();

        if(category.toLowerCase() === 'x1') {
            return 'private'
        } else if(category.toLowerCase() === 'motor cycle') {
            return 'motor_cycle'
        }

        return 'commercial';
    }

    /**
     * @method getType
     * @returns string
     * @todo    Fetch Car's category name
     */
    getType() {
        return this.getCarCategory().cat_name;
    }


    /**
     * @method getCarId
     * @returns string
     * @todo    Fetches car id
     */

    getCarId() {
        return this.getCar().car_id;
    }

    /**
     * @method getMinPremium
     * @returns number
     * @todo   Searches for the minimum premuim
     */

    getMinPremium() {
        let 
            min = 0, 
            population 
            /**
             * Assign an array of object of total basic premium
             */
            = this._getTotalBasicPremiumPopulation()
        ;
        if(population.length > 0) 
            min = population[0].total_basic_premium;

        /**
         * Searches for minimum total basic premium
         */
        population.forEach(initialData => {
            population.forEach(nextData => {
                if(initialData.total_basic_premium < nextData.total_basic_premium)
                    min = initialData.total_basic_premium;
            });
        });
        return min;
    }


    /**
     * @method _getTotalBasicPremiumPopulation
     * @returns array
     * @todo   Fetches an array of object of total basic premium
     */

    _getTotalBasicPremiumPopulation() {
        const 
            population
            /**
             * Stores the population of the total basic premium
             */
            = []
        ;

        let   
            result    
            /**
             * Stores the calculated result of each basic premium amount
             */
            = 0.0
        ;
        
        /**
         * Calculate and pushes the total basic premium into the population
         * array variable with a category identification
         */

        this.dataStore.thirdPartyTariffs.forEach(data => {
            result = parseFloat(data.tppd_value) + parseFloat(data.tpi_value);
            population.push({cat_id: data.cat_id,total_basic_premium: result});            
        });        
        return population;
    }

    /**
     * @method _getOfficePremiumPopulation
     * @returns array
     * @todo   Fetches an array of object of office premium
     */

    _getOfficePremiumPopulation() {
        const 
            population
            /**
             * Stores the population of office premium
             */
            = []
        ;

        let   
            result    
            /**
             * Stores the calculated result of each office premium amount
             */
            = 0.0
        ;
        
        /**
         * Calculate and pushes the office premium into the population
         * array variable with a category identification
         */

        this.dataStore.thirdPartyTariffs.forEach(data => {
            result = (
                parseFloat(data.tppd_value)   + 
                parseFloat(data.tpi_value)    +
                parseFloat(data.add_perils)   + 
                parseFloat(data.ecowas_perils)+
                parseFloat(data.pa_benefits) 
            );
            population.push({cat_id: data.cat_id,office_premium: result});            
        });        
        return population;
    }

    _getTotalPremiumPopulation() {
        const 
            population       = [],
            officePopulation = this._getTotalBasicPremiumPopulation()
        ;
        let   
            result     = 0.0,
            count      = 0;
        this.dataStore.thirdPartyTariffs.forEach(data => {
            result = (
                parseFloat(data.nic)           + 
                parseFloat(data.nhis_nrsc_levy)+
                parseFloat(data.brown_card)  
            )+ officePopulation[count++].office_premium;
            population.push({cat_id: data.cat_id,total_basic_premium: result});            
        });        
        return population;
    }
    
    /**
     * @method getThirdPartyBasicPremium()
     * @returns number
     * @todo Calculate for the Third Party Basic Premium
     */

    getThirdPartyBasicPremium() {
        const {id}                  = this.getCarCategory();
        const {total_basic_premium} = this._getTotalBasicPremiumPopulation().find(data => data.cat_id === id);
        const  premium              = total_basic_premium - this.getMinPremium();
        return premium <= 0 ? (this.getMinPremium() / 2): premium;
    }

    /**
     * @method getTariffType()
     * @returns object
     * @todo Fetch the appropriate tariff data
     */

    getTariffType() {
        const {id} = this.getCarCategory();
        return this.dataStore.thirdPartyTariffs.find(data => data.cat_id === id );
    }

    /**
     * @method getCarCategory
     * @returns object
     * @todo Fetch the appropriate vehicle category object data
     */

    getCarCategory() {
        const {cat_id}  = this.getCar();
        return this.dataStore.vehicles.categories.find((data) => data.id === cat_id);
    }
    

    /**
     * @method getDrivingAndExperience
     * @returns object
     * @todo Fetch the appropriate drivering experience and car usage object data
     */

    getDrivingAndExperience(usage) {
        return this.dataStore.drivingAndExperiences.find((data) => data.usage.toLowerCase() === usage.toLowerCase());
    }

    /**
     * @method getCar
     * @returns object
     * @todo Fetch the appropriate data object for a car by car id
     */

    getCar() {
        return this.dataStore.vehicles.cars.find(data => data.car_id === this.params.car_id);
    }

    /**
     * @method getInsuranceType
     * @returns object
     * @todo Fetch the appropriate insurance type
     */

    getInsuranceType() {
        return this.dataStore.insuranceTypes.find(data => data.typeName.toLowerCase() === this.params.type.toLowerCase());
    }

    /**
     * @method getInsurance
     * @returns object
     * @todo Fetch the appropriate insurance data
     */

    getInsurance() {
        const {car_id} = this.getCar();
        return this.dataStore.insurances.find(data => car_id === data.car_id);
    }

    /**
     * @method getNoClaimDiscount
     * @returns object
     * @todo Get the object data for No Claim Discount incase of any
     */

    getNoClaimDiscount() {
        const {ncd_years} = this.getOwner();

        return this.dataStore.ncds.find(data => data.years === ncd_years)
    }

    /**
     * @method getOwner
     * @returns object
     * @todo Get the owner's object data 
     */

    getOwner() {
        const {owner_id} = this.getCar();
        return this.dataStore.owners.find(data => data.id === owner_id);
    }


    /**
     * @method countOwnerCars
     * @returns number
     * @todo Get the number of vehicles an owner has
     */

    countOwnerCars() {
        let total = 0, {id} = this.getOwner();
        this.dataStore.vehicles.cars.forEach(data => {
            if(data.owner_id === id) ++total;
        });
        return total;
    }

    /**
     * @method getFleetDiscount
     * @returns number
     * @todo Calculate for the fleet discount
     */

    getFleetDiscount() {
        const numOfCars = this.countOwnerCars();
        let interval = '1-4';

        if(numOfCars >= 5 && numOfCars <= 10) {
            interval = '5-10';
        } else if(numOfCars >= 11 && numOfCars <= 20) {
            interval = '11-20';
        } else if(numOfCars > 20) {
            interval = 'above20';
        }
        return this.dataStore.fleetDiscounts.find(data => 
            (interval.replace(/\s+/,'')).toLowerCase() ===
            (data.interval.replace(/\s+/,'')).toLowerCase() 
        );
    }

    /**
     * @method getVehicleAgeRate
     * @returns number
     * @todo Get the age of rate of the insured vehicle
     */

    getVehicleAgeRate(interval) {
        return this.store.vehicleAgeRates.find(data => {
          (interval.replace(/\s+/,'')).toLowerCase() === (data.interval.replace(/\s+/,'')).toLowerCase();
        }).rate;
    }


    /**
     * @method getVehicleAgeRate
     * @returns number
     * @todo Get the year limit usage of the insured vehicle
     */

    getYearLimit() {
        return this.dataStore.insuranceVehicleAges.length > 0 ? parseInt(this.dataStore.insuranceVehicleAges.year_limit) : this.yearLimit;
    }


    /**
     * @method getVehicleAgeRate
     * @returns number
     * @todo Get the third party damage limit
     */

    getThirdPartyDamageLimit() {
        return getInsuranceType().third_party_damage_limit;
    }


    /**
     * @method getExtraSeatLoading
     * @returns number
     * @todo Get the appropriate extra seat loading value
     */

    getExtraSeatLoading() {
        return this.getTariffType().extra_seat_loading;
    }


    /**
     * @method getOldAgeLoadingRate
     * @returns number
     * @todo Get the appropriate Old Age Loading Rate
     */

    getOldAgeLoadingRate() {
        const {year}     = this.getCar();
        const vehicleAge = Math.abs(this.getYearLimit() - year);
        let rate     = 0.0;
        if(vehicleAge <= 5 && vehicleAge > 1) {
            rate = this.getVehicleAgeRate('1-5');
        } else if(vehicleAge <= 10 && vehicleAge > 5) {
            rate = this.getVehicleAgeRate('5-10');
        } else if(vehicleAge > 10) {
            rate = this.getVehicleAgeRate('above10');
        }
        return rate;
    }

    /**
     * @method getOldAgeLoadingValue
     * @returns number
     * @todo Calculate for the Old Age Loading Value by the appropriate rate
     */

    getOldAgeLoadingValue() {
        return this.getThirdPartyBasicPremium() * this.getOldAgeLoadingRate();
    }

    /**
     * @method getInexperiencedDriverLoadingRate
     * @returns number
     * @todo Get the appropriate Inexperienced Driver Loading Rate
     */

    getInexperiencedDriverLoadingRate() {
        const {cat_name} = this.getCarCategory();
        let usage        = 'commercial';
        if(typeof cat_name === 'undefined' && (cat_name.toUpperCase() === 'MOTOR CYCLE' ^ cat_name.toUpperCase() === 'X1')) {
            usage        = 'private';
        }
        return this.getDrivingAndExperience(usage).at_inception;
    }

    /**
     * @method getNoClaimDiscountRate
     * @returns number
     * @todo Get the appropriate No Claim Discount Rate
     */

    getNoClaimDiscountRate() {
        const ncd = this.getNoClaimDiscount();
        return (typeof ncd[this.getVehicleType()] === 'number') ? ncd[this.getVehicleType()]: 0.0;
    }

    /**
     * @method getNoClaimDiscountValue
     * @returns number
     * @todo Calculate for the No Claim Discount Value by the its approriate rate
     */

    getNoClaimDiscountValue() {
        return this.getBasicPremium() * this.getNoClaimDiscountRate();
    }

    /**
     * @method getFleetDiscountRate
     * @returns number
     * @todo Get the appropriate Fleet Discount Rate
     */

    getFleetDiscountRate() {
        
        return parseFloat(this.getFleetDiscount().frb);
    }

    /**
     * @method getFleetDiscountValue
     * @returns number
     * @todo Calculate for the Fleet Discount Value by the its corresponding rate
     */

    getFleetDiscountValue() {
        return parseFloat(this.getBasicPremium()) * this.getFleetDiscountRate();
    }

    /**
     * @method getExtraSeatLoadingValue
     * @returns number
     * @todo Calculate for the Extra Seat Loading Value by its corresponding
     * Extra Seat Loading Rate
     */

    getExtraSeatLoadingValue() {
        const {no_seats} = this.getCar();
        const {extra_seat_loading} = this.getTariffType();
        let price  = 0.0, diff = (parseInt(no_seats) - 5);

        if(diff >= 0) {
            price = diff * extra_seat_loading;
        }
        return price;
    }

    /**
     * @method getInexperiencedDriverLoadingValue
     * @returns number
     * @todo Calculate for the Inexperienced Driver Loading Value by its corresponding
     * Inexperienced Driver Loading Rate
     */

    getInexperiencedDriverLoadingValue() {
        return this.getInexperiencedDriverLoadingRate() * this.getThirdPartyBasicPremium();
    }

    /**
     * @method getAdditionalPerilValue
     * @returns number
     * @todo Get the appropriate Additional Peril Value
     */

    getAdditionalPerilValue() {
        const {add_perils} = this.getTariffType();
        return add_perils;
    }

    /**
     * @method getEcowasPerilValue
     * @returns number
     * @todo Get the appropriate Ecowas Peril Value
     */

    getEcowasPerilValue() {
        const {ecowas_perils} = this.getTariffType();
        return ecowas_perils;
    }

    /**
     * @method getPABenefits
     * @returns number
     * @todo Get the appropriate PA Benefits Value
     */

    getPABenefits() {
        const {pa_benefits} = this.getTariffType();
        return pa_benefits;
    }

    /**
     * @method getStatutoryCharges
     * @returns number
     * @todo Calculate Statutory Charges
     */

    getStatutoryCharges() {
        const {
            nic,
            nhis_nrsc_levy,
            brown_card
        } = this.getTariffType();
        return nic + nhis_nrsc_levy + brown_card;
    }
    

    /**
     * @method getExtraTPPDCoverCharge
     * @returns number
     * @todo Calculate for the Extra TPPD Cover Charge
     */

    getExtraTPPDCoverCharge() {
        const {
            extra_tppd_cover_rate,
            extra_tppd_cover_value
        } = this.getInsurance();
        return extra_tppd_cover_rate * extra_tppd_cover_value;
    }

    /**
     * @method getBasicPremium
     * @returns number
     * @todo Calculate for the Basic Premium with Old Age Loading Value
     */

    getBasicPremium() {
        return this.getOldAgeLoadingValue() + this.getThirdPartyBasicPremium();
    }


    /**
     * @method getLessValue
     * @returns number
     * @todo Calculate for the Less Value
     */

    getLessValue() {
        return this.getFleetDiscountValue() + this.getNoClaimDiscountValue();
    }

    /**
     * @method getSumOfOtherLoadings
     * @returns number
     * @todo Calculate for all the Sum of Other Loadings
     */

    getSumOfOtherLoadings() {
        return (
            this.getExtraSeatLoadingValue()           + 
            this.getInexperiencedDriverLoadingValue() +
            this.getExtraTPPDCoverCharge()            +
            this.getAdditionalPerilValue()            +
            this.getEcowasPerilValue()                +
            this.getPABenefits()                      +
            this.getStatutoryCharges()                
        );     
    }
}