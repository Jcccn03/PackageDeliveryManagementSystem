export class Driver{
    driverName: string;
    driverDepartment: string;
    driverLicense: string;
    driverIsActive: boolean;
    driverId: string;
    driverCreatedAt: Date;
    id: string;
    constructor(){
        this.driverName = '';
        this.driverDepartment = '';
        this.driverLicense = '';
        this.driverIsActive = false;
        this.driverId = '';
        this.driverCreatedAt = new Date();
        this.id = '';
    }
}