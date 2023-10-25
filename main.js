const cryptoNames = ["bitcoin", "ethereum", "tether", "binancecoin"];
let cryptoChart;



document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('cryptoChart').getContext('2d');

    // Initialize the chart with empty data
    cryptoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],  
            datasets: [{
                label: '',
                data: [], 
                
            }]
        },
        options: {}
    });


    document.querySelectorAll('.wallet-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const cryptoName = event.target.innerText.toLowerCase();
            if (cryptoNames.includes(cryptoName)) {
                const data = await fetchData(cryptoName);
                updateChartWithData(cryptoChart, data);
            }
        });
    });
});



async function fetchData(cryptoName) {
    const url = `https://api.coingecko.com/api/v3/coins/${cryptoName}?sparkline=true`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();

    } catch (error) {
        console.log('There was a problem with the fetch operation for', cryptoName, ':', error);
    }
}




function getLast7Days() {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        const formattedDay = day.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
        days.push(formattedDay);
    }
    return days;
}




function updateChartWithData(chart, data) {
    //console.log(data);
    populateCoinData(data)

    const lastSevenDays = getLast7Days();
    const bulkSevenDayArr = data.market_data.sparkline_7d.price;
    const cleanedSevenDayArr = [];
    for (let i = 8; i < bulkSevenDayArr.length; i += 24) {
        cleanedSevenDayArr.push(Math.round(bulkSevenDayArr[i]));
    }
    //console.log(cleanedSevenDayArr);


        chart.data.labels = lastSevenDays; 
        chart.data.datasets[0].label = `${data.name} 7 Day`;
        chart.data.datasets[0].data = cleanedSevenDayArr;
        chart.update();
}




function populateCoinData(data) {
    const coinPrice = document.querySelector('.details-data-1')
    const coinVolume = document.querySelector('.details-data-2')
    const coinSentimentPos = document.querySelector('.sub-div-1')
    const coinSentimentNeg = document.querySelector('.sub-div-2')

    console.log(data)

    coinPrice.textContent = `Current Price: $${data.market_data.current_price.usd.toLocaleString()}`
    coinVolume.textContent = `24Hr Volume: $${data.market_data.total_volume.usd.toLocaleString()}`
    coinSentimentNeg.textContent = `😔 ${data.sentiment_votes_down_percentage}%`
    coinSentimentPos.textContent = `😀 ${data.sentiment_votes_up_percentage}%`
}






document.addEventListener('DOMContentLoaded', function () {
    const walletButtons = document.querySelectorAll('.wallet-btn');
    const detailsContainer = document.querySelector('.details-container');
    const backButton = document.querySelector('.back-btn');

    walletButtons.forEach(button => {
        button.addEventListener('click', () => {
            detailsContainer.style.display = 'block';

        });
    });

    backButton.addEventListener('click', () => {
        detailsContainer.style.display = 'none';
    });
});








/*
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('cryptoChart').getContext('2d');

    cryptoChart = new Chart(ctx, {
        // initial chart configuration here
    });

    walletButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // fetch data for the clicked cryptocurrency
            // then update the cryptoChart with the new data
        });
    });
});
*/
