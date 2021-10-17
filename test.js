function add(a, b) {
    console.log('added');
    return a+b;
}

function min(a,b){
    console.log('minus');
    return a-b;
}

const p = new Promise(add, function(){console.log('error')}).then(function(){console.log('worked')},
function(){console.log('failed')});
