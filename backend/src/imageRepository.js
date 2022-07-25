import fs from "fs" 

export default class ImageRepository{
    
    imageDirectory = __basedir + '/images/';
    folderPath(){
        return this.imageDirectory
    }
    
    readImageFileNames(){
        return fs.readdirSync(this.imageDirectory);  
    }
}