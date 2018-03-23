(function($){

$("#loadhtml").load("load.html", function() {

"use strict";

//默认显示英文
if(!$.cookie("langClassName")){
   $.cookie("langClassName", "lang_english", { path: '/' });
}

//检测语言
__checkLang();

//设置首页页面标题语言切换
if($.cookie("langClassName")=="lang_english"){
   __setTitleLang("Tokenpii,Put Your Token in the Pocket.");
}

$(document).on('click', '#langChange', function () {

    __checkLang();

   if($.cookie("langClassName")=="lang_english"){
       __setTitleLang("Tokenpii,Put Your Token in the Pocket.");
   }else{
       __setTitleLang("Tokenpii，把你的通证资产装进口袋。");
   }

});


});



})(jQuery)


/*
* 点击时语言转换 为了快速修改对应语言直接在当前节点进行处理
* @__changeLang
* @langClassName 切换标识
*/

function __changeLang(){

    var langClassName = $('#langChange').attr('class');
    var englishHtml = '';
    var englishVal = '';
    var englisPlaceholder = '';
    var chineseHtml = '';
    var chineseVal = '';
    var chinesePlaceholder = '';

    //切换语言时设置cookie为当前语言
    if(langClassName=='lang_chinese'){
        $.cookie("langClassName", "lang_english", { path: '/' });
    }else{
        $.cookie("langClassName", "lang_chinese", { path: '/' });
    }

    //通过判断cookie切换语言
    if($.cookie("langClassName")=='lang_english'){

        //当cookie切换为英文时执行

        $('#langChange').removeClass().addClass('lang_english');

        $("[data-english]").each(function() {

            englishHtml = $(this).data('english');
            englisVal = $(this).val();
            englisPlaceholder = $(this).attr("placeholder");

            if ($(this).attr('data-chinese')){
                chineseHtml = $(this).data('chinese');
            }else{
                chineseHtml = $(this).html();
                $(this).attr('data-chinese', chineseHtml);
            }

            //判断标签类型
            if($(this).get(0).tagName=='INPUT'){
                if($(this).attr('type')=='button'){
                    $(this).val(englishHtml);
                }else if($(this).attr('type')=='text'||$(this).attr('type')=='password'){
                    $(this).attr("placeholder", englishHtml);
                }else{
                    console.log('未找到要定义的元素类型，请在函数中增加需要的类型');
                }
            }else{
                $(this).html(englishHtml);
            }

         });

    }else{

        //当cookie切换为中文时执行

        $('#langChange').removeClass().addClass('lang_chinese');

        $("[data-english]").each(function() {

            englishHtml = $(this).data('english');

            chineseVal = $(this).val();
            chinesePlaceholder = $(this).attr("placeholder");

            if ($(this).attr('data-chinese')){
                chineseHtml = $(this).data('chinese');
            }else{
                chineseHtml = $(this).html();
                $(this).attr('data-chinese', chineseHtml);
            }

            //判断标签类型
            if($(this).get(0).tagName=='INPUT'){
                if($(this).attr('type')=='button'){
                    $(this).val(chineseHtml);
                }else if($(this).attr('type')=='text'||$(this).attr('type')=='password'){
                    $(this).attr("placeholder", chineseHtml);
                }else{
                    console.log('未找到要定义的元素类型，请在函数中增加需要的类型');
                }

            }else{
                $(this).html(chineseHtml);
            }

         });

    }

}


/*
* 语言检测
* 如果cookie langClassName english存在则使用英文
* 目前我们仅做了两种语言 因此只需做一次判断
* 此外获取文本方式不同还需要先判断标签类型
*/

function __checkLang(){

    if($.cookie("langClassName")&&$.cookie("langClassName")=="lang_english"){

        $('body').removeAttr('class').addClass('english_html');

        $('#langChange').removeClass().addClass('lang_english');

        $("[data-english]").each(function() {

            englishHtml = $(this).data('english');

            if ($(this).attr('data-chinese')){
                chineseHtml = $(this).data('chinese');
            }else{
                chineseHtml = $(this).html();
                $(this).attr('data-chinese', chineseHtml);
            }

            if($(this).get(0).tagName=='INPUT'){
                if($(this).attr('type')=='button'){
                    $(this).val(englishHtml);
                }else if($(this).attr('type')=='text'||$(this).attr('type')=='password'){
                    $(this).attr("placeholder", englishHtml);
                }else{
                    console.log('未找到要定义的元素类型，请在函数中增加需要的类型');
                }
            }else{
                $(this).html(englishHtml);
            }

         });

    }else{

        $('body').removeAttr('class').addClass('chinese_html');

    }

}

/*
 *设置切换语言标题
 * @__setTitleLang
 *
 */
function __setTitleLang(english){
    document.title = english;
}

/*导航跳转*/
function __scrollToClick(id){

    if(id=='Advantage'){
        $("html,body").animate({scrollTop: $('#section-3').offset().top}, 'swing');
    }

    if(id=='Database'){
        window.location.href = 'https://www.assetfun.org/';
    }

    if(id=='Client'){
        $("html,body").animate({scrollTop: $('#section-5').offset().top}, 'swing');
    }

}
