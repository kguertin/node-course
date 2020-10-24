import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath }  from 'url';

const __filename =fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const resHandler = (req, res, next) => {
    fs.readFile('home.html', 'utf8', (err, data) => {
        res.send(data);
    })
    res.sendFile(path.join(__dirname, 'home.html'));
}

export default resHandler;