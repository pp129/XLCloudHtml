/**
 * Created by lin on 2017/10/11.
 */
function fn() {
    console.log(1);
    setTimeout(fn,1000);
}
fn();
