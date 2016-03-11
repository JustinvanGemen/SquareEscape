//Platform Colours http://www.colorhexa.com


$(document).ready(function () {
    var i = 0;

 
    var ctx = Sketch.create({
        fullscreen: false,
        width: 1280,
        height: 720,
        container: document.getElementById('container')
    });

    function random(min, max) {
        return Math.round(min + (Math.random() * (max - min)));
    }

    function rndmKeuze(array) {
        return array[Math.round(random(0, array.length - 1))];
    }

//Blokje

    function Blokje(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.previousX = 0;
        this.previousY = 0;
    }

    Blokje.prototype.setPosition = function (x, y) {

        this.previousX = this.x;
        this.previousY = this.y;

        this.x = x;
        this.y = y;

    };

    Blokje.prototype.setX = function (x) {

        this.previousX = this.x;
        this.x = x;

    };

    Blokje.prototype.setY = function (y) {

        this.previousY = this.y;
        this.y = y;

    };


    Blokje.prototype.insercects = function (obj) {

        if (obj.x < this.x + this.width && obj.y < this.y + this.height &&
                obj.x + obj.width > this.x && obj.y + obj.height > this.y) {
            return true;
        }

        return false;
    };

    Blokje.prototype.insercectsLeft = function (obj) {

        if (obj.x < this.x + this.width && obj.y < this.y + this.height) {
            return true;
        }

        return false;
    };

//PLAYER

    function Player(options) {

        this.setPosition(options.x, options.y);
        this.width = options.width;
        this.height = options.height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.jumpSize = -13;
        this.color = '#181818';

    }

    Player.prototype = new Blokje();

    Player.prototype.update = function () {
        this.velocityY += 1;
        this.setPosition(this.x + this.velocityX, this.y + this.velocityY);

        if (this.y > ctx.height || this.x + this.width < 0) {
            this.x = 150;
            this.y = 50;
            this.velocityX = 0;
            this.velocityY = 0;
            ctx.jumpCount = 0;
            ctx.aceleration = 0;
            ctx.acelerationTweening = 0;
            ctx.scoreColor = '#181818';
            ctx.platformBeheer.maxDistanceBetween = 350;
            ctx.platformBeheer.updateWhenLose();
        }

        if ((ctx.keys.UP || ctx.keys.SPACE || ctx.keys.W || ctx.dragging) && this.velocityY < -8) {
            this.velocityY += -0.75;
        }

    };

    Player.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

//PLATFORM

    function Platform(options) {
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.previousX = 0;
        this.previousY = 0;
        this.color = options.color;
    }

    Platform.prototype = new Blokje();

    Platform.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

//PLATFORM BEHEER

    function PlatformBeheer() {
        this.maxDistanceBetween = 300;
        this.colors = ['#2ca8c2', '#98cb4a', '#f76d3c', '#f15f74', '#5481e6'];

        this.first = new Platform({
            x: 300,
            y: ctx.width / 2,
            width: 400,
            height: 70
        });
        this.second = new Platform({
            x: (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
            y: random(this.first.y - 128, ctx.height - 80),
            width: 400,
            height: 70
        });
        this.third = new Platform({
            x: (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
            y: random(this.second.y - 128, ctx.height - 80),
            width: 400,
            height: 70
        });

        this.first.height = this.first.y + ctx.height;
        this.second.height = this.second.y + ctx.height;
        this.third.height = this.third.y + ctx.height;
        this.first.color = rndmKeuze(this.colors);
        this.second.color = rndmKeuze(this.colors);
        this.third.color = rndmKeuze(this.colors);

        this.colliding = false;

        this.platforms = [this.first, this.second, this.third];
    }

    PlatformBeheer.prototype.update = function () {

        this.first.x -= 3 + ctx.aceleration;
        if (this.first.x + this.first.width < 0) {
            this.first.width = random(450, ctx.width + 200);
            this.first.x = (this.third.x + this.third.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
            this.first.y = random(this.third.y - 32, ctx.height - 80);
            this.first.height = this.first.y + ctx.height + 10;
            this.first.color = rndmKeuze(this.colors);
        }

        this.second.x -= 3 + ctx.aceleration;
        if (this.second.x + this.second.width < 0) {
            this.second.width = random(450, ctx.width + 200);
            this.second.x = (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
            this.second.y = random(this.first.y - 32, ctx.height - 80);
            this.second.height = this.second.y + ctx.height + 10;
            this.second.color = rndmKeuze(this.colors);
        }

        this.third.x -= 3 + ctx.aceleration;
        if (this.third.x + this.third.width < 0) {
            this.third.width = random(450, ctx.width + 200);
            this.third.x = (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
            this.third.y = random(this.second.y - 32, ctx.height - 80);
            this.third.height = this.third.y + ctx.height + 10;
            this.third.color = rndmKeuze(this.colors);
        }

    };

    PlatformBeheer.prototype.updateWhenLose = function () {

        this.first.x = 300;
        this.first.color = rndmKeuze(this.colors);
        this.first.y = ctx.width / random(2, 3);
        this.second.x = (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
        this.third.x = (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);

    };

//PARTICLE SYSTEEM

    function Particle(options) {
        this.x = options.x;
        this.y = options.y;
        this.size = 10;
        this.velocityX = options.velocityX || random(-(ctx.aceleration * 3) + -8, -(ctx.aceleration * 3));
        this.velocityY = options.velocityY || random(-(ctx.aceleration * 3) + -8, -(ctx.aceleration * 3));
        this.color = options.color;
    }

    Particle.prototype.update = function () {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.size *= 0.89;
    };

    Particle.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    };

/***/

    ctx.setup = function () {

        this.jumpCount = 0;
        this.aceleration = 0;
        this.acelerationTweening = 0;

        this.player = new Player({
            x: 150,
            y: 30,
            width: 32,
            height: 32
        });

        this.platformBeheer = new PlatformBeheer();

        this.particles = [];
        this.particlesIndex = 0;
        this.particlesMax = 20;
        this.collidedPlatform = null;
        this.scoreColor = '#181818';
        this.jumpCountRecord = 0;

    };

    ctx.update = function () {

        this.player.update();

        switch (this.jumpCount) {
        case 10:
            this.acelerationTweening = 1;
            this.platformBeheer.maxDistanceBetween = 430;
            this.scoreColor = '#076C00';
            break;
        case 25:
            this.acelerationTweening = 2;
            this.platformBeheer.maxDistanceBetween = 530;
            this.scoreColor = '#0300A9';
            break;
        case 40:
            this.acelerationTweening = 3;
            this.platformBeheer.maxDistanceBetween = 580;
            this.scoreColor = '#9F8F00';
            break;
        }

        this.aceleration += (this.acelerationTweening - this.aceleration) * 0.01;

        for (i = 0; i < this.platformBeheer.platforms.length; i++) {
            if (this.player.insercects(this.platformBeheer.platforms[i])) {
                this.collidedPlatform = this.platformBeheer.platforms[i];
                if (this.player.y < this.platformBeheer.platforms[i].y) {
                    this.player.y = this.platformBeheer.platforms[i].y;
                    this.player.velocityY = 0;
                }

                this.player.x = this.player.previousX;
                this.player.y = this.player.previousY;

                this.particles[(this.particlesIndex++) % this.particlesMax] = new Particle({
                    x: this.player.x,
                    y: this.player.y + this.player.height,
                    color: this.collidedPlatform.color
                });

                if (this.player.insercectsLeft(this.platformBeheer.platforms[i])) {
                    this.player.x = this.collidedPlatform.x - 64;
                    for (i = 0; i < 10; i++) {
                        this.particles[(this.particlesIndex++) % this.particlesMax] = new Particle({
                            x: this.player.x + this.player.width,
                            y: random(this.player.y, this.player.y + this.player.height),
                            velocityY: random(-30, 30),
                            color: rndmKeuze(['#181818', '#181818', this.collidedPlatform.color])
                        });
                    }
                    this.player.velocityY = -10 + -(this.aceleration * 4);
                    this.player.velocityX = -20 + -(this.aceleration * 4);


                } else {

                    if (this.dragging || this.keys.SPACE || this.keys.UP || this.keys.W) {
                        this.player.velocityY = this.player.jumpSize;
                        this.jumpCount++;
                        if (this.jumpCount > this.jumpCountRecord) {
                            this.jumpCountRecord = this.jumpCount;
                        }
                    }

                }

            }
        }

        for (i = 0; i < this.platformBeheer.platforms.length; i++) {
            this.platformBeheer.update();
        }

    };

    ctx.draw = function () {
        this.player.draw();

        for (i = 0; i < this.platformBeheer.platforms.length; i++) {
            this.platformBeheer.platforms[i].draw();
        }

        this.font = '12pt Arial';
        this.fillStyle = '#181818';
        this.fillText('HIGHSCORE: ' + this.jumpCountRecord, this.width - (150 + (this.aceleration * 4)), 33 - (this.aceleration * 4));
        this.fillStyle = this.scoreColor;
        this.font = (12 + (this.aceleration * 3)) + 'pt Arial';
        this.fillText('SPRONGEN: ' + this.jumpCount, this.width - (150 + (this.aceleration * 4)), 50);

    };

    ctx.resize = function () {

    };
});