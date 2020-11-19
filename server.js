const { syncAndSeed, conn, models: { Student, Sportsteam } } = require('./index');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('assets'));

app.get('/', async(req, res, next) => {
    try{
        res.send(`
        <html>
        <head>
        <link rel='stylesheet' href='/styles.css'>
        <title>Students and Teams</title>
        </head>
        <body>
        <h1> Please pick one from below... </h1>
        <div class='homepage'>
        <li><a href='/sportsteams'> Sportsteams </a></li>
        <li><a href='/students'> Students </a></li>
        </div>
        </body>
        </html>
        `)
    }
    catch(ex){
        next(ex)
    }
});


app.get('/sportsteams', async(req, res, next) => {
    try{
        res.send(await Sportsteam.findAll({
            include : [
                Student
            ],
            order: [
                ['id', 'ASC']
            ]
        }))
    }
    catch(ex){
        next(ex)
    }
})

app.get('/students', async(req, res, next) => {
    try{
        res.send(await Student.findAll({
            include : [
                {
                    model: Student,
                    as: 'captain'
                },
                {
                    model: Student,
                    as: 'teammate'
                }

            ]
        }));

    }
    catch(ex){
        next(ex)
    }
});

const init = async() => {
    try{
        await conn.authenticate();
        await syncAndSeed();
        const port = 3000;
        app.listen(port, () => {
            console.log(`You are being heard on port ${port}`);
        });
    }
    catch(ex){

    }
}
init();











