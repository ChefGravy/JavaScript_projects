let buttonColours = ["red", "blue", "green", "yellow"];
var userClickedPattern = [];
let gamePattern = [];
let randomChosenColour;

let gamePlay=false;
let level = 0;

function nextSequence(){

  gamePlay = true;
  let randomNumber = Math.round(Math.random() * 3);
  randomChosenColour = buttonColours[randomNumber];
  playSound(randomChosenColour);
  gamePattern.push(randomChosenColour);
  $(`#${randomChosenColour}`).fadeOut(100).fadeIn(100);
  level ++;
  $(`h1`).text(`Level ${level}`);
  userClickedPattern = [];
};

function checkAnswer(currentLevel){
  if(gamePattern[userClickedPattern.length - 1] === userClickedPattern[userClickedPattern.length - 1]){
    gamePlay = true;
  } else {
    gamePlay = false;
    level = 0;
    userClickedPattern = [];
    gamePattern = [];
    $(`h1`).text(`Game Over, Press Any Key to Start`);
    playSoundLoss(`wrong`);
    animateLoss();
  };
  if(userClickedPattern.length === currentLevel){
    setTimeout(nextSequence, 600);
    };
};

let playSound = (name) => {
  let audio = new Audio(`sounds/${name}.mp3`);
  audio.play();
};

let playSoundLoss = (name) => {
  let audio = new Audio(`sounds/${name}.mp3`);
  audio.play();
};

let animatePress = (currentColour) => {
  let className = $(`#${currentColour}`).addClass(`pressed`);
  setTimeout(() => {$(`#${currentColour}`).removeClass(`pressed`); }, 50);
};

let animateLoss = () => {
  let className = $(`body`).addClass(`game-over`);
  setTimeout(() => {$(`body`).removeClass(`game-over`); }, 200);
};

$(`.btn`).click((evt) => {
  if(gamePlay){
    userChosenColour = evt.target['id'];
    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    playSound(userChosenColour);
    checkAnswer(level);
  };
});

$(document).keypress(function(){
  if(!gamePlay){
    nextSequence();
    gamePlay = true;
  }
});