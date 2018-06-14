$(function () {
    zaObj.buildMessageCommonEchart();
    setInterval("zaObj.buildMessageCommonEchart()", "1800000");
});

var zaObj = {};
zaObj.buildMessageCommonEchart = function () {
    zaObj.buildMessageTopicEchart();
    zaObj.buildMessageEchart("umetrip");
    zaObj.buildMessageEchart("claim");
    zaObj.buildMessageEchart("ctrip");
    zaObj.buildMessageMsfEchart();
    zaObj.queryDetailList(1);
    zaObj.dataSourceHourTimebyCondition();
    zaObj.dataSourceStatErrorDataToday();
};


zaObj.dataSourceHourTimebyCondition = function () {
    //组装参数
    var statType = "hour_real";//按天实时统计
    var params = {};
    params.statType = statType;
    //var loaderIdx = layer.load(3);
    var xhr = $.ajax({
        url: APIRest.dataSourceHourTimebyCondition_list,
        type: 'POST',
        data: JSON.stringify(params),
        dataType: 'json',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        timeout: 60000,
        success: function (data) {
            if (data != null && data.success) {
                var records = data.value;
                if (records.length > 0) {
                    initTimeConsumeByHourEchart(records);
                } else {
                    initCommFailHtmlById("detailTable");
                }
            } else {
                layer.msg(errorTips);
            }
        }
    });
    xhr.complete(function () {
        layer.close(loaderIdx);
    });
    xhr.fail(function () {
        layer.msg(errorTips);
    });
};


function initTimeConsumeByHourEchart(records) {
    var dataSourceArr = [];
    var series = [];
    for (var i = 0; i < records.length; i++) {
        dataSourceArr[i] = records[i].dataSourceName;
        var detail = {};
        detail.name = records[i].dataSourceName;
        detail.type = "line";
        detail.data = records[i].avgTimeConsumeArr;
        detail.symbol = "none";
        detail.smooth = "true";
        series[i] = detail;
    }
    var myChart = echarts.init(document.getElementById('needTime'), 'dark');
    var option = {
        title: {
            subtext: '单位：毫秒'
        },
        backgroundColor: false,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: dataSourceArr
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            splitLine: { show: false },//去除网格线
            boundaryGap: false,
            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
        }],
        yAxis: [{
            type: 'value',
            splitLine: { show: false }//去除网格线
        }],
        series: series
    };
    myChart.setOption(option);
}

zaObj.buildMessageEchart = function (id) {
    var url = "";
    if (id == "umetrip") {
        url = APIRest.screenMonitorMessage_umetrip_list;
    } else if (id == "claim") {
        url = APIRest.screenMonitorMessage_claim_list;
    } else if (id == "ctrip") {
        url = APIRest.screenMonitorMessage_ctrip_list;
    }
    var xhr = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        timeout: 60000,
        success: function (data) {
            if (data != null && data.success) {
                var record = data.value;
                if (record != null) {
                    getCommonMessageEchart(record, id);
                }
            } else {
                layer.msg(errorTips);
            }
        }
    });
    xhr.complete(function () {
    });
    xhr.fail(function () {
        layer.msg(errorTips);
    });
};

zaObj.buildMessageMsfEchart = function () {
    //var loaderIdx = layer.load(3);
    var xhr = $.ajax({
        url: APIRest.screenMonitorMessage_msf_list,
        type: 'POST',
        dataType: 'json',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        timeout: 60000,
        success: function (data) {
            if (data != null && data.success) {
                var record = data.value;
                if (record != null) {
                    getMessageMsfEchart(record);
                }
            } else {
                layer.msg(errorTips);
            }
        }
    });
    xhr.complete(function () {
        //layer.close(loaderIdx);
    });
    xhr.fail(function () {
        layer.msg(errorTips);
    });
};

zaObj.buildMessageTopicEchart = function () {
    //var loaderIdx = layer.load(3);
    var xhr = $.ajax({
        url: APIRest.screenMonitorMessage_topic_list,
        type: 'POST',
        dataType: 'json',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        timeout: 60000,
        success: function (data) {
            if (data != null) {
                getMessageTopicEchart(data);
            } else {
                layer.msg(errorTips);
            }
        }
    });
    xhr.complete(function () {
        //layer.close(loaderIdx);
    });
    xhr.fail(function () {
        layer.msg(errorTips);
    });
};

