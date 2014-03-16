var jq = document.createElement("script");
jq.type = "text/javascript";
jq.src = "http://code.jquery.com/jquery-1.11.0.min.js";
var head_element = document.getElementsByTagName('HEAD').item(0);
head_element.appendChild(jq);

var settings_element = jQuery('<div>', {
    id: 'cheaterSettings',
    style: 'position:absolute;top:0px;right:0px;border:1px solid none',
    html: '<h2>Cheater Controller</h2>' +
        '<small>You can also press <em>P</em> to start/stop</small>' +
        '<div id="controls"></div>' +
        '<ul id="loggingArea"></ul>'
});
jQuery('body').append(settings_element);
var start_stop_button = jQuery('<button>', {
    id: 'startStop',
    html: 'Start/Stop'
}).click(function (e) {
    e.preventDefault();
    cheater.toggleRunning();
});
jQuery('#controls').append(start_stop_button);

var cheater = new GameCheater(new KeySimulator(), new Randomizer(), new GameInfo(jQuery(document)), new ElementLogger(jQuery('#loggingArea')));

jQuery(document).keydown(function (e) {
    if (e.which == 80) {
        cheater.toggleRunning();
    }
});

function ElementLogger(element) {
    this.log = function (message) {
        element.append('<li>' + message + '</li>');
    }
}

/*
 32: // Spacebar
 38: // Up
 39: // Right
 40: // Down
 37: // Left
 */

function GameCheater(keyboard, randomizer, game_info, logger) {
    var games_played = 0;
    var glitch_chance = 1; // %
    var waiting_time = 150; // milliseconds
    var next_keypress = 0;
    var random_sequence = false;
    var glitch_key = 38;

    var timer_id = 0;

    var sequence = [];
    sequence[0] = 39; // right
    sequence[1] = 40; // down
    sequence[2] = 37; // left
    sequence[3] = 40; // down

    this.getSequence = function () {
        return sequence;
    };

    this.setSequence = function (new_sequence) {
        sequence = new_sequence;
    };

    this.getGamesPlayed = function () {
        return games_played;
    };

    this.getWaitingTime = function () {
        return waiting_time;
    };

    this.setWaitingTime = function (new_waitingTime) {
        waiting_time = new_waitingTime;
    };

    this.toggleRunning = function () {
        if (this.isRunning()) {
            this.stop();
        } else {
            this.start();
        }
    };

    this.isRunning = function () {
        return timer_id !== 0;
    };

    this.stop = function () {
        if (this.isRunning()) {
            clearInterval(timer_id);
        }
        timer_id = 0;
        logger.log('stopped');
    };

    this.start = function () {
        logger.log('started');

        var object = this;
        timer_id = setInterval(function () {
                // game over?
                if (game_info.isLost()) {
                    games_played++;
                    logger.log('New game; Score: ' + jQuery('.score-container').html());
                    // reset
                    keyboard.press(32);

                }

                // did we win?
                if (game_info.isWon()) {
                    object.stop();
                    return;
                }

                // glitch = key_up
                if (randomizer.randomBetween(0, 100) < glitch_chance) {
                    keyboard.press(glitch_key);
                    logger.log('glitch happens');
                } else {
                    keyboard.press(sequence[next_keypress]);
                    if (random_sequence == true) {
                        next_keypress = randomizer.randomBetween(0, sequence.length);
                    }
                    else {
                        next_keypress++;
                        if (next_keypress >= sequence.length) {
                            next_keypress = 0;
                        }
                    }
                }

            }, waiting_time
        );
    }
}

function KeySimulator() {
    this.press = function (key) {
        var keyboard_event = document.createEvent("KeyboardEvent");
        var init_method = typeof keyboard_event.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
        keyboard_event[init_method](
            "keydown", // event type : keydown, keyup, keypress
            true, // bubbles
            true, // cancelable
            window, // viewArg: should be window
            false, // ctrlKeyArg
            false, // altKeyArg
            false, // shiftKeyArg
            false, // metaKeyArg
            key, // keyCodeArg : unsigned long the virtual key code, else 0
            0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
        );
        document.dispatchEvent(keyboard_event);
    }
}

function Randomizer() {
    /**
     lower is included
     upper is exluded
     if not defined, round = true
     */
    this.randomBetween = function (lower, upper, roud) {
        // did we define round?
        round = typeof round == 'undefined' ? true : round;
        rand = (Math.random() * (upper - lower)) + lower;
        return round == true ? Math.floor(rand) : rand;
    }
}

function GameInfo(document) {
    this.isWon = function () {
        return document.find('.game-message.game-won:visible').length > 0;
    };

    this.isLost = function () {
        return document.find('.game-message.game-over:visible').length == 1;
    }
}
