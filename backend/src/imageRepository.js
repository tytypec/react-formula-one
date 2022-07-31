import fs from "fs" 
import { log } from "console";

export default class ImageRepository{
    
    
    imageDirectory = __basedir + '/images/';
    
    folderPath(){
        return this.imageDirectory
    }
    
    readImageFileNames(){
        return fs.readdirSync(this.imageDirectory);  
    }
}