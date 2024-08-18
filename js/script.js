const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".socore--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");
const btnStart = document.querySelector(".btn-start");
const screeInitial = document.querySelector(".screeInitial");

const audio = new Audio('../assets/audio.mp3');
const size = 30;
const inicialPosition = {x: 270, y: 240};
let snake = [inicialPosition];
canvas.style.filter = "blur(5px)";

const incrementScore = () => {
    score.innerText = +score.innerText + 1;

}

const randonNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);// retorna um número aleatório maior que zero e meno que 1

}

const randonPosition = () => {
    const number =  randonNumber(0, canvas.width - size);// Um número aleatório que o mínimo seja 0 e o máximo seja 270
    return Math.round(number/30) * 30; // Divi o número aleatório por 30 e depois multiplica por 30, para que ele se torne multiplo de 30


}

const randonColor = () => {
    const red = randonNumber(0, 255); // gera cores aleatórias rgb
    const green = randonNumber(0, 255);
    const blue = randonNumber(0, 255);
    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randonPosition(),
    y: randonPosition(),
    color: randonColor()

}

let direction, loopId;

const drowFood = () => {

    const {x, y, color} = food;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0; // Evita que a sombra pegue em todos os elementos.
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd";

    snake.forEach( (position, index) => {
        if(index == snake.length - 1){
            ctx.fillStyle = "white";
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
}


const moveSnake = () => {

    if(!direction) return; // Se não tiver valor no direction, esta função não será executada.
    const head = snake[snake.length - 1];

 
    if( direction == "right"){
        snake.push({x: head.x + size, y: head.y});
    }

    if( direction == "left"){
        snake.push({x: head.x - size, y: head.y});
    }
    if( direction == "down"){
        snake.push({x: head.x , y: head.y + size});
    }
    if( direction == "up"){
        snake.push({x: head.x , y: head.y - size});
    }



    snake.shift() // remove o primeiro item do array
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";
 for( i = 30; i < canvas.width; i += 30){
    ctx.beginPath(); // Evita que a proxima linha não pegue a anterior
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath(); // Evita que a proxima linha não pegue a anterior
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
 }
}

const checkEat =  () => {
    const head = snake[snake.length - 1];
    if(head.x == food.x && head.y == food.y){
        incrementScore();
        snake.push(head);
        audio.play();

        let x = randonPosition();
        let y = randonPosition();
        while (snake.find((position) => position.x == x && position.y == y)) { // loop para poder evitar que as coordenadas da comida sejam as mesmas da cobra;
             x = randonPosition();
             y = randonPosition();
        }
        food.x = x;
        food.y = y;
        food.color = randonColor();

    }

}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const wallColision = head.x < 0 || head.x > 570 || head.y < 0 || head.y > 570;
    const neckIndex = snake.length - 2; // Para ignorar a posição da cabeça em relação ao corpo da cobra;
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    })
    if(wallColision || selfCollision){
       gameOver();
    }
}
const gameOver = () => {
    direction = undefined;

    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(5px)";
    btnStart.removeEventListener('click');
}

const gameLoop = () => {

    clearInterval(loopId); // Limpa o loop antes de iniciar outro para poder evitar bugs;
    ctx.clearRect(0, 0, 600, 600); // Limpa o desenho do canvas
    drawGrid();
    drowFood();
    drawSnake();
    moveSnake();
    checkEat();
    checkCollision();
    canvas.style.filter = "none";
  

    loopId = setTimeout(() => {
        gameLoop();
    }, 300);
}


document.addEventListener("keydown", ({key}) => {
    
        if(key == "ArrowRight" && direction !== "left"){
            direction = "right";
        }
        if(key == "ArrowLeft" && direction !== "right"){
            direction = "left";
        }
        if(key == "ArrowUp" && direction !== "down"){
            direction = "up";
        }
        if(key == "ArrowDown" && direction !== "up"){
            direction = "down";
        }
    
});


buttonPlay.addEventListener("click",  () =>{
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";
    snake = [inicialPosition];
    gameLoop();
   
  

});

btnStart.addEventListener("click",  () =>{
    screeInitial.style.display = "none";
    gameLoop();

});



























/*
setInterval(() => {
    ctx.clearRect(0, 0, 600, 600); // Limpa o desenho do canvas
    drawSnake();
    moveSnake();
}, 600);
*/
