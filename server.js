const { syncAndSeed, conn, models: { Member, Sportsteam } } = require('./index');
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
        <li><a href='/sportsteams'> Teams </a></li>
        <li><a href='/members'> Captain with Members </a></li>
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
                {
                    model : Member,
                    as: 'coach'
                }
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

app.get('/members', async(req, res, next) => {
    try{
        res.send(await Member.findAll({
            include: [
                {
                    model: Member,
                    as: 'captain'
                },
                Member,
                Sportsteam
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











