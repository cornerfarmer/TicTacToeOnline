var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
var c;
var ctx;
var width;
var height;
var fields = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var currentPlayer = 1;
var gameRunning = false;
var invalidMove = false;
var aiScore = 0;
var humanScore = 0;
var lastBeginner = -1;

jQuery(document).ready(function () {
    var json = '{"neurons":[{"bias":0.00000000000000,"layer":"input","squash":"HLIM"},{"bias":0.00000000000000,"layer":"input","squash":"HLIM"},{"bias":2.27842384712968,"layer":"0","squash":"HLIM"},{"bias":3.34858981861236,"layer":"0","squash":"HLIM"},{"bias":3.96418096172299,"layer":"0","squash":"HLIM"},{"bias":-3.92979671193090,"layer":"output","squash":"HLIM"}],"connections":[{"from":0,"to":2,"weight":-5.97730812726829},{"from":0,"to":3,"weight":-2.36775816488263},{"from":0,"to":4,"weight":-2.84008772426777},{"from":1,"to":2,"weight":-6.01825421209065},{"from":1,"to":3,"weight":-2.46654960015039},{"from":1,"to":4,"weight":-2.75312838822441},{"from":2,"to":5,"weight":-8.53883973729034},{"from":3,"to":5,"weight":4.18224867001210},{"from":4,"to":5,"weight":4.96020682361533}]}';
    var perceptron = Network.fromJSON(JSON.parse(json));
    //var perceptron = new Architect.Perceptron(2, 3, 1);
    var output = perceptron.activate([1, 0]);

    c = document.getElementById("canvas");
    ctx = c.getContext("2d");

    width = c.width;
    height = c.height;
    $("#canvas").bind("click", canvasClick);

    startNewGame();
    refreshScoreDisplay();
});

var canvasClick = function (e) {
    if (gameRunning) {
        var offset = $("#canvas").offset();
        var x = parseInt((e.pageX - offset.left) / (width / 3))
        var y = parseInt((e.pageY - offset.top) / (height / 3));
        if (x < 3 && y < 3)
            setField(x , y);
    } else {
        startNewGame();
    }
}

var setField = function(x, y)
{
    if (fields[x][y] === 0) {
        fields[x][y] = currentPlayer;
        currentPlayer *= -1;
        redraw();
        if (whoHasWon() != 0) {
            stopGame();
        } else {
            setStatusForCurrentPlayer();
        }
    } else {
        invalidMove = true;
        stopGame();
    }
}

var setStatusForCurrentPlayer = function() {
    if (currentPlayer === 1)
        setStatus("Its your turn");
    else
        setStatus("Its AI turn");
}

var whoHasWon = function () {
    if (fields[0][0] != 0 && fields[0][0] == fields[0][1] && fields[0][1] == fields[0][2])
        return fields[0][0];
    else if (fields[1][0] != 0 && fields[1][0] == fields[1][1] && fields[1][1] == fields[1][2])
        return fields[1][0];
    else if (fields[2][0] != 0 && fields[2][0] == fields[2][1] && fields[2][1] == fields[2][2])
        return fields[2][0];

    else if (fields[0][0] != 0 && fields[0][0] == fields[1][0] && fields[1][0] == fields[2][0])
        return fields[0][0];
    else if (fields[0][1] != 0 && fields[0][1] == fields[1][1] && fields[1][1] == fields[2][1])
        return fields[0][1];
    else if (fields[0][2] != 0 && fields[0][2] == fields[1][2] && fields[1][2] == fields[2][2])
        return fields[0][2];

    else if (fields[0][0] != 0 && fields[0][0] == fields[1][1] && fields[1][1] == fields[2][2])
        return fields[0][0];
    else if (fields[2][0] != 0 && fields[2][0] == fields[1][1] && fields[1][1] == fields[0][2])
        return fields[2][0];
    else
        return 0;
}

var stopGame = function () {
    gameRunning = false;
    if (invalidMove)
    {
        if (currentPlayer == 1) {
            setStatus("Human player made invalid move => AI won");
            aiScore++;
        }
        else {
            setStatus("AI player made invalid move => Human won");
            humanScore++;
        }
    }
    else if (whoHasWon() == 1)
    {
        setStatus("Human won");
        humanScore++;
    }
    else if (whoHasWon() == -1) {
        setStatus("AI won");
        aiScore++;
    }
    else
    {
        setStatus("Tie!");
    }
    refreshScoreDisplay();
}

var refreshScoreDisplay = function() {
    $("#score").html("You " + humanScore + " - " + aiScore + " AI");
}

var setStatus = function (status) {
    $("#status").html(status);
}

var startNewGame = function () {
    fields = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    lastBeginner *= -1;
    currentPlayer = lastBeginner;
    setStatusForCurrentPlayer();
    gameRunning = true;
    invalidMove = false;
    redraw();
}

var redraw = function () {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    drawFields();
}

var drawGrid = function () {
    ctx.beginPath();
    ctx.moveTo(width / 3, 0);
    ctx.lineTo(width / 3, height);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 3 * 2, 0);
    ctx.lineTo(width / 3 * 2, height);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height / 3);
    ctx.lineTo(width, height / 3);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height / 3 * 2);
    ctx.lineTo(width, height / 3 * 2);
    ctx.closePath();
    ctx.stroke();
}

var drawFields = function () {
    for (var x = 0; x < fields.length; x++)
    {
        for (var y = 0; y < fields.length; y++) {
            drawField(x, y);
        }
    }
}


var drawField = function (x, y) {
    if (fields[x][y] === 1)
        drawX(x, y);
    else if (fields[x][y] === -1)
        drawO(x, y);
}

var drawX = function (x, y) {
    ctx.beginPath();
    ctx.moveTo(width / 3 * x, height / 3 * y);
    ctx.lineTo(width / 3 * (x + 1), height / 3 * (y + 1));
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 3 * (x + 1), height / 3 * y);
    ctx.lineTo(width / 3 * x, height / 3 * (y + 1));
    ctx.closePath();
    ctx.stroke();
}

var drawO = function (x, y) {
    ctx.beginPath();
    ctx.arc(width / 3 * (x + 0.5), height / 3 * (y + 0.5), height / 6, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
}
