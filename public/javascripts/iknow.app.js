$(document)
    .ready(function () {

    var k = 0;
    var tag_names = [];
    var ajax_url = ''; // Url динамический для получения статистики с АПИ
    var selector = '';     // Для определения текущей вкладки
    var current_data_type_test = [] //  события, выбранные пользователем на текущий момент
    var current_data_tags = [] // Выбранные  Тэги
    var current_data = [] // Данные для динамики событий
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
    var labels = [];
    var lines = new Array(); // Массив объектов для динамики событий
    var current_code = 'trouble'; // Код ошибки, чтобы сервер не обрабатывал ошибочный запрос. (Отсылается 3 почему-то)
    var data_type = []; // Временная переменная для создания current_data_type
    var current_data_type = []; // Выбранные на текущий момент пользователем события для отрисовки графика ( не меняются, если пользователь отрисовал графики, а потом выбрал другие события)
    var pie_data = [];
    var pie_labels = [];
    var constant_conversion = 0;



    $("#pages")
        .tabs();
    $("#pages")
        .fadeTo('slow', 0.8); // Интерфейс jQuery UI + грузим дерево.





    $(".hrefs").click(function(){
        $("#ui-tabs-1").empty();
        $("#ui-tabs-2").empty();

    })


        $("button")
            .button();





function GoodYear (year) {
 return (year < 1900 ? year+1900 : year);
}


function NumDay (day,mon,year) {
 var mondays=new Array (12);
 mondays[0]=31;mondays[1]=28;mondays[2]=31;
 mondays[3]=30;mondays[4]=31;mondays[5]=30;
 mondays[6]=31;mondays[7]=31;mondays[8]=30;
 mondays[9]=31;mondays[10]=30;mondays[11]=31;
 if ((year%4==0) && (year%100!=0) || (year%400==0)) mondays[1]=29;

 var s=0;
 for (var i=1; i<mon; i++) s+=mondays[i-1];
 s+=day;
 return s;
}







    function drawing(first_metric, second_metric, third_metric, type, graph_id, fourth_metric,fifth_metric,sixth_metric, seventh_metric) { // Функция отрисовки графиков. Тип - часы\минуты, graph_id - id канвас элемента


        RGraph.Clear(document.getElementById(graph_id));

        if (graph_id!=0) RGraph.ObjectRegistry.Clear(graph_id); else  RGraph.ObjectRegistry.Clear('0');



        



        





          if ( ($(".ui-tabs-selected a").text()=="Статистика по тэгам") || ($(".ui-tabs-selected a").text()=="Постоянные показатели") ) // Если мы находимся на странице динамики событий

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

            if (($("#graph_conversion-"+ graph_id + " span").text() == 'Hide Conversion')  || ($(".ui-tabs-selected a").text()=="Постоянные показатели") ) {
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

               if  ($(".ui-tabs-selected a").text()=="Постоянные показатели") {
                 end_time= new Date(app.conversion.end_time);
                 start_time= new Date(app.conversion.start_time);
               }
               else

               {

                 end_time= new Date($('#datepickerfinish').val());
                 start_time= new Date($('#datepickerstart').val());
                }
                 



                 time = (NumDay(end_time.getDate(), end_time.getMonth()+1, GoodYear(end_time.getYear())) - NumDay(start_time.getDate(), start_time.getMonth()+1, GoodYear(start_time.getYear())));


               labels = []
               var points = (parseInt(time)*24) / 30 | 0;

               for (i=0;i<parseInt(time)*24;i=i+points) {

                labels[i] = i;

               }
                lines[graph_id].Set('chart.labels', labels);

            };


            if (type == 'days_tags') {


               if  ($(".ui-tabs-selected a").text()=="Постоянные показатели") {
                 end_time= new Date(app.conversion.end_time);
                 start_time= new Date(app.conversion.start_time);
               }
               else
                
               {

                 end_time= new Date($('#datepickerfinish').val());
                 start_time= new Date($('#datepickerstart').val());
                }

                 time = (NumDay(end_time.getDate(), end_time.getMonth()+1, GoodYear(end_time.getYear())) - NumDay(start_time.getDate(), start_time.getMonth()+1, GoodYear(start_time.getYear())));
                 labels = []

               for (i=0;i<parseInt(time);i++) {

                labels[i] = i;

               }

                lines[graph_id].Set('chart.labels', labels);




            };






            lines[graph_id].Draw();


        }




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
            .text() == 'Show Days')

        {           

             if ($(".ui-tabs-selected a").text()=="Постоянные показатели") {
                    

                    first_metric = data_tags_hours[current_data_type_one]["all"];

                    if (current_data_type_one == app.conversion.from_a)
                        selected_conversion = app.conversion.to_a;

                    if (current_data_type_one == app.conversion.from_b)
                        selected_conversion = app.conversion.to_b;

                    if (current_data_type_one == app.conversion.from_c)
                        selected_conversion = app.conversion.to_c;

                    var max_value = 0;
                    var max_v = [];
                    max_v[0] = (Math.max.apply(null, first_metric));


                    for(var j=0;j<max_v.length;j++)
                    {
                        if (max_v[j]>max_value)
                            max_value = max_v[j];
                    }

                    
                    var conversion_temp_1 = data_tags_hours[selected_conversion][current_data_tags[0]];
                   


                    for(i=0;i<data_tags_hours[selected_conversion][current_data_tags[0]].length;i++){

                    if (first_metric[i] == 0)
                        fifth_metric.push(max_value);
                    else
                        fifth_metric.push(max_value+(conversion_temp_1[i]/first_metric[i])*max_value);


                    }


                    drawing(first_metric, second_metric, third_metric, 'hours_tags', graph_numb, fourth_metric, fifth_metric, sixth_metric, seventh_metric);


                }

                else 

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


                if ($(".ui-tabs-selected a").text()=="Постоянные показатели") {


                    first_metric = data_tags_days[current_data_type_one]["all"];

                    if (current_data_type_one == app.conversion.from_a)
                        selected_conversion = app.conversion.to_a;

                    if (current_data_type_one == app.conversion.from_b)
                        selected_conversion = app.conversion.to_b;
                    
                    if (current_data_type_one == app.conversion.from_c)
                        selected_conversion = app.conversion.to_c;

                    var max_value = 0;
                    var max_v = [];
                    max_v[0] = (Math.max.apply(null, first_metric));


                    for(var j=0;j<max_v.length;j++)
                    {
                        if (max_v[j]>max_value)
                            max_value = max_v[j];
                    }


                    var conversion_temp_1 = data_tags_days[selected_conversion][current_data_tags[0]];


                    for(i=0;i<data_tags_days[selected_conversion][current_data_tags[0]].length;i++){

                    if (first_metric[i] == 0)
                        fifth_metric.push(max_value);
                    else
                        fifth_metric.push(max_value+(conversion_temp_1[i]/first_metric[i])*max_value);


                    }


                    drawing(first_metric, second_metric, third_metric, 'days_tags', graph_numb, fourth_metric, fifth_metric, sixth_metric, seventh_metric);


                }

                else 


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



    }








var dynamic_graph = function(type) {



           

            for (j = 0; j < current_data_type.length-constant_conversion; j++) {



                  if ($(".ui-tabs-selected a").text()=="Постоянные показатели") {

                    $("#ui-tabs-2")
                        .append('<div  id="graph_div-' + j + '" style="margin-top:50px;"><b style="color:white;position:absolute;margin-left:200px;">Конверсия ' + current_data_type[j] + ' к ' +current_data_type[j+3]+' </b><button  style ="font-size: 10px;position:absolute;" id="graph_switcher-' + j + '" class="switcher_tags">Show Days</button><canvas id="' + j + '" width="1000" height="350"  style="margin-top:50px;"no="" canvas=""  support=""></canvas></div> ');
    
                    
                }

                if ($(".ui-tabs-selected a").text()=="Статистика по тэгам") {

                    $("#ui-tabs-1")
                        .append('<div class="removable" id="graph_div-' + j + '" style="margin-top:50px;"><b style="color:white; ">' + current_data_type[j] + '</b><button  style ="font-size: 10px;" id="graph_switcher-' + j + '" class="switcher_tags">Show Days</button><select id="conversion_'+ j +'""><option>Коверсия к</option></select><button  style ="font-size: 10px;" id="graph_conversion-'+j+'" class = "conversion">Show Conversion</button><canvas id="' + j + '" width="1000" height="350" no="" canvas=""  support=""></canvas></div> ');



              


                }




                for (var conv=0;conv<current_data_type.length;conv++)

                {

                if (current_data_type[conv] != current_data_type[j])
                    $('#conversion_'+j).append('<option>'+current_data_type[conv]+'</option>');
                }

                    count = j;
                    $("button")
                        .button();

                    data_selection(current_data_type[j], count);
                    j = count;
                



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






        }




    $(".show_graph")
        .click( init = function() 


    {


        current_data_type = current_data_type_test;


        if ($(".ui-tabs-selected a").text()=="Постоянные показатели") {

                current_data_type_test = []
                current_data_type_test[0] = app.conversion.from_a 
                current_data_type_test[1] = app.conversion.from_b 
                current_data_type_test[2] = app.conversion.from_c
                current_data_type_test[3] = app.conversion.to_a 
                current_data_type_test[4] = app.conversion.to_b 
                current_data_type_test[5] = app.conversion.to_c
                constant_conversion = 3;

                current_data_type = current_data_type_test;
                current_data_tags = []
                current_data_tags[0] = "all"


                ajax_url = app.API_URL +"users_stat";
                console.log(ajax_url);


                    $.ajax(ajax_url, { 
                        type: 'GET',

                        dataType: 'json',
                        success: function (data) {

                       

                        for (i=1;i<data.length;i++)
                        {
                           pie_data.push(data[i].count);
                           pie_labels.push(data[i].descr);
                        }
                        console.log(pie_data);
                        console.log(pie_labels);
                        console.log('gg');

            

            var pie = new RGraph.Pie('pie', pie_data);
            pie.Set('chart.labels', pie_labels);
            pie.Set('chart.tooltips', pie_labels);
            pie.Set('chart.tooltips.event', 'onmousemove');
            pie.Set('chart.colors', ['RED','#FFCD00','#9900FF','#A0D305','','#FF7300','#004CB0']);
            pie.Set('chart.strokestyle', 'green');
            pie.Set('chart.linewidth', 4);
            pie.Set('chart.shadow', true);
            pie.Set('chart.shadow.offsetx', 2);
            pie.Set('chart.shadow.offsety', 2);
            pie.Set('chart.shadow.blur', 3);
            pie.Set('chart.exploded', 4);
            pie.Set('chart.labels.colors', ['#A0D300']);
            pie.Set('chart.text.color', 'White');
            
            
          
            
            pie.Draw();
                                                



                        },
                        error: function (err) {

                          alert('Something is  wrong');

                        },
                    });
                                     
        }




        $(".removable").remove();

        // Если мы на странице динамики :



         if (($(this)
            .parent()
            .attr('id') == 'ui-tabs-1') || ($(".ui-tabs-selected a").text()=="Постоянные показатели")) {

        var ajax_i=0;
        var ajax_j=0;
        var ajax_count = 0;
        var check_ajax_array = [];
        selector = "tags";

        for (var i=0;i<current_data_type_test.length;i++) {

            for (var j=0;j<current_data_tags.length;j++) {

               
                ajax_url=app.API_URL+"stat?event_tag="+current_data_tags[j]+"&event_type="+current_data_type_test[i]+"&end_time="+$('#datepickerfinish').val()+"&start_time="+$('#datepickerstart').val();

                if ($(".ui-tabs-selected a").text()=="Постоянные показатели") 
                    ajax_url=app.API_URL+"stat?event_tag="+current_data_tags[j]+"&event_type="+current_data_type_test[i]+"&end_time="+app.conversion.end_time+"&start_time="+app.conversion.start_time;



                $.ajax(ajax_url, { 
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
                                
                                console.log(data_tags_hours[current_data_type[0]]["all"]);
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



});


if ($(".ui-tabs-selected a").text()=="Постоянные показатели") {

init();

}



$("#datepickerstart").datepicker();
$("#datepickerstart").datepicker("option", "dateFormat", "yy-mm-dd");
$("#datepickerfinish").datepicker();
$("#datepickerfinish").datepicker("option", "dateFormat", "yy-mm-dd");
$('.get_events_tags').click(function(){
$('.tags').css('display','inherit');

if (($("#datepickerfinish").val().length>1) && ($("#datepickerstart").val().length>1) && ($("#datepickerfinish").val() > $("#datepickerstart").val())) {

var get_tags_url = app.API_URL+"event_tags?end_time="+$("#datepickerfinish").val()+"&start_time="+$("#datepickerstart").val();
var get_events_url=app.API_URL+"event_types?end_time="+$("#datepickerfinish").val()+"&start_time="+$("#datepickerstart").val();

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


});




