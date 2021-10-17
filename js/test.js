function a(){
    console.log('func a enter');
    var x = true;
    var y = 0
    function b() {
        console.log('func b enter');
        if (y < 5) {
            console.log(x);
            y++;
            return requestAnimationFrame(b);
        }
        console.log('func b exit');
    }
    requestAnimationFrame(b);
    console.log(x);
    x = false;
}
requestAnimationFrame(a);

