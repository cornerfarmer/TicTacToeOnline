jQuery(document).ready(function () {
    var net = new brain.NeuralNetwork();
    var json = "{\"layers\":[{\"0\":{},\"1\":{}},{\"0\":{\"bias\":2.27842384712968,\"weights\":{\"0\":-5.97730812726829,\"1\":-6.01825421209065}},\"1\":{\"bias\":3.34858981861236,\"weights\":{\"0\":-2.36775816488263,\"1\":-2.46654960015039}},\"2\":{\"bias\":3.96418096172299,\"weights\":{\"0\":-2.84008772426777,\"1\":-2.75312838822441}}},{\"0\":{\"bias\":-3.92979671193090,\"weights\":{\"0\":-8.53883973729034,\"1\":4.18224867001210,\"2\":4.96020682361533}}}]}";

    net.fromJSON(JSON.parse(json));

    var output = net.run([1, 0]);
    $('body pre').append(JSON.stringify(net.toJSON(), null, 2));
    $('body pre').append(output);
});