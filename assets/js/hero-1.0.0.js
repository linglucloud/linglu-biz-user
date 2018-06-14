var w;
var h;
var dw;
var dh;
var SSO_USER_NAME = null;//用户名
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function executeFunctionByName(functionName, context /*, args */) {
    var args = [].slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(this, args);
}

var changeptype = function () {
    w = $(window).width();
    h = $(window).height();
    dw = $(document).width();
    dh = $(document).height();

    if (jQuery.browser.mobile === true) {
        $("body").addClass("mobile").removeClass("fixed-left");
    }

    if (!$("#wrapper").hasClass("forced")) {
        if (w > 990) {
            $("body").removeClass("smallscreen").addClass("widescreen");
            $("#wrapper").removeClass("enlarged");
        } else {
            $("body").removeClass("widescreen").addClass("smallscreen");
            $("#wrapper").addClass("enlarged");
            $(".left ul").removeAttr("style");
        }
        if ($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
            $("body").removeClass("fixed-left").addClass("fixed-left-void");
        } else if (!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
            $("body").removeClass("fixed-left-void").addClass("fixed-left");
        }

    }
    toggle_slimscroll(".slimscrollleft");
}

$(document).ready(function () {
    SSO_USER_NAME = getCookie("sso_user_name");
    $(".icon-user").after("&nbsp;&nbsp;" + SSO_USER_NAME);
    resizefunc.push("initscrolls");
    resizefunc.push("changeptype");
    $('.animate-number').each(function () {
        $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-duration")));
    })

//TOOLTIP
    $('body').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });

//RESPONSIVE SIDEBAR


    $(".open-right").click(function (e) {
        $("#wrapper").toggleClass("open-right-sidebar");
        e.stopPropagation();
        $("body").trigger("resize");
    });


    $(".open-left").click(function (e) {
        e.stopPropagation();
        $("#wrapper").toggleClass("enlarged");
        $("#wrapper").addClass("forced");

        if ($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
            $("body").removeClass("fixed-left").addClass("fixed-left-void");
        } else if (!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
            $("body").removeClass("fixed-left-void").addClass("fixed-left");
        }
        if ($("#wrapper").hasClass("enlarged")) {
            $(".left ul").removeAttr("style");
        } else {
            $(".subdrop").siblings("ul:first").show();
        }
        toggle_slimscroll(".slimscrollleft");
        $("body").trigger("resize");
    });

// LEFT SIDE MAIN NAVIGATION
    $("#sidebar-menu a").on('click', function (e) {
        if (!$("#wrapper").hasClass("enlarged")) {

            if ($(this).parent().hasClass("has_sub")) {
                e.preventDefault();
            }

            if (!$(this).hasClass("subdrop")) {
                // hide any open menus and remove all other classes
                $("ul", $(this).parents("ul:first")).slideUp(350);
                $("a", $(this).parents("ul:first")).removeClass("subdrop");
                $("#sidebar-menu .pull-right i").removeClass("fa-angle-up").addClass("fa-angle-down");

                // open our new menu and add the open class
                $(this).next("ul").slideDown(350);
                $(this).addClass("subdrop");
                $(".pull-right i", $(this).parents(".has_sub:last")).removeClass("fa-angle-down").addClass("fa-angle-up");
                $(".pull-right i", $(this).siblings("ul")).removeClass("fa-angle-up").addClass("fa-angle-down");
            } else if ($(this).hasClass("subdrop")) {
                $(this).removeClass("subdrop");
                $(this).next("ul").slideUp(350);
                $(".pull-right i", $(this).parent()).removeClass("fa-angle-up").addClass("fa-angle-down");
                //$(".pull-right i",$(this).parents("ul:eq(1)")).removeClass("fa-chevron-down").addClass("fa-chevron-left");
            }
        }
    });

// NAVIGATION HIGHLIGHT & OPEN PARENT
    $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");

//WIDGET ACTIONS
    $(".widget-header .widget-close").on("click", function (event) {
        event.preventDefault();
        $item = $(this).parents(".widget:first");
        bootbox.confirm("Are you sure to remove this widget?", function (result) {
            if (result === true) {
                $item.addClass("animated bounceOutUp");
                window.setTimeout(function () {
                    if ($item.data("is-app")) {

                        $item.removeClass("animated bounceOutUp");
                        if ($item.hasClass("ui-draggable")) {
                            $item.find(".widget-popout").click();
                        }
                        $item.hide();
                        $("a[data-app='" + $item.attr("id") + "']").addClass("clickable");
                    } else {
                        $item.remove();
                    }
                }, 300);
            }
        });
    });

    $(document).on("click", ".widget-header .widget-toggle", function (event) {
        event.preventDefault();
        $(this).toggleClass("closed").parents(".widget:first").find(".widget-content").slideToggle();
    });

    $(document).on("click", ".widget-header .widget-popout", function (event) {
        event.preventDefault();
        var widget = $(this).parents(".widget:first");
        if (widget.hasClass("modal-widget")) {
            $("i", this).removeClass("icon-window").addClass("icon-publish");
            widget.removeAttr("style").removeClass("modal-widget");
            widget.find(".widget-maximize,.widget-toggle").removeClass("nevershow");
            widget.draggable("destroy").resizable("destroy");
        } else {
            widget.removeClass("maximized");
            widget.find(".widget-maximize,.widget-toggle").addClass("nevershow");
            $("i", this).removeClass("icon-publish").addClass("icon-window");
            var w = widget.width();
            var h = widget.height();
            widget.addClass("modal-widget").removeAttr("style").width(w).height(h);
            $(widget).draggable({
                handle: ".widget-header",
                containment: ".content-page"
            }).css({"left": widget.position().left - 2, "top": widget.position().top - 2}).resizable({
                minHeight: 150,
                minWidth: 200
            });
        }
        window.setTimeout(function () {
            $("body").trigger("resize");
        }, 300);
    });

    $("a[data-app]").each(function (e) {
        var app = $(this).data("app");
        var status = $(this).data("status");
        $("#" + app).data("is-app", true);
        if (status == "inactive") {
            $("#" + app).hide();
            $(this).addClass("clickable");
        }
    });

    $(document).on("click", "a[data-app].clickable", function (event) {
        event.preventDefault();
        $(this).removeClass("clickable");
        var app = $(this).data("app");
        $("#" + app).show();
        $("#" + app + " .widget-popout").click();
        topd = $("#" + app).offset().top - $(window).scrollTop();
        $("#" + app).css({"left": "10", "top": -(topd - 60) + "px"}).addClass("fadeInDown animated");
        window.setTimeout(function () {
            $("#" + app).removeClass("fadeInDown animated");
        }, 300);
    });

    $(document).on("click", ".widget", function () {
        if ($(this).hasClass("modal-widget")) {
            $(".modal-widget").css("z-index", 5);
            $(this).css("z-index", 6);
        }
    });

    $(document).on("click", '.widget .reload', function (event) {
        event.preventDefault();
        var el = $(this).parents(".widget:first");
        blockUI(el);
        window.setTimeout(function () {
            unblockUI(el);
        }, 1000);
    });

    $(document).on("click", ".widget-header .widget-maximize", function (event) {
        event.preventDefault();
        $(this).parents(".widget:first").removeAttr("style").toggleClass("maximized");
        $("i", this).toggleClass("icon-resize-full-1").toggleClass("icon-resize-small-1");
        $(this).parents(".widget:first").find(".widget-toggle").toggleClass("nevershow");
        $("body").trigger("resize");
        return false;
    });

    $(".portlets").sortable({
        connectWith: ".portlets",
        handle: ".widget-header",
        cancel: ".modal-widget",
        opacity: 0.5,
        dropOnEmpty: true,
        forcePlaceholderSize: true,
        receive: function (event, ui) {
            $("body").trigger("resize")
        }
    });

//RUN RESIZE ITEMS
    $(window).resize(debounce(resizeitems, 100));
    $("body").trigger("resize");

//DATE PICKER
    $('.datepicker-input').datepicker();
});

var debounce = function (func, wait, immediate) {
    var timeout, result;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(context, args);
        return result;
    };
}

function resizeitems() {
    if ($.isArray(resizefunc)) {
        for (i = 0; i < resizefunc.length; i++) {
            window[resizefunc[i]]();
        }
    }
}

function initscrolls() {
    if (jQuery.browser.mobile !== true) {
        //SLIM SCROLL
        $('.slimscroller').slimscroll({
            height: 'auto',
            size: "5px"
        });

        $('.slimscrollleft').slimScroll({
            height: 'auto',
            position: 'left',
            size: "5px",
            color: '#7A868F'
        });
    }
}
function toggle_slimscroll(item) {
    if ($("#wrapper").hasClass("enlarged")) {
        $(item).css("overflow", "inherit").parent().css("overflow", "inherit");
        $(item).siblings(".slimScrollBar").css("visibility", "hidden");
    } else {
        $(item).css("overflow", "hidden").parent().css("overflow", "hidden");
        $(item).siblings(".slimScrollBar").css("visibility", "visible");
    }
}

function nifty_modal_alert(effect, header, text) {

    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now();

    $modal = '<div class="md-modal md-effect-' + effect + '" id="' + uniqid + '">';
    $modal += '<div class="md-content">';
    $modal += '<h3>' + header + '</h3>';
    $modal += '<div class="md-modal-body">' + text;
    $modal += '</div>';
    $modal += '</div>';
    $modal += '</div>';

    $("body").prepend($modal);

    window.setTimeout(function () {
        $("#" + uniqid).addClass("md-show");
        $(".md-overlay,.md-close").click(function () {
            $("#" + uniqid).removeClass("md-show");
            window.setTimeout(function () {
                $("#" + uniqid).remove();
            }, 500);
        });
    }, 100);

    return false;
}