function getMessageTopicEchart(records) {
    var date = zaUtils.getCurrentTime();
    var dateHourArr = records[0].dateHourInfo;
    var html = '<table class="table table-hover table-striped">'
        + '<thead>'
        + '<tr>'
        + '<th>topic&nbsp;&nbsp;' + date + '</th>';
    for (var k = 0; k < dateHourArr.length; k++) {
        html += '<th>' + dateHourArr[k].dateHour.substring(8, 10) + '</th>';
    }
    html += '</tr>'
        + '</thead>'
        + '<tbody>';
    //var colorArr = ['#f56f6c', "#fe9901", "#FFC052", "#68C39F", "#3498db", "#6b116b", "#00736e", "#4B66A0", "#d94132"];
    for (var i = 0; i < records.length; i++) {
        html += '<tr>'
            //+ '<td style="white-space: nowrap;color:' + colorArr[i] + '">' + records[i].topicDesc + '</td>';
            + '<td style="white-space: nowrap;">' + records[i].topicDesc + '</td>';
        for (var j = 0; j < dateHourArr.length; j++) {
            html += '<td>' + records[i].dateHourInfo[j].successCount + '/<span style="color:red">' + records[i].dateHourInfo[j].failCount + '</span></td>';
        }
    }
    html += '</tbody></table>';
    $("#topicTable").html(html);
    // var xAxisArr = [];
    // var successSeries = [];
    // var failSeries = [];
    // var dateHourArr = records[0].dateHourInfo;
    // for (var k = dateHourArr.length - 1; k >= 0; k--) {
    //     xAxisArr.push(dateHourArr[k].dateHour.substring(8, 10));
    // }
    // for (var i = 0; i < records.length; i++) {
    //     var detail = {};
    //     detail.name = records[i].topic;
    //     detail.type = "line";
    //     var dataArr = [];
    //     var failArr = [];
    //     dateHourArr = records[i].dateHourInfo;
    //     for (var j = dateHourArr.length - 1; j >= 0; j--) {
    //         dataArr.push(dateHourArr[j].successCount);
    //         failArr.push(dateHourArr[j].failCount);
    //     }
    //     detail.data = dataArr;
    //     detail.symbol = 'none';
    //     detail.smooth = 'true';
    //     successSeries[i] = detail;

    //     var failDetail = {};
    //     failDetail.name = records[i].topic;
    //     failDetail.type = "line";
    //     failDetail.data = failArr;
    //     failDetail.symbol = 'none';
    //     failDetail.smooth = 'true';
    //     failSeries[i] = failDetail;
    // }
    // var successChart = echarts.init(document.getElementById('successTopicMap'));
    // var successOption = {
    //     title: {
    //         text: '24小时内成功趋势图',
    //         left: 'center',
    //         padding: 25
    //     },
    //     color: ['#f56f6c', "#fe9901", "#FFC052", "#68C39F", "#3498db", "#6b116b", "#00736e", "#4B66A0", "#d94132"],
    //     tooltip: {
    //         trigger: 'axis'
    //     },
    //     grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //     },
    //     xAxis: [{
    //         type: 'category',
    //         splitLine: { show: false },//去除网格线
    //         boundaryGap: false,
    //         data: xAxisArr
    //     }],
    //     yAxis: {
    //         splitLine: { show: false },//去除网格线
    //         type: 'value'
    //     },
    //     series: successSeries
    // };
    // successChart.setOption(successOption);
    // var failChart = echarts.init(document.getElementById('failTopicMap'));
    // var failOption = {
    //     title: {
    //         text: '24小时内失败趋势图',
    //         left: 'center',
    //         padding: 25
    //     },
    //     color: ['#f56f6c', "#fe9901", "#FFC052", "#68C39F", "#3498db", "#6b116b", "#00736e", "#4B66A0", "#d94132"],
    //     tooltip: {
    //         trigger: 'axis'
    //     },
    //     grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '5%',
    //         containLabel: true
    //     },
    //     xAxis: [{
    //         type: 'category',
    //         splitLine: { show: false },//去除网格线
    //         boundaryGap: false,
    //         data: xAxisArr
    //     }],
    //     yAxis: {
    //         splitLine: { show: false },//去除网格线
    //         type: 'value'
    //     },
    //     series: failSeries
    // };
    // failChart.setOption(failOption);
}

