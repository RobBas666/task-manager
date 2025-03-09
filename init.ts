import path from "path";
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

const envFilePath = path.join(process.cwd(), '.env');
const dbFilePath = path.join(process.cwd(), 'database.sqlite');

const resetDb = process.argv.includes('--reset-db'); //this will mean that or db will only be removed with this flag

function deleteFileIfExists(file: string){
    if (fs.existsSync(file)){
        fs.unlinkSync(file)
        console.log(`Deleted ${file}`);
    }
}

deleteFileIfExists(envFilePath);

const secretKey = crypto.randomBytes(32).toString('hex');

const envVars = `PORT=3000
JWT_SECRET=${secretKey}
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
`;

fs.writeFileSync(envFilePath,envVars);
console.log(`Environment file ${envFilePath} has been created`)

if(resetDb){
    deleteFileIfExists(dbFilePath);
}