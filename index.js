const Sequelize = require('sequelize');
const { STRING } = Sequelize;

const conn = new Sequelize('postgres://localhost/student_sport_db');

const Member = conn.define('member', {
    name: {
        type: STRING
    }
});
const Sportsteam = conn.define('sportsteam', {
    team: {
        type: STRING
    }

});

Sportsteam.belongsTo(Member, { as: 'coach' });
Member.hasMany(Sportsteam, { foreignKey: 'coachId' });

Member.belongsTo(Member, { as: 'captain' });
Member.hasMany(Member, { foreignKey: 'captainId' })





const syncAndSeed = async() => {
     await conn.sync({ force: true });
     const [ Nathan, Oscar, Kevin, Daniel, Ginni, Kawai, Joseph ] = await Promise.all([
         'Nathan', 'Oscar', 'Kevin', 'Daniel', 'Ginni', 'Kawai', 'Joseph'
     ].map( name => 
         Member.create({name})
     ));
     const memberArr = [ Kawai, Oscar, Kevin, Daniel, Ginni, Nathan, Joseph ];
     const [ Basketball, Football, Soccer, Baseball ] = await Promise.all([
        'Basketball', 'Football', 'Soccer', 'Baseball'
    ].map( team => 
        Sportsteam.create({team})
    ));

        Basketball.coachId = Kawai.id;
        Football.coachId = Kawai.id;
        Baseball.coachId = Joseph.id;
        await Promise.all([
            Basketball.save(),
            Football.save(),
            Baseball.save()
        ]);
        
        Nathan.captainId = Kawai.id;
        Kevin.captainId = Kawai.id;
        Oscar.captainId = Joseph.id;
        Daniel.captainId = Joseph.id;

        await Promise.all([
            Nathan.save(),
            Kevin.save(),
            Oscar.save(),
            Daniel.save()
        ]);

};




module.exports = {
    syncAndSeed,
    conn,
    models: {
        Member,
        Sportsteam
    }
}