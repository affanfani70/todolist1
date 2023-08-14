const express = require("express")
const bodyParser = require("body-parser");
const date = require("./date.js")
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

let items = [];
let workItems = []

app.get('/', (req, res) => {
    let day = date();
    res.render('list', { listTitle: day, newItems: items });
})

app.post('/', (req, res) => {
    const listInp = req.body.newItem;
    if (req.body.list === 'work') {
        workItems.push(listInp);
        res.redirect('/work');
    } else {
        items.push(listInp);
        res.redirect('/');
    }
})
app.get('/work', (req, res) => {
    res.render("list", { listTitle: "work ", newItems: workItems })
})


app.listen(3000, () => {
    console.log("app listen at 3000....")
})