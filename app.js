const express = require(`express`);
const bodyParser = require(`body-parser`);

const app = express();

app.set(`view engine`, `ejs`);
app.use(bodyParser.urlencoded({ extended: true }));
// with EJS it's totally different
app.use(express.static("public"));
const mongoose = require(`mongoose`);
const _ = require("lodash");
const { Schema } = mongoose;

mongoose.connect(`mongodb+srv://test123:Pepper091581!@cluster0.2mzjk.mongodb.net/todolistDB`, {useUnifiedTopology: true, useNewUrlParser: true});

const itemsSchema = new Schema ({
  name: String,
});

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const Item = mongoose.model(`Item`, itemsSchema);
const List = mongoose.model("List", listSchema)



const item = new Item({
  name: `stuff to do`,
});

const item2 = new Item({
  name: `finish coding`,
});

const item3 = new Item({
  name: `workout`,
});

const defaultItems = [item, item2, item3];

app.get(`/`, (req, res)=>{
  Item.find({}, (err, found)=>{
    if (found.length === 0) {
      Item.insertMany(defaultItems, (err)=>{
        if (err) {
          console.log(err);
        } else {
          console.log(`success`);
        }
      });
      res.redirect(`/`)
    } else {
      res.render(`list`, {listTitle:`Today`, newListItems: found});
    }
  });
});

app.get(`/:customListName`, (req, res)=>{
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name:customListName}, (err, foundList)=>{
    if (!err) {
      if(!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // show an existing list
        res.render("list", {listTitle:foundList.name, newListItems:foundList.items});
      }
    }
  });
});

app.get(`/about`, (req, res)=>{
  res.render(`about`);
});

app.post(`/`, (req, res)=>{

  const itemName = req.body.NewItem;
  const listName = req.body.list;
  const myObj = new Item({name:`${itemName}`});

  if (listName === "Today") {
    myObj.save();
    res.redirect(`/`)
  } else {
    List.findOne({name:listName}, (err, foundList)=>{
      foundList.items.push(myObj);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post(`/delete`, (req, res)=>{
  const checkedItemID = req.body.checkbox;
  const listName = req.body.list;

  if (listName === "Today") {
    Item.deleteOne({_id:checkedItemID}, (err)=>{
      if (err) {
        console.log(err);
      } else {
        console.log(`delete success`);
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name:listName},{$pull: {items:{_id:checkedItemID}}}, (err, foundList)=>{
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});


app.post(`/work`, (req, res)=>{
  res.redirect(`/work`);
});

app.listen(3000, ()=>{
  console.log("server is running");
});