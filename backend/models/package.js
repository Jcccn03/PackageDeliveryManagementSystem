const mongoose = require('mongoose');

/**
 * This module represents a package.
 * @typedef {Object} Package
 * @property {String} packageTitle - package's title
 * @property {Number} packageWeight - the weight of the package. must be greater than 0
 * @property {String} packageDestination - the destination of the package
 * @property {String} description - optional field. the description of the package
 * @property {Boolean} isAllocated - indicates whether the package has been allocated to a driver. defaults to false
 * @property {mongoose.Schema.Types.ObjectId} driverId - references the 'Driver' document associated with this package
 * @property {String} packageId - an auto-generated unique identifier for the package
 * @property {Date} createdAt - the timestamp of when the package record was created. default to the current date and time
 */
const packageSchema = mongoose.Schema({
    packageTitle:{
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return /^[A-Za-z0-9 ]{3,15}$/.test(value);
            }, 
            message: "Package title should be alphanumeric with length between 3 and 15 inclusive"
        }
    },

    packageWeight: {
        type: Number,
        required: true,
        validate: {
            validator: function(value){
                return value > 0
            }, message: 'Package Weight should be greater than 0'
        }
    },

    packageDestination: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return /^[A-Za-z0-9 ]{5,15}$/.test(value);
            }, 
            message: 'Package destination should have length between 5 and 15 inclusive.'
        }
    },

    description: {
        type: String,
        required: false,
        validate: {
            validator: function(value){
                return /^.{0,30}$/.test(value);
            },
            message: "Description too long"
        }
    },

    isAllocated: {
        type: Boolean,
        required: true,
        default: false
    },

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Driver'
    },

    packageId: {
        type: String,
        unique: true,
        default: function(){
            let id_generated = "P";
            for (let i = 0; i < 2; i++){
                id_generated += String.fromCharCode(65 + Math.floor(Math.random()*26)); // ASCII code of A is 65
            }

            id_generated += "-JS-";

            for (let i = 0; i < 3; i++){
                let digit = Math.floor(Math.random()*10);
                id_generated += digit;
            }
            return id_generated;
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Package", packageSchema);