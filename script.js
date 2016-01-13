jQuery(document).ready(function () {
    var net = new brain.NeuralNetwork();

    net.train([{ input: [0, 0], output: [0] },
               { input: [0, 1], output: [1] },
               { input: [1, 0], output: [1] },
               { input: [1, 1], output: [0] }]);

    var output = net.run([1, 0]);  // [0.987]
    $('body pre').append(JSON.stringify(net.toJSON(), null, 2));
    $('body pre').append(output);
});