$(document)
    .ready(function () {
    var interval;
    var fg = 0;
    var k =0;
    var favorites_check_dynamic=0;
    var favorites_check = 0;
    var col,row,size_x,size_y;
    var favorites_row = 1;
    var rose_count=0;
    var roses = new Array();
    var tag_names = [];
    var rose_tooltip = [];
    var rose_colors = [];
    var ajax_url = ''; // Url динамический для получения статистики с АПИ
    var selector = '';     // Для определения текущей вкладки
    var tree_id;           // Выбор дерева
    var expected_data;     // Ожидаемые значения с сервера
    var current_data_type_test = [] //  события, выбранные пользователем на текущий момент
    var current_data_tags = [] // Выбранные  Тэги
    var growth_data = []
    var current_data = [] // Данные для динамики событий
    var change_data = [] // Изменения для динамики событий
    var column_data = [] // Данные для распределения событий. День\ неделя.
    var first_metric = [] // Первая линия на графике
    var second_metric = [] // Вторая ( у нас - изменения)
    var third_metric = [] // Потенциальная третья ( например ожидаемая)
    var fourth_metric = [] // Метрики для тэгов
    var fifth_metric = []
    var sixth_metric = []
    var seventh_metric = []
    var data_tags_hours = []
    var data_tags_days = []
    var selected_conversion = "";

    var lines = new Array(); // Массив объектов для динамики событий
    var bars = new Array(); // Массив объектов для распределения событий
    var tooltip_metric = new Array(); // Подсказки для динамики событий
    var tooltip_count = 0; // Счетчик подсказок
    var bar_graph_labels = []; // Лэйблы для отрисовки распределения событий. (Максимум - 5)
    var bar_count = 0; // Счетчик для того, чтобы отрисовать распределения выбранных пользователем событий с рассчетом 5 на 1 график
    var current_code = 'trouble'; // Код ошибки, чтобы сервер не обрабатывал ошибочный запрос. (Отсылается 3 почему-то)
    var data_type = []; // Временная переменная для создания current_data_type
    var bar_graph = []; // Данные для отрисовки распределения событий ( Максимум -5)
    var current_data_type = []; // Выбранные на текущий момент пользователем события для отрисовки графика ( не меняются, если пользователь отрисовал графики, а потом выбрал другие события)
    var temp_id = 0; // Показатель, необходимый для корректной отрисовки распределения событий
    var fake = 0; //
    var bar;
    var fake_count = 0; // fake, fake_count  - Работа с фиктивным точками в дереве событий. (Например, pin.list, user, ...  - не должно учитываться при построении)




    $.ajax('/dataset', { // Получаем первый набор данных.
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            current_data = data.graph_data;
            change_data = data.change_data;
            column_data = data.column_data;
            expected_data = data.expected_data;
            growth_data = data.growth_data;
            window.parent.$('#param')
                .html('<img src="../images/root.png" width="100" height="40"></img> <b>' + growth_data.roots + '%</b> &nbsp&nbsp&nbsp<img src="../images/13058eeb.gif" width="100" height="40"></img> <b>' + growth_data.average + '%</b>&nbsp&nbsp&nbsp<img src="../images/pin.png" width="50" height="40"></img><b> ' + growth_data.pins + '%</b>&nbsp&nbsp&nbsp<img src="../images/board.jpg" width="105" height="40"></img><b>' + growth_data.plans + '%</b>&nbsp&nbsp&nbsp<img src="../images/user.png" width="55" height="40"></img><b>' + growth_data.users + '%</b>');

        },
        error: function () {}
    });



    $("#pages")
        .tabs();
    $("#pages")
        .fadeTo('slow', 0.8); // Интерфейс jQuery UI + грузим дерево.
    $("#metrics-remove")
        .buttonset();
    $("#shows-selection")
        .buttonset();
    $("#accordion")
        .accordion();
    $(".tree")
        .Tree();


    $(".tree")
        .each(function () {
        tree_id = $(this)
            .parent()
            .attr('id')[8];
        $(this)
            .attr('id', 'tree_' + tree_id);

    })


    $(".hrefs").click(function(){
        $("#ui-tabs-4").empty();
        $("#ui-tabs-3").empty();
        $("#ui-tabs-1").empty();
        $("#ui-tabs-2").empty();
        $("#ui-tabs-5").empty();

        if ($(".ui-tabs-selected a").text()!='Избранное') {


     }

        clearInterval(interval);
        clearInterval(get_data);

    })



        $("button")
            .button();









    function drawing(first_metric, second_metric, third_metric, type, graph_id, fourth_metric,fifth_metric,sixth_metric, seventh_metric) { // Функция отрисовки графиков. Тип - часы\минуты, graph_id - id канвас элемента


        RGraph.Clear(document.getElementById(graph_id));

        if (graph_id!=0) RGraph.ObjectRegistry.Clear(graph_id); else  RGraph.ObjectRegistry.Clear('0');


        if ((selector == 'first') || (favorites_check_dynamic==1)) // Если мы находимся на странице динамики событий

        {

            // Добавляем в массив линий новую, соответствующую входным параметрам

            lines[graph_id] = new RGraph.Line(graph_id, first_metric, second_metric);
            tooltip_count++;
            tooltip_metric[tooltip_count] = new Array();

            // Генерируем подсказки

            for (i = 0; i < first_metric.length; i++) {
                if (second_metric != null) tooltip_metric[tooltip_count][i] = '<b style="color:green;"> Реальное: ' + first_metric[i].toString() + '</b><br><b style="color:red;"> Изменения: ' + (-second_metric[i] + first_metric[i])
                    .toString() + '</b><br><b style="color:blue;"> Ожидаемое: ' + third_metric[i] + '</b>';
                else tooltip_metric[tooltip_count][i] = '<b style="color:green;"> Реальное: ' + first_metric[i].toString() + '</b><br><b style="color:blue;"> Ожидаемое: ' + third_metric[i] + '</b>';
            }




            // Устанавливаем свойства объекта - графика.

            lines[graph_id].Set('char.ylabels.count', 3);
            lines[graph_id].Set('chart.linewidth', 3);
            lines[graph_id].Set('chart.colors', ['black']);
            lines[graph_id].Set('chart.key', ['Количество событий', 'Предыдущий период']);
            lines[graph_id].Set('chart.key.position', 'gutter');
            lines[graph_id].Set('chart.key.position.x', 30);
            lines[graph_id].Set('chart.key.position.y', 30);
            lines[graph_id].Set('chart.key.background', 'rgba(255,255,255,0.5)');
            lines[graph_id].Set('chart.key.color.shape', 'circle');
            lines[graph_id].Set('chart.key.shadow.color', 'white');
            lines[graph_id].Set('chart.tickmarks', 'circle');
            lines[graph_id].Set('chart.colors', ['#2E2EB8', 'rgba(255,255,255,0.5)', 'green']);
            lines[graph_id].Set('chart.background.grid.autofit', true);
            lines[graph_id].Set('chart.tooltips', tooltip_metric[tooltip_count]);
            lines[graph_id].Set('chart.shadow', true);
            lines[graph_id].Set('chart.shadow.offsetx', 0);
            lines[graph_id].Set('chart.shadow.offsety', 0);
            lines[graph_id].Set('chart.background.grid.autofit.numhlines', 10);
            lines[graph_id].Set('chart.background.grid.color', 'black');
            lines[graph_id].Set('chart.background.barcolor1', 'orange');
            lines[graph_id].Set('chart.background.barcolor2', 'orange');
            lines[graph_id].Set('chart.text.color', 'white');
            lines[graph_id].Set('chart.fillstyle', ['orange']);
            lines[graph_id].Set('chart.shadow', true);
            lines[graph_id].Set('chart.shadow.offsetx', 1);
            lines[graph_id].Set('chart.shadow.offsety', 1);
            lines[graph_id].Set('chart.hmargin', 5);



            // Для минут и часов  - labels должны быть разными. Динамически меняем максимальное значение по Y - максимум из значений текущих и за прошлый период + 10% сверху от этого для наглядности

            if (type == 'minutes') {

                lines[graph_id].Set('chart.labels', ['1', '', '', '', '5', '', '', '', '', '10', '', '', '', '', '15', '', '', '', '', '20', '', '', '', '', '25', '', '', '', '', '30', '', '', '', '', '35', '', '', '', '', '40', '', '', '', '', '45', '', '', '', '', '50', '', '', '', '', '55', '', '', '', '', '60']);

                lines[graph_id].Set('chart.ymax', Math.max(Math.max.apply(null, first_metric), Math.max.apply(null, second_metric)) + Math.max(Math.max.apply(null, first_metric), Math.max.apply(null, second_metric)) / 10);


            };





            if (type == 'hours') {


                lines[graph_id].Set('chart.labels', ['1', '2', '3', '4', '5', '6', '7']);
                lines[graph_id].Set('chart.ymax', Math.max(Math.max.apply(null, first_metric), Math.max.apply(null, second_metric)) + Math.max(Math.max.apply(null, first_metric), Math.max.apply(null, second_metric)) / 10);

            };


            lines[graph_id].Draw();


        }


          if ($(".ui-tabs-selected a").text()=="Статистика по тэгам") // Если мы находимся на странице динамики событий

        {




            // Добавляем в массив линий новую, соответствующую входным параметрам

            var metric_100 = [];

            var     max_value = 0;
                    var max_v = [];
                    max_v[0] = (Math.max.apply(null, first_metric));
                    max_v[1] = (Math.max.apply(null, second_metric));
                    max_v[2] = (Math.max.apply(null, third_metric));
                    for(var j=0;j<max_v.length;j++)
                    {
                        if (max_v[j]>max_value)
                            max_value = max_v[j];
                    }
            if($("#graph_conversion-"+ graph_id + " span").text() == 'Hide Conversion'){
            for (i=0;i<first_metric.length;i++)
                metric_100[i] = 2*max_value;}


            lines[graph_id] = new RGraph.Line(graph_id, first_metric, second_metric, third_metric, fourth_metric, fifth_metric, sixth_metric, seventh_metric, metric_100);



            // Устанавливаем свойства объекта - графика.

            lines[graph_id].Set('char.ylabels.count', 5);
            lines[graph_id].Set('chart.linewidth', 3);

            if($("#graph_conversion-"+ graph_id + " span").text() == 'Hide Conversion')
            lines[graph_id].Set('chart.key', [current_data_tags[0],current_data_tags[1], current_data_tags[2], current_data_tags[3], current_data_tags[0], current_data_tags[1], current_data_tags[2]]);
            else
            lines[graph_id].Set('chart.key', [current_data_tags[0],current_data_tags[1], current_data_tags[2], current_data_tags[3]]);
            lines[graph_id].Set('chart.key.position', 'gutter');
            lines[graph_id].Set('chart.key.linewidth', 5);
            lines[graph_id].Set('chart.key.background', 'rgba(255,255,255,0.5)');
            lines[graph_id].Set('chart.key.color.shape', 'circle');
            lines[graph_id].Set('chart.key.shadow.color', 'white');
            lines[graph_id].Set('chart.colors', ['#2E2EB8', 'black', 'red', 'pink', 'purple','white' , 'brown', 'rgba(255,255,255,0.5)']);
            lines[graph_id].Set('chart.background.grid.autofit', true);
            lines[graph_id].Set('chart.shadow', true);
            lines[graph_id].Set('chart.shadow.offsetx', 0);
            lines[graph_id].Set('chart.shadow.offsety', 0);
            lines[graph_id].Set('chart.background.grid.autofit.numhlines', 10);
            lines[graph_id].Set('chart.background.grid.color', 'black');
            lines[graph_id].Set('chart.background.barcolor1', 'orange');
            lines[graph_id].Set('chart.background.barcolor2', 'orange');
            lines[graph_id].Set('chart.text.color', 'white');
            lines[graph_id].Set('chart.fillstyle', ['orange']);
            lines[graph_id].Set('chart.shadow', true);
            lines[graph_id].Set('chart.shadow.offsetx', 1);
            lines[graph_id].Set('chart.shadow.offsety', 1);
            lines[graph_id].Set('chart.hmargin', 0);
            lines[graph_id].Set('chart.gutter.left', 50);



            // Для минут и часов  - labels должны быть разными. Динамически меняем максимальное значение по Y - максимум из значений текущих и за прошлый период + 10% сверху от этого для наглядности

            if (type == 'hours_tags') {


                 end_time= new Date($('#datepickerfinish').val());
                 start_time= new Date($('#datepickerstart').val());

                 time = (end_time.getDate() - start_time.getDate());

                 ;

               var  labels = []
               var points = (parseInt(time)*24) / 30 | 0;

               for (i=0;i<parseInt(time)*24;i=i+points) {

                labels[i] = i;

               }

                lines[graph_id].Set('chart.labels', labels);



            };


            if (type == 'days_tags') {


                 end_time= new Date($('#datepickerfinish').val());
                 start_time=new Date($('#datepickerstart').val());
                 time = (end_time.getDate() - start_time.getDate());
                 var labels = []

               for (i=0;i<parseInt(time);i++) {

                labels[i] = i;

               }

                lines[graph_id].Set('chart.labels', labels);




            };






            lines[graph_id].Draw();


        }


        if ((selector == 'second') || (favorites_check == 1))// Если находимся на странице распределения событий

        {


            // Новый объект столбчатой диаграммы.

            bars[graph_id] = new RGraph.Bar(graph_id, first_metric);
            bars[graph_id].Set('chart.labels', bar_graph_labels);
            bars[graph_id].Set('chart.background.grid.autofit', true);
            bars[graph_id].Set('chart.hmargin', 15);
            bars[graph_id].Set('chart.gutter.left', 45);
            bars[graph_id].Set('chart.background.grid.autofit.numhlines', 10);
            bars[graph_id].Set('chart.background.grid.color', 'black');
            bars[graph_id].Set('chart.background.barcolor1', 'orange');
            bars[graph_id].Set('chart.background.barcolor2', 'orange');
            bars[graph_id].Set('chart.text.color', 'white');
            bars[graph_id].Set('chart.fillstyle', ['orange']);
            bars[graph_id].Set('chart.hmargin', 5);
            bars[graph_id].Draw();




        }

    }







function rose_graph() {

        RGraph.Clear(document.getElementById(rose_canvas));
        RGraph.ObjectRegistry.Clear(rose_canvas);


        first_metric =[];
        second_metric = [];
        third_metric =[];
        rose_colors = [];
        rose_count++;

        first_metric = proSwitcher('user.show.places', 7, first_metric, current_data);
        first_metric = proSwitcher('pin.list.popular', 7, first_metric, current_data);
        first_metric = proSwitcher('pin.list.contest', 7, first_metric, current_data);
        first_metric = proSwitcher('user.show.plans', 7, first_metric, current_data);
        first_metric = proSwitcher('user.show.likes', 7, first_metric, current_data);
        first_metric = proSwitcher('user.follow', 7, first_metric, current_data);
        first_metric = proSwitcher('pin.show', 7, first_metric, current_data);
        first_metric = proSwitcher('user.show.follows', 7, first_metric, current_data);

        second_metric = first_metric;
        first_metric = [];



        first_metric = proSwitcher('user.show.places', 8, first_metric, current_data);
        first_metric = proSwitcher('pin.list.popular', 8, first_metric, current_data);
        first_metric = proSwitcher('pin.list.contest', 8, first_metric, current_data);
        first_metric = proSwitcher('user.show.plans', 8, first_metric, current_data);
        first_metric = proSwitcher('user.show.likes', 8, first_metric, current_data);
        first_metric = proSwitcher('user.follow', 8, first_metric, current_data);
        first_metric = proSwitcher('pin.show', 8, first_metric, current_data);
        first_metric = proSwitcher('user.show.follows', 8, first_metric, current_data);

        for (i=0;i<8;i++)

        {

            if ((-first_metric[i]+second_metric[i]) < 0 )

                {

                    third_metric.push(+first_metric[i]-second_metric[i]);
                    rose_colors[i] = 'red';

                }

            else

                {

                    third_metric.push(-first_metric[i]+second_metric[i]);
                    rose_colors[i] = 'rgb(0,255,0)';

                }

            rose_tooltip[i] = 'Изменение: ' + (-first_metric[i]+second_metric[i]);
        }






            roses[rose_count] = new RGraph.Rose('rose_canvas', third_metric);
            roses[rose_count].Set('chart.colors.alpha', 0.9);
            roses[rose_count].Set('chart.labels', ['user.show.places','Popular','Contest','user.show.plans','user.show.likes','user.follow','pin.show','user.show.follows']);
            roses[rose_count].Set('chart.tooltips', rose_tooltip);
            roses[rose_count].Set('chart.labels.position', 'center');
            roses[rose_count].Set('chart.labels.axes', '');
            roses[rose_count].Set('chart.background.grid.spokes', 8);
            roses[rose_count].Set('chart.background.axes', false);
            roses[rose_count].Set('chart.colors.sequential', true);
            roses[rose_count].Set('chart.gutter.top', 2);
            roses[rose_count].Set('chart.margin', 5);
            roses[rose_count].Set('chart.text.color', 'white');
            roses[rose_count].Set('chart.text.size', 10);
            roses[rose_count].Set('chart.colors', rose_colors);
            roses[rose_count].Set('chart.background.axes.color', 'orange');
            RGraph.Effects.Rose.RoundRobin(roses[rose_count]);

        }


if ($.find('#rose_canvas')[0] != undefined)

    {

        setTimeout(function()

        {

            rose_graph();
            interval = setInterval(rose_graph,10000);

        }, 100);

    }


function data_selection(current_data_type_one, graph_numb) // Проверка на часы\минуты, запуск отрисовки, запуск вышестоящего анализатора.

    {


        first_metric = [];
        second_metric = [];
        third_metric = [];
        fourth_metric = [];
        fifth_metric = [];
        sixth_metric = [];
        seventh_metric = [];



        if ($("#graph_switcher-" + graph_numb + " span")
            .text() == 'show last 60 minutes')

        {


            for (i = 6; i > -1; i--) {


                    first_metric = proSwitcher(current_data_type_one, i, first_metric, current_data);
                    second_metric = proSwitcher_2(current_data_type_one, i, second_metric, change_data);
                    third_metric = proSwitcher_4(current_data_type_one, i, third_metric, expected_data);


            }


            if ($("#changes_remove-" + graph_numb + " span").text() == 'remove changes')

                drawing(first_metric, second_metric, third_metric, 'hours', graph_numb);

            else

                drawing(first_metric, null, third_metric, 'hours', graph_numb);



        }



        if ($("#graph_switcher-" + graph_numb + " span")
            .text() == 'Show Days')

        {

                if($("#graph_conversion-"+ graph_numb + " span").text() == 'Hide Conversion')

                {
                    first_metric = data_tags_hours[current_data_type_one][current_data_tags[0]];
                    second_metric = data_tags_hours[current_data_type_one][current_data_tags[1]];
                    third_metric = data_tags_hours[current_data_type_one][current_data_tags[2]];

                    var max_value = 0;
                    var max_v = [];
                    max_v[0] = (Math.max.apply(null, first_metric));
                    max_v[1] = (Math.max.apply(null, second_metric));
                    max_v[2] = (Math.max.apply(null, third_metric));
                    for(var j=0;j<max_v.length;j++)
                    {
                        if (max_v[j]>max_value)
                            max_value = max_v[j];
                    }
                    var conversion_temp_1 = data_tags_hours[selected_conversion][current_data_tags[0]];
                    var conversion_temp_2 = data_tags_hours[selected_conversion][current_data_tags[1]];
                    var conversion_temp_3 = data_tags_hours[selected_conversion][current_data_tags[2]];

                    for(i=0;i<data_tags_hours[selected_conversion][current_data_tags[0]].length;i++){

                    if (first_metric[i] == 0)
                        fifth_metric.push(max_value);
                    else
                        fifth_metric.push(max_value+(conversion_temp_1[i]/first_metric[i])*max_value);

                    if (current_data_tags.length>1)
                    if (second_metric[i] == 0)
                        sixth_metric.push(max_value);
                    else
                        sixth_metric.push(max_value+(conversion_temp_2[i]/second_metric[i])*max_value);

                    if (current_data_tags.length>2)
                    if (third_metric[i] == 0)
                        seventh_metric.push(max_value);
                    else
                        seventh_metric.push(max_value+(conversion_temp_3[i]/third_metric[i])*max_value);

                    }


                    drawing(first_metric, second_metric, third_metric, 'hours_tags', graph_numb, fourth_metric, fifth_metric, sixth_metric, seventh_metric);


                }
                else {

                    first_metric = data_tags_hours[current_data_type_one][current_data_tags[0]];
                    second_metric = data_tags_hours[current_data_type_one][current_data_tags[1]];
                    third_metric = data_tags_hours[current_data_type_one][current_data_tags[2]];
                    fourth_metric = data_tags_hours[current_data_type_one][current_data_tags[3]];
                    fifth_metric = data_tags_hours[current_data_type_one][current_data_tags[4]];
                    sixth_metric = data_tags_hours[current_data_type_one][current_data_tags[5]];
                    seventh_metric = data_tags_hours[current_data_type_one][current_data_tags[6]];
                    drawing(first_metric, second_metric, third_metric, 'hours_tags', graph_numb, fourth_metric, fifth_metric, sixth_metric, seventh_metric);
                }



        }


        if ($("#graph_switcher-" + graph_numb + " span")
            .text() == 'Show Hours')

        {

                if($("#graph_conversion-"+ graph_numb + " span").text() == 'Hide Conversion')

                {
                    first_metric = data_tags_days[current_data_type_one][current_data_tags[0]];
                    second_metric = data_tags_days[current_data_type_one][current_data_tags[1]];
                    third_metric = data_tags_days[current_data_type_one][current_data_tags[2]];


                    var max_value = 0;
                    var max_v = [];
                    max_v[0] = (Math.max.apply(null, first_metric));
                    max_v[1] = (Math.max.apply(null, second_metric));
                    max_v[2] = (Math.max.apply(null, third_metric));
                    for(var j=0;j<max_v.length;j++)
                    {
                        if (max_v[j]>max_value)
                            max_value = max_v[j];
                    }

                    var conversion_temp_1 = data_tags_days[selected_conversion][current_data_tags[0]];
                    var conversion_temp_2 = data_tags_days[selected_conversion][current_data_tags[1]];
                    var conversion_temp_3 = data_tags_days[selected_conversion][current_data_tags[2]];

                    for(i=0;i<data_tags_days[selected_conversion][current_data_tags[0]].length;i++){

                    if (first_metric[i] == 0)
                        fifth_metric.push(max_value);
                    else
                        fifth_metric.push(max_value+(conversion_temp_1[i]/first_metric[i])*max_value);

                    if (current_data_tags.length>1)
                    if (second_metric[i] == 0)
                        sixth_metric.push(max_value);
                    else
                        sixth_metric.push(max_value+(conversion_temp_2[i]/second_metric[i])*max_value);

                    if (current_data_tags.length>2)
                    if (third_metric[i] == 0)
                        seventh_metric.push(max_value);
                    else
                        seventh_metric.push(max_value+(conversion_temp_3[i]/third_metric[i])*max_value);

                    }


                    drawing(first_metric, second_metric, third_metric, 'days_tags', graph_numb, fourth_metric, fifth_metric, sixth_metric, seventh_metric);


                }
                else {

                    first_metric = data_tags_days[current_data_type_one][current_data_tags[0]];
                    second_metric = data_tags_days[current_data_type_one][current_data_tags[1]];
                    third_metric = data_tags_days[current_data_type_one][current_data_tags[2]];
                    fourth_metric = data_tags_days[current_data_type_one][current_data_tags[3]];
                    fifth_metric = data_tags_days[current_data_type_one][current_data_tags[4]];
                    sixth_metric = data_tags_days[current_data_type_one][current_data_tags[5]];
                    seventh_metric = data_tags_days[current_data_type_one][current_data_tags[6]];
                    drawing(first_metric, second_metric, third_metric, 'days_tags', graph_numb, fourth_metric, fifth_metric, sixth_metric, seventh_metric);
            }



        }

        if ($("#graph_switcher-" + graph_numb + " span").text() == 'show last 7 hours')

        {
                for (i = 66; i >= 7; i--)

                    {



                            first_metric = proSwitcher(current_data_type_one, i, first_metric, current_data);
                            second_metric = proSwitcher_2(current_data_type_one, i, second_metric, change_data);
                            third_metric = proSwitcher_4(current_data_type_one, i, third_metric, expected_data);




                    }

                if ($("#changes_remove-" + graph_numb + " span").text() == 'remove changes')

                     drawing(first_metric, second_metric, third_metric, 'minutes', graph_numb);

                else

                     drawing(first_metric, null, third_metric, 'minutes', graph_numb);

        }

    }





    function data_selection_bar(current_data_type_one, graph_numb) // Здесь готовим данные по 5 единиц для создания графиков на странице распределения событий.

    {


        bar_count++;
        bar_graph = proSwitcher_3(current_data_type_one, 'day', bar_graph, column_data);
        bar_graph_labels.push(current_data_type_one.toString());

        if ((bar_count == 5) || (bar_count == 10) || (bar_count == 15) || (bar_count == 20) || (bar_count == 25) || (bar_count == 30))

        {


            drawing(bar_graph, null, null, 'bar', graph_numb);
            bar_graph = [];
            bar_graph_labels = [];


        }

        else

            if (current_data_type.length - fake_count == bar_count)

            {

                drawing(bar_graph, null, null, 'bar', graph_numb);
                bar_graph = [];
                bar_graph_labels = [];
            }

    }




  var dynamic_graph = function(type) {
    favorites_check_dynamic = 0;

            $(".save_param").click(function(){

                localStorage.config = JSON.stringify(gridster.serialize());

            });

            config = localStorage.config ? JSON.parse(localStorage.config) : [];




            for (j = 0; j < current_data_type.length; j++) {

                if (config[j]==undefined) { col = null; row = null; size_x = 5; size_y = 3;} else { col = config[j].col; row = config[j].row; size_x = config[j].size_x; size_y = config[j].size_y;}




                if ((current_data_type[j] != 'pin.list') && (current_data_type[j] != 'user') && (current_data_type[j] != 'pin') && (current_data_type[j] != 'plan') && (current_data_type[j] != 'user.show')) {

                if ($(".ui-tabs-selected a").text()=="Динамика числа событий") {
                    if (fg == 1) $("#ui-tabs-1")
                        .append('<div class="removable" id="graph_div-' + j + '"><b style="color:white; ">' + current_data_type[j] + '</b><button style="font-size: 10px;" id="graph_switcher-' + j + '" class="switcher">show last 60 minutes</button><button style="font-size: 10px; " class = "changer" id="changes_remove-' + j + '">remove changes</button><canvas id="' + j + '" width="1000" height="350" no="" canvas="" support=""></canvas></div> ');
                    else $("#ui-tabs-1")
                        .append('<div class="removable" id="graph_div-' + j + '" style="margin-top:50px;"><b style="color:white; ">' + current_data_type[j] + '</b><button  style ="font-size: 10px;" id="graph_switcher-' + j + '" class="switcher">show last 60 minutes</button><button style="font-size: 10px;" class = "changer" id="changes_remove-' + j + '">remove changes</button><canvas id="' + j + '" width="1000" height="350" no="" canvas=""  support=""></canvas></div> ');

                    fg = 0;
                }


                if ($(".ui-tabs-selected a").text()=="Статистика по тэгам") {

                    $("#ui-tabs-5")
                        .append('<div class="removable" id="graph_div-' + j + '" style="margin-top:50px;"><b style="color:white; ">' + current_data_type[j] + '</b><button  style ="font-size: 10px;" id="graph_switcher-' + j + '" class="switcher_tags">Show Days</button><select id="conversion_'+ j +'""><option>Коверсия к</option></select><button  style ="font-size: 10px;" id="graph_conversion-'+j+'" class = "conversion">Show Conversion</button><canvas id="' + j + '" width="1000" height="350" no="" canvas=""  support=""></canvas></div> ');



                }


                    if ($(".ui-tabs-selected a").text()=="Избранное") {

                    favorites_check_dynamic=1;

                    gridster.add_widget('<li class = "new"><b style="color:white; ">' + current_data_type[j] + '</b> <button style="font-size: 10px;" id="graph_switcher-' + j + '" class="switcher">show last 60 minutes</button><button style="font-size: 10px; " class = "changer" id="changes_remove-' + j + '">remove changes</button> <button style="font-size:10px;" class="resizer" id="graph_resize_2_'+j+'"">Resize_2</button><button style="font-size:10px;" class="resizer" id="graph_resize_3_'+j+'"">Resize_3</button><button style="font-size:10px;" class="resizer" id="graph_resize_1_'+j+'"">Resize_1</button><canvas id="' + j + '" width="800" height="420" no="" canvas="" support=""></canvas></li>', size_x, size_y, col, row);

                }


                for (var conv=0;conv<current_data_type.length;conv++){

                if (current_data_type[conv] != current_data_type[j])
                $('#conversion_'+j).append('<option>'+current_data_type[conv]+'</option>');
                }
                    count = j;
                    $("button")
                        .button();

                    data_selection(current_data_type[j], count);
                    j = count;
                }



                if ($(".ui-tabs-selected a").text()=="Избранное") {
                if (size_x==6) {

                $("#"+j).attr('width', 950);
                $("#"+j).attr('height', 600);
            }
                if (size_x==13) {

                $("#"+j).attr('width', 1900);
                $("#"+j).attr('height', 600);
            }
        }
                 lines[j].Draw();
        }


$('.switcher_tags span').click(function() {





                if ($(this)
                    .text() == 'Show Days') {

                    $(this)
                        .html('Show Hours');


                    graph_numb = parseInt($(this)
                        .parent()
                        .attr('id')[15] + $(this)
                        .parent()
                        .attr('id')[16]);

                    data_selection(current_data_type[graph_numb], graph_numb);


            } else

            {






                $(this)
                    .html('Show Days');

                graph_numb = parseInt($(this)
                    .parent()
                    .attr('id')[15] + $(this)
                    .parent()
                    .attr('id')[16]);

                data_selection(current_data_type[graph_numb], graph_numb);


            }



});



$('.conversion span').click(function() {





                if ($(this)
                    .text() == 'Show Conversion') {

                    $(this)
                        .html('Hide Conversion');


                    graph_numb = parseInt($(this)
                        .parent()
                        .attr('id')[17] + $(this)
                        .parent()
                        .attr('id')[18]);

                     selected_conversion = $('#conversion_'+graph_numb).val();



                    data_selection(current_data_type[graph_numb], graph_numb);


            } else

            {






                $(this)
                    .html('Show Conversion');

                graph_numb = parseInt($(this)
                    .parent()
                    .attr('id')[17] + $(this)
                    .parent()
                    .attr('id')[18]);

                data_selection(current_data_type[graph_numb], graph_numb);


            }



});


        $(".switcher span")
            .click(function () { // Отрисовываем график заного при переключении на часы\минуты


            if ($(".ui-tabs-selected a").text()=="Избранное") {

            current_data_type = current_data_1;
            selector='first';
            favorites_check = 0;
            favorites_check_dynamic = 1;
             }



            if ($(this)
                .text() == 'show last 60 minutes') {

                $(this)
                    .html('show last 7 hours');


                graph_numb = parseInt($(this)
                    .parent()
                    .attr('id')[15] + $(this)
                    .parent()
                    .attr('id')[16]);

                data_selection(current_data_type[graph_numb], graph_numb);


            } else

            {






                $(this)
                    .html('show last 60 minutes');

                graph_numb = parseInt($(this)
                    .parent()
                    .attr('id')[15] + $(this)
                    .parent()
                    .attr('id')[16]);

                data_selection(current_data_type[graph_numb], graph_numb);


            }




        });
            $(".resizer span")
                .click(function(){


                    graph_numb = parseInt($(this).parent().attr('id')[15]);
                    canvas_element = $("#"+graph_numb);
                    if (parseInt($(this).parent().attr('id')[13])==1)
                    {
                    gridster.resize_widget($(this).closest('li'), 6, 4);
                    canvas_element.attr('width','950');
                    canvas_element.attr('height','600');
                    }
                    if (parseInt($(this).parent().attr('id')[13])==2)
                    {
                    gridster.resize_widget($(this).closest('li'), 8, 4);
                    canvas_element.attr('width','1250');
                    canvas_element.attr('height','600');
                    }
                    if (parseInt($(this).parent().attr('id')[13])==3)
                    {
                    gridster.resize_widget($(this).closest('li'), 5, 3);
                    canvas_element.attr('width','800');
                    canvas_element.attr('height','420');
                    }

                    lines[graph_numb].Draw();




                })

        $(".changer span")
            .click(function () { // Убераем изменения или добавляем их на выбранные график на странице динамики событий.
           if ($(".ui-tabs-selected a").text()=="Избранное") {
            selector = 'first';
            favorites_check_dynamic = 1;
            current_data_type = current_data_1;
            favorites_check=0;
        }

            if ($(this)
                .text() == 'remove changes') {

                $(this)
                    .html('Enable changes');

                graph_numb = parseInt($(this)
                    .parent()
                    .attr('id')[15] + $(this)
                    .parent()
                    .attr('id')[16]);

                data_selection(current_data_type[graph_numb], graph_numb);

            } else

            {
                $(this)
                    .html('remove changes');
                graph_numb = parseInt($(this)
                    .parent()
                    .attr('id')[15] + $(this)
                    .parent()
                    .attr('id')[16]);
                data_selection(current_data_type[graph_numb], graph_numb);

            }




        });






        }


var events_graph = function(type) {
            bar_graph = [];
            bar_graph_labels = []; // Зануляем предыдущие 5 точек и лэйблы для них
            bar_count = 0;
            temp_id = 0;
            fake = 0; // Fake - "Чистый" счетчик, который отбрасывает фиктивные точки, в отличие от j.
            fake_count = 0;
            favorites_check=0;
            favorites_check_dynamic = 0;
            selector = 'second';

            var bar_graph_count = 0;


            for (j = 0; j < (current_data_type.length); j++) {
              if ($(".ui-tabs-selected a").text()=="Избранное") {
              if (config[bar_graph_count+current_data_1.length]==undefined) { col = null; row = null; size_x = 5; size_y = 3;} else {  col = config[bar_graph_count+current_data_1.length].col; row = config[bar_graph_count+current_data_1.length].row; size_x = config[bar_graph_count+current_data_1.length].size_x; size_y = config[bar_graph_count+current_data_1.length].size_y;}
                }
                    if ($(".ui-tabs-selected a").text()=="Распределение событий") {

                    //Первый график
                    if (fake == 0) {
                        $("#ui-tabs-2")
                            .append('<div class="removable" id="graph_div-' + fake + '" > <div id="radio' + fake + '" class ="radio"><input type="radio" id="radio_1' + fake + '"   name="radio' + fake + '" /><label for="radio_1' + fake + '">Last Week</label><input type="radio" id="radio_2' + fake + '" checked="checked" name="radio' + fake + '" /><label for="radio_2' + fake + '">Last Day</label></div><canvas id="' + fake + '" width="1000" height="350" no="" canvas="" support=""></canvas></div> ');
                        temp_id = 0;

                    } else
                    // Если пора рисовать новый график из 5 элементов - мы это делаем.
                    if ((fake == 5) || (fake == 10) || (fake == 15) || (fake == 20) || (fake == 25) || (fake == 30)) {
                        $("#ui-tabs-2")
                            .append('<div class="removable" id="graph_div-' + fake + '" style="margin-top:50px;"" > <div id="radio' + fake + '" class ="radio"><input type="radio" id="radio_1' + fake + '"   name="radio' + fake + '" /><label for="radio_1' + fake + '">Last Week</label><input type="radio" id="radio_2' + fake + '" checked="checked" name="radio' + fake + '" /><label for="radio_2' + fake + '">Last Day</label></div><canvas id="' + fake + '" width="1000"  height="350" no="" canvas="" support=""></canvas></div>');
                        temp_id = fake;

                    }
                }

                    if ($(".ui-tabs-selected a").text()=="Избранное") {
                        favorites_check = 1;

                     if (fake == 0) {

                    gridster.add_widget('<li class = "new"> <div id="radio' + (fake+35) + '" class ="radio"><input type="radio" id="radio_1' + (fake+35) + '"   name="radio' + (fake+35) + '" /><label for="radio_1' + (fake+35) + '">Last Week</label><input type="radio" id="radio_2' + (fake+35) + '" checked="checked" name="radio' + (fake+35) + '" /><label for="radio_2' + (fake+35)+ '">Last Day</label></div> <canvas id="' + (fake+35) + '" width="800" height="420" no="" canvas="" support=""></canvas></li>', size_x, size_y, col, row);

                    temp_id = fake+35;
                    bar_graph_count++;
                }
                    else


                    if (( (fake+35) == 40) || ((fake+35) == 45) || ((fake+35) == 50) || ((fake+35) == 55) || ((fake+35) == 60) || ((fake+35) == 65)) {

                    gridster.add_widget('<li class = "new"> <div id="radio' + (fake+35) + '" class ="radio"><input type="radio" id="radio_1' + (fake+35) + '"   name="radio' + (fake+35) + '" /><label for="radio_1' + (fake+35) + '">Last Week</label><input type="radio" id="radio_2' + (fake+35) + '" checked="checked" name="radio' + (fake+35) + '" /><label for="radio_2' + (fake+35)+ '">Last Day</label></div> <canvas id="' + (fake+35) + '" width="800" height="420" no="" canvas="" support=""></canvas></li>', size_x, size_y, col, row);

                    temp_id = fake+35;
                    bar_graph_count++;
                }
            }

                    $("button")
                        .button();
                    data_selection_bar(current_data_type[j], temp_id);
                    fake++;


                   // Fake_count - количество фиктивных точек в выбранном дереве событий. Используется в data_selection_bar для четкого перехода к новому графику.

            }

              $(".radio")
            .buttonset(); // Отрисовка всех добавленных элементов на основе jQuery UI


        $(".radio input")
            .click(function () { // Меняем день на неделю и обратно у выбранного графика на странице распределения событий
            bar_graph = [];
            bar_graph_labels = [];
            selector = 'second';
            favorites_check = 1;
            favorites_check_dynamic = 0;

             if ($(".ui-tabs-selected a").text()=="Избранное") {

              current_data_type = current_data_2;
          }
            var change_id = parseInt($(this)
                .attr('id')[7] + $(this)
                .attr('id')[8]);

            bar_graph_labels = bars[change_id].Get('chart.labels');

            if ($(this)
                .attr('id')[6] == '1') {

                for (i = 0; i < bar_graph_labels.length; i++) {
                    bar_graph = proSwitcher_3(bar_graph_labels[i], 'week', bar_graph, column_data);
                }

            } else {

                for (i = 0; i < bar_graph_labels.length; i++) {
                    bar_graph = proSwitcher_3(bar_graph_labels[i], 'day', bar_graph, column_data);
                }
            }



            drawing(bar_graph, null, null, 'bar', change_id);




        })

        }


 if ($(".ui-tabs-selected a").text()=="Избранное") {

    selector='first';

    current_data_1 = localStorage.current_data_1 ? JSON.parse(localStorage.current_data_1) : [];
    current_data_2 = localStorage.current_data_2 ? JSON.parse(localStorage.current_data_2) : [];




    setTimeout(function(){
        current_data_type = current_data_1;
        dynamic_graph('favorites');

    },200);


    setTimeout(function(){
        current_data_type = current_data_2;

        events_graph('favorites');

    },600);


 }



    $(".show_graph")
        .click(function () // Рисуем графики по нажатию на кнопку. Удаляем все предыдущие. Проверяем на лже-графики (pin, list..)


    {


        current_data_type = current_data_type_test;

        $(".removable").remove();

        // Если мы на странице динамики :

        if ($(this)
            .parent()
            .attr('id') == 'ui-tabs-1') {

            selector = 'first';

            dynamic_graph('first');

        }


         if ($(this)
            .parent()
            .attr('id') == 'ui-tabs-5') {

        var ajax_i=0;
        var ajax_j=0;
        var ajax_count = 0;
        var check_ajax_array = [];
        selector = "tags";

        for (var i=0;i<current_data_type_test.length;i++) {

            for (var j=0;j<current_data_tags.length;j++) {

                ajax_url="http://relcom.int.iknow.travel:4000/api/stat?event_tag="+current_data_tags[j]+"&event_type="+current_data_type_test[i]+"&end_time="+$('#datepickerfinish').val()+"&start_time="+$('#datepickerstart').val();
                $.ajax(ajax_url, { // П
                        type: 'GET',

                        dataType: 'json',
                        success: function (data) {



                        if (check_ajax_array[data.event_type] != 1) data_tags_days[data.event_type] = new Array();


                        data_tags_days[data.event_type][data.event_tag] = data.days_stat;


                        tag_names[data.event_tag] = data.event_tag;

                        if (check_ajax_array[data.event_type] != 1) data_tags_hours[data.event_type] = new Array();
                        data_tags_hours[data.event_type][data.event_tag] = data.hours_stat;

                        check_ajax_array[data.event_type] = 1;

                        ajax_j++;
                        ajax_count++;


                        if (ajax_count == current_data_type_test.length*current_data_tags.length)

                         {

                                dynamic_graph('first');
                            }




                        },
                        error: function (err) {

                          alert('Something is  wrong');

                        },
                    });


            }
        }


        }
        // Если на странице распределений

        if ($(this)
            .parent()
            .attr('id') == 'ui-tabs-2') {

            selector = 'second';
            events_graph('second');

        }


    });



   var get_data = setInterval(function () { // Получаем актуальную информацию каждые 60 сек.

        $.ajax('/dataset', {
            type: 'GET',
            dataType: 'json',
            success: function (data) {

                current_data = data.graph_data;
                change_data = data.change_data;
                column_data = data.column_data;
                expected_data = data.expected_data;
                growth_data = data.growth_data;



                if (selector == 'first') { // Обновляем все текущие графики на странице динамики событий.

                    for (j = 0; j < count + 1; j++) {


                        data_selection(current_data_type[j], j);


                    }
                }






            },
            error: function () {
                alert('gg');
            }
        });


    }, 60000);







    $(".tree  label input")
        .click(function () //  Добавляем выбранные пользователем фильтры в нужном нам формате. Без таймера не работает.


    {
        var tree_select = $(this)
            .closest($(".tree"))
            .attr('id');

        setTimeout(function () {




            $("#" + tree_select + "  label input")
                .each(function ()

            {

                if ($(this)
                    .is(':checked')) {
                     if ( ($(this) .parent().attr('id') != 'pin.list') && ($(this) .parent().attr('id') != 'user') && ($(this) .parent().attr('id') != 'pin') && ($(this) .parent().attr('id') != 'plan') && ($(this) .parent().attr('id') != 'user.show')) {
                    data_type.push($(this)
                        .parent()
                        .attr('id'));
                    }


                }




            });


            current_data_type_test = data_type;


            data_type = [];


        }, 100);


    });


$("#datepickerstart").datepicker();
$("#datepickerstart").datepicker("option", "dateFormat", "yy-mm-dd");

$("#datepickerfinish").datepicker();
$("#datepickerfinish").datepicker("option", "dateFormat", "yy-mm-dd");

$('.get_events_tags').click(function(){
$('.tags').css('display','inherit');
if (($("#datepickerfinish").val().length>1) && ($("#datepickerstart").val().length>1) && ($("#datepickerfinish").val() > $("#datepickerstart").val())) {

var get_tags_url = "http://relcom.int.iknow.travel:4000/api/event_tags?end_time="+$("#datepickerfinish").val()+"&start_time="+$("#datepickerstart").val();
var get_events_url="http://relcom.int.iknow.travel:4000/api/event_types?end_time="+$("#datepickerfinish").val()+"&start_time="+$("#datepickerstart").val();

$.ajax(get_tags_url, {
                        type: 'GET',

                        dataType: 'json',
                        success: function (data) {


                          for (i=0;i<data.length;i++)
                          {
                             var tag_string = data[i].split(':');
                             if (tag_string.length>1)

                             $('.'+tag_string[0]).append('<ul><li class="'+data[i]+' collapsed"><input type="checkbox" id='+data[i]+'><label id='+data[i]+'>'+data[i]+'</label></li></ul>');
                             else
                             $('.other').append('<ul><li class="'+data[i]+' collapsed"><input type="checkbox" id='+data[i]+'><label id='+data[i]+'>'+data[i]+'</label></li></ul>');



                          }

                            $(".tags input")
                                        .click(function ()


                                    {
                                        setTimeout(function () {


                                            $(".tags  input")
                                                .each(function ()

                                            {

                                                if (($(this)
                                                    .is(':checked')) && ($(this).attr('id') != undefined)) {
                                                    data_type.push($(this)
                                                        .attr('id'));

                                                }




                                            });


                                            current_data_tags = data_type;


                                            data_type = [];


                                        }, 100);


                                    });

                            $('.tags').checkboxTree({

                                initializeChecked: 'collapsed',
                                initializeUnchecked: 'collapsed'
                            });


                        },
                        error: function (err) {

                          alert('Where is our tags?');

                        },
                    });

$.ajax(get_events_url, {
                        type: 'GET',

                        dataType: 'json',
                        success: function (data) {


                        var keys = Object.keys(data);

                        for (var key in data) {
                          $('.checkboxtree').append('<ul id="good'+key+'"><li class="'+key+' collapsed"><input type="checkbox" id='+key+'><label id='+key+'>'+key+'</label></li></ul>')

                          for (var key2 in data[key]) {

                              $('.'+key).append('<ul><li class="'+key2+'"><input type="checkbox" id='+key+':'+key2+'><label id='+key+':'+key2+'>'+key2+'</label></li><ul>')
                              for (var key3 in data[key][key2]) {

                               $('.'+key2).append('<ul><li class="'+key3+'"><input type="checkbox" id='+key+':'+key2+':'+key3+'><label id='+key+':'+key2+':'+key3+'>'+key3+'</label></li><ul>')
                              }

                          }
                        }


                                    $(".checkboxtree input")
                                    .click(function ()


                                {
                                    setTimeout(function () {


                                        $(".checkboxtree  input")
                                            .each(function ()

                                        {

                                            if ($(this)
                                                .is(':checked')) {
                                                data_type.push($(this)
                                                    .attr('id'));



                                            }




                                        });


                                        current_data_type_test = data_type;


                                        data_type = [];


                                    }, 100);


                                });

                            $('.checkboxtree').checkboxTree({
                                initializeChecked: 'collapsed',
                                initializeUnchecked: 'collapsed'
                            });



                        },
                        error: function (err) {

                          alert('Where is our events?');

                        },
                    });


}
else
  alert('Smth wrong');

});


















    $(".favorites")
        .click(function ()

    {
        localStorage.config = [];
        if ($(".ui-tabs-selected a").text()=="Динамика числа событий")

             localStorage.current_data_1 = JSON.stringify(current_data_type_test);

        if ($(".ui-tabs-selected a").text()=="Распределение событий")

             localStorage.current_data_2 = JSON.stringify(current_data_type_test);



    });

});




