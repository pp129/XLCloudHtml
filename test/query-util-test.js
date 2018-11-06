const assert = require("chai").assert;
const util = require("../src/js/util/query-util");
describe("util-test", function() {
    it("getQueryArg test", function(done) {
        let obj = {
            url:"http://www.linchaoqun.com/list/index/1/50?v=1",
            arg:"v"
        };
        assert.equal(util.getQueryArg(obj), "1");
        done();
    });
    it("getQueryArg null test", function(done) {
        let obj = {
            url:"http://www.linchaoqun.com/list/index/1/50?v=1",
            arg:"v1"
        };
        assert.equal(util.getQueryArg(obj), "");
        done();
    });
    it("typeof test", function(done) {
        assert.equal(typeof "1", "string");
        done();
    });
});