function getMessageMsfEchart(record) {
    $("#totalNum").html(record.totalNum);
    var statListArr = record.statList;
    var html = '<table class="table table-hover table-striped">'
        + '<thead>'
        + '<tr>'
        + '<th>执行结果</th>'
        + '<th>数量</th>'
        + '<th>占比</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
    for (var k = 0; k < statListArr.length; k++) {
        html += '<tr>'
            + '<td style="white-space: nowrap;">' + statListArr[k].desc + '</td>'
            + '<td>' + statListArr[k].count + '</td>'
            + '<td><span class="label label-success">' + statListArr[k].percent + '</span></td>'
            + '</tr>';
    }
    html += '</tbody></table>';
    $("#msf1-table").html(html);

    var templateNoArr = record.templateNoList;
    html = '<table class="table table-hover table-striped">'
        + '<thead>'
        + '<tr>'
        + '<th>模板号</th>'
        + '<th>模板描述</th>'
        + '<th>数量</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
    for (var i = 0; i < templateNoArr.length; i++) {
        html += '<tr>'
            + '<td>' + (i + 1) + '</td>'
            + '<td style="white-space: nowrap;">' + templateNoArr[i].templateName + '</td>'
            + '<td>' + templateNoArr[i].count + '</td>'
            + '</tr>';
    }
    html += '</tbody></table>';
    $("#msf2-table").html(html);

    var cpListArr = record.cpList;
    html = '<table class="table table-hover table-striped">'
        + '<thead>'
        + '<tr>'
        + '<th>cp号</th>'
        + '<th>数量</th>'
        + '<th>占比</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
    for (var j = 0; j < cpListArr.length; j++) {
        html += '<tr>'
            + '<td style="white-space: nowrap;">' + cpListArr[j].cpId + '</td>'
            + '<td>' + cpListArr[j].count + '</td>'
            + '<td>' + cpListArr[j].percent + '</td>'
            + '</tr>';
    }
    html += '</tbody></table>';
    $("#msf3-table").html(html);
    var xAxisArr = [];
    var seriesDataArr = [];
    var sevenDaysListArr = record.sevenDaysList;
    for (var a = 0; a < sevenDaysListArr.length; a++) {
        xAxisArr.push(sevenDaysListArr[a].date);
        seriesDataArr.push(sevenDaysListArr[a].successNum);
    }
    var chart = echarts.init(document.getElementById("msfMap"));
    var option = {
        color: ['#f57a82'],
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [{
            type: 'category',
            splitLine: { show: false },//去除网格线
            boundaryGap: false,
            axisLabel: {
                interval: 0,
                rotate: 40
            },
            data: xAxisArr
        }],
        yAxis: {
            splitLine: { show: false },//去除网格线
            type: 'value'
        },
        series: [{
            type: 'line',
            symbol: 'none',
            smooth: 'true',
            data: seriesDataArr
        }]
    };
    chart.setOption(option);
}

function getCommonMessageEchart(record, id) {
    var successDayThreeArr = record.SUCCESS_DAY_THREE.data;
    var html = '<table class="table table-hover table-striped">'
        + '<thead>'
        + '<tr>'
        + '<th>时间</th>'
        + '<th>总数量</th>'
        + '<th>成功数量</th>'
        + '<th>失败数量</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
    for (var i = 0; i < successDayThreeArr.length; i++) {
        html += '<tr>'
            + '<td style="white-space: nowrap;">' + getSuccessDayThreeDate(successDayThreeArr[i].key) + '</td>'
            + '<td>' + successDayThreeArr[i].total + '</td>'
            + '<td>' + successDayThreeArr[i].success + '</td>'
            + '<td>' + successDayThreeArr[i].failure + '</td>'
            + '</tr>';
    }
    html += '</tbody></table>';
    $("#" + id + "Table").html(html);

    var successHourTwentyfourArr = record.SUCCESS_HOUR_TWENTYFOUR.data;
    var xAxisHour = [];
    var sucessSeriesDataArr = [];
    var failSeriesDataArr = [];
    for (var a = 0; a < successHourTwentyfourArr.length; a++) {
        xAxisHour.push(getxAxisHourStr(successHourTwentyfourArr[a].key));
        sucessSeriesDataArr.push(successHourTwentyfourArr[a].successPer);
        failSeriesDataArr.push(successHourTwentyfourArr[a].failurePer);
    }
    var hourChart = echarts.init(document.getElementById(id + "HourMap"));
    var hourOption = {
        title: {
            text: '24小时内成功失败趋势对比图',
            left: 'center',
            padding: 30
        },
        color: ['#5793f3', "#fe9901"],
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            splitLine: { show: false },//去除网格线
            boundaryGap: false,
            data: xAxisHour
        }],
        yAxis: {
            name: '百分比(%)',
            splitLine: { show: false },//去除网格线
            type: 'value'
        },
        series: [{
            type: 'line',
            symbol: 'none',
            smooth: 'true',
            data: sucessSeriesDataArr
        },
        {
            type: 'line',
            symbol: 'none',
            smooth: 'true',
            data: failSeriesDataArr
        }]
    };
    hourChart.setOption(hourOption);

    var repcodeDayTodayArr = record.REPCODE_DAY_TODAY.data;
    var todayDataArr = [];
    var tadayHtml = "";
    if (repcodeDayTodayArr == null) {
        return false;
    }
    for (var b = 0; b < repcodeDayTodayArr.length; b++) {
        var data = {};
        data.value = repcodeDayTodayArr[b].count;
        data.name = repcodeDayTodayArr[b].responseCode;
        todayDataArr.push(data);
        tadayHtml += "<p>" + repcodeDayTodayArr[b].desc + "&nbsp;&nbsp;&nbsp;&nbsp;code：" + repcodeDayTodayArr[b].responseCode
            + "&nbsp;&nbsp;&nbsp;&nbsp;数量：" + repcodeDayTodayArr[b].count
            + "</p>";
    }
    $("#" + id + "Detail").html(tadayHtml);
    var todayChart = echarts.init(document.getElementById(id + "TodayMap"), "infographic");
    var todayOption = {
        backgroundColor: false,
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: todayDataArr,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    todayChart.setOption(todayOption);
}