function blockUI(item) {
    $(item).block({
        message: '<div class="loading"></div>',
        css: {
            border: 'none',
            width: '14px',
            backgroundColor: 'none'
        },
        overlayCSS: {
            backgroundColor: '#fff',
            opacity: 0.4,
            cursor: 'wait'
        }
    });
}

function unblockUI(item) {
    $(item).unblock();
}

function toggle_fullscreen() {
    var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
    if (fullscreenEnabled) {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            launchIntoFullscreen(document.documentElement);
        } else {
            exitFullscreen();
        }
    }
}

function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}


//main
$(document).ready(function () {
    buildLeftMenu();
    $('.za-timepicker').datetimepicker({
        step: 30, //分钟的间隔
        lang: 'ch', //语言
        format: 'Y-m-d', //时间格式
        timepicker: false, //时间控件
        allowBlank: true //默认允许空
    });

    $('.za-timespicker').datetimepicker({
        step: 60, //分钟的间隔
        lang: 'ch', //语言
        format: 'Y-m-d H:i:s', //时间格式
        allowBlank: true //默认允许空
    });

    $(".tcdPageCode").createPage({
        pageCount: 7,
        current: 3,
        backFn: function (p) {
            alert(p);
        }
    });

    zaUtils.bindAppKeySel();
    resetQueryComm();
});

//构建左侧功能菜单
function buildLeftMenu() {
    var html = "<ul>"
        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);' id='indexHref'>" + "<i class='icon-home-3'></i>" + "<span>首页</span>" + "</a>"
        + "</li>"
        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-feather'></i>" + "<span>第三方数据平台</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        + "<li><a href='/flight'><span>航班查询</span></a></li>"
        + "<li><a href='/passenger'><span>乘客查询</span></a></li>"
        + "<li><a href='/searchLog'><span>日志查询</span></a></li>"
        + "<li><a href='/message'><span>消息查询</span></a></li>"
        + "<li><a href='/searchLogYearCard'><span>年单日志查询</span></a></li>"
        + "<li><a href='/simulation'><span>航班模拟数据配置</span></a></li>"
        + "</ul>"
        + "</li>"

        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-megaphone'></i>" + "<span>业务配置</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        + "<li><a href='/eProductConfig'><span>产品配置</span></a></li>"
        + "<li><a href='/eProductStrategyRelation'><span>产品策略关系配置</span></a></li>"
        + "<li><a href='/eFlightStrategyConfig'><span>航延航班策略配置</span></a></li>"
        + "<li><a href='/eFlightBusinessStrategyConfig'><span>航延业务策略配置</span></a></li>"
        + "<li><a href='/flightPolicy'><span>航延前置保单配置</span></a></li>"
        + "<li><a href='/flightBusiness'><span>航延前置保单业务配置</span></a></li>"
        + "<li><a href='/flightBatch'><span>航延任务配置</span></a></li>"
        + "<li><a href='/productSendConfig'><span>产品发送配置</span></a></li>"
        + "<li><a href='/claimCalRule'><span>理赔金额配置</span></a></li>"
        + "<li><a href='/messageListenerConfig'><span>消息监听配置</span></a></li>"
        + "<li><a href='/messageProcessConfig'><span>消息处理器配置</span></a></li>"
        + "<li><a href='/dataSourceConfig'><span>数据源配置</span></a></li>"
        + "<li><a href='/flightProductConfig'><span>航班查询注册登记配置</span></a></li>"
        + "<li><a href='/flightProductStrategyConfig'><span>航班查询策略配置</span></a></li>"
        + "<li><a href='/productCommonNoticeConfig'><span>理赔支付通用通知</span></a></li>"
        + "</ul>"
        + "</li>"

        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-database'></i>" + "<span>数据字典配置</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        + "<li><a href='/city'><span>城市配置</span></a></li>"
        + "<li><a href='/flightDomestic'><span>国内机场三字码配置</span></a></li>"
        + "<li><a href='/ruleFormula'><span>公式配置</span></a></li>"
        + "<li><a href='/ruleFormulaField'><span>公式参数配置</span></a></li>"
        + "<li><a href='/ruleFormulaDictionary'><span>公式字典配置</span></a></li>"
        + "</ul>"
        + "</li>"

        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-bell-2'></i>" + "<span>通知中心</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        + "<li><a href='/messageConfig'><span>消息配置</span></a></li>"
        + "<li><a href='/messageSend'><span>消息发送</span></a></li>"
        + "</ul>"
        + "</li>"

        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-chart-line'></i>" + "<span>米其林管理</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        + "<li><a href='michelin.html'><span>激活优惠券</span></a></li>"
        + "<li><a href='michelin-pre.html'><span>清空预发数据</span></a></li>"
        + "<li><a href='michelin-phone.html'><span>修改手机号</span></a></li>"
        + "</ul>"
        + "</li>"

        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-bookmarks'></i>" + "<span>电子保单管理</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        + "<li><a href='ele-policy-query-request.html'><span>前置入库请求查询</span></a></li>"
        + "<li><a href='ele-policy-query-benefit.html'><span>保险责任查询</span></a></li>"
        + "<li><a href='ele-policy-query-clause.html'><span>保险条款查询</span></a></li>"
        + "<li><a href='ele-policy-check-config.html'><span>校验配置信息</span></a></li>"
        + "</ul>"
        + "</li>"

        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-chat-2'></i>" + "<span>微信模板</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        + "<li><a href='/wechatTemplateDetail'><span>微信模板细节</span></a></li>"
        + "<li><a href='/wechatTemplateVersion'><span>微信模板版本</span></a></li>"
        + "</ul>"
        + "</li>"

        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-eye-1'></i>" + "<span>监控平台</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        // + "<li><a href='/datasourceErrorDetail'><span>数据源错误明细</span></a></li>"
        + "<li><a href='/screenMonitor' target='_blank'><span>实时监控</span></a></li>"
        + "<li><a href='/dataSourceMonitor'><span>监控统计分析</span></a></li>"
        + "<li><a href='/ninaMonitor'><span>za-nina监控分析</span></a></li>"
        + "</ul>"
        + "</li>"

        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-heart'></i>" + "<span>缓存管理</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        + "<li><a href='/powerCacheManage'><span>powercache缓存管理</span></a></li>"
        + "</ul>"
        + "</li>"

        + "<li class='has_sub'>"
        + "<a href='javascript:void(0);'>" + "<i class='icon-search-1'></i>" + "<span>Elasticsearch搜索</span>" + "<span class='pull-right'><i class='fa fa-angle-down'></i></span>" + "</a>"
        + "<ul>"
        + "<li><a href='http://tsconsole.zhonganonline.com/index' target='_blank'><span>ES通用搜索(iSearch)</span></a></li>"
        + "<li><a href='http://tsconsole.zhonganonline.com/manage' target='_blank'><span>ES搜索管理(iSearch)</span></a></li>"
        + "</ul>"
        + "</li>"

        + "</ul>"
        + "<div class='clearfix'></div>";
    var key = $(document.body).data("keynav");
    $("#sidebar-menu").html(html);
    $("#sidebar-menu a[href='" + key + "']").addClass("active");
    // LEFT SIDE MAIN NAVIGATION
    $("#sidebar-menu a").on('click', function (e) {
        if (!$("#wrapper").hasClass("enlarged")) {

            if ($(this).parent().hasClass("has_sub")) {
                e.preventDefault();
            }

            if (!$(this).hasClass("subdrop")) {
                // hide any open menus and remove all other classes
                $("ul", $(this).parents("ul:first")).slideUp(350);
                $("a", $(this).parents("ul:first")).removeClass("subdrop");
                $("#sidebar-menu .pull-right i").removeClass("fa-angle-up").addClass("fa-angle-down");

                // open our new menu and add the open class
                $(this).next("ul").slideDown(350);
                $(this).addClass("subdrop");
                $(".pull-right i", $(this).parents(".has_sub:last")).removeClass("fa-angle-down").addClass("fa-angle-up");
                $(".pull-right i", $(this).siblings("ul")).removeClass("fa-angle-up").addClass("fa-angle-down");
            } else if ($(this).hasClass("subdrop")) {
                $(this).removeClass("subdrop");
                $(this).next("ul").slideUp(350);
                $(".pull-right i", $(this).parent()).removeClass("fa-angle-up").addClass("fa-angle-down");
                //$(".pull-right i",$(this).parents("ul:eq(1)")).removeClass("fa-chevron-down").addClass("fa-chevron-left");
            }
        }
    });
    // NAVIGATION HIGHLIGHT & OPEN PARENT
    $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
    $("#indexHref").on('click', function () {
        window.location.href = "https://fantasy.zhonganonline.com/";
    });
}

//绑定checkbox事件
function bindCheckboxEvent() {
    $(document).on('change', '.za-checkbox', function () {
        var flag = 0;
        var o = $('.za-checkbox');
        if (this.checked) {
            for (var i = 0; i < o.length; i++) {
                if (o[i].checked == !this.checked) {
                    flag = 1;
                }
            }
            if (flag == 0) {
                $('.za-checkbox-all')[0].checked = this.checked;
            }
        } else {
            if ($('.za-checkbox-all')[0].checked) {
                $('.za-checkbox-all')[0].checked = this.checked;
            }
        }
    });

    $('.za-checkbox-all').change(function () {
        var o = $('.za-checkbox');
        for (var i = 0; i < o.length; i++) {
            o[i].checked = this.checked;
        }
    });
}

