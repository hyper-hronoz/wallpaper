class Graphic {
    prices;
    ctx;

    constructor() {
        this.ctx = document.getElementById('myChart').getContext('2d')
        this.data = {
            type: 'line',

            data: {
                labels: [],
                datasets: [{
                    label: 'ethereum chart',
                    backgroundColor: 'rgba(0, 211, 240, 0.1)',
                    borderColor: 'rgb(23, 162, 225)',
                    data: [],
                    lineTension: 0,
                    pointRadius: 0,
                    borderWidth: 1,
                }]
            },

            options: {
                animation: {
                    duration: 0 // general animation time
                },
                // responsive: false,
                responsiveAnimationDuration: 0,
            }
        }
    }

    async getData() {
        const timeRange = new TimeRange("days")

        let http = await new Http(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=${timeRange.start}&to=${timeRange.stop}`)

        let data = await http.sendRequest()

        class convertUNIXtoDate {

            constructor() {
            }
        }

        data.prices.forEach(item => {
            this.data.data.labels.push(`${new Date(item[0]).getMonth()}`)
            this.data.data.datasets[0].data.push(item[1])
        })

        for (let i = 0; i < this.data.data.labels.length / 4; i ++) {
            this.data.data.labels.push("")
        }
    }

    drawChart() {
        console.log(this.data)
        let chart = new Chart(this.ctx, this.data)
    }
}

class TimeRange {
    range

    constructor(range="hours") {
       this.range = range
        switch (range) {
            case "hours":
                return this.getHoursRange()
                break
            case "minutes":
                return this.getMinutesRange()
                break
            case "days":
                return this.getDayRange()
                break
            default:
                return this.getHoursRange()
        }
    }

    getMinutesRange() {
        return {start: Math.floor(Math.floor(Date.now()/1000)/60)*60 - 24 * 60, stop: Math.floor(Math.floor(Date.now()/1000)/60)*60}
    }

    getHoursRange() {
        return {start: Math.floor(Math.floor(Date.now()/1000)/3600)*3600 - 24 * 3600, stop: Math.floor(Math.floor(Date.now()/1000)/3600)*3600}
    }

    getDayRange() {
        return {start: Math.floor(Math.floor(Date.now()/1000)/86400)*86400 - 30 * 86400, stop: Math.floor(Math.floor(Date.now()/1000)/86400)*86400}
    }
}

class Http {
    constructor(url, method = "GET") {
        this.url = url
        this.method = method
    }

    async sendRequest() {
        const response = await fetch(this.url, {
                method: this.method
            }
        )
        const promise = await response.json()
        let data = await promise
        return data
    }
}

class Preloader {

}

class Main {
    async startApp() {
        const chart = await new Graphic()
        await chart.getData()
        await chart.drawChart()
    }
}

new Main().startApp()