function getxAxisHourStr(date) {
    var formatDate = DateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    var xAxisHourStr = formatDate.substring(11, 13);
    return xAxisHourStr;
}

function getSuccessDayThreeDate(date) {
    var formatDate = DateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    var day = formatDate.substring(0, 10);
    return day;
}

var successRateVO = {
    "dataSourceName": {
        "name": "数据源",
        "type": "operate"
    },
    "totalNum": {
        "name": "查询总数",
        "type": "string"
    },
    "successRate": {
        "name": "成功率",
        "type": "string"
    },
    "findRate": {
        "name": "查得率",
        "type": "string"
    },
    "notFindRate": {
        "name": "未查到率",
        "type": "string"
    },
    "failRate": {
        "name": "失败率",
        "type": "string"
    },
    "overtimeRate": {
        "name": "超时率",
        "type": "string"
    },
    "avgTimeConsume": {
        "name": "平均耗时",
        "type": "string"
    },
    "status": {
        "name": "状态",
        "type": "string"
    }
};
var timeRateVO = {
    "dataSourceName": {
        "name": "数据源",
        "type": "string"
    },
    "totalNum": {
        "name": "查询总数",
        "type": "string"
    },
    "avgTimeConsume": {
        "name": "平均耗时",
        "type": "string"
    },
    "oneSecondRate": {
        "name": "耗时1s内",
        "type": "string"
    },
    "oneToThreeSecondRate": {
        "name": "耗时1-3s",
        "type": "string"
    },
    "threeToFiveSecondRate": {
        "name": "耗时3-5s",
        "type": "string"
    },
    "fiveToTenSecondRate": {
        "name": "耗时5-10s",
        "type": "string"
    },
    "tenToTwentySecondRate": {
        "name": "耗时10-20s",
        "type": "string"
    },
    "twentyToSixtySecondRate": {
        "name": "耗时20-60s",
        "type": "string"
    },
    "sixtySecondRate": {
        "name": "耗时60s以上",
        "type": "string"
    },
    "status": {
        "name": "总结描述",
        "type": "string"
    }
};
zaObj.queryDetailList = function (currentPage) {
    //组装参数
    var statType = "day_real";//按天实时统计
    var startTime = DateUtils.getCurrentDayStartTime();//获取当天起始时间
    var array = new Array();
    $.each(datasourceEnum, function (key, value) {
        array.push(key);//向数组中添加元素
    });
    var dataSource = array.join(',');//将数组元素连接起来以构建一个字符串
    var params = {};
    params.statType = statType;
    params.startTime = startTime;
    params.dataSource = dataSource;
    var condition = {};
    condition.param = params;
    condition.pageSize = 20;
    condition.pageNum = currentPage;
    var xhr = $.ajax({
        url: APIRest.dataSourceStatistics_list,
        type: 'POST',
        data: JSON.stringify(condition),
        dataType: 'json',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        timeout: 60000,
        success: function (data) {
            if (data != null && data.success) {
                var records = data.value;
                var htmlStr = "";
                var screenStr = "";
                var successRateStr = "";
                var timeRateStr = "";
                if (records.length > 0) {
                    for (var i = 0; i < records.length; i++) {
                        var status = zaObj.getStatusByRate(records[i].successRate);
                        records[i].status = status;
                    }
                    screenStr += zaObj.getScreenHtml(records);
                    $(".top-summary").html(screenStr);
                    successRateStr += zaObj.getTableHtml(successRateVO, records, data.totalCount);
                    $("#successRateTable").html(successRateStr);
                    //计算耗时总结描述
                    for (var i = 0; i < records.length; i++) {
                        var status = zaObj.getTimeStatusByRate(records[i]);
                        records[i].status = status;
                        records[i].dataSourceName = records[i].dataSourceName.substring(0, 5);
                    }
                    timeRateStr += zaObj.getTableHtml(timeRateVO, records, data.totalCount);
                    $("#timeRateTable").html(timeRateStr);
                }
            } else {
                layer.msg(errorTips);
            }
        }
    });
    xhr.complete(function () {
        //layer.close(loaderIdx);
    });
    xhr.fail(function () {
        //layer.msg(errorTips);
    });
};