//获取checkbox值
function getCheckboxValues() {
    var chk_value = [];
    $('.za-checkbox:checked').each(function () {
        chk_value.push($(this).val());
    })
    return chk_value;
}

function getCheckboxValuesNew(divId) {
    var chk_value = [];
    $('#' + divId + ' .za-checkbox:checked').each(function () {
        chk_value.push($(this).val());
    })
    return chk_value;
}

//绑定数据源类型select
function bindDataSourceTypeSel(id) {
    var loaderIdx = layer.load(3);
    var xhr = $.ajax({
        url: APIRest.datasourceTypeEnum,
        type: 'POST',
        data: {},
        dataType: 'json',
        timeout: 60000,
        success: function (data) {
            if (data != null) {
                var selectOptions = "<option value=''>请选择数据源类型</option>";
                $.each(data, function (key, value) {
                    selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
                });
                $("#" + id).html(selectOptions);
            } else {
                layer.msg("加载数据失败，请稍候再试");
            }
        }
    });
    xhr.complete(function () {
        layer.close(loaderIdx);
    });
    xhr.fail(function () {
        layer.msg(errorTips);
    });
}

//绑定数据源实现类select
function bindDataSourceSel(id) {
    var loaderIdx = layer.load(3);
    var xhr = $.ajax({
        url: APIRest.datasourceEnum,
        type: 'POST',
        data: {},
        dataType: 'json',
        timeout: 60000,
        success: function (data) {
            if (data != null) {
                var selectOptions = "<option value=''>请选择数据源</option>";
                $.each(data, function (key, value) {
                    selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
                });
                $("#" + id).html(selectOptions);
            } else {
                layer.msg("加载数据失败，请稍候再试");
            }
        }
    });
    xhr.complete(function () {
        layer.close(loaderIdx);
    });
    xhr.fail(function () {
        layer.msg(errorTips);
    });
}

//绑定数据源接口实现类select
function bindInterfaceSel(id) {
    var loaderIdx = layer.load(3);
    var xhr = $.ajax({
        url: APIRest.datasourceEnum,
        type: 'POST',
        data: {},
        dataType: 'json',
        timeout: 60000,
        success: function (data) {
            if (data != null) {
                var selectOptions = "<option value=''>请选择接口实现类</option>";
                $.each(data, function (key, value) {
                    selectOptions += "<option value=\"" + key + "\">" + key + "</option>";
                });
                $("#" + id).html(selectOptions);
            } else {
                layer.msg("加载数据失败，请稍候再试");
            }
        }
    });
    xhr.complete(function () {
        layer.close(loaderIdx);
    });
    xhr.fail(function () {
        layer.msg(errorTips);
    });
}

