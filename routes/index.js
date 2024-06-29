var express = require("express");
const passport = require("passport");
var router = express.Router();
const localStrategy = require("passport-local");
const say = require("say");
var userModel = require("./users");
var messageModel = require("./message");
passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/register", function (req, res, next) {
  var newUser = new userModel({
    username: req.body.username,

  });
  userModel
    .register(newUser, req.body.password)
    .then(function (u) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    })
    .catch(function (e) {
      res.send(e);
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  function (req, res, next) {}
);

router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect("/");
});

router.get("/profile", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user })
    .populate({
      path: "receivedMsg",
      populate: {
        path: "userid",
      },
    })
    .populate({
      path: "sentMsg",
      populate: {
        path: "userid",
      },
    })
    .then(function (foundUser) {
      res.render("userPage", { foundUser });
    });
});

router.get("/read/mail/:id", isLoggedIn, function (req, res) {
  messageModel
    .findOne({ _id: req.params.id })
    .populate("userid")
    .then(function (mail) {
      mail.read = true;
      mail.save();
      res.render("mail", { mail });
    });
  // res.send("hiteere");
});





router.post("/compose", isLoggedIn, async function (req, res) {
  const sender = await userModel.findOne({
    username: req.session.passport.user,
  });
  const message = await messageModel.create({
    userid: sender._id,
    reciever: req.body.email,
    subject: req.body.subject,
    msgtext: req.body.ta,
  });

  // Simple Mail Transfer Protocol

  const recieveruser = await userModel.findOne({ username: req.body.email });

  if (recieveruser) {
    recieveruser.receivedMsg.push(message._id);
    sender.sentMsg.push(message._id);
    const updatedReciever = await recieveruser.save();
  } else {
    const errmail = await messageModel.create({
      userid: sender._id,
      reciever: req.body.email,
      subject:"Email Not Found",
      msgtext: "err: the mail does not exists",
    });
    sender.sentMsg.push(errmail._id);
  }

  const updatedsender = await sender.save();
  res.redirect("back");
});

router.get("/speak/:matter", isLoggedIn, function (req, res) {
  say.speak(`${req.params.matter}`, "Microsoft David Desktop", 1.0, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Text has been spoken.");
    res.redirect("back");
  });
});

router.get("/stopspeak", isLoggedIn, function (req, res) {
  say.stop();
  res.redirect("back");
});

router.get("/allusers", function (req, res) {
  userModel.find().then(function (allusers) {
    res.render("allusers", { allusers });
  });
});

router.get("/deleteall", function (req, res) {
  userModel.deleteMany({}).then(function (data) {
    res.send("all data is deleted");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

module.exports = router;

// router.get('/chat/:sender/:name',isLoggedIn,function(req,res){
// userModel.findOne({username:req.params.name})
// .then(function(user){
//   userModel.find()
//   .then(function (allusers) {
//     userModel.findOne({username:req.params.sender})
//     .populate({
//       path:'receivedMsg',
//       populate:{
//         path:'userid'
//       }
//     })
//     .then(function(sender){
//       userModel.findOne({username:req.params.sender})
//       .populate({
//         path:'sentMsg',
//         populate:{
//           path:'userid'
//         }
//       })
//       .then(function(sent){
//         res.render("chatprofile", { user,allusers,sender,sent});
//       })
//     })
//   })
// })
// });

// router.get('/speak/:gender',function(req,res){
//   if(req.params.gender==='male'){
//     say.speak(` hi there this is the ladka wala noise`, 'Microsoft David Desktop', 1.0, (err) => {
//       if (err) {
//         return console.error(err)
//       }
//       console.log('Text has been spoken.')

//     });
//   }
//   else{
//     say.speak(` hi there this is the ladki wala noise`, 'Microsoft Zira Desktop', 1.0, (err) => {
//       if (err) {
//         return console.error(err)
//       }
//       console.log('Text has been spoken.')

//     });
//   }

// })

//say.speak("hi there this is a new voice line", 'Microsoft David Desktop', 0.5);
//say.speak("hi there this is a new voice line", 'Microsoft Zira Desktop', 0.5);
// res.render("profile");

//say.stop()
