const mongoose = require('mongoose');

/**
 * This module represents a driver.
 * @typedef {Object} Driver
 * @property {String} driverName - driver's name
 * @property {String} driverDepartment - the department to which the driver belongs ('Food', 'Furniture', 'Department')
 * @property {String} driverLicense - driver's license
 * @property {Boolean} driverIsActive - indicates whether the driver is currently active. Default to false
 * @property {String} driverId - an auto-generated id to identify the driver
 * @property {Date} driverCreatedAt - timestamp of when the driver record was created
 * @property {mongoose.Schema.Types.ObjectId[]} assignedPackages - an array of package ids assigned to the driver
 */
const driverSchema = mongoose.Schema({
    driverName: { 
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return /^[A-Za-z ]{3,20}$/.test(value);
            },
            message: "Driver name must be between 3 and 20 inclusive"
        }
    },

    driverDepartment: {
        type: String,
        enum: ['Food', 'Electronic', 'Furniture'], // enum to restrict values
        required: true
    },

    driverLicense:{
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return /^[A-Za-z0-9]{5}$/.test(value);
            }, 
            message: 'Driver license must be alphanumeric and exactly 5 characters long'
        }
    },

    driverIsActive: {
        type: Boolean,
        required: true,
        default: false // default value if checkbox in unchecked
    },

    driverId: {
        type: String,
        unique: true,
        default: function(){
            let id_generated = "D";
            for (let i = 0; i < 2; i++){
                let digit = Math.floor(Math.random()*10);
                id_generated += digit;
            }

            id_generated += "-34-";

            for (let i = 0; i < 3; i++){
                id_generated += String.fromCharCode(65 + Math.floor(Math.random()*26)); // ASCII code of A is 65
            }

            return id_generated;
        }
    },

    driverCreatedAt: {
        type: Date,
        default: Date.now
    },

    assignedPackages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    }]
});

module.exports = mongoose.model('Driver', driverSchema);
