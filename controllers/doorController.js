const db = require("../models");
var DoorModel = db.mongoose.model("Doors");

DoorsController = {
    
    saveOne : function(req, res){
        
        console.log("Insert One");

        const doorModel = new DoorModel({
            _id : req.body.UniqueId,
            FamilyType : req.body.FamilyType,
            Mark : req.body.Mark,
            DoorFinish : req.body.DoorFinish
        });

        DoorModel.create(doorModel, (err, door) => {
            if (err) return console.log(err);
            return res.send(door);
        })

    },

    getAll : function(req, res){
        console.log("Get All");
    
        DoorModel.find({}, (err, doors) => {
            if (err) return console.log(err);
            return res.send(doors);
        });
    },
    
    batchSave : function(req, res){
        console.log("Insert Batch");
    
        db.mongoose.connection.db.collection("Doors").count((err, count) => {
            
            if(count == 0){
                console.log("Found No Records");
    
                DoorModel.insertMany(req.body, (err, door) => {
                    if (err) return console.log(err);
                    return res.send(door);
                });
            }
            else{
                console.log("Found Records : " + count);
    
                const writeOperations = req.body.map((door) => {
                    return {
                        updateOne: {
                            filter: { _id: door._id },
                            update: { DoorFinish: door.DoorFinish, Mark: door.Mark}
                        }
                    };
                });
        
                DoorModel.bulkWrite(writeOperations, (err, door) => {
                    if (err) return console.log(err);
                    return res.send(door);
                });
            }
        });
    },

    updateOne : function(req, res) {
        console.log("Update One");
        var id = req.body._id;

        DoorModel.updateOne({"_id": id}, {$set: {DoorFinish: req.body.DoorFinish}}, (err, door) => {
            if (err) return console.log(err);
            return res.send(door);
        });
    },

    delete : function(req, res){
        console.log("Delete One");
        var id = req.body._id;

        DoorModel.deleteOne({"_id": id}, (err, door) => {
            if (err) return console.log(err);
            return res.send(door);
        });
    }

};

module.exports = DoorsController;