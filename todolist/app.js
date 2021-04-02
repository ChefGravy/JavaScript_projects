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


const CONNECTION_URL = `mongodb+srv://testout:Password45678!@cluster0.2mzjk.mongodb.net/todolistDB?retryWrites=true&w=majority`
mongoose.connect(CONNECTION_URL, {useUnifiedTopology: true, useNewUrlParser: true})


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
  name: `Do an hour of cardio!`,
});

const item2 = new Item({
  name: `Do the dishes`,
});

const item3 = new Item({
  name: `Take Pepper out`,
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

// this is for HEROKU
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, ()=>{
  console.log(`server is running successfully on port: ${port}`);
});
