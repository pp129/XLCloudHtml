const request = require("supertest");
describe("person", function() {
    it("/api2/personInfoDetail/getFamilyRelationship", function(done) {
        let app = require("../../app");
        request(app)
            .post("/api2/personInfoDetail/getFamilyRelationship?idCard=1")
            // .send({
            //     idCard:"1"
            // })
            .then(response => {
                console.log(response.body);
                done();
            }).catch((error)=>{
            console.log(error)
            done();
        });
    });
});
