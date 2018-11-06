function websocket() {
    this.name = "websocket";
    this.fn = function (callback) {
        console.log(this.name)
        callback()

    }
}
function vue() {
    this.name = "vue";
    this.fn = function () {
        let A = new websocket();
        A.fn(this.hand);
    }
    this.hand =  () =>{
        console.log("hand",this.name);
    }
}
let oVue = new vue();
oVue.fn()
