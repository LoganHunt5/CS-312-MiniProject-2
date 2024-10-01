import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
var emoji = "none";
var emojidata;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Public'));

app.get("/", (req, res) => {
    res.render("index.ejs", {emojimap: EmojiMap, emoji: emoji});
});

app.get("/emoji", (req, res) => {
    res.render("emoji.ejs", {emoji: emojidata.data});
});

app.post("/generate", async (req, res) => {
    try{
        emoji = [req.body["category"], req.body["type"]];
        console.log(emoji[1]);
        if(req.body["type"] === "Pick Category First"){
            res.redirect("/");
        } else if(req.body["category"] === "random") {
            emojidata = await axios.get("https://emojihub.yurace.pro/api/random");
        } else if (req.body["type"] !== "any") {
            emojidata = await axios.get("https://emojihub.yurace.pro/api/random/group/" + emoji[1]);
        } else {
            emojidata = await axios.get("https://emojihub.yurace.pro/api/random/category/" + emoji[0]);
        }
        console.log(emojidata);
        res.redirect("/emoji");
    } catch(error) {
        console.log(error.response);
        res.status(500);
    }

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


const EmojiMap = ["random", "smileys-and-people", "animals-and-nature","food-and-drink", "travel-and-places", "activites", "objects", "symbols", "flags"];
