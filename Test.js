let a = {
    Value: 99999,
    Rate: 0,
    Total: 0
}


function Calrate(a) {
    console.log(a.Rate)
    var value = [1000, 3000, 5000, 7000]
    var rate = [0.1, 0.2, 0.3, 0.4, 0.5]
    var Rate

    for (let i = 0; i < value.length; i++) {
        if (a.Value < value[i]) {
            a.Rate = rate[i]
            break
        }
    }
    if (a.Value >= 7000) a.Rate = rate[4]
    a.Total = a.Value * a.Rate
    a.Total += a.Value


}