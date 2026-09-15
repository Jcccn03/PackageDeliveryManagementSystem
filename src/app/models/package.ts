export class Package{
    packageTitle: string;
    packageWeight: number;
    packageDestination: string;
    description: string;
    isAllocated: boolean;
    createdAt: Date;
    packageId: string;
    driverId: string;
    id: string;
    constructor(){
        this.packageTitle = '';
        this.packageWeight = 0;
        this.packageDestination = '';
        this.description = '';
        this.isAllocated = false;
        this.createdAt = new Date();
        this.packageId = '';
        this.driverId = '';
        this.id = '';
    }
}