zaObj.getScreenHtml = function (obj) {
    var html = "";
    for (var i = 0; i < obj.length; i++) {
        html += '<div class="animated flipInY col-lg-3 col-md-4 col-sm-4 col-xs-12">';
        if (obj[i].status == "1") {
            html += '<div class="widget green-1 animated fadeInDown">';
        } else if (obj[i].status == "2") {
            html += '<div class="widget pink-1 animated fadeInDown">';
        } else {
            html += '<div class="widget red-1 animated fadeInDown">';
        }
        html += '<div class="widget-content padding">'
            + '<div class="text-box">'
            + '<p class="maindata" style="font-size: 16px;font-weight: 700">' + obj[i].dataSourceName + '</p>'
            + '<h2><span class="animate-number" style="font-weight: 600">' + obj[i].totalNum + '</span>'
            + '&nbsp;&nbsp;<span style="font-size:14px;font-weight: 600">健康度：' + bindStatusValue(obj[i].status) + '</span></h2>';
        html += '<div class="clearfix"></div>'
            + ' </div>'
            + ' </div>'
            + ' </div>'
            + ' </div>';
    }
    return html;
};

function bindStatusValue(status) {
    var htmlStr = "";
    switch (status) {
        case 1:
            htmlStr = '正常';
            break;
        case 2:
            htmlStr = '较差';
            break;
        case 3:
            htmlStr = '异常';
            break;
        default:
            htmlStr = "";
    }
    return htmlStr;
}

zaObj.getStatusByRate = function (rate) {
    rate = rate.replace("%", "");
    var status = 0;
    if (rate >= 90) {
        status = 1;
    } else if (rate < 90 && rate >= 80) {
        status = 2;
    } else {
        status = 3;
    }
    return status;
};

zaObj.getTableHtml = function (dataModel, obj, rowcount) {
    var html = '<table>';
    html += '<tbody><tr>';
    $.each(dataModel, function (key, value) {
        if (key == "checkbox") {
            html += '<th style="text-align:center;"><input type="checkbox" class="za-checkbox-all"></th>';
        } else if (key == "update") {
            html += '<th style="text-align:center;">操作</th>';
        } else if (key == "serialNo") {
            html += '<th style="text-align:center;">序号</th>';
        } else {
            html += '<th>' + value.name + '</th>';
        }
    });
    html += '</tr></tbody><tbody>';
    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++) {
            html += '<tr>';
            $.each(dataModel, function (key, value) {
                if (value.type == "time") {
                    html += '<td>' + DateUtils.formatDate(obj[i][key], 'yyyy-MM-dd hh:mm:ss') + '</td>';
                } else if (value.type == "date") {
                    html += '<td>' + DateUtils.formatDate(obj[i][key], 'yyyy-MM-dd') + '</td>';
                } else if (key == "checkbox") {
                    html += '<td style="text-align:center;"><input type="checkbox" class="za-checkbox" value="' + obj[i].id + '"></td>';
                } else if (key == "update") {
                    html += '<td style="text-align:center;"><a class="edit" data-key=' + obj[i].id + '>编辑</a></td>';
                } else if (key == "dataSourceName") {
                    html += '<td style="width:200px;">' + obj[i][key].substring(0, 8) + '</td>';
                } else if (key == "status") {
                    html += '<td style="text-align:center;"><p>' + hero.bindStatusSpan(obj[i][key]) + '</p></td>';
                } else {
                    html += '<td><p>' + obj[i][key] + '</p></td>';
                }
            });
            html += '</tr>';
        }
    }
    html += '</tbody></table><br>';
    return html;
};

