function addZero(num , length) {
    return (Array(length).join(0) + num).slice(-length);
}
console.log(addZero(1,2));
