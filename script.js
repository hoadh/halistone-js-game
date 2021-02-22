class ElementRender {
    constructor(renderCallback) {
        this.renderCallback = renderCallback;
    }

    render() {
        this.renderCallback(this);
    }
}

class Hailstone extends ElementRender {
    constructor(x, y, side, downSpeed, renderCallback) {
        super(renderCallback);
        this.x = x;
        this.y = y;
        this.w = side;
        this.h = side;
        this.downSpeed = downSpeed;
    }
    moveDown() {
        this.y += this.downSpeed;
    }
}

class Player extends ElementRender {
    constructor(x, y, side, color, renderCallback) {
        super(renderCallback);
        this.x = x;
        this.y = y;
        this.w = side;
        this.h = side;
        this.color = color;
        this.dx = 0;
        this.dy = 0;
    }

    moveRight() {
        this.dx = 5;
        this.dy = 0;
    }

    moveLeft() {
        this.dx = -5;
        this.dy = 0;
    }

    moveUp() {
        this.dx = 0;
        this.dy = -5;
    }

    moveDown() {
        this.dx = 0;
        this.dy = 5;
    }
}

class Game {
    constructor(window, document) {
        this.window = window;
        this.hailstones = [];

        let screen_side = 500;
        this.canvas = document.getElementById("game_screen"); // tham chiếu đến canvas trên màn hình
        this.canvas.width = screen_side;
        this.canvas.height = screen_side;
        this.context = this.canvas.getContext("2d");

        const playerRenderCallback = (player) => {
            this.context.fillStyle = player.color;
            player.x += player.dx;
            player.y += player.dy;
            this.context.fillRect(player.x, player.y, player.w, player.h);
        }

        const player_side = 50;
        const xPosition = this.canvas.width / 2 - player_side / 2;
        this.player = new Player(xPosition, this.canvas.height - player_side, player_side, "green", playerRenderCallback);

        this.hailstoneRenderCallback = (hailstone) => {
            this.context.fillStyle = "red";
            this.context.fillRect(hailstone.x, hailstone.y, hailstone.w, hailstone.h);
        }
        this.createStone();
    }

    createStone() {
        const randomX = Math.floor(Math.random() * this.canvas.width);
        const positionY = 0;
        const hailstone = new Hailstone(randomX, positionY, 10, 5, this.hailstoneRenderCallback);
        this.hailstones.push(hailstone);
    }

    controlDirection(event) {

        // let KEY_UP = 38;
        // let KEY_DOWN = 40;
        let KEY_RIGHT = 39;
        let KEY_LEFT = 37;
    
        switch (event.keyCode) {
            case KEY_RIGHT:
                this.player.moveRight();
                break;
            case KEY_LEFT:
                this.player.moveLeft();
                break;
            // case KEY_UP:
            //     this.player.moveUp();
            //     break;
            // case KEY_DOWN:
            //     this.player.moveDown();
            //     break;
        }
    }

    clearScreen() {
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    }

    repeatRender() {
        this.clearScreen();
        this.player.render();
        for (let hailstone of this.hailstones) {
            hailstone.moveDown();
            hailstone.render();
        }
        if (this.shouldStop()) this.stopRender();
    }

    shouldStop() {
        for (let hailstone of this.hailstones) {
            if (this.isCollision(this.player, hailstone)) return true;
        }
        return false;
    }

    // xác định va chạm giữa 2 hình chữ nhật.
    isCollision(rect1, rect2) {
        let distX = (rect1.x + (rect1.w/2)) - (rect2.x + (rect2.w)/2);
        if (distX < 0)
            distX = -distX;
    
        const distW = (rect1.w + rect2.w)/2;
    
        let distY =(rect1.y + (rect1.h/2)) - (rect2.y + (rect2.h)/2);
        if(distY < 0)
            distY = -distY;
    
        const distH = (rect1.h + rect2.h)/2;
    
        return (distX <= distW && distY <= distH);
    }

    stopRender() {
        clearInterval(this.interval);
    }

    begin() {
        this.player.render();
        let game_loop_time = 20;
        this.window.addEventListener("keydown", this.controlDirection.bind(this));
        this.interval = setInterval(this.repeatRender.bind(this), game_loop_time);
        setInterval(this.createStone.bind(this), 250);
    }


}

let game = new Game(window, document);
game.begin();