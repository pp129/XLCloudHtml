var label = {};
label.defaults = {
    // value : "部恐|非法越境,重点|关系人,国|法轮功,经|法轮功,治|关系人,恐|法轮功,禁|法轮功,网|关系人,刑|法轮功"
    value: ""
};

label.classType = {
    "部恐": 1,
    "重点": 2,
    "国": 3,
    "经": 4,
    "治": 5,
    "恐": 6,
    "禁": 7,
    "网": 8,
    "刑": 9
};

label.personLabel = function (options, systemRecognition) {
    options = $.extend(true, {}, label.defaults, options);
    var rows = options.value.split(",");
    var str = '<div title="' + options.value + '" style="overflow:hidden">';
    if (systemRecognition != 0) {
        $.each(rows, function (index, item) {
            if (index < 2) {
                var labels = item.split("|");
                if (labels.length > 1) {
                    str += '<div class="msg-tab theme-'
                        + label.classType[labels[0]] + '">'
                        + '<span class="tab-lf">' + labels[0] + '</span>'
                        + '<span class="tab-lr">' + labels[1] + '</span>'
                        + '</div>';
                }
            }
        });
    }
    else {
        if (rows[0] != "") {
            var labels = rows[0].split("|");
            str += '<div class="msg-tab theme-'
                + label.classType[labels[0]] + '">'
                + '<span class="tab-lf">' + labels[0] + '</span>'
                + '<span class="tab-lr">' + labels[1] + '</span>'
                + '</div>';
        }

    }

    str += "</div>";
    return str;
};
