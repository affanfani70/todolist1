const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require("./date.js")
const app = express();
const loDash = require("lodash")


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
let day = date();
console.log(day)


mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");
const schema = new mongoose.Schema({
    task: {
        type: String,
    }
})
const model = new mongoose.model("list", schema);
const list1 = new model({
    task: "complete the papers"
})
const list2 = new model({
    task: "complete the papers"
})
const list3 = new model({
    task: "complete the papers"
})
const defualtList = [list1, list2, list3];

const listSchema = {
    name: String,
    items: [schema]
};

const item = new mongoose.model("item", listSchema);




app.get('/', (req, res) => {

    model.find().then((result) => {
        if (result.length === 0) {
            model.insertMany(defualtList).then((result) => {
                console.log("inserted successfully")
            }).catch((err) => {
                console.log("cannot insert the result")
            });
            res.redirect('/');
        } else {
            res.render('list', { listTitle: "Today", newItems: result });
        }
    }).catch((err) => {
        console.log("unable to retrive the data")
    });

})

app.get('/:customName', (req, res) => {
    const customName = loDash.capitalize(req.params.customName)


    item.findOne({ name: customName }).then((result) => {
        if (!result) {
            const list = new item({
                name: customName,
                items: defualtList
            })
            list.save();
            res.redirect('/' + customName);
        } else {
            res.render('list', { listTitle: result.name, newItems: result.items });

        }
    }).catch((err) => {
        console.log(err)
    });

})

app.post('/', (req, res) => {
    const listInp = req.body.newItem;
    const listName = req.body.list;
    
    const list = new model({
        task: listInp
    });
    if (listName === "Today") {
        list.save().then((result) => {
            res.redirect('/')
        }).catch((err) => {
            console('cannot added to list ',err)
        });
    } else {
        item.findOne({ name: listName }).then((result) => {
            result.items.push(list);
            result.save();
            res.redirect('/' + listName)
        }).catch((err) => {
            console.log(err)
        });
    }




})

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === day) {
        model.findByIdAndRemove(checkedItemId).then((result) => {
            res.redirect('/');
        }).catch((err) => {
            console.log(err);
        });
    } else {
        item.findOneAndUpdate({name:listName},{$pull:{items: {_id:checkedItemId}}}).then((result) => {
            res.redirect('/'+listName)            
        }).catch((err) => {
           console.log(err); 
        });
    }


})

app.get('/work', (req, res) => {
    res.render("list", { listTitle: "work ", newItems: workItems })
})


app.listen(3000, () => {
    console.log("app listen at 3000....")
})