//绑定事业部select
function bindAppKeySel(id) {
    var selectOptions = "<option value=''>请选择事业部</option>";
    $.each(appkeyJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("#" + id).html(selectOptions);
}

function getAppKeySel(id) {
    var selectOptions = "<option value=''>请选择事业部</option>";
    $.each(appkeyJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("#" + id).html(selectOptions);
}

//绑定证件类型select
function bindCardTypeSel(id) {

    var selectOptions = "<option value=''>请选择证件类型</option>";
    selectOptions += '<option value="I">身份证</option>' + '<option value="P">护照号</option>' + '</select>';
    $("#" + id).html(selectOptions);
}

//字符串工具类
var StringUtils = {
    formatStr: function (str) {
        if (str == null) {
            return '';
        } else {
            return str;
        }
    }
};

//时间工具类
var DateUtils = {
    formatDate: function (datenumber, format) {
        if (datenumber == null || datenumber == undefined || datenumber == "undefined") {
            return '';
        }
        if (format == null) {
            return new Date(datenumber).format('yyyy-MM-dd');
        } else {
            return new Date(datenumber).format(format);
        }
    },
    showDate: function (dateStr) {
        if (dateStr == null || dateStr == "") {
            return '';
        } else {
            return dateStr.substring(0, 16);
        }
    },
    formatDateAjax: function (date) {
        if (date != null && date != undefined) {
            if (isString(date)) {
                return DateUtils.formatDate(date, 'yyyy-MM-dd');
            } else {
                return DateUtils.formatDate(date.time, 'yyyy-MM-dd');
            }
        } else {
            return "";
        }
    },
    getCurrentDayStartTime: function () {
        var currentDay = new Date().format('yyyy-MM-dd');
        var startTime = currentDay + " 00:00:00";
        return startTime;
    }
};

function isString(obj) { //判断对象是否是字符串
    return Object.prototype.toString.call(obj) === "[object String]";
}

/**
 * 时间对象的格式化
 */
Date.prototype.format = function (format) {
    /*
     * format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

String.prototype.format = function () {
    var str = this;
    if (str == null || str == "null" || str == undefined || str == "undefined") {
        str = "";
    }
    return str;
}

function formatStr(str) {
    if (str == null || str == "null" || str == undefined || str == "undefined") {
        str = "";
    }
    return str;
}

function initCommFailHtml() {
    var noStr = '<table cellspacing="0" width="100%" height="300px;">';
    noStr += '<tr><td style="text-align:center;">抱歉！未查询到相关记录</td></tr>';
    noStr += '</table>';
    $("#za-list").html(noStr);
}

function initCommFailHtmlById(id) {
    var noStr = '<table cellspacing="0" width="100%" height="300px;">';
    noStr += '<tr><td style="text-align:center;">抱歉！未查询到相关记录</td></tr>';
    noStr += '</table>';
    $("#" + id).html(noStr);
}

function initCommFailHtmlByIdAndMsg(id, msg) {
    var msgStr = '<table cellspacing="0" width="100%" height="300px;">';
    msgStr += '<tr><td style="text-align:center;">'+msg+'</td></tr>';
    msgStr += '</table>';
    $("#" + id).html(msgStr);
}

//航班状态select
var FlightStateEnum = "";

function getFlightStateEnum() {
    if (FlightStateEnum == "") {
        var loaderIdx = layer.load(3);
        var xhr = $.ajax({
            url: APIRest.flightStateEnum,
            type: 'POST',
            data: {},
            dataType: 'json',
            timeout: 6000,
            success: function (data) {
                if (data != null) {
                    var selectOptions = '<select class="form-control" style="width:130px;"><option value="">请选择航班状态</option>';
                    $.each(data, function (key, value) {
                        if (value != "") {
                            selectOptions += '<option value=\'' + key + '\'>' + value + '</option>';
                        }
                    });
                    selectOptions += '</select>';
                    FlightStateEnum = selectOptions;
                } else {
                    layer.msg("加载数据失败，请稍候再试");
                }
            }
        });
        xhr.complete(function () {
            layer.close(loaderIdx);
        });
        xhr.fail(function () {
            layer.msg(errorTips);
        });
    }
}

//证件类型select
function getCardTypeEnum() {
    var selectOptions = '<select class="form-control" style="width:130px;"><option value="">请选择证件类型</option>';
    selectOptions += '<option value="I">身份证</option>' + '<option value="P">护照号</option>' + '</select>';
    return selectOptions;
}

//客票状态select
var FlightPersonStatusEnum = "";

function getFlightPersonStatusEnum() {
    if (FlightPersonStatusEnum == "") {
        var loaderIdx = layer.load(3);
        var xhr = $.ajax({
            url: APIRest.flightPersonStatusEnum,
            type: 'POST',
            data: {},
            dataType: 'json',
            timeout: 6000,
            success: function (data) {
                if (data != null) {
                    var selectOptions = '<select class="form-control" style="width:130px;"><option value="">请选择客票状态</option>';
                    $.each(data, function (key, value) {
                        if (value != "") {
                            selectOptions += '<option value=\'' + key + '\'>' + value + '</option>';
                        }
                    });
                    selectOptions += '</select>';
                    FlightPersonStatusEnum = selectOptions;
                } else {
                    layer.msg("加载数据失败，请稍候再试");
                }
            }
        });
        xhr.complete(function () {
            layer.close(loaderIdx);
        });
        xhr.fail(function () {
            layer.msg(errorTips);
        });
    }
}

//验证日期yyyy-mm-dd
function checkDateUtil(date) {
    var flag = false;
    var result = date.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
    if (result != null) {
        flag = true;
    }
    return flag;
}

//验证日期yyyy-mm-dd hh:mm:ss
function checkFullDateUtil(date) {
    var flag = false;
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var result = date.match(reg);
    if (result != null) {
        flag = true;
    }
    return flag;
}


var za_expirydate = "2100-12-01 00:00:00";

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
}


//绑定公共方法
function addDataComm() {
    $("#add-data").click(function () {
        $("#za-add-modal input").each(function () {
            $(this).val("");
        });
        $("#za-add-modal select").each(function () {
            $(this).val("");
        });
        $("#za-add-modal textarea").each(function () {
            $(this).val("");
        });
        if ($("#add-effectiveDate").length > 0) {
            $("#add-effectiveDate").val(getNowFormatDate());
        }
        if ($("#add-expiryDate").length > 0) {
            $("#add-expiryDate").val(za_expirydate);
        }
        $("#za-add-modal").modal('show');
    });
}

function resetDataComm() {
    $("#reset").click(function () {
        $("#za-query-form")[0].reset();
    });
}

function resetQueryComm() {
    $("#reset").click(function () {
        $(this).parents("form")[0].reset();
    });
}

function checkIsBlankComm(elementId) {
    var flag = true;
    $("#" + elementId + " input").each(function () {
        if ($(this).val() == "") {
            flag = false;
            return false;
        }
    });
    $("#" + elementId + " select").each(function () {
        if ($(this).val() == "") {
            flag = false;
            return false;
        }
    });
    $("#" + elementId + " textarea").each(function () {
        if ($(this).val() == "") {
            flag = false;
            return false;
        }
    });
    return flag;
}

function getFormJson(form) {
    var o = {};
    var a = $(form).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

function loadData(json) {
    var obj;
    if (json instanceof Object) {
        obj = json;
    } else {
        obj = eval("(" + json + ")");
    }
    var key, value, tagName, type, arr;
    for (x in obj) {
        key = x;
        value = obj[x];

        $("[name='" + key + "'],[name='" + key + "[]']").each(function () {
            tagName = $(this)[0].tagName;
            type = $(this).attr('type');
            if (tagName == 'INPUT') {
                if (type == 'radio') {
                    $(this).attr('checked', $(this).val() == value);
                } else if (type == 'checkbox') {
                    arr = value.split(',');
                    for (var i = 0; i < arr.length; i++) {
                        if ($(this).val() == arr[i]) {
                            $(this).attr('checked', true);
                            break;
                        }
                    }
                } else {
                    if ($(this).is('.date')) {
                        $(this).val(DateUtils.formatDate(value, 'yyyy-MM-dd'));
                    } else if ($(this).is('.time')) {
                        $(this).val(DateUtils.formatDate(value, 'yyyy-MM-dd hh:mm:ss'));
                    } else {
                        $(this).val(value);
                    }
                }
            } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                $(this).val(value);
            }

        });
    }
}

//utils工具组件
//绑定事业部select
var zaUtils = {};
zaUtils.bindAppKeySel = function () {
    var selectOptions = "<option value=''>请选择事业部</option>";
    $.each(appkeyJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='appKey']").html(selectOptions);
    $("#appKey").html(selectOptions);
};

zaUtils.bindStrategyTypeSel = function () {
    var selectOptions = "<option value=''>请选择策略类型</option>";
    $.each(strategyTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='strategyType']").html(selectOptions);
};

zaUtils.bindRuleTypeSel = function () {
    var selectOptions = "<option value=''>请选择</option>";
    $.each(ruleTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='ruleType']").html(selectOptions);
    $("#ruleType").html(selectOptions);
};

zaUtils.bindCancelLevelSel = function () {
    var selectOptions = "<option value=''>请选择取消责任级别</option>";
    $.each(cancelLevelJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='cancelLevel']").html(selectOptions);
};

zaUtils.bindOtherArriveLevelSel = function () {
    var selectOptions = "<option value=''>请选择其他到达级别</option>";
    $.each(otherArriveLevelJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='otherArriveLevel']").html(selectOptions);
};

zaUtils.bindOtherCancelLevelSel = function () {
    var selectOptions = "<option value=''>请选择延其他取消级别</option>";
    $.each(otherCancelLevelJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='otherCancelLevel']").html(selectOptions);
};

zaUtils.bindDelayTypeSel = function () {
    var selectOptions = "<option value=''>请选择延误责任类型</option>";
    $.each(delayTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='delayType']").html(selectOptions);
};

zaUtils.bindOtherLevelSel = function () {
    var selectOptions = "<option value=''>请选择其他责任级别</option>";
    $.each(otherLevelJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='otherLevel']").html(selectOptions);
};

//绑定证件类型select
zaUtils.bindCertTypeSel = function () {

    var selectOptions = "<option value=''>请选择证件类型</option>";
    $.each(certTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='certType']").html(selectOptions);
    $("#certType").html(selectOptions);
};
//绑定航班赔付数据源
zaUtils.bindFlightPaySourceSel = function () {

    var selectOptions = "<option value=''>请选择赔付数据源</option>";
    $.each(flightPaySourceJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='paySource']").html(selectOptions);
    $("#paySource").html(selectOptions);
};

//绑定航班数据源
zaUtils.bindFlightSearchDataSourceSel = function () {

    var selectOptions = "<option value=''>请选择数据源</option>";
    $.each(flightSearchDataSourceJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='dataSource']").html(selectOptions);
    $("#input_datasource").html(selectOptions);
};
//绑定航班数据源
zaUtils.bindFlightDataSourceSel = function () {

    var selectOptions = "<option value=''>请选择数据源</option>";
    $.each(flightDataSourceJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='dataSource']").html(selectOptions);
    $("#dataSource").html(selectOptions);
};

//绑定来源类型
zaUtils.bindSourceTypeSel = function () {

    var selectOptions = "<option value=''>请选择来源类型</option>";
    $.each(sourceTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='sourceType']").html(selectOptions);
    $("#sourceType").html(selectOptions);
};

//绑定城市数据源
zaUtils.bindCityDataSourceSel = function () {

    var selectOptions = "<option value=''>请选择城市数据源</option>";
    $.each(cityDataSourceJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='dataSource']").html(selectOptions);
    $("#dataSource").html(selectOptions);
};
//绑定消息类型
zaUtils.bindMessageTypeSel = function () {

    var selectOptions = "<option value=''>请选择消息类型</option>";
    $.each(messageTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='messageType']").html(selectOptions);
    $("#messageType").html(selectOptions);
};

//绑定启动标识
zaUtils.bindOpenSel = function () {

    var selectOptions = "<option value=''>请选择启动标识</option>";
    $.each(openJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='isOpen']").html(selectOptions);
    $("#isOpen").html(selectOptions);
};


//绑定计算类型
zaUtils.bindComputeTypeSel = function () {

    var selectOptions = "<option value=''>请选择计算类型</option>";
    $.each(computeTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='type']").html(selectOptions);
    $("#type").html(selectOptions);
};

//绑定机场类型
zaUtils.bindAirportTypeSel = function () {

    var selectOptions = "<option value=''>请选择是否国际机场</option>";
    $.each(isInternationalJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='isInternational']").html(selectOptions);
    $("#isInternational").html(selectOptions);
};


//绑定热门类型
zaUtils.bindHotSel = function () {

    var selectOptions = "<option value=''>请选择是否热门城市</option>";
    $.each(isHotJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='isHot']").html(selectOptions);
    $("#isHot").html(selectOptions);
};


zaUtils.isNotBlank = function (str) {
    if (str != null && str != undefined && str != "") {
        return true;
    }
    return false;
};

zaUtils.isBlank = function (str) {
    if (str == null || str == undefined || str == "") {
        return true;
    }
    return false;
};

zaUtils.getEnvSpan = function (env) {
    var html = "";
    if (env == "test") {
        html += '<span class="label label-success">test</span>';
    } else if (env == "pre") {
        html += '<span class="label label-primary">pre</span>';
    } else if (env == "prd") {
        html += '<span class="label label-danger">prd</span>';
    }
    return html;
};

zaUtils.bindProcessTypeSel = function () {
    var selectOptions = "<option value=''>请选择消息处理类型</option>";
    $.each(processTypeEnum, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='processType']").html(selectOptions);
};

function initAddModalBtn(clickSelector, modal) {
    $(clickSelector).click(function () {
        $(modal + ' form')[0].reset();
        $(modal).modal('show');
    });
}
//客票状态
var segmentStatusJSON = {
    "OpenForUse": "未使用",
    "UsedFlown": "已使用",
    "CheckedIn": "已值机",
    "LiftBoarded": "已登机",
    "Refunded": "已退票",
    "Suspended": "票被挂起，不能使用",
    "Exchanged": "已改签",
    "Void": "已作废",
    "Suspended": "不能使用",
    "NoAuth": "无权限",
    "UNKNOW": "未知"
}
zaUtils.bindSegmentStatusSel = function () {
    var selectOptions = "<option value=''>请选择客票状态</option>";
    $.each(segmentStatusJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='segmentStatus']").html(selectOptions);
};


//航班状态
var flightStateJSON = {
    "flyingOff": "起飞",
    "flightPlan": "计划",
    "flightArrive": "到达",
    "flightDelay": "延误",
    "flightCancel": "取消",
    "flightAdvanceCancel": "提前取消",
    "flightAlternate": "备降",
    "flightAlternateFlying": "备降起飞",
    "flightAlternateArrive": "备降到达",
    "flightAlternateCancel": "备降取消",
    "flightReturned": "返航",
    "flightReturnedFlying": "返航起飞",
    "flightReturnedArrive": "返航到达",
    "flightReturnedCancel": "返航取消",
    "flightPlanCancel": "计划前取消",
    "flightDelayCancel": "计划后取消",
    "UNKNOW": "UNKNOW"
}
zaUtils.bindFlightStateSel = function () {
    var selectOptions = "<option value=''>请选择航班状态</option>";
    $.each(flightStateJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='flightState']").html(selectOptions);
    $("#flightState").html(selectOptions);
};


zaUtils.addModalShow = function (click_id, modal_id) {
    $("#" + click_id).click(function () {
        $("#" + modal_id + " input").each(function () {
            $(this).val("");
        });
        $("#" + modal_id + " select").each(function () {
            $(this).val("");
        });
        $("#" + modal_id + " textarea").each(function () {
            $(this).val("");
        });
        $("#" + modal_id).modal('show');
    });
};

//hero插件
var hero = {};
hero.getTableHtml = function (dataModel, obj, rowcount) {
    var html = '<table class="table table-hover table-striped table-bordered" cellspacing="0" width="100%" style="font-size:12px;">';
    html += '<tr><thead>';
    $.each(dataModel, function (key, value) {
        if (key == "checkbox") {
            html += '<th style="text-align:center;"><input type="checkbox" class="za-checkbox-all"></th>';
        } else if (key == "update") {
            html += '<th style="text-align:center;">操作</th>';
        } else if (key == "updateAndCache") {
            html += '<th style="text-align:center;width:200px;">操作</th>';
        } else if (key == "serialNo") {
            html += '<th style="text-align:center;">序号</th>';
        } else {
            html += '<th>' + value.name + '</th>';
        }
    });
    html += '</tr></thead>';
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
                } else if (key == "updateAndCache") {
                    html += '<td style="text-align:center;" nowrap="nowrap"><a class="edit" data-key=' + obj[i].id + '>编辑</a>'
                         +  '&nbsp;&nbsp;&nbsp;&nbsp;<a class="" data-key=' + obj[i].id + '>刷入缓存</a>'
                         +  '&nbsp;&nbsp;&nbsp;&nbsp;<a class="" data-key=' + obj[i].id + '>查看缓存</a></td>';
                } else if (key == "serialNo") {
                    html += '<td style="text-align:center;">' + (i+1) + '</td>';
                } else if (key == "status") {
                    html += '<td style="text-align:center;">' + hero.bindStatusSpan(obj[i][key]) + '</td>';
                } else {
                    html += '<td>' + obj[i][key] + '</td>';
                }
            });
            html += '</tr>';
        }
    } else {
        html += '<tr>';
        $.each(dataModel, function (key, value) {
            if (value.type == "time") {
                html += '<td>' + DateUtils.formatDate(obj[key], 'yyyy-MM-dd hh:mm:ss') + '</td>';
            } else if (value.type == "date") {
                html += '<td>' + DateUtils.formatDate(obj[key], 'yyyy-MM-dd') + '</td>';
            } else if (key == "md5") {
                if (obj[i][key].indexOf("不") >= 0) {
                    html += '<td style="color:#E15554;">' + obj[i][key] + '</td>';
                } else {
                    html += '<td style="color:#3189c4;">' + obj[i][key] + '</td>';
                }
            } else {
                html += '<td>' + obj[key] + '</td>';
            }
        });
        html += '</tr>';
    }
    html += '</table><br>';
    html += '<div style="float:left;margin-left:20px;margin-top:12px;">共搜索到 ' + rowcount + ' 条记录</div><div class="tcdPageCode"></div>';
    return html;
}

hero.bindStatusSpan = function (status) {
    var htmlStr = "";
    switch(status) {
        case 1:
            htmlStr += '<span class="label label-success">正常</span>';
            break;
        case 2:
            htmlStr += '<span class="label label-light-red">较差</span>';
            break;
        case 3:
            htmlStr += '<span class="label label-danger">异常</span>';
            break;
        default:
            htmlStr += "";
    }
    return htmlStr;
}

hero.layerFullOpen = function(title, content) {
    //弹出即全屏
    var index = layer.open({
        type: 2,
        title: title,
        content: content,
        area: ['500px', '500px'],
        maxmin: true
    });
    layer.full(index);
}

//config
var EMMA_URL = '/za-emma/';
var SHEPHERD_URL = '/za-shepherd/';
var MICHELIN_URL = "http://192.168.91.1:8080/";
var EVA_URL = "/za-eva/";
var HYOMIN_URL = "/za-hyomin/";
//错误提示
var errorTips = "网络异常，请稍候再试！";

var APIRest = {
    //航班信息
    flight_list: SHEPHERD_URL + "flightinfo/queryflightLocal",
    flight_add: SHEPHERD_URL + "flightinfo/curd/create",
    flight_del: SHEPHERD_URL + "flightinfo/curd/delete",
    flight_upd: SHEPHERD_URL + "flightinfo/curd/update",
    flight_get: SHEPHERD_URL + "flightinfo/curd/retrieve",
    flight_query_source: SHEPHERD_URL + "flightinfo/queryflight",
    flight_correctErrorData: SHEPHERD_URL + "flight/correctErrorData",

    passenger_list: SHEPHERD_URL + "passengerinfo/querypassengerLocal",
    passenger_add: SHEPHERD_URL + "passengerinfo/curd/create",
    passenger_del: SHEPHERD_URL + "passengerinfo/curd/delete",
    passenger_upd: SHEPHERD_URL + "passengerinfo/curd/update",
    passenger_get: SHEPHERD_URL + "passengerinfo/curd/retrieve",
    passenger_query_source: SHEPHERD_URL + "passengerinfo/querypassenger",

    appKeys: SHEPHERD_URL + "enum/appKeyEnum",
    datasourceEnum: SHEPHERD_URL + "enum/datasourceEnum",
    cardEnum: SHEPHERD_URL + "enum/cardEnum",
    datasourceTypeEnum: SHEPHERD_URL + "enum/datasourceTypeEnum",
    delayTypeEnum: SHEPHERD_URL + "enum/delayTypeEnum",
    strategyTypesEnum: SHEPHERD_URL + "enum/strategyTypesEnum",
    flightStateEnum: SHEPHERD_URL + "enum/flightStateEnum",
    flightPersonStatusEnum: SHEPHERD_URL + "enum/flightPersonStatusEnum",

    datasource: SHEPHERD_URL + "datasource/datasourcelist",
    getDatasource: SHEPHERD_URL + "datasource/getDataSource",
    editDatasource: SHEPHERD_URL + "datasource/editDataSource",
    deleteDatasource: SHEPHERD_URL + "datasource/delDataSourceByIds",

    searchLog_list: SHEPHERD_URL + "log/queryPager",
    searchLog_yearCard_list: SHEPHERD_URL + "log/queryYearCardPolicy",

    productSendConfig_list: SHEPHERD_URL + "productSendConfig/list",

    productSendConfig_edit: SHEPHERD_URL + "productSendConfig/edit",

    productSendConfig_del: SHEPHERD_URL + "productSendConfig/delByIds",

    productSendConfig_get: SHEPHERD_URL + "productSendConfig/getBean",

    messageList: SHEPHERD_URL + "message/messageList",
    getMessageById: SHEPHERD_URL + "message/getMessageById",

    messageListener_list: SHEPHERD_URL + "messageListener/messageListenerList",

    messageListener_edit: SHEPHERD_URL + "messageListener/edit",

    messageListener_del: SHEPHERD_URL + "messageListener/delByIds",

    messageListener_get: SHEPHERD_URL + "messageListener/getBean",

    message_list: EVA_URL + "messageInfo/queryPage",
    message_add: EVA_URL + "messageInfo/curd/create",
    message_del: EVA_URL + "messageInfo/curd/delete",
    message_edit: EVA_URL + "messageInfo/curd/update",
    message_get: EVA_URL + "messageInfo/curd/retrieve",

    eProductConfig_list: EMMA_URL + "strategycrud/readProductConfigAll",
    eProductConfig_add: EMMA_URL + "strategycrud/createProductConfig",
    eProductConfig_del: EMMA_URL + "strategycrud/deleteProductConfig",
    eProductConfig_upd: EMMA_URL + "strategycrud/updateProductConfig",
    eProductConfig_get: EMMA_URL + "strategycrud/readProductConfig",

    michelin_list: MICHELIN_URL + "coupon/queryCoupon",
    michelin_add: MICHELIN_URL + "strategycrud/createProductConfig",
    michelin_del: MICHELIN_URL + "strategycrud/deleteProductConfig",
    michelin_upd: MICHELIN_URL + "strategycrud/updateProductConfig",
    michelin_get: MICHELIN_URL + "strategycrud/readProductConfig",

    eProductStrategyRelation_list: EMMA_URL + "strategycrud/readProductStrategyRelationAll",
    eProductStrategyRelation_add: EMMA_URL + "strategycrud/createProductStrategyRelation",
    eProductStrategyRelation_del: EMMA_URL + "strategycrud/deleteProductStrategyRelation",
    eProductStrategyRelation_upd: EMMA_URL + "strategycrud/updateProductStrategyRelation",
    eProductStrategyRelation_get: EMMA_URL + "strategycrud/readProductStrategyRelation",

    eFlightStrategyConfig_list: EMMA_URL + "strategycrud/readFlightStrategyConfigAll",
    eFlightStrategyConfig_add: EMMA_URL + "strategycrud/createFlightStrategyConfig",
    eFlightStrategyConfig_del: EMMA_URL + "strategycrud/deleteFlightStrategyConfig",
    eFlightStrategyConfig_upd: EMMA_URL + "strategycrud/updateFlightStrategyConfig",
    eFlightStrategyConfig_get: EMMA_URL + "strategycrud/readFlightStrategyConfig",

    eFlightBusinessStrategyConfig_list: EMMA_URL + "strategycrud/readFlightBusinessStrategyConfigAll",
    eFlightBusinessStrategyConfig_add: EMMA_URL + "strategycrud/createFlightBusinessStrategyConfig",
    eFlightBusinessStrategyConfig_del: EMMA_URL + "strategycrud/deleyteFlightBusinessStrategyConfig",
    eFlightBusinessStrategyConfig_upd: EMMA_URL + "strategycrud/updateFlightBusinessStrategyConfig",
    eFlightBusinessStrategyConfig_get: EMMA_URL + "strategycrud/readFlightBusinessStrategyConfig",

    flightSimulation_list: SHEPHERD_URL + "flightSimulation/flight/queryPage",
    flightSimulation_del: SHEPHERD_URL + "flightSimulation/flight/curd/delete",
    flightSimulation_add: SHEPHERD_URL + "flightSimulation/flight/curd/create",
    flightSimulation_upd: SHEPHERD_URL + "flightSimulation/flight/curd/update",
    flightSimulation_get: SHEPHERD_URL + "flightSimulation/flight/curd/retrieve",

    passengerSimulation_list: SHEPHERD_URL + "flightSimulation/passenger/queryPage",
    passengerSimulation_del: SHEPHERD_URL + "flightSimulation/passenger/curd/delete",
    passengerSimulation_add: SHEPHERD_URL + "flightSimulation/passenger/curd/create",
    passengerSimulation_upd: SHEPHERD_URL + "flightSimulation/passenger/curd/update",
    passengerSimulation_get: SHEPHERD_URL + "flightSimulation/passenger/curd/retrieve",

    //策略同步
    strategy_sync_list: EMMA_URL + "strategy/synchroSearch",

    //航延前置保单业务
    flightBusiness_list: EVA_URL + "flightBusinessInfo/queryPage",
    flightBusiness_del: EVA_URL + "flightBusinessInfo/curd/delete",
    flightBusiness_add: EVA_URL + "flightBusinessInfo/curd/create",
    flightBusiness_upd: EVA_URL + "flightBusinessInfo/curd/update",
    flightBusiness_get: EVA_URL + "flightBusinessInfo/curd/retrieve",

    //城市业务
    city_list: EVA_URL + "cityInfo/queryPage",
    city_add: EVA_URL + "cityInfo/curd/create",
    city_del: EVA_URL + "cityInfo/curd/delete",
    city_upd: EVA_URL + "cityInfo/curd/update",
    city_get: EVA_URL + "cityInfo/curd/retrieve",
    city_import: EVA_URL + "cityInfo/collectData",

    //国内城市三字码业务
    flightDomestic_list: EVA_URL + "flightDomesticInfo/queryPage",
    flightDomestic_add: EVA_URL + "flightDomesticInfo/curd/create",
    flightDomestic_del: EVA_URL + "flightDomesticInfo/curd/delete",
    flightDomestic_upd: EVA_URL + "flightDomesticInfo/curd/update",
    flightDomestic_get: EVA_URL + "flightDomesticInfo/curd/retrieve",

    //航延前置保单业务
    flightPolicy_list: EVA_URL + "flightPolicyInfo/queryPage",
    flightPolicy_add: EVA_URL + "flightPolicyInfo/curd/create",
    flightPolicy_del: EVA_URL + "flightPolicyInfo/curd/delete",
    flightPolicy_upd: EVA_URL + "flightPolicyInfo/curd/update",
    flightPolicy_get: EVA_URL + "flightPolicyInfo/curd/retrieve",


    //航延任务
    flightBatch_list: EVA_URL + "flightBatchInfo/queryPage",
    flightBatch_add: EVA_URL + "flightBatchInfo/curd/create",
    flightBatch_del: EVA_URL + "flightBatchInfo/curd/delete",
    flightBatch_upd: EVA_URL + "flightBatchInfo/curd/update",
    flightBatch_get: EVA_URL + "flightBatchInfo/curd/retrieve",

    //理赔金额
    claimCalRule_list: EVA_URL + "claimCalRule/queryPage",
    claimCalRule_add: EVA_URL + "claimCalRule/curd/create",
    claimCalRule_del: EVA_URL + "claimCalRule/curd/delete",
    claimCalRule_upd: EVA_URL + "claimCalRule/curd/update",
    claimCalRule_get: EVA_URL + "claimCalRule/curd/retrieve",

    //消息监听
    messageListenerConfig_list: EVA_URL + "messageListenerConfig/queryPage",
    messageListenerConfig_add: EVA_URL + "messageListenerConfig/curd/create",
    messageListenerConfig_del: EVA_URL + "messageListenerConfig/curd/delete",
    messageListenerConfig_upd: EVA_URL + "messageListenerConfig/curd/update",
    messageListenerConfig_get: EVA_URL + "messageListenerConfig/curd/retrieve",

    //消息处理器
    messageProcessConfig_list: EVA_URL + "messageProcessConfig/queryPage",
    messageProcessConfig_add: EVA_URL + "messageProcessConfig/curd/create",
    messageProcessConfig_del: EVA_URL + "messageProcessConfig/curd/delete",
    messageProcessConfig_upd: EVA_URL + "messageProcessConfig/curd/update",
    messageProcessConfig_get: EVA_URL + "messageProcessConfig/curd/retrieve",


    //数据源配置
    dataSourceConfig_list: EVA_URL + "dataSourceConfig/queryPage",
    dataSourceConfig_add: EVA_URL + "dataSourceConfig/curd/create",
    dataSourceConfig_del: EVA_URL + "dataSourceConfig/curd/delete",
    dataSourceConfig_upd: EVA_URL + "dataSourceConfig/curd/update",
    dataSourceConfig_get: EVA_URL + "dataSourceConfig/curd/retrieve",

    flightProductConfig_list: EVA_URL + "flightProductConfig/queryPage",
    flightProductConfig_add: EVA_URL + "flightProductConfig/curd/create",
    flightProductConfig_del: EVA_URL + "flightProductConfig/curd/delete",
    flightProductConfig_upd: EVA_URL + "flightProductConfig/curd/update",
    flightProductConfig_get: EVA_URL + "flightProductConfig/curd/retrieve",

    flightProductStrategyConfig_list: EVA_URL + "flightProductStrategyConfig/queryPage",
    flightProductStrategyConfig_add: EVA_URL + "flightProductStrategyConfig/curd/create",
    flightProductStrategyConfig_del: EVA_URL + "flightProductStrategyConfig/curd/delete",
    flightProductStrategyConfig_upd: EVA_URL + "flightProductStrategyConfig/curd/update",
    flightProductStrategyConfig_get: EVA_URL + "flightProductStrategyConfig/curd/retrieve",


    //微信模板
    wechatTemplateVersion_list: EVA_URL + "wechatTemplateVersion/find/byConditionWithPage",
    wechatTemplateVersion_add: EVA_URL + "wechatTemplateVersion/curd/create",
    wechatTemplateVersion_del: EVA_URL + "wechatTemplateVersion/curd/delete",
    wechatTemplateVersion_upd: EVA_URL + "wechatTemplateVersion/curd/update",
    wechatTemplateVersion_get: EVA_URL + "wechatTemplateVersion/curd/findbyid",

    //微信模板
    wechatTemplateDetail_list: EVA_URL + "wechatTemplateDetail/find/byConditionWithPage",
    wechatTemplateDetail_add: EVA_URL + "wechatTemplateDetail/curd/create",
    wechatTemplateDetail_del: EVA_URL + "wechatTemplateDetail/curd/delete",
    wechatTemplateDetail_upd: EVA_URL + "wechatTemplateDetail/curd/update",
    wechatTemplateDetail_get: EVA_URL + "wechatTemplateDetail/curd/findbyid",


    //字典
    ruleFormula_list: EVA_URL + "ruleFormula/find/byConditionWithPage",
    ruleFormula_add: EVA_URL + "ruleFormula/curd/create",
    ruleFormula_del: EVA_URL + "ruleFormula/curd/delete",
    ruleFormula_upd: EVA_URL + "ruleFormula/curd/update",
    ruleFormula_get: EVA_URL + "ruleFormula/curd/findbyid",

    //字典
    ruleFormulaDictionary_list: EVA_URL + "ruleFormulaDictionary/find/byConditionWithPage",
    ruleFormulaDictionary_add: EVA_URL + "ruleFormulaDictionary/curd/create",
    ruleFormulaDictionary_del: EVA_URL + "ruleFormulaDictionary/curd/delete",
    ruleFormulaDictionary_upd: EVA_URL + "ruleFormulaDictionary/curd/update",
    ruleFormulaDictionary_get: EVA_URL + "ruleFormulaDictionary/curd/findbyid",

    //字典
    ruleFormulaField_list: EVA_URL + "ruleFormulaField/find/byConditionWithPage",
    ruleFormulaField_add: EVA_URL + "ruleFormulaField/curd/create",
    ruleFormulaField_del: EVA_URL + "ruleFormulaField/curd/delete",
    ruleFormulaField_upd: EVA_URL + "ruleFormulaField/curd/update",
    ruleFormulaField_get: EVA_URL + "ruleFormulaField/curd/findbyid",

    //数据源监控
    dataSourceStatistics_list: EVA_URL + "dataSourceStatistics/find/byConditionWithPage",
    dataSourceHourTimebyCondition_list: EVA_URL + "dataSourceStatistics/find/dataSourceHourTimebyCondition",
    dataSourceStatErrorDataToday_get: EVA_URL + "dataSourceStatistics/find/statErrorDataToday",

    //理赔支付通用通知功能
    productCommonNoticeConfig_list: EVA_URL + "productCommonNoticeConfig/find/byConditionWithPage",
    productCommonNoticeConfig_add: EVA_URL + "productCommonNoticeConfig/curd/create",
    productCommonNoticeConfig_del: EVA_URL + "productCommonNoticeConfig/curd/delete",
    productCommonNoticeConfig_upd: EVA_URL + "productCommonNoticeConfig/curd/update",
    productCommonNoticeConfig_get: EVA_URL + "productCommonNoticeConfig/curd/findbyid",

    //skywalking
    skywalkingApp_list: "/api/es/applications",
    skywalkingQuery_list: "/api/es/report/entry",

    //nina
    ninaQuery_list: "/api/es/report/local",

    //缓存管理
    powerCacheManage_set: EVA_URL + "powerCacheManage/setCache",
    powerCacheManage_del: EVA_URL + "powerCacheManage/deleteCache",
    powerCacheManage_get: EVA_URL + "powerCacheManage/getByKey",

    screenMonitorMessage_topic_list: HYOMIN_URL + "messageMonitor/getMessageMonitor",
    screenMonitorMessage_msf_list: EVA_URL + "es/message/msfAttractFansReport",
    screenMonitorMessage_umetrip_list: EVA_URL + "es/msgdetailv1/airTravel",
    screenMonitorMessage_claim_list: EVA_URL + "es/msgdetailv1/claim",
    screenMonitorMessage_ctrip_list: EVA_URL + "es/msgdetailv1/ctripClaim",
};

//appKey事业部属性配置
var appkeyJSON = {
    "HL": "航旅",
    "KF": "客服",
    "ZY": "直营",
    "TZ": "投资",
    "KFPT": "开放平台",
    "UNKNOW": "未知"
};

//strategyType策略类型枚举
var strategyTypeJSON = {
    "FLIGHT": "航班策略",
    "BUSINESS": "业务策略",
    "unknow": "未知"
};

//ruleType枚举
var ruleTypeJSON = {
    "1": "自动判赔理赔",
    "2": "需判赔",
    "3": "需理赔",
    "4": "不处理",
    "5": "颜值"
};

//delayType枚举
var delayTypeJSON = {
    "dep": "起飞延误责任",
    "arr": "到达延误责任"
};

//取消责任级别枚举
var cancelLevelJSON = {
    "0": "无取消责任",
    "1": "计划前取消责任",
    "2": "计划后取消责任",
    "3": "计划前后都有取消责任",
    "-1": "未知"
};

//其他责任级别枚举
var otherLevelJSON = {
    "0": "没有任何取消责任",
    "1": "返航责任",
    "2": "备降责任",
    "3": "折备都有责任",
    "-1": "未知"
};

//其他到达级别枚举
var otherArriveLevelJSON = {
    "0": "折备即停止任务",
    "1": "折返到达时赔付",
    "2": "备降到达时赔付",
    "3": "折备到达均赔付"
};

//其他取消级别
var otherCancelLevelJSON = {
    "0": "折备停止任务",
    "1": "返航取消赔付",
    "2": "备降取消时赔付",
    "3": "折备取消均赔付"
};

//消息配置消息处理类型枚举
var processTypeEnum = {
    "1": "投保",
    "2": "退保",
    "3": "判赔",
    "4": "理赔",
    "5": "批改",
    "14": "理赔支付",
    "6": "报案",
    "7": "报案回退",
    "8": "报案注销",
    "9": "立案",
    "10": "理算",
    "11": "拒赔",
    "12": "结案",
    "13": "零结",
    "UNKNOW": "未知"
};

var certTypeJSON = {
    "I": "身份证",
    "P": "护照号",
    "TN": "客票号",
    "NI": "身份证(NI)"
};

var flightSearchDataSourceJSON = {
    "default": "默认查询",
    "jingZhongFindFlightProcessor": "敬众国内航班查询",
    "jingZhongFindInterFlightProcessor": "敬众国际航班查询",
    "hanglianFindFlightProcessor": "航联航班查询",
    "feeYooFlightCurrentProcessor": "飞友航班（新）查询",
    "travelSkyFlightCityProcessor": "中航信起降地航班查询",
    "travelSkyFlightNoProcessor": "中航信不含预计起飞时间航班查询",
    "travelSkyFlightNoWithEstiProcessor": "中航信含预计起飞时间航班查询",
    "chunQiuFlightProcessor": "春秋航班查询",
    "chunQiuFlightWsProcessor": "春秋航班查询(webservice)",
    "testFlightProcessor": "测试航班查询"
};
var flightDataSourceJSON = {
    "jingZhongFindFlightProcessor": "敬众国内航班",
    "jingZhongFindInterFlightProcessor": "敬众国际航班",
    "hanglianFindFlightProcessor": "航联航班查询",
    "feeYooFlightCurrentProcessor": "飞友航班（新）",
    "travelSkyFlightCityProcessor": "中航信起降地航班查询",
    "travelSkyFlightNoProcessor": "中航信不含预计起飞时间航班查询",
    "travelSkyFlightNoWithEstiProcessor": "中航信含预计起飞时间航班查询",
    "chunQiuFlightProcessor": "春秋航班查询",
    "chunQiuFlightWsProcessor": "春秋航班查询(webservice)",
    "testFlightProcessor": "测试航班查询"
};
var flightPaySourceJSON = {
    "jingZhongFindFlightProcessor": "敬众国内航班",
    "jingZhongFindInterFlightProcessor": "敬众国际航班",
    "hanglianFindFlightProcessor": "航联航班查询",
    "feeYooFlightCurrentProcessor": "飞友航班（新）",
    "travelSkyFlightCityProcessor": "中航信起降地航班查询",
    "travelSkyFlightNoProcessor": "中航信不含预计起飞时间航班查询",
    "travelSkyFlightNoWithEstiProcessor": "中航信含预计起飞时间航班查询",
    "chunQiuFlightProcessor": "春秋航班查询",
    "chunQiuFlightWsProcessor": "春秋航班查询(webservice)",
    "testFlightProcessor": "测试航班查询"
};


var sourceTypeJSON = {
    "01": "天气"
};

var cityDataSourceJSON = {
    "jisuapi": "极速数据"
};
var messageTypeJSON = {
    "ONS": "ONS",
    "KAFKA": "KAFKA"
};
var openJSON = {
    "0": "停止",
    "1": "启动"
};
var computeTypeJSON = {
    "fixed": "区间计算",
    "incremental": "阶梯计算",
    "max": "取大"
};

var productConfigVO = {
    "env": {
        "name": "运行环境",
        "type": "env"
    },
    "md5": {
        "name": "md5是否一致",
        "type": "string"
    },
    "id": {
        "name": "id",
        "type": "long"
    },
    "productKey": {
        "name": "产品对应唯一标识",
        "type": "string"
    },
    "productName": {
        "name": "产品名称",
        "type": "string"
    },
    "productType": {
        "name": "产品类型",
        "type": "string"
    },
    "feeType": {
        "name": "收费标准",
        "type": "string"
    },
    "appKey": {
        "name": "事业部",
        "type": "string"
    },
    "creator": {
        "name": "创建人",
        "type": "string"
    },
    "gmtCreated": {
        "name": "创建时间",
        "type": "time"
    },
    "modifier": {
        "name": "更新人",
        "type": "string"
    },
    "gmtModified": {
        "name": "更新时间",
        "type": "time"
    },
    "isDeleted": {
        "name": "删除标识",
        "type": "string"
    }
};

var flightStrategyConfigVO = {
    "env": {
        "name": "运行环境",
        "type": "env"
    },
    "md5": {
        "name": "md5是否一致",
        "type": "string"
    },
    "id": {
        "name": "id",
        "type": "long"
    },
    "strategyType": {
        "name": "策略类型（多次1，单次0）",
        "type": "int"
    },
    "ruleType": {
        "name": "rule_type",
        "type": "string"
    },
    "maxClaimTime": {
        "name": "最大理赔次数",
        "type": "long"
    },
    "delayTimeNode": {
        "name": "延误时长节点",
        "type": "string"
    },
    "isFinish": {
        "name": "是否需要扫描到航班最终状态",
        "type": "string"
    },
    "delayType": {
        "name": "延误责任类型",
        "type": "string"
    },
    "cancelLevel": {
        "name": "取消责任级别",
        "type": "string"
    },
    "otherLevel": {
        "name": "其他责任级别",
        "type": "string"
    },
    "otherArriveLevel": {
        "name": "其他到达级别",
        "type": "string"
    },
    "otherCancelLevel": {
        "name": "其他取消级别",
        "type": "string"
    },
    "execClaimDay": {
        "name": "生成理赔时间（天）",
        "type": "string"
    },
    "execClaimTime": {
        "name": "生成理赔时间（时分）",
        "type": "string"
    },
    "batchFrequency": {
        "name": "跑批频率",
        "type": "int"
    },
    "isCheck": {
        "name": "复合航班",
        "type": "string"
    },
    "dataSource": {
        "name": "航班数据源",
        "type": "string"
    },
    "isBusiness": {
        "name": "是否需要处理附加业务",
        "type": "string"
    },
    "pushDataSource": {
        "name": "航班推送数据源",
        "type": "string"
    },
    "resultDataSource": {
        "name": "结果推送数据源",
        "type": "string"
    },
    "configExtraInfo": {
        "name": "配置扩展信息",
        "type": "string"
    },
    "paramExtraInfo": {
        "name": "参数扩展信息",
        "type": "string"
    },
    "creator": {
        "name": "创建人",
        "type": "string"
    },
    "gmtCreated": {
        "name": "创建时间",
        "type": "time"
    },
    "modifier": {
        "name": "更新人",
        "type": "string"
    },
    "gmtModified": {
        "name": "更新时间",
        "type": "time"
    },
    "isDeleted": {
        "name": "删除标识",
        "type": "string"
    }
};

var flightBusinessStrategyConfigVO = {
    "env": {
        "name": "运行环境",
        "type": "env"
    },
    "md5": {
        "name": "md5是否一致",
        "type": "string"
    },
    "id": {
        "name": "id",
        "type": "long"
    },
    "isNeedCheck": {
        "name": "是否需要检验乘客（Y/N）",
        "type": "string"
    },
    "dataSource": {
        "name": "乘客查询数据源",
        "type": "string"
    },
    "ticketStatus": {
        "name": "乘客客票",
        "type": "string"
    },
    "isCompensate": {
        "name": "是否需要补偿查询",
        "type": "string"
    },
    "maxCompensateTimes": {
        "name": "最大补偿次数",
        "type": "int"
    },
    "compensateFrequency": {
        "name": "补偿频率",
        "type": "int"
    },
    "configExtraInfo": {
        "name": "配置扩展信息",
        "type": "string"
    },
    "paramExtraInfo": {
        "name": "参数扩展信息",
        "type": "string"
    },
    "creator": {
        "name": "创建人",
        "type": "string"
    },
    "gmtCreated": {
        "name": "创建时间",
        "type": "time"
    },
    "modifier": {
        "name": "更新人",
        "type": "string"
    },
    "gmtModified": {
        "name": "更新时间",
        "type": "time"
    },
    "isDeleted": {
        "name": "删除标识",
        "type": "string"
    }
};

var productStrategyRelationVO = {
    "env": {
        "name": "运行环境",
        "type": "env"
    },
    "md5": {
        "name": "md5是否一致",
        "type": "string"
    },
    "id": {
        "name": "id",
        "type": "long"
    },
    "productKey": {
        "name": "产品对应唯一标识",
        "type": "string"
    },
    "productName": {
        "name": "产品名称",
        "type": "string"
    },
    "productConfigId": {
        "name": "产品配置ID",
        "type": "string"
    },
    "strategyConfigId": {
        "name": "策略ID",
        "type": "string"
    },
    "strategyType": {
        "name": "策略类型",
        "type": "string"
    },
    "effectiveDate": {
        "name": "策略生效日期",
        "type": "time"
    },
    "expiryDate": {
        "name": "策略失效日期",
        "type": "time"
    },
    "creator": {
        "name": "创建人",
        "type": "string"
    },
    "gmtCreated": {
        "name": "创建时间",
        "type": "time"
    },
    "modifier": {
        "name": "更新人",
        "type": "string"
    },
    "gmtModified": {
        "name": "更新时间",
        "type": "time"
    },
    "isDeleted": {
        "name": "删除标识",
        "type": "string"
    }
};


var isInternationalJSON = {
    "N": "非国际",
    "Y": "国际"
};

var isHotJSON = {
    "N": "非热门",
    "Y": "热门"
};

//统计类型枚举
var statTypeEnum = {
    "hour_real": "按小时实时统计",
    "day_real": "按天实时统计",
    "hour": "按小时统计",
    "day": "按天统计",
    "month": "按月统计",
    "year": "按年统计"
}


//绑定统计类型Select
zaUtils.bindStatTypeSel = function () {
    var selectOptions = "<option value=''>请选择统计类型</option>";
    $.each(statTypeEnum, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='statType']").html(selectOptions);
};


var noticeCreateTypeJSON = {
    "1": "人工",
    "2": "自动",
    "3": "全部"
};

zaUtils.bindNoticeCreateTypeSel = function () {
    var selectOptions = "<option value=''>请选择发送事件生成类型</option>";
    $.each(noticeCreateTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='noticeCreateType']").html(selectOptions);
    $("#noticeCreateType").html(selectOptions);
};
var noticeTypeJSON = {
    "1": "短信",
    "2": "微信",
    "3": "HTTPREQUEST",
    "4": "其他"
};
zaUtils.bindNoticeTypeSel = function () {
    var selectOptions = "<option value=''>请选择通知的类型</option>";
    $.each(noticeTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='noticeType']").html(selectOptions);
    $("#noticeType").html(selectOptions);
};
var noticeSourceJSON = {
    "bops": "bops",
    "newBops": "newBops",
    "mashangfei": "mashangfei",
    "claimSource": "claimSource"
};
zaUtils.bindNoticeSourceSel = function () {
    var selectOptions = "<option value=''>请选择理赔来源</option>";
    $.each(noticeSourceJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='noticeSourceType']").html(selectOptions);
};
var receiveTypeJSON = {
    "1": "支付",
    "2": "理赔"
};
zaUtils.bindReceiveTypeSel = function () {
    var selectOptions = "<option value=''>请选择接收事件的类型</option>";
    $.each(receiveTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='receiveType']").html(selectOptions);
    $("#receiveType").html(selectOptions);
};
var productTypeJSON = {
    "1": "险种",
    "2": "CP"
};
zaUtils.bindProductTypeSel = function () {
    var selectOptions = "<option value=''>请选择产品类型</option>";
    $.each(productTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='productType']").html(selectOptions);
    $("#productType").html(selectOptions);
};
var receiveStatusJSON = {
    "1": "支付",
    "2": "理赔"
};
zaUtils.bindReceiveStatusSel = function () {
    var selectOptions = "<option value=''>请选择接收事件状态</option>";
    $.each(receiveStatusJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='receiveStatus']").html(selectOptions);
    $("#receiveStatus").html(selectOptions);
};

var sendUserTypeJSON = {
    "1": "客户",
    "2": "员工"
};
zaUtils.bindSendUserTypeSel = function () {
    var selectOptions = "<option value=''>请选择发送用户类型</option>";
    $.each(sendUserTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='sendUserType']").html(selectOptions);
    $("#sendUserType").html(selectOptions);
};
var sendStartTimeTypeJSON = {
    "1": "固定",
    "2": "代码生成"
};
zaUtils.bindSendStartTimeTypeSel = function () {
    var selectOptions = "<option value=''>请选择首次发送时间类型</option>";
    $.each(sendStartTimeTypeJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='sendStartTimeType']").html(selectOptions);
    $("#sendStartTimeType").html(selectOptions);
};
var sendDimensionJSON = {
    "1": "保单",
    "2": "理赔"
};
zaUtils.bindSendDimensionSel = function () {
    var selectOptions = "<option value=''>请选择来源类型</option>";
    $.each(sendDimensionJSON, function (key, value) {
        selectOptions += "<option value=\"" + key + "\">" + value + "</option>";
    });
    $("select[name='sendDimension']").html(selectOptions);
    $("#sendDimension").html(selectOptions);
};

var datasourceEnum = {
    "jingZhongFindFlightProcessor": "敬众国内航班",
    "jingZhongFindInterFlightProcessor": "敬众国际航班",
    "feeYooFlightCurrentProcessor": "飞常准国内航班",
    "flightManagerFindFlightProcessor": "航班管家航班查询",
    "jingZhongPassengerCheckbyTicketNoProcessor": " 敬众客票号查询",
    "jingZhongCheckPassengerByNIProcessor": "敬众国内航班行程验证",
    "travelSkyActivityVerifyProcessor": "航旅纵横行程验证"
};

//绑定多个checkbox
zaUtils.bindCheckboxDiv = function (enums, divId, checkboxName) {
    var checkboxDiv = "<input type='checkbox' id='checkall' data-placement='right' checked> &nbsp;&nbsp;<em style='margin-right: 20px'>全选</em>";
    $.each(enums, function (key, value) {
        checkboxDiv += "<input type='checkbox' name=\"" + checkboxName + "\" data-placement='right' value=\"" + key + "\" checked> &nbsp;&nbsp;"
                    + "<label class='control-label' style='margin-right: 20px;'>" + value + "</label>";
    });
    $("#"+divId).html(checkboxDiv);
    $("#checkall").click(function () {
        if (this.checked) { // 全选
            $("input[name='"+checkboxName+"']").each(function () {
                this.checked = true;   
            });
        } else { // 取消全选 
            $("input[name='"+checkboxName+"']").each(function () {
                this.checked = false;   
            });
        }
    });
    $("input[name='"+checkboxName+"']").click(function () {
        var allcheck = true;
        $("input[name='"+checkboxName+"']").each(function () {
            if (!this.checked){
                allcheck = false;
                return false;
            }
        });
        if (allcheck){
            $("#checkall").prop("checked",true);
        }else {
             $("#checkall").prop("checked",false);
        }
    });
};

function getCurrentTime(){
    var date = new Date();
    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var time = [y, M, d, h, m, s];
    var str = "";
    for (var i = 0; i < time.length; i++) {
        if (time[i] < 10) {
            time[i] = '0' + time[i];
        }
    }
    str += time[0] + "-" + time[1] + "-" + time[2] + " " + time[3] +":"+time[4]+":"+time[5];
    $(".time-show").html(str);
}

zaUtils.initCurrentTime = function() {
    getCurrentTime();
    setInterval(getCurrentTime, 1000);
}

zaUtils.getCurrentTime = function() {
    var date = new Date();
    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var time = [y, M, d, h, m, s];
    var str = "";
    for (var i = 0; i < time.length; i++) {
        if (time[i] < 10) {
            time[i] = '0' + time[i];
        }
    }
    str += time[0] + "-" + time[1] + "-" + time[2] + " " + time[3] +":"+time[4]+":"+time[5];
    return str;
}