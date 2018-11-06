const assert = require("chai").assert;
const util = require("../src/js/util/util");
describe("util-test", function() {
    it("getItemByValue test", function(done) {
        let arr = [{
            id: 111,
            name: "111name"
        },{
            id: 222,
            name: "222name"
        }];
        assert.equal(util.getItemByValue(arr,"id",111).name, "111name");
        done();
    });
    it("noNoneGetParams test", function(done) {
        let arr ={
            name:"",
            sex:"male",
            address:null
        };
        console.log(util.noNoneGetParams(arr));
        done();
    });
});
