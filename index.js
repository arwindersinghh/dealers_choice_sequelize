const Sequelize = require('sequelize');
const { STRING } = Sequelize;

const conn = new Sequelize('postgress://localhost/student_sport_db');




const syncAndSeed = async() => {
    try{
        await conn.sync({ force: true });
    }
    catch(ex){
        console.log(ex)
    }
}