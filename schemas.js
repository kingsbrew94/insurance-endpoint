/**
 * @author K.B. Brew <kingsleybrew@gmail.com>
 * @version 1.0
 */

const 

/**
 * @todo Setup schemas for application data
 */

    mongoose = require('mongoose'), 
    Schema = mongoose.Schema,
    carSchema  = new Schema({
        car_id                    : String,
        cat_id                    : String,
        owner_id                  : String,
        make_of_vehicle           : String,
        cc                        : String,
        reg_no                    : String,
        chassis                   : String,
        eng_no                    : String,
        year                      : String,
        no_seats                  : String,
        lincence_issued_year      : String
    }),
    insuranceSchema = new Schema({
        car_id                    : String,
        extra_tppd_cover_rate     : Number,
        extra_tppd_cover_value    : Number,
        sum_insured               : Number,
        exccess_bought_rate       : Number 
    }),
    insuranceTypeSchema = new Schema({
        typeName                  : String,
        third_party_damage_limit  : Number
    }),
    insuranceVehicleAgeSchema = new Schema({
        id                        : String,
        year_limit                : String
    }),
    carCategorySchema = new Schema({
        id                        : String,
        cat_name                  : String
    }),
    compTariffsSchema = new Schema({
        cat_id                    : String,
        own_damage_basic_prem_rate: Number
    }),
    ownerSchema      = new Schema({
        id                        : String,
        insured                   : String,
        address                   : String,
        contact_no                : String,
        ncd_years                 : String
    }),
    fleetDiscountSchema = new Schema({
        id                        : String,
        interval                  : String,
        frb                       : Number
    }),
    tpTariffsSchema    = new Schema({
        cat_id                    : String,
        tppd_rate                 : Number,
        tppd_value                : Number,
        tpi_rate                  : Number,
        tpi_value                 : Number,
        extra_seat_loading        : Number,
        add_perils                : Number,
        ecowas_perils             : Number,
        pa_benefits               : Number,
        nic                       : Number,
        nhis_nrsc_levy            : Number,
        brown_card                : Number
    }),
    drivingAndExperienceSchema = new Schema({
        usage                     : String,
        age_of_driver             : String,
        min_year_experience       : String,
        at_inception              : Number,
        at_time_of_claim          : Number                  
    }),
    vehicleAgeRateSchema      = new Schema({
        id                        : String,
        interval                  : String,
        rate                      : Number
    }),
    ncdSchema                 = new Schema({
        years                     : String,
        private                   : Number,
        commercial                : Number,
        motor_cycle               : Number
    }),
    ccloadingSchema           = new Schema({
        valueRange                : String,
        rate                      : Number
    })
;
/**
 * @function 
 * @param md
 * @todo Setup models and implement schemas for application data
 */
module.exports = (md) => {
    return {
        Insurances           : md.model('car_insurances',insuranceSchema),

        CCLoadings           : md.model('cc_loadings',ccloadingSchema),

        InsuranceTypes       : md.model('insurance_types', insuranceTypeSchema),
        
        InsuranceVehicleAges : md.model('insurance_vehicle_ages', insuranceVehicleAgeSchema), 

        CarCategories        : md.model('car_categories', carCategorySchema), 

        Cars                 : md.model('cars',carSchema),

        ComprehensiveTariffs : md.model('comprehensive_tariffs',compTariffsSchema),

        Owners               : md.model('owners',ownerSchema),

        FleetDiscounts       : md.model('fleet_discounts',fleetDiscountSchema),

        ThirdPartyTariffs    : md.model('third_party_tariffs', tpTariffsSchema),

        DrivingAndExperiences: md.model('driving_and_experiences',drivingAndExperienceSchema),

        VehicleAgeRates      : md.model('vehicle_age_rates', vehicleAgeRateSchema),

        NCDS                 : md.model('ncds', ncdSchema)
    };
};