zaObj.getTimeStatusByRate = function (obj) {
    var oneSecondRate = obj.oneSecondRate.replace("%", "");
    var oneToThreeSecondRate = obj.oneToThreeSecondRate.replace("%", "");
    var threeToFiveSecondRate = obj.threeToFiveSecondRate.replace("%", "");
    var fiveToTenSecondRate = obj.fiveToTenSecondRate.replace("%", "");
    var sixtySecondRate = obj.sixtySecondRate.replace("%", "");
    var status = 0;
    if ((parseInt(oneSecondRate) + parseInt(oneToThreeSecondRate)) >= 90 && sixtySecondRate < 5) {
        status = 1;
    } else if ((parseInt(oneSecondRate) + parseInt(oneToThreeSecondRate)) >= 80 && sixtySecondRate < 10) {
        status = 2;
    } else {
        status = 3;
    }
    return status;
};

zaObj.dataSourceStatErrorDataToday = function() {
    //var loaderIdx = layer.load(3);
    var xhr = $.ajax({
        url: APIRest.dataSourceStatErrorDataToday_get,
        type: 'POST',
        dataType: 'json',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        timeout: 60000,
        success: function(data) {
            if (data != null && data.success) {
                var record = data.value;
                $("#aiTotalNum").html(record.totalNum);
                $("#handledNum").html(record.handledNum);
                $("#unHandledNum").html(record.unHandledNum);
                $("#needHelpNum").html(record.needHelpNum);
                $("#errorDataNum").html(record.unHandledNum);
                var errorList = record.errorList;
                zaObj.initAiBarrage(errorList);
            } else {
                //layer.msg(errorTips);
            }
            if (controller == 0) {
                $("#content1").siblings().hide();
                setInterval("timer()","120000");
                controller = 1;
            }
        }
    });
    xhr.complete(function() {
        //layer.close(loaderIdx);
    });
    xhr.fail(function() {
        //layer.msg(errorTips);
    });
};

zaObj.initAiBarrage = function(records) {
    var html = "<p class='ai-search'>AirGo：正在努力搜索异常的航班数据......</p>";
    for (var i = 0; i < 6; i++) {
        var str = records[i].flightNo + "&nbsp;&nbsp;" + records[i].flightDate + "&nbsp;&nbsp;" + records[i].flightDepCode
                + "&nbsp;&nbsp" + records[i].flightArrCode + "&nbsp;&nbsp;" + records[i].flightDepCity 
                + "&nbsp;&nbsp;" + records[i].flightArrCity;
        var gmtCreated = DateUtils.formatDate(records[i].gmtCreated, 'yyyy-MM-dd hh:mm:ss');
        var gmtModified = DateUtils.formatDate(records[i].gmtModified, 'yyyy-MM-dd hh:mm:ss');
        if (records[i].dataCorrect == "error") {
            html += "<p class='ai-find'>AirGo：发现异常航班数据 " + str + "<span class='ai-time-tip'>（" + gmtCreated + "）</span></p>";
        } else if (records[i].dataCorrect == "error_hand") {
            html += "<p class='ai-find'>AirGo：发现异常航班数据 " + str + "<span class='ai-time-tip'>（" + gmtCreated + "）</span></p>"
                 + "<p class='ai-handle-success'>AirGo：异常航班数据 " + str + "，处理成功！<span class='ai-time-tip'>（" + gmtModified + "）</span></p>";
        } else if (records[i].dataCorrect == "error_help") {
            html += "<p class='ai-find'>AirGo：发现异常航班数据 " + str + "<span class='ai-time-tip'>（" + gmtCreated + "）</span></p>"
                 + "<p class='ai-need-help'>AirGo：@主人，异常航班数据 " + str + "，处理失败了，请求帮忙！<span class='ai-time-tip'>（" + gmtModified + "）</span></p>";
        }
    }
    $(".ai-barrage").html(html);
};