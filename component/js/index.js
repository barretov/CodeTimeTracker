document.addEventListener('DOMContentLoaded', function(e){

    var data = '';

    var req = new XMLHttpRequest();
    req.open('get', 'data.txt', false);

    req.onload = function(e){
        data = e.target.response;
    }

    req.onerror = function(e){
        console.log(e);
    }

    req.send();

    // transforma txto em objeto
    var dataObject = [];
    var teste = data.split('data');

    for(let i = 1; i < teste.length; i++) {

     dataObject.push(JSON.parse(teste[i]));
 }

    // faz os acumuladores
    var bolas = {};
    bolas.month ={};
    bolas.day ={};
    var status = {};
    status.fullTime = 0;
    status.fullMonth = 0;
    status.fullDay = 0;

    // percorre todos os dados.
    dataObject.forEach(function(element, index) {

        let date = new Date(element.date * 1000);
        let day = [date.getDate(), date.getMonth(), date.getFullYear()].join('-');
        let month = [date.getMonth(), date.getFullYear()].join('-');
        // let tech = element.tech;

        // diário
        if(!bolas.day[day]){

            bolas.day[day] = {

                data: {
                    "date": day,
                    "time": element.time,
                }
            };

            // full day
            status.fullDay ++;

        }else{

            bolas.day[day].data.time += element.time;
        }

        // mensal
        if(!bolas.month[month]){

            bolas.month[month] = {

                data: {
                    "date": month,
                    "time": element.time,
                }
            };

            // full month
            status.fullMonth ++;

        }else{

            bolas.month[month].data.time += element.time;
        }

        // total de horas
        status.fullTime += element.time;

    });

            // TODO remove //
            console.log(status);
            console.log(bolas);


    // total de horas
    document.getElementById('fullTime').innerHTML = "<strong>Total de horas: </strong>" + (status.fullTime / 3600).toFixed(2);

    // total de meses
    document.getElementById('fullMonth').innerHTML = "<strong>Total de Meses: </strong>" + status.fullMonth;

    // total de dias
    document.getElementById('fullDay').innerHTML = "<strong>Total de Dias: </strong>" + status.fullDay;

    // Config of Graphic Line
    var graphLine ={

       title: {
        text: 'Horas Mensais',
            // subtext: 'Mensal',
            x: 'center'
        },

        tooltip : {

            trigger: 'axis'
        },

        calculable : true,

        xAxis : [

        {
            // name : 'Mês',
            type : 'category',
            boundaryGap : true,
            data : []
        }
        ],

        yAxis : [
        {
            name: 'Horas',
            type : 'value'
        }
        ],

        series : [

        {
            name:'Horas Trabalhadas',
            type:'line',
            data:[]
        },

        ]
    };

    // ajusta os dados para o gráfico de linha
    Object.keys(bolas.month).forEach(function(element, index) {

        // insere os dias
        graphLine.xAxis[0].data.push(bolas.month[element].data.date);

        // insere as horas
        graphLine.series[0].data.push(bolas.month[element].data.time / 3600);
    });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('graphLine'));
    myChart.setOption(graphLine);
});