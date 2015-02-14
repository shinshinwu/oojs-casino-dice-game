var Casino = Casino || {} // Namespacing to Casino object

;(function($, Casino) {
    $(function() {
        Casino.Dealer.start()
    })

    // Models
    function Die() {
        this.SIDE_COUNT = 6
        this.value = this._generateRandomValue()
    }

    Die.prototype = {
        roll: function() {
            this.value = this._generateRandomValue()
        },
        // Helper Methods
        _generateRandomValue: function() {
            return Math.floor((Math.random() * this.SIDE_COUNT) + 1)
        }
    }

    function Game(DieFactory) {
        this.DieFactory = DieFactory
        this.dice = []
    }

    Game.prototype = {
        addDie: function() {
            this.dice.push(new this.DieFactory())
        },
        rollDice: function() {
            var index, diceCount = this.dice.length
            for (index = 0; index < diceCount; index++) {
                var die = this.dice[index]
                die.roll()
            }
        },
        clearDice: function() {
            this.dice = []
        }
    }

    // Views
    function Display() {
        this.DIE_CLASS_NAME = 'die'
        this.DICE_CONTAINER_NAME = '.dice'
        this.diceContainer = $(this.DICE_CONTAINER_NAME)
    }

    Display.prototype = {
        dieTemplate: function(value) {
            return "<div class=\'"+ this.DIE_CLASS_NAME +"\'>"+ value +"</div>"
        },
        compileDiceTemplate: function(dice) {
            var diceTemplate = ""
            var index, diceCount = dice.length
            for (index = 0; index < diceCount; index++) {
                var die = dice[index]
                diceTemplate += this.dieTemplate(die.value)
            }
            return diceTemplate
        },
        render: function(dice) {
            this.diceContainer.html(this.compileDiceTemplate(dice))
        }
    }

    // Controllers
    function Dealer(game, display) {
        this.game = game
        this.display = display
    }

    Dealer.prototype = {
        start: function() {
            this.bindEventListeners()
        },
        addDie: function() {
            this.game.addDie()
            this.updateView()
        },
        rollDice: function() {
            this.game.rollDice()
            this.updateView()
        },
        clearDice: function() {
            this.game.clearDice()
            this.updateView()
        },
        updateView: function() {
            this.display.render(this.game.dice)
        },
        bindEventListeners: function() {
            $('.add').on('click', this.addDie.bind(this))
            $('.roll').on('click', this.rollDice.bind(this))
            $('.clear').on('click', this.clearDice.bind(this))
        }
    }

    // Model Declarations
    Casino.DieFactory = Die
    Casino.Game = new Game(Casino.DieFactory)

    // View Declarations
    Casino.Display = new Display()

    // Controller Declarations
    Casino.Dealer = new Dealer(Casino.Game, Casino.Display)

}(jQuery, Casino))
