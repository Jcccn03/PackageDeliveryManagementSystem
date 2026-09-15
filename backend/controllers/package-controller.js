/**
 * Controller for managing packages
 * This controller handles the CRUD operations for packages, including:
 * - Insert new package
 * - List all packages and populate the associated driver details
 * - Delete package by id (also need to remove the package from the associated driver's assignedPackages list)
 * - Update package destination by its ID
 */

const Package = require('../models/package');
const Driver = require('../models/driver');
const {incrementCRUDCounter} = require('../firebase');

module.exports = {
    /**
     * Insert a new package
     * The data of the new package is sent as a JSON object through the request body.
     * For example:
     *  {
            "packageTitle": "cake",
            "packageWeight": "1.2",
            "packageDestination": "Clayton",
            "description": "Birthday cake",
            "isAllocated": true,
            "driverId": "66e128de25d119f887a52e52"
        }
     * @param {Object} req - The request object containing package data
     * @param {Object} res - The response object to send the result
     */
    createPackage : async function (req, res) {
        console.log('Creating package with data:', req.body);
        try{
            // check if the assigned driver exists
            let theDriver = await Driver.findById(req.body.driverId);
            if(!theDriver){
                return res.status(404).json({message: 'Driver not found'});
            }

            // if driver exists, create and save the package
            let aPackage = new Package({
                packageTitle: req.body.packageTitle,
                packageWeight: req.body.packageWeight,
                packageDestination: req.body.packageDestination,
                description: req.body.description || undefined,
                isAllocated: req.body.isAllocated,
                driverId: req.body.driverId,
            });

            const savedPackage = await aPackage.save();

            // add the package to the driver's assignedPackages
            theDriver.assignedPackages.push(savedPackage._id);
            await theDriver.save();

            // increment the 'create' counter in the firestore
            await incrementCRUDCounter('create');

            // respond with the saved package data
            res.status(200).json({
                id: savedPackage._id,
                packageId: savedPackage.packageId
            });
        } catch(err){ // validation error
            res.status(400).json({message: err.message});
        }
    },

    /**
     * List all packages and show the details of the associated driver
     * @param {Object} req - The request object
     * @param {Object} res - The response object to send the list of packages
     */
    getAllPackages : async function (req, res) {
        let packages = await Package.find({}).populate('driverId');

        // increment the 'retrieve' counter in the firebase
        await incrementCRUDCounter('retrieve');

        res.status(200).json(packages);
    },

    /**
     * Delete a package by ID
     * The package id to be delete will be passed as a route parameter.
     * @param {Object} req - The request object containing the package ID
     * @param {Object} res - The response object to confirm the deletion
     */
    deletePackageById : async function (req, res) {
        let packageId = req.params.id;
        try{
            // find the package
            let package = await Package.findById(packageId);
            if (! package){ // package does not exist
                return res.status(404).json({message: 'Package not found'});
            }

            // if package exists, remove it from the driver's assigned packages
            let driverId = package.driverId;
            await Driver.updateOne({_id: driverId}, {$pull: {assignedPackages: packageId}});

            // delete the package
            let obj = await Package.deleteOne({_id: packageId});

            // increment the 'delete' counter in firebase
            await incrementCRUDCounter('delete');

            res.status(200).json(obj);

        } catch(err){
            console.log(err);
            res.status(500).json({message: "Server error"});
        }
    },

    /**
     * Update package destination by package ID
     * The data for the destination field that need to be update and the associated package id will be send in JSON format through the request body.
     * For example:
     *  {
            "id": "66dd7b80174c89e3c543ca82",
            "destination": "Brisbane"
        }
     * @param {Object} req - The request body containing the package ID and new destination
     * @param {Object} res - The response object to confirm the update
     */
    updateById: async function (req, res) {
        let packageId = req.params.id;
        let destination = req.body.destination;

        try{ // if package not found using the id, findByIdAndUpdate returns null, normally it returns a doc
            const updatePackage = await Package.findByIdAndUpdate(packageId, {$set: {packageDestination: destination}}, {new: true, runValidators: true});
            if(!updatePackage){
                return res.status(404).json({ message: 'ID not found'})
            }

            // increment the 'update' counter in the firebase
            await incrementCRUDCounter('update');

            res.status(200).json({status: 'Updated successfully'})
        } catch(err){
            console.log(err);
            res.status(400).json({message: err.message});
        }
    },

    getOne: async function(req, res){
        try{
            // find the package
            let package = await Package.findOne({_id: req.params.id})
                .populate('driverId')
                .exec();            
            if (! package){ // package does not exist
                return res.status(404).json({message: 'Package not found'});
            }
            // increment the 'retrieve' counter in the firebase
            await incrementCRUDCounter('retrieve');
            
            res.status(200).json(package);

        } catch(err){
            console.log(err);
            res.status(500).json({message: "Server error"});
        }
        
    }
};