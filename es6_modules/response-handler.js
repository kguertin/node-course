import fs from 'fs';

const resHandler = (req, res, next) => {
    fs.readFile('home.html', 'utf8', (err, data) => {
        res.send(data);
    })
}

export default resHandler;