/**
 * Controller for managing drivers.
 * This controller handles the CRUD operation for drivers, including:
 * - Create a new driver
 * - List all drivers and populate the details of the packages assigned
 * - Delete driver by ID
 * - Update driver license and department by ID
 */
const Driver = require('../models/driver');
const Package = require('../models/package');
const {incrementCRUDCounter} = require('../firebase');

module.exports = {
    /**
     * Create a new driver
     * The data of the new driver is sent as a JSON object through the request body.
     * For example:
     * {
            "driverName": "Ali",
            "driverDepartment": "Electronic",
            "driverLicense": "AWD12",
            "driverIsActive": true
        }
     * @param {Object} req - The request object containing driver data
     * @param {Object} res  - The response object to send the result
     */
    createDriver: async function (req, res) {
        driverDepartment = req.body.driverDepartment.toLowerCase();
        const validDepartments = ['food', 'electronic', 'furniture'];

        // check if department is valid
        const isValidDepartment = validDepartments.includes(driverDepartment);
        if(!isValidDepartment){
            return res.status(400).json({message: 'Invalid Department. Must be Food, Electronic or Furniture'});
        }

        let formattedDepartment = driverDepartment.charAt(0).toUpperCase() + driverDepartment.slice(1);

        try{
            let aDriver = new Driver({
                driverName: req.body.driverName,
                driverDepartment: formattedDepartment, // enum of department: ['Food', 'Electronic', 'Furniture'] so need to change format before creating a new driver
                driverLicense: req.body.driverLicense,
                driverIsActive: req.body.driverIsActive
            });
            const savedDriver = await aDriver.save();

            // increase the 'create' counter in firestore
            await incrementCRUDCounter('create');

            res.status(200).json({
                id: savedDriver._id,
                driverId: savedDriver.driverId
            });
        } catch(err){ // validation error 
            res.status(400).json({message: err.message});
        }
    },

    /**
     * Retrieve all drivers.
     * @param {Object} req - The request object
     * @param {Object} res - The response object to send the result
     */
    getAllDrivers: async function (req, res) {
        let drivers = await Driver.find({}).populate('assignedPackages');

        // increase the 'retrieve' counter in firestore
        await incrementCRUDCounter('retrieve');

        res.status(200).json(drivers);
    },

    /**
     * Delete a driver by id
     * The driver id to be delete will be passed in using query string.
     * @param {Object} req - The request object
     * @param {Object} res - The response object to send the result
     */
    deleteDriverById: async function (req, res) {
        try{
            let driverId = req.params.id;
            console.log(driverId);
            // find the driver by id
            let theDriver = await Driver.findById(driverId);
            if(!theDriver){
                return res.status(404).json({message: 'Driver not found'});
            }

            // process to delete the driver's assigned packages if the driver exists
            let packageIds = theDriver.assignedPackages;

            // delete packages assigned to the driver
            await Package.deleteMany({_id: {$in: packageIds}});

            // delete the driver
            let obj = await Driver.deleteOne({_id: driverId});

            // increase 'delete' counter in firestore
            await incrementCRUDCounter('delete');

            res.json(obj);
            
        } catch(err){
            console.log(err);
            res.status(500).json({message: 'Server error'});
        }
    },

    /**
     * Update driver license and department by driver ID.
     * The data for the field that need to be update and the associated driver id will be send in JSON format through the request body.
     * For example:
     * {
            "id": "66dc68ef3a14f19d29e090a5",
            "driverLicense": "ABC11",
            "driverDepartment": "Food"
        }

     * @param {Object} req - The request object containing driver ID, license, and department
     * @param {Object} res - The response object to send the result
     */
    updateById: async function (req, res) {
        try{
            let driverId = req.params.id; // mongodb id
            let driverLicense = req.body.driverLicense;
            let driverDepartment = req.body.driverDepartment.toLowerCase();
    
            const validDepartments = ['food', 'electronic', 'furniture'];
    
            // check if department is valid
            const isValidDepartment = validDepartments.includes(driverDepartment);
    
            if(!isValidDepartment){
                return res.status(400).json({message: 'Invalid Department. Must be Food, Electronic or Furniture'});
            }
    
            let formattedDepartment = driverDepartment.charAt(0).toUpperCase() + driverDepartment.slice(1);
    
            // {new: true} tells Mongoose to return the updated document rather than the ori doc before the update
            // findByIdAndUpdate automatically saves the changes to the database so no need .save()
            const updateDriver = await Driver.findByIdAndUpdate(driverId, {$set: {driverLicense:driverLicense, driverDepartment:formattedDepartment}}, {new: true, runValidators: true});
            
            if(!updateDriver){
                return res.status(404).json({ message: 'Driver not not found'})
            }
    
            // increase the' update' counter in firestore
            await incrementCRUDCounter('update');

            res.status(200).json({status: 'Driver updated successfully'});

        }catch(err){
            res.status(400).json({message: err.message});
        }
    },

    getOne: async function(req, res){
        try{
            let driver = await Driver.findOne({_id: req.params.id})
                .populate('assignedPackages')
                .exec();
            if(! driver){
                return res.status(404).json({message: 'Driver not found'});
            }

            // increment the 'retrieve' counter in the firebase
            await incrementCRUDCounter('retrieve');

            res.status(200).json(driver);
        } catch(err){
            console.log(err);
            res.status(500).json({message: "Server error"});
        }
    }
};  