const Sequelize = require('sequelize');
const { STRING } = Sequelize;

const conn = new Sequelize('postgres://localhost/student_sport_db');

const Student = conn.define('students', {
    name: {
        type: STRING
    }
});
const Sportsteam = conn.define('sports_team', {
    team: {
        type: STRING
    }

});

Student.belongsTo(Sportsteam, { as: 'teammate' });
Sportsteam.hasMany(Student, { foreignKey: 'teammateId' });
Student.belongsTo(Student, { as : 'captain' });
Student.hasMany(Student, { foreignKey: 'captainId' });




const syncAndSeed = async() => {
     await conn.sync({ force: true });
     const [ Nathan, Oscar, Kevin, Daniel, Ginni, Kawai, Joseph ] = await Promise.all([
         'Nathan', 'Oscar', 'Kevin', 'Daniel', 'Ginni', 'Kawai', 'Joseph'
     ].map( name => 
         Student.create({name})
     ));
     const studentArr = [ Kawai, Oscar, Kevin, Daniel, Ginni, Nathan, Joseph ];
     const [ Basketball, Football, Soccer, Baseball ] = await Promise.all([
        'Basketball', 'Football', 'Soccer', 'Baseball'
    ].map( name => 
        Sportsteam.create({team:name})
    ));
    Kevin.teammateId = Football.id;
    Nathan.teammateId = Basketball.id;
    Oscar.teammateId = Basketball.id;
    Daniel.teammateId = Soccer.id;
    Kawai.teammateId = Basketball.id;
    Joseph.teammateId = Baseball.id;
    
    await Promise.all(
        studentArr.map( student => student.save() ));

        Nathan.captainId = Kawai.id;
        Oscar.captainId = Kawai.id;
        await Promise.all([
            Nathan.save(),
            Oscar.save()
        ]);
};



module.exports = {
    syncAndSeed,
    conn,
    models: {
        Student,
        Sportsteam
    }
}