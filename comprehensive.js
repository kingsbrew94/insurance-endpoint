/**
 * @author K.B. Brew <kingsleybrew@gmail.com>
 * @version 1.0
 */

const ThirdParty = require('./thirdparty')

module.exports = 

 /** 
   * @class Comprehensive
   * @extends ThirdParty
   */

class Comprenhesive extends ThirdParty {
    /**
     * 
     * @param {*} store 
     * @param {*} params 
     */

    constructor(store, params) {
        super(store,params);
    }

    /**
     * @method getSumInsured
     * @returns number
     * @todo  Fetches the Sum Insured
     */
    getSumInsured() {
        return this.getInsurance().sum_insured;
    }

    /**
     * @method getComprehensiveTariffs()
     * @returns object
     * @todo Fetch the appropriate comprehensive tariff data
     */

    getComprehensiveTariffs() {
        const categoryId = this.getCarCategory().id;
        return this.dataStore.comprehensiveTariffs.find(data => data.cat_id === categoryId);
    }

    /**
     * @method getOwnDamageRate
     * @returns number
     * @todo Get Own Damage Rate
     */

    getOwnDamageRate() {
        return this.getComprehensiveTariffs().own_damage_basic_prem_rate;
    }

    /**
     * @method getCCLoadingRate
     * @returns number
     * @todo Get the Cubic Capacity Loading Rate
     */

    getCCLoadingRate() {
        const ccloadingValue = this.getSumInsured() / 100;
        let valueRange = "upto1600";

        if(ccloadingValue > 1600 && ccloadingValue <= 2000) {
            valueRange = "1600-2000";
        } else if(ccloadingValue > 2000) {
            valueRange = "above2000";
        }
        return this.dataStore.ccLoadings.find(data => ((data.valueRange).replace(/\s+/,'')) === valueRange).rate
    }

    /**
     * @method getOwnDamageBasicPremium
     * @returns number
     * @todo Calculate for the Own Damage Basic Premium Value
     */

    getOwnDamageBasicPremium() {
        return this.getSumInsured() * this.getOwnDamageRate();
    }

    /**
     * @method getCCLoadingValue
     * @returns number
     * @todo Calculate for the Cubic Capacity Loading Value
     */

    getCCLoadingValue() {
        return this.getOwnDamageBasicPremium() * this.getCCLoadingRate();
    }

    /**
     * @method getComprehensiveOldAgeLoadingValue
     * @returns number
     * @todo Calculate the Comprehensive Old Age Loading Value by the appropriate rate
     */

    getComprehensiveOldAgeLoadingValue() {
        return this.getOldAgeLoadingRate() * this.getOwnDamageBasicPremium();
    }

    /**
     * @method getComprehensiveBasic
     * @returns number
     * @todo Calculate the Comprehensive Basic Value
     */

    getComprehensiveBasic() {
        return (
            this.getOwnDamageBasicPremium()           + 
            this.getCCLoadingValue()                  +
            this.getComprehensiveOldAgeLoadingValue() +
            this.getThirdPartyBasicPremium()
        );
    }

    /**
     * @method getComprehensiveNoClaimDiscountValue
     * @returns object
     * @todo Calculate for the Comphrensive No Claim Discount Value by the its approriate rate
     */

    getComprehensiveNoClaimDiscount() {
        return this.getNoClaimDiscountRate() * this.getComprehensiveBasic();
    }

    /**
     * @method getComprehensiveFleetDiscountValue
     * @returns number
     * @todo Calculate for the Comprehensive Fleet Discount Value by the its corresponding rate
     */

    getComprehensiveFleetDiscount() {
        return this.getFleetDiscountRate() * this.getComprehensiveBasic();
    }

    /**
     * @method getExcessBoughtBackRate
     * @returns number
     * @todo Get the Excess Bought Back Rate
     */

    getExcessBoughtBackRate() {
        return this.getInsurance().exccess_bought_rate;
    }

    /**
     * @method getComprehensiveIDLValue
     * @returns number
     * @todo Calculate for the Comprehensive Inexperienced Driver Loading Value by its corresponding
     * Inexperienced Driver Loading Rate
     */

    getComprenhensiveIDLValue() {
        return this.getInexperiencedDriverLoadingRate() * this.getOwnDamageBasicPremium();
    }

    /**
     * @method getExcessBoughtBackValue
     * @returns number
     * @todo Calculate for the Excess Bought Back Value
     */

    getExcessBoughtBackValue() {
        return this.getExcessBoughtBackRate() * this.getOwnDamageBasicPremium();
    }

    /**
     * @method getComprehensiveLessValue
     * @returns number
     * @todo Calculate for the Comprehensive Less Value
     */

    getComprehensiveLess() {
        return this.getComprehensiveNoClaimDiscount() + this.getComprehensiveFleetDiscount();
    }

    /**
     * @method getSumOfComprehensiveOtherLoadings
     * @returns number
     * @todo Calculate for all the Sum of Comprehensive Other Loadings
     */


    getSumOfComprehensiveOtherLoading() {
        return (
            this.getExcessBoughtBackValue()  +
            this.getExtraSeatLoadingValue()  +
            this.getComprenhensiveIDLValue() +
            this.getExtraTPPDCoverCharge()   +
            this.getAdditionalPerilValue()   +
            this.getEcowasPerilValue()       +
            this.getPABenefits()             +
            this.getStatutoryCharges()               
        );
    }
}