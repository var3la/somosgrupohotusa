//'use strict';
//tpl-readMore
var readMore = (function (a, h) {
  if (!a.length || !h) return false;

  var plugin = (function () {
    function clipHtml(string, maxLength, options) { for (var _options$imageWeight = options.imageWeight, imageWeight = void 0 === _options$imageWeight ? 2 : _options$imageWeight, indicator = options.indicator, maxLines = options.maxLines, numChars = indicator.length, numLines = 1, i = 0, isUnbreakableContent = !1, tagStack = [], length = string.length; length > i; i++) { var rest = i ? string.slice(i) : string, nextIndex = rest.search(CHAR_OF_INTEREST_REGEX), nextBlockSize = nextIndex > -1 ? nextIndex : rest.length; if (i += nextBlockSize, !isUnbreakableContent && (numChars += nextBlockSize, numChars > maxLength)) { i = Math.max(i - numChars + maxLength, 0); break } if (-1 === nextIndex) break; var charCode = string.charCodeAt(i); if (charCode === TAG_OPEN_CHAR_CODE) { var nextCharCode = string.charCodeAt(i + 1), isSpecialTag = nextCharCode === EXCLAMATION_CHAR_CODE; if (isSpecialTag && "--" === string.substr(i + 2, 2)) { var commentEndIndex = string.indexOf("-->", i + 4) + 3; i = commentEndIndex - 1 } else if (isSpecialTag && "[CDATA[" === string.substr(i + 2, 7)) { var cdataEndIndex = string.indexOf("]]>", i + 9) + 3; i = cdataEndIndex - 1 } else { if (numChars === maxLength && string.charCodeAt(i + 1) !== FORWARD_SLASH_CHAR_CODE) { numChars++; break } for (var attributeQuoteCharCode = 0, endIndex = i, isAttributeValue = !1; ;) { if (endIndex++, endIndex >= length) throw new Error("Invalid HTML: ".concat(string)); var _charCode = string.charCodeAt(endIndex); if (isAttributeValue) attributeQuoteCharCode ? _charCode === attributeQuoteCharCode && (isAttributeValue = !1) : isWhiteSpace(_charCode) ? isAttributeValue = !1 : _charCode === TAG_CLOSE_CHAR_CODE && (isAttributeValue = !1, endIndex--); else if (_charCode === EQUAL_SIGN_CHAR_CODE) { for (; isWhiteSpace(string.charCodeAt(endIndex + 1));)endIndex++; isAttributeValue = !0; var firstAttributeCharCode = string.charCodeAt(endIndex + 1); firstAttributeCharCode === DOUBLE_QUOTE_CHAR_CODE || firstAttributeCharCode === SINGLE_QUOTE_CHAR_CODE ? (attributeQuoteCharCode = firstAttributeCharCode, endIndex++) : attributeQuoteCharCode = 0 } else if (_charCode === TAG_CLOSE_CHAR_CODE) { var isEndTag = string.charCodeAt(i + 1) === FORWARD_SLASH_CHAR_CODE, tagNameStartIndex = i + (isEndTag ? 2 : 1), tagNameEndIndex = Math.min(indexOfWhiteSpace(string, tagNameStartIndex), endIndex), tagName = string.slice(tagNameStartIndex, tagNameEndIndex).toLowerCase(); if (tagName.charCodeAt(tagName.length - 1) === FORWARD_SLASH_CHAR_CODE && (tagName = tagName.slice(0, tagName.length - 1)), isEndTag) { var currentTagName = tagStack.pop(); if (currentTagName !== tagName) throw new Error("Invalid HTML: ".concat(string)); if (("math" === tagName || "svg" === tagName) && (isUnbreakableContent = tagStack.includes("math") || tagStack.includes("svg"), !isUnbreakableContent && (numChars += imageWeight, numChars > maxLength))) break; if (BLOCK_ELEMENTS.includes(tagName) && !isUnbreakableContent && (numLines++, numLines > maxLines)) { tagStack.push(tagName); break } } else if (VOID_ELEMENTS.includes(tagName) || string.charCodeAt(endIndex - 1) === FORWARD_SLASH_CHAR_CODE) { if ("br" === tagName) { if (numLines++, numLines > maxLines) break } else if ("img" === tagName && (numChars += imageWeight, numChars > maxLength)) break } else tagStack.push(tagName), "math" !== tagName && "svg" !== tagName || (isUnbreakableContent = !0); i = endIndex; break } } if (numChars > maxLength || numLines > maxLines) break } } else if (charCode === AMPERSAND_CHAR_CODE) { for (var _endIndex = i + 1, isCharacterReference = !0; ;) { var _charCode2 = string.charCodeAt(_endIndex); if (!isCharacterReferenceCharacter(_charCode2)) { if (_charCode2 === SEMICOLON_CHAR_CODE) break; isCharacterReference = !1; break } _endIndex++ } if (!isUnbreakableContent && (numChars++, numChars > maxLength)) break; isCharacterReference && (i = _endIndex) } else if (charCode === NEWLINE_CHAR_CODE) { if (!isUnbreakableContent) { if (numChars++, numChars > maxLength) break; if (numLines++, numLines > maxLines) break } } else { if (!isUnbreakableContent && (numChars++, numChars > maxLength)) break; var _nextCharCode = string.charCodeAt(i + 1); 56320 === (64512 & _nextCharCode) && i++ } } if (numChars > maxLength) { var nextChar = takeHtmlCharAt(string, i); if (indicator) { for (var peekIndex = i + nextChar.length; string.charCodeAt(peekIndex) === TAG_OPEN_CHAR_CODE && string.charCodeAt(peekIndex + 1) === FORWARD_SLASH_CHAR_CODE;) { var nextPeekIndex = string.indexOf(">", peekIndex + 2) + 1; if (!nextPeekIndex) break; peekIndex = nextPeekIndex } peekIndex && (peekIndex === string.length || isLineBreak(string, peekIndex)) && (i += nextChar.length, nextChar = string.charAt(i)) } for (; "<" === nextChar && string.charCodeAt(i + 1) === FORWARD_SLASH_CHAR_CODE;) { var _tagName = tagStack.pop(), tagEndIndex = _tagName ? string.indexOf(">", i + 2) : -1; if (-1 === tagEndIndex || string.replace(TRIM_END_REGEX, "").slice(i + 2, tagEndIndex) !== _tagName) throw new Error("Invalid HTML: ".concat(string)); i = tagEndIndex + 1, nextChar = string.charAt(i) } if (i < string.length) { if (!options.breakWords) for (var j = i - indicator.length; j >= 0; j--) { var _charCode3 = string.charCodeAt(j); if (_charCode3 === TAG_CLOSE_CHAR_CODE || _charCode3 === SEMICOLON_CHAR_CODE) break; if (_charCode3 === NEWLINE_CHAR_CODE || _charCode3 === TAG_OPEN_CHAR_CODE) { i = j; break } if (isWhiteSpace(_charCode3)) { i = j + (indicator ? 1 : 0); break } } for (var result = string.slice(0, i) + (isLineBreak(string, i) ? "" : indicator); tagStack.length;) { var _tagName2 = tagStack.pop(); result += "</".concat(_tagName2, ">") } return result } } else if (numLines > maxLines) { for (var _result = string.slice(0, i); tagStack.length;) { var _tagName3 = tagStack.pop(); _result += "</".concat(_tagName3, ">") } return _result } return string }
    function clipPlainText(string, maxLength, options) { for (var indicator = options.indicator, maxLines = options.maxLines, numChars = indicator.length, numLines = 1, i = 0, length = string.length; length > i && (numChars++, !(numChars > maxLength)); i++) { var charCode = string.charCodeAt(i); if (charCode === NEWLINE_CHAR_CODE) { if (numLines++, numLines > maxLines) break } else if (55296 === (64512 & charCode)) { var nextCharCode = string.charCodeAt(i + 1); 56320 === (64512 & nextCharCode) && i++ } } if (numChars > maxLength) { var nextChar = takeCharAt(string, i); if (indicator) { var peekIndex = i + nextChar.length; if (peekIndex === string.length) return string; if (string.charCodeAt(peekIndex) === NEWLINE_CHAR_CODE) return string.slice(0, i + nextChar.length) } if (!options.breakWords) for (var j = i - indicator.length; j >= 0; j--) { var _charCode4 = string.charCodeAt(j); if (_charCode4 === NEWLINE_CHAR_CODE) { i = j, nextChar = "\n"; break } if (isWhiteSpace(_charCode4)) { i = j + (indicator ? 1 : 0); break } } return string.slice(0, i) + ("\n" === nextChar ? "" : indicator) } return numLines > maxLines ? string.slice(0, i) : string }
    function indexOfWhiteSpace(string, fromIndex) { for (var length = string.length, i = fromIndex; length > i; i++)if (isWhiteSpace(string.charCodeAt(i))) return i; return length }
    function isCharacterReferenceCharacter(charCode) { return charCode >= 48 && 57 >= charCode || charCode >= 65 && 90 >= charCode || charCode >= 97 && 122 >= charCode }
    function isLineBreak(string, index) { var firstCharCode = string.charCodeAt(index); if (firstCharCode === NEWLINE_CHAR_CODE) return !0; if (firstCharCode === TAG_OPEN_CHAR_CODE) { var newlineElements = "(".concat(BLOCK_ELEMENTS.join("|"), "|br)"), newlineRegExp = new RegExp("^<".concat(newlineElements, "[	\n\f\r ]*/?>"), "i"); return newlineRegExp.test(string.slice(index)) } return !1 }
    function isWhiteSpace(charCode) { return 9 === charCode || 10 === charCode || 12 === charCode || 13 === charCode || 32 === charCode }
    function takeCharAt(string, index) { var charCode = string.charCodeAt(index); if (55296 === (64512 & charCode)) { var nextCharCode = string.charCodeAt(index + 1); if (56320 === (64512 & nextCharCode)) return String.fromCharCode(charCode, nextCharCode) } return String.fromCharCode(charCode) }
    function takeHtmlCharAt(string, index) { var char = takeCharAt(string, index); if ("&" === char) for (; ;) { index++; var nextCharCode = string.charCodeAt(index); if (!isCharacterReferenceCharacter(nextCharCode)) { if (nextCharCode === SEMICOLON_CHAR_CODE) { char += String.fromCharCode(nextCharCode); break } break } char += String.fromCharCode(nextCharCode) } return char }
    var VOID_ELEMENTS = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"], BLOCK_ELEMENTS = ["address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video"], NEWLINE_CHAR_CODE = 10, EXCLAMATION_CHAR_CODE = 33, DOUBLE_QUOTE_CHAR_CODE = 34, AMPERSAND_CHAR_CODE = 38, SINGLE_QUOTE_CHAR_CODE = 39, FORWARD_SLASH_CHAR_CODE = 47, SEMICOLON_CHAR_CODE = 59, TAG_OPEN_CHAR_CODE = 60, EQUAL_SIGN_CHAR_CODE = 61, TAG_CLOSE_CHAR_CODE = 62, CHAR_OF_INTEREST_REGEX = /[<&\n\ud800-\udbff]/, TRIM_END_REGEX = /\s+$/;
    return function (string, maxLength) { var options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; return string ? (string = string.toString(), void 0 === options.indicator && (options.indicator = "â€¦"), options.html ? clipHtml(string, maxLength, options) : clipPlainText(string, maxLength, options)) : "" }
  })();

  var generateMore = function (o) {
    var obj = {
      cont: o.querySelector('.fn-readMore_content'),
      bLong: o.querySelector('.fn-readMore_bLong'),
      bShort: o.querySelector('.fn-readMore_bShort')
    },
      size = (function () {
        var _w = document.body.offsetWidth,
          dataResolution = o.dataset;
        if (_w < 600) return dataResolution.m && !isNaN(dataResolution.m) ? parseInt(dataResolution.m) : 300;
        if (_w >= 600 && _w <= 820) return dataResolution.t && !isNaN(dataResolution.t) ? parseInt(dataResolution.t) : 400;
        if (_w > 900) return dataResolution.d && !isNaN(dataResolution.d) ? parseInt(dataResolution.d) : 1800;
      })();
    obj.text = obj.cont.innerHTML.trim();

    if (obj.text.replace(/(<([^>]+)>)/ig, '').length > size) {
      obj.textShort = plugin(obj.text, size, { html: true, indicator: '...' });
      changeText(obj, false, true);
      obj.bShort.addEventListener('click', function () {
        changeText(obj, true);
      });
      obj.bLong.addEventListener('click', function () {
        changeText(obj, false);
      });
    }
  },
    changeText = function (obj, boo, notAni) {
      var pxSecond = 200;
      if (boo) {
        var heightCont = obj.cont.offsetHeight;
        obj.bLong.classList.add('sta-show');
        obj.bShort.classList.remove('sta-show');
        obj.cont.innerHTML = obj.text;
        var heightDes = obj.cont.offsetHeight;
        obj.cont.style.height = heightCont + 'px';
        obj.cont.classList.add('sta-gradient');
        duracion = (heightDes - heightCont) / pxSecond * 500;

        obj.cont.style.display = 'block';
        h.animate({
          elem: obj.cont,
          duration: 500,
          draw: function (progress) {
            obj.cont.style.height = (heightCont + ((heightDes - heightCont) * progress)) + 'px';
          },
          duration: duracion,
          callback: function () {
            obj.cont.style.display = '';
            obj.cont.style.height = '';
            obj.cont.classList.remove('sta-gradient');
          }
        })
      } else {
        obj.bLong.classList.remove('sta-show');
        obj.bShort.classList.add('sta-show');
        obj.cont.innerHTML = obj.textShort;
        if (!notAni) {
          var heightCont = obj.cont.offsetHeight;
          obj.cont.innerHTML = obj.text;
          obj.cont.classList.add('sta-gradient');
          var heightAct = obj.cont.offsetHeight,
            duracion = (heightAct - heightCont) / pxSecond * 500;

          obj.cont.style.display = 'block';
          h.animate({
            elem: obj.cont,
            duration: duracion,
            draw: function (progress) {
              obj.cont.style.height = (heightCont + ((heightAct - heightCont) * (1 - progress))) + 'px';
            },
            callback: function () {
              obj.cont.innerHTML = obj.textShort;
              obj.cont.style.height = '';
              obj.cont.style.display = '';
              obj.cont.classList.remove('sta-gradient');
            }
          })

        };

      };
    };
  for (var i = 0; i < a.length; i++) generateMore(a[i]);

  return {
    multi: function (a) {
      var _t = a.querySelectorAll('.fn-readMore');
      for (var i = 0; i < _t.length; i++) generateMore(_t[i])
    },
    mono: generateMore
  }
})(document.querySelectorAll('.fn-readMore'), window.hotusa && hotusa());

(function (o, $, h) {
  if (o) {

    function clone(obj) {
      var $obj = $(obj),
        $ases = $(obj.querySelectorAll('a'));

      if (!actual) {
        $ases.each(function (i, e) {
          if (!actual) {
            var $e = $(e),
              a_url = $e.attr('href');

            if (url == a_url) {
              $obj.addClass('sta-actual');
              actual = true;
              return false
            }
          }
        });
      };

      return $obj;
    };
    function mover() {
      $nav.empty();

      if (control) {
        var _w = $navP.width();
        mas = false;

        for (var i = 0; i < arrLis.length; i++) {
          mas = (function ($li) {
            $("input, label", $li).remove();
            $li.hover(function () {
              $o.addClass('sta-notActual');
            }, function () {
              $o.removeClass('sta-notActual');
            });

            if ($nav.width() > _w) {
              $li.remove();
              return true;
            };
          })(arrLis[i].clone(true).appendTo($nav));
        };

        mas
          ? $o.removeClass('sta-noVerMas')
          : $o.addClass('sta-noVerMas');


        if (!mas && inputCheck.checked) {
          $html.removeClass("sta-noScroll");
          inputCheck.click();
        }
      }
    };
    function check() {
      if (mas) {
        inputCheck.checked
          ? $html.addClass('sta-noScroll')
          : $html.removeClass('sta-noScroll');
      }
    };
    function closeNav() {
      if (inputCheck.checked) inputCheck.click();
    };

    var arrLis = [],
      actual = false,
      mas = false,
      url = location.origin + location.pathname,
      get = h.getQueryVariable('scroll'),
      $html = $('html'),
      $scroll = $('html, body'),
      $o = $(o),
      tamAbs = (function ($abs) {
        var _h = $abs.height();
        $(window).resize(function () {
          tamAbs = $abs.height();
        });
        return _h;
      })($(o.querySelector('.sta-header-gh_abs'))),
      inputCheck = o.querySelector('#sta-header-gh_nav'),
      lis = o.querySelectorAll(".sta-header-gh_lateralNav .sta-header-gh_liNav"),
      $navP = $(o.querySelector(".sta-header-gh_nav")),
      $nav = $($navP[0].querySelector(".sta-header-gh_contNav")),
      control = (function () {
        $(window).resize(function () {
          control = ($navP.css('display') != 'none');
        });
        return ($navP.css('display') != 'none');
      })();

    for (var i = 0; i < lis.length; i++) {
      (function (li) {
        var $a = $(li.querySelector('a')),
          urlA = $a.attr('href').split('?');

        if (url == urlA[0]) {

          if (urlA[1] && urlA[1].indexOf('scroll') >= 0) {

            var varScroll = _.find(urlA[1].split('&'), function (e) {
              return e.search('scroll=') == 0;
            });

            var $mod = $(document.querySelector('.scroll_' + varScroll.split('=')[1]));
            if ($mod.length) {
              $a.click(function (e) {
                e.preventDefault();
                if(window.innerWidth > 821){
                  $scroll.animate({ scrollTop: $mod.offset().top - tamAbs }, 1000)
                } else{
                  $scroll.animate({ scrollTop: $mod.offset().top - tamAbs - 45 }, 1000)
                }
                closeNav();
              });
            };
          };

        } else if (urlA[0].search(location.origin) == -1) {
          $a.attr('target', '_blank');
        };

      })(lis[i])
      arrLis.push(clone(lis[i]));
    };

    if (!o.querySelector(".sta-idioma_lista").children.length) $o.addClass("sta-notIdiomas");

    mover();
    $(window).resize(mover);
    $(inputCheck).change(check);

    h.controlTop($(o));

    if (get) {
      var $mod = $(document.querySelector('.scroll_' + get));

      if ($mod.length) {
        if (window.history && history.scrollRestoration != 'manual') history.scrollRestoration = 'manual';
        setTimeout(function () {
          $scroll.animate({ scrollTop: $mod.offset().top - tamAbs }, 1e3);
        }, 1e3);
      }
    };
  };
})(document.querySelector('.tpl-header-gh'), window.jQuery, window.hotusa && hotusa());




var servlet = (function (o, $, h) {
  if (!o || !$ || !h) return false;
  var $o = $(o);

  function dobleCero(num) {
    var tam = num.toString().length;
    if (tam < 2) num = '0' + num;
    return num;
  };
  function cleanHash(){
    location.hash = "";
    history.replaceState("", "", location.pathname);
  };
  function crearHtml(obj){
    var bool=false;
    try{

      var $img = $('<img />', { class: 'imgOculta', alt: obj.title }),
      fecha = new Date(obj.date),
      url_origin = document.location.origin+document.location.pathname,
      url_fb = "https://www.facebook.com/sharer/sharer.php?u="+url_origin+"%23noticia_"+obj.id,
      url_tw = "https://twitter.com/intent/tweet?text="+url_origin+"%23noticia_"+obj.id,
      url_whatsapp = "https://wa.me/?text=%22"+encodeURIComponent(obj.title)+'%22%0a'+url_origin+"%23noticia_"+obj.id,
      url_linkedin = "https://www.linkedin.com/shareArticle/?url="+url_origin+"%23noticia_"+obj.id;

      //IMAGEN
      $(o.querySelector(".sta-pressRelease-gh_image"))
        .css('background-image', "url('" + obj.image + "')")
        .append($img.attr('src', obj.image))
  
      //FECHA
      $(o.querySelector(".sta-pressRelease-gh_date")).text(dobleCero(fecha.getDate()) + '/' + dobleCero(fecha.getMonth()+1) + '/' + fecha.getFullYear());
  
      //TITULO
      $(o.querySelector(".sta-pressRelease-gh_title")).text(obj.title);
  
      //SUBTITULO
      $(o.querySelector(".sta-pressRelease-gh_subtitle")).html(obj.subtitle);
  
      //DESCRIPTION
      $(o.querySelector(".sta-pressRelease-gh_fullNew")).html(obj.description);
      
      //DOWNLOAD BUTTON
      obj.pdf !== '' ?
        $(o.querySelector(".sta-pressRelease-gh_downloadButton")).attr("href", obj.pdf).show() :
        $(o.querySelector(".sta-pressRelease-gh_downloadButton")).hide();

      //REDES SOCIALES
      $('.sta-redes > .sta-fb',o).attr('href',url_fb);
      $('.sta-redes > .sta-tw',o).attr('href',url_tw);
      $('.sta-redes > .sta-linkedin',o).attr('href',url_linkedin);
      $('.sta-redes > .sta-whatsapp',o).attr('href',url_whatsapp);

      bool=true;
    }
    catch(err){
      console.trace(err);
    }
    return bool;
  };
  function open(obj){
    if(crearHtml(obj)){
      $('body').addClass('sta-noScroll')
      $o.fadeIn();
      location.hash = 'noticia_'+obj.id;
    }
  };
  function cerrarModal() {
    cleanHash();
    $o.fadeOut();
    $('body').removeClass('sta-noScroll');
  };
  $o.on('click', function (e) {
    if (e.target !== this) return;
    cerrarModal();
  });
  $('.sta-pressRelease-gh_backButton', o).click(function () {
    cerrarModal();
  });
  $(document).keydown(function (t) {
    if (t.keyCode == 27) cerrarModal();
  });

  return open;

})(document.querySelector('.tpl-pressRelease-gh'), jQuery, hotusa());

(function (o, $, h) {
  if (!o || !$ || !h) return false;

  var slide = o.querySelector('.sta-cabecera-gh_slide'),
    ev = function () {
      $(slide).slick({
        autoplay: true,
        autoplaySpeed: 5e3,
        fade: true,
        speed: 1e3,
        adaptiveHeight: true,
        prevArrow: null,
        nextArrow: slide.querySelectorAll('.slick-next')
      });
    },
    $btnPlay = $(o.querySelector('.sta-cabecera-gh_btn'));

  if ($btnPlay.data('video') && h.getQueryVariable('video') == 'on') $btnPlay.click();

  $(slide.querySelectorAll('.sta-cabecera-gh_contador')).attr('data-total', slide.children.length);

  if ($(o).hasClass('sta-logoFixed')) $(document.querySelector('.tpl-header-gh')).addClass('sta-logoFixed');

  if (slide.children.length > 1) {
    h.cargaScrollAuto({ obj: o, dual: true }, function () {
      h.cargarFicheroJS('/js/libraries/slick/slick.min.js', ev);
      $(o).addClass('sta-active');
    });
  };

})(document.querySelector('.tpl-cabecera-gh'), window.jQuery, window.hotusa && hotusa());

(function (a, $, h) {

  if (!a.length || !$ || !h) return false;

  var control = function (obj) {
    var bounding = obj.p.getBoundingClientRect(),
      wHeight = h.getWindowHeight(),
      wScrollTop = h.getScrollTop();

    if (bounding.bottom < 0 || bounding.bottom > wScrollTop + wHeight) {
      //fuera
      if (obj.class) {
        obj.$p.removeClass('inter')
        obj.class = false;
      };
    } else {
      //dentro
      if (!obj.class) {
        obj.$p.addClass('inter')
        obj.class = true;
      };

      var posiBotMod = bounding.bottom,
        porce2 = posiBotMod * 100 / wHeight;
      if (porce2 > 100) porce2 = 100;
      var trasnlate = ((obj.mov * 2 / 100) * porce2) - obj.mov;

      obj.$ani.css('transform', 'translateY(' + trasnlate + 'px)');
    }
  }

  for (var i = 0; i < a.length; i++) {
    (function (o) {
      var $o = $(o),
        move = 100,
        obj = {
          p: o,
          $p: $o,
          $ani: $(o.querySelector('.fn-parallax_abs')),
          mov: move,
          class: false
        };

      h.cargaScrollAuto({ obj: $o, dual: true, before: 200 }, function () {
        obj.$ani.css("background-image", "url('" + obj.$ani.data('bck') + "')");
        control(obj);
        $(window).scroll(function () {
          control(obj);
        })
      });
    })(a[i])
  };

})(document.querySelectorAll('.fn-parallax'), window.jQuery, window.hotusa && hotusa());

(function (o, $, h) {
  if (!o || !$ || !h) return false;

  var callBack = function () {
    var navSlide = o.querySelector('.sta-timelapse-gh_list'),
      cuerpSlide = o.querySelector('.sta-timelapse-gh_list2'),
      cargaImg = function (li) {
        var $bck = $(li.querySelector('.sta-timelapse-gh_img')),
          src = $bck.data('bck');

        if (src) {
          $bck
            .css('background-image', "url('" + src + "')")
            .append($('<img />', { src: src, class: 'imgOculta', alt: li.querySelector('.sta-timelapse-gh_title').innerText }))
            .data('bck', '');
        }
      };

    $(navSlide).slick({
      infinite: false,
      speed: 1e3,
      centerPadding: 0,
      slidesToShow: 1,
      centerMode: true,
      slidesToScroll: 1,
      swipeToSlide: true,
      focusOnSelect: true,
      asNavFor: cuerpSlide,
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 3,
          }
        }
      ]
    });

    cargaImg(cuerpSlide.querySelector('li'));

    $(cuerpSlide).slick({
      speed: 1e3,
      arrows: false,
      infinite: false,
      //fade: true,
      slidesToScroll: 1,
      adaptiveHeight: true,
      asNavFor: navSlide
    });


    $(cuerpSlide).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      cargaImg(slick.$slides[nextSlide]);
    });

  };

  h.cargaScrollAuto({ obj: o }, function () {
    $(o).addClass('sta-active');
    h.cargarFicheroJS('/js/libraries/slick/slick.min.js', callBack)
  });

})(document.querySelector('.tpl-timelapse-gh'), window.jQuery, window.hotusa && hotusa());

(function (o, $, h) {
  if (!o || !$ || !h) return false;

  var callBack = function () {
    var slide = o.querySelector('.sta-organChart-gh_slideContent'),
      dotParent = o.querySelector('.sta-organChart-gh_dots');

    $(slide).slick({
      infinite: false,
      dots: true,
      appendDots: dotParent,
      speed: 1e3,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipeToSlide: true,
      adaptiveHeight: true,
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 3,
            swipeToSlide: false,
            dots: false
          }
        }
      ]
    });

  };

  h.cargaScrollAuto({ obj: o }, function () {
    h.cargarFicheroJS('/js/libraries/slick/slick.min.js', callBack)
  });

})(document.querySelector('.tpl-organChart-gh'), window.jQuery, window.hotusa && hotusa());


//tpl-cabeText

(function (a, h) {
  if (!a.length || !h) return false;

  for (var i = 0; i < a.length; i++) {
    (function (o) {
      var ani = false,
        scroll = document.querySelector('html', 'body'),
        header = (function (abs) {
          if (!abs) return 0;
          return abs.offsetHeight;
        })(document.querySelector('.tpl-header .sta-header_abs'));

      if (o.classList.contains('sta-logoFixed')) {
        document.querySelector('.tpl-header').classList.add('sta-logoFixed');
      }
      window.addEventListener('mousewheel', function () {
        if (ani) scroll.stop;
      });

      h.cargaScrollAuto({ obj: o }, function () {
        var img = o.querySelector('.sta-cabeText_back'),
          back = img.dataset.bck;
        img.style.backgroundImage = "url('" + back + "')";
        o.classList.add('sta-active');
      });
      

    })(a[i])
  }

})(document.querySelectorAll('.tpl-cabeText'), window.hotusa && hotusa());

(function (a, $, h) {
  if (!a.length || !$ || !h) return false;

  var ev = function (o) {
    var $o = $(o),
      wistia = $o.data('video_wistia'),
      youtube = $o.data('video_youtube');

    if (!wistia && !youtube) return false;

    if (wistia) {
      (function () {
        $('<div></div>', { 'class': 'wistia_embed wistia_async_' + wistia, 'id': 'idWistia_' + wistia }).appendTo($o);
        window._wq = window._wq || [];

        _wq.push({
          id: 'idWistia_' + wistia,
          options: {
            endVideoBehavior: "loop",
            autoPlay: true,
            videoFoam: false,
            playButton: false,
            playbar: false,
            smallPlayButton: false,
            fullscreenButton: false,
            volumeControl: false,
            volume: 0
          },
          onReady: function (video) {
            video.bind("play", function (e) {
              $o.addClass('sta-videoActive');
            });
            video.play();
          }
        });

        h.cargarFicheroJS('https://fast.wistia.net/assets/external/E-v1.js');
      })();
    } else if (youtube) {
      (function () {
        var onPlayerReady = function (ev) {
          ev.target.unMute();
          ev.target.mute();
          ev.target.playVideo();
        },
          onPlayerStateChange = function (ev) {
            if (ev.data === YT.PlayerState.PLAYING) {
              vidRescale();
              if (first) {
                first = false;
                $(window).on('resize', function () {
                  vidRescale();
                });
              }
              $o.addClass('sta-videoActive');
              ev.target.mute();
            }
          },
          vidRescale = function () {
            var w = $o.width() + 200,
              h = $o.height() + 200;

            if (!obj.$frame) obj.$frame = $('.embed_youtube', $o);

            if (w / h > 16 / 9) {
              obj.player.setSize(w, w / 16 * 9);
              obj.$frame.css({ 'left': '0px' });
            } else {
              obj.player.setSize(h / 9 * 16, h);
              obj.$frame.css({ 'left': -(obj.$frame.outerWidth() - w) / 2 });
            }
          },
          obj = {
            player: null,
            $frame: false,
            json: {
              videoId: youtube,
              playerVars: {
                showinfo: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                enablejsapi: 1,
                playlist: youtube,
                loop: 1,
                controls: 0
              },
              events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
              }
            }
          },
          first = true;

        $o.append($('<div></div>', { 'class': 'embed_youtube', 'id': 'idYoutube_' + youtube }));
        h.cargaScrollAuto({ obj: $o, dual: true }, function () {
          h.cargarFicheroJS('https://www.youtube.com/iframe_api', function () {

            YT.ready(function () {
              obj.player = new YT.Player('idYoutube_' + youtube, obj.json);
            });
          });
        })
      })();
    };
  };

  for (var i = 0; i < a.length; i++) ev(a[i]);

})(document.querySelectorAll('.fn-video'), window.jQuery, window.hotusa && hotusa());

(function( a, $, h){
  if( !a.length || !$ || !h ) return false;

  var ev = function(o){
    var elements = o.querySelectorAll('.sta-proxEvents-gh_event');
    if (elements.length > 1) {
      h.cargaScrollAuto({obj:o,dual:true},function () {
        h.cargarFicheroJS('/js/libraries/slick/slick.min.js',function () {
          cargaSlide(o);
          $(o).addClass('sta-active');
        });
      });
    } else {
      h.cargaScrollAuto({obj:o,dual:true},function () {
        cargaImg(o);
        $(o).addClass('sta-active');
      });
    }
  },
  cargaSlide = function (o) {
    var slide = o.querySelector('.sta-proxEvents-gh_slideCont');
    $(slide).slick({
      dots: true,
      appendDots: o.querySelector('.sta-proxEvents-gh_dots'),
      arrows: false,
      autoplay: true,
      speed: 1000,
      fade: true,
      cssEase: 'linear'
    });

    cargaImg(slide.querySelector('.sta-proxEvents-gh_event'));

    $(slide).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      cargaImg(slick.$slides[nextSlide]);
    });

  },
  cargaImg = function(o){
    var $bkc = $(o.querySelector('.sta-proxEvents-gh_bkc')),
    src = $bkc.data('bkc');

    if( src ){
      $bkc
      .css('background-image', "url('" + src + "')")
      .append( $('<img />',{ class: 'imgOculta', alt: o.querySelector('.sta-proxEvents-gh_title').textContent, src : src }) )
      .data('bkc','');
    };
  };

  for (var i = 0; i < a.length; i++) ev(a[i]);

})( document.querySelectorAll('.tpl-proxEvents-gh'), window.jQuery, window.hotusa && hotusa() );

(function (o, $, h) {
  if (!o || !$ || !h) return false;

  var contImg = 2,
    ul = o.querySelector('.sta-awards-gh_list'),
    $ul = $(ul),
    lis = ul.children,
    srcLeft = $ul.data('img_left'),
    srcRight = $ul.data('img_right'),
    imgLeft = new Image(),
    imgRight = new Image(),
    fnImg = function () {
      contImg--;
      if (!contImg) ani();
    },
    ani = function () {
      $(lis).css('background-image', "url('" + srcLeft + "'),url('" + srcRight + "')");
      for (var i = 0; i < lis.length; i++) {
        (function ($li) {
          h.cargaScrollAuto({ obj: $li }, function () {
            $li.addClass('sta-active');
          });
        })($(lis[i]));
      };
    };

  imgLeft.onload = fnImg;
  imgRight.onload = fnImg;

  h.cargaScrollAuto({ obj: o }, function () {
    imgLeft.src = srcLeft;
    imgRight.src = srcRight;
  });

})(document.querySelector('.tpl-awards-gh'), window.jQuery, window.hotusa && hotusa());

(function (o, $, h) {
  if (!o || !$ || !h) return false;

  h.cargaScrollAuto({ obj: o, dual: true }, function () {
    $(o).addClass('sta-activo');
  });
})(document.querySelector('.tpl-logos-gh'), jQuery, hotusa());


(function (o, h) {
  if (!o || !h) return false;
  slide = function(s){
  var callback = function () {

    var swiperSup = new Swiper(navHeader, {
      speed: 1000,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      freeMode: true,
      slidesPerView: 1,
      breakpoints: {
        1101 : {
          centeredSlides: false,
          centerInsufficientSlides: true,
          slidesPerView: 4
        }
      },
      on: {
        init: function () {
          navHeader.querySelector('li').classList.add('sta-active');
        },
        click : function (swiper, event) {
          var li = event.target.closest('li'),
          siblings = Array.from(li.parentElement.children),
          n = siblings.indexOf(li);
          
          if( swiperInf.realIndex == n ) return false;

          swiperInf.slideTo(n);
          
          var remove = navHeader.querySelector('.sta-active');
          if( remove ) remove.classList.remove('sta-active');
          li.classList.add('sta-active');
        },
        slideChange: function (swiper) { 
          var activeIndex = swiper.activeIndex;
          swiperInf.slideTo(activeIndex);
        }
      }
    });

    var swiperInf = new Swiper(navSection, {
      speed: 1000,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      navigation: false,
      autoHeight: true,
      lazyLoading: true,
      lazy: true,
      on: {
        slideChange: function (swiper, ) {
          var activeIndex = swiper.activeIndex,
          remove = navHeader.querySelector('.sta-active'),
          siblings = Array.from(remove.parentElement.children);

          if( remove ) remove.classList.remove('sta-active'); 
          
          siblings[activeIndex].classList.add('sta-active');

          swiperSup.slideTo(activeIndex);
 
        }
      }
    });

    console.log(1)

  },
  navHeader = s.querySelector('article header .sta-slideGrupos_slide'),
  navSection = s.querySelector('.sta-slideGrupos_sectionNav');
 
  h.cargaScrollAuto({ obj: o }, function () {
    var load = 2,
    fn = function () {
      load--;
      if (!load) {
        callback();
      }
    }

    h.cargarFicheroCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', fn)
 
    h.cargarFicheroJS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', fn);

  });
}
for (var i = 0; i <o.length; i++) slide(o[i]);

o.forEach((module) => {
  const img = module.querySelectorAll('.sta-slideGrupos_bck'), 
  ev = function(d){
    h.cargaScrollAuto({obj:module, dual:true}, function(){
      const imgBack = new Image();
      imgBack.src = d.dataset.background;
      d.appendChild(imgBack);
    })
  }
  for (var i = 0; i < img.length; i++) ev(img[i]);
});

})(document.querySelectorAll('.tpl-slideGrupos'), window.hotusa && hotusa());

var openModal = (function (o, btns, $) {
  if (!o || !$) return false;

  var $o = $(o),
    $video = $(o.querySelector('iframe')),
    $html = $('html'),
    cell = o.querySelector('.sta-modalVideo-gh_cell'),
    bOpen = false,
    close = function () {
      bOpen = false;
      $o.fadeOut(1000, function () {
        $video.removeAttr('src');
        $html.removeClass('sta-noScroll');
      });
    },
    _open = function (src) {
      bOpen = true;
      $html.addClass('sta-noScroll');
      $video.attr('src', src);
      $o.fadeIn(1000);
    };

  $(o.querySelector('.sta-modalVideo-gh_bClose')).click(close);
  $o.click(function (e) {
    if (e.target === cell) close();
  });
  $(document).keydown(function (e) {
    if (bOpen && e.keyCode === 27) close();
  });

  for (var i = 0; i < btns.length; i++) {
    (function ($bt) {
      var src = $bt.data('video');

      if (src) {
        $bt.click(function () {
          _open(src);
        })
      }
    })($(btns[i]));

  };

  return _open;

})(document.querySelector('.tpl-modalVideo-gh'), document.querySelectorAll('.fn-openModal'), window.jQuery);

(function (a, btns, $, h) {

  if (!a.length || !$ || !h) return false;

  var eventos = function (o) {
    $(o.querySelector(".sta-modalTexto-gh_bClose")).click(function () {
      close(o);
    });

    var out = o.querySelector(".sta-modalTexto-gh_cell");
    $(out).click(function (e) {
      if (e.target === out) close(o);
    });
  },
    close = function (_o) {
      _open = false;
      $(_o).fadeOut(1000, function () {
        $scroll.removeClass('sta-noScroll');
        if (typeof _close == 'function') _close();
        _close = false;
      });
    },
    open = function (_o, obj) {
      if (!_o) return false;

      var $v = $(_o);
      if (!$v.length) return false;

      if (obj && typeof obj.before == 'function') obj.before();

      _close = obj && typeof obj.after == 'function'
        ? obj.after
        : false;

      _open = $v;
      $scroll.addClass('sta-noScroll')
      $v.fadeIn(1000);
    },
    eventsBtns = function ($b) {
      var id = $b.data('modal'),
        modal = document.querySelector('div[id="' + id + '"]');
      if (id && modal) {
        $b.click(function (e) {
          e.preventDefault();
          open(modal);
        });
      }
    };

  var $scroll = $(document.querySelector("html")),
    _close = false,
    _open = false;

  for (var i = 0; i < a.length; i++) eventos(a[i]);

  for (var i = 0; i < btns.length; i++) eventsBtns($(btns[i]));

  $(window).keydown(function (e) {
    if (e.keyCode == 27 && _open) close(_open);
  });

  var mQuery = h.getQueryVariable('m');

  if(mQuery){
   open(document.getElementById(mQuery));
  }

  return open;

})(document.querySelectorAll('.tpl-modalTexto-gh'), document.querySelectorAll('.fn-openModalTexto'), window.jQuery, window.hotusa && hotusa());

(function (a, $, h) {
  if (!a.length || !$ || !h) return false;

  var ev = function (o) {
    var elems = o.querySelectorAll('.sta-infoCard-gh_elems');

    for (var i = 0; i < elems.length; i++) ev2(elems[i]);
  },
    ev2 = function (o) {
      var $bkc = $(o.querySelector('.sta-infoCard-gh_bck')),
        src = $bkc.data('bck'),
        $img = $('<img />', { class: 'imgOculta', alt: $bkc.data('title') });

      if (src) {
        h.cargaScrollAuto({ obj: o, dual: true }, function () {
          $bkc
            .css('background-image', "url('" + src + "')")
            .append($img.attr('src', src));
            $(o).addClass('sta-animate');
        })
      };
    };

  for (var i = 0; i < a.length; i++) ev(a[i]);

})(document.querySelectorAll('.tpl-infoCard-gh'), window.jQuery, window.hotusa && hotusa());

//tpl-columnText
(function (a, h) {
  if (!a.length || !h) return false;
  var fn = function (o) {
    h.cargaScrollAuto({ obj: o, dual: true }, function () {
      o.classList.add('sta-animate');
    });
  }
  for (var i = 0; i < a.length; i++) fn(a[i]);
})(document.querySelectorAll('.tpl-columnText'), window.hotusa && hotusa());


(function (a, $, h) {
  if (!a.length || !$ || !h) return false;

  var fn= function(o){
    h.cargaScrollAuto({ obj: o, dual: true }, function () {
      $(o).addClass('sta-animate');
    });
  }

  for (var i = 0; i < a.length; i++) fn(a[i]);

})(document.querySelectorAll('.tpl-article-gh'), window.jQuery, window.hotusa && hotusa());

(function (a, $, h) {
  if (!a.length || !$ || !h) return false;

  var ev = function (o) {
    var elems = o.querySelectorAll('.sta-pressCard-gh_cardElement');

    for (var i = 0; i < elems.length; i++) ev2(elems[i]);
  },
    ev2 = function (o) {
      var $bkc = $(o.querySelector('.sta-pressCard-gh_bkc')),
        src = $bkc.data('bkc'),
        $img = $('<img />', { class: 'imgOculta', alt: $bkc.data('title') });

      if (src) {
        h.cargaScrollAuto({ obj: o, dual: true }, function () {
          $bkc
            .css('background-image', "url('" + src + "')")
            .append($img.attr('src', src));
        })
      };
    };

  for (var i = 0; i < a.length; i++) ev(a[i]);

})(document.querySelectorAll('.tpl-pressCard-gh'), window.jQuery, window.hotusa && hotusa());

(function (o, $, h, _) {

  if (!o || !$ || !h || !_) return false;

  var form = o.querySelector('form'),
    url = $(form).attr('action'),
    obj = {
      name: {
        o: form.name
      },
      email: {
        type: 'mail',
        o: form.email
      },
      phone: {
        o: form.phone
      },
      company: {
        o: form.company
      },
      commentary: {
        o: form.commentary
      },
      politics: {
        o: form.politics
      },
      errors: {
        $o: $(o.querySelector('.sta-form-gh_error')),
        $empty: $('<li></li>').text(form.e_empty.value),
        $email: $('<li></li>').text(form.e_email.value),
        $poli: $('<li></li>').text(form.e_politics.value),
        $ok: $('<li></li>').text(form.e_ok.value)
      },
      oblig: []
    },
    valid = function () {
      var envio = true,
        empty = false,
        email = false,
        poli = false;

      obj.errors.$o.removeClass('sta-ko sta-ok').empty();

      for (var i = 0; i < obj.oblig.length; i++) {
        (function (elem) {
          switch (elem.type) {
            //format mail
            case 'mail':
              if (!h.mail(elem.o.value.trim())) {
                email = true;
                envio = false;
                elem.$o.addClass('sta-ko');
              } else {
                elem.$o.removeClass('sta-ko');
              };
              break;

            //empty only
            default:
              if (!elem.o.value.trim()) {
                empty = true;
                envio = false;
                elem.$o.addClass('sta-ko');
              } else {
                elem.$o.removeClass('sta-ko')
              }
              break;
          };
        })(obj.oblig[i]);
      };

      if (!obj.politics.o.checked) {
        envio = false;
        poli = true;
        obj.politics.$o.addClass('sta-ko');
      } else {
        obj.politics.$o.removeClass('sta-ko');
      }

      if (empty) obj.errors.$o.append(obj.errors.$empty).addClass('sta-ko');
      if (email) obj.errors.$o.append(obj.errors.$email).addClass('sta-ko');
      if (poli) obj.errors.$o.append(obj.errors.$poli).addClass('sta-ko');

      return envio;

    },
    enviar = function () {
      var _tmp = {
        d: {
          name: obj.name.o.value.trim(),
          email: obj.email.o.value.trim(),
          phone: obj.phone.o.value.trim(),
          company: obj.company.o.value.trim(),
          commentary: obj.commentary.o.value.trim(),
        }
      };

      $.ajax({
        type: 'POST',
        async: false,
        url: url,
        data: JSON.stringify(_tmp),
        success: function (n) {
          switch (n) {
            case 'OK':
              form.reset();
              obj.errors.$o.append(obj.errors.$ok).addClass('sta-ok');
              break;
            case 'ERR':
              console.trace("Not template", n);
              break;
            case 'KO - Error Formato Datos JSON':
            case 'KO':
            default:
              console.trace(n);
              break;
          };
        },
        error: function (n) {
          console.trace("ERROR:", n);
        }
      });
    };

  //obligatorios && $o
  (function () {
    obj.oblig.push(obj.name, obj.company, obj.email, obj.phone);

    _.forOwn(obj, function (value, key) {
      if (key == 'errors' || key == 'oblig') return true;
      value.$o = $(value.o);
    });
  })();

  //event text full
  (function () {
    var arrText = [obj.name, obj.company, obj.email, obj.phone, obj.commentary]
    for (var i = 0; i < arrText.length; i++) {
      (function ($inp) {
        $inp.change(function () {
          this.value.trim()
            ? $inp.addClass('sta-fill')
            : $inp.removeClass('sta-fill');
        })
      })(arrText[i].$o);
    };
  })();

  //event change in oblig
  (function (oblig) {
    function ev(elem) {
      switch (elem.type) {
        //format mail
        case 'mail':
          $(elem.o).change(function () {
            h.mail(this.value.trim())
              ? elem.$o.removeClass('sta-ko')
              : elem.$o.addClass('sta-ko');
          });
          break;

        //empty only
        default:
          $(elem.o).change(function () {
            this.value.trim()
              ? elem.$o.removeClass('sta-ko')
              : elem.$o.addClass('sta-ko');
          });
          break;
      };
    };
    for (var i = 0; i < oblig.length; i++) ev(oblig[i]);
  })(obj.oblig);



  $(form).submit(function (e) {
    e.preventDefault();
    if (valid()) enviar()
  });

})(document.querySelector('.tpl-form-gh'), window.jQuery, window.hotusa && hotusa(), window._);

(function ($, h) {
  if (!$ || !h) return false;

  var arrMods = [
    '.tpl-liServices-gh'
  ],
    mods = document.querySelectorAll(arrMods.join(','));

  for (var i = 0; i < mods.length; i++) {
    (function (o) {
      h.cargaScrollAuto({ obj: o, dual: true }, function () {
        $(o).addClass('sta-active');
      });
    })(mods[i]);
  };
})(window.jQuery, window.hotusa && hotusa());

(function (a, $, h) {

  if (!a || !$ || !h) return false;

  for (var i = 0; i < a.length; i++) {
    (function (o) {
      var $img = $(o.querySelector('.sta-boxInfo-gh_imgAbs')),
        imgback = $img.data('back'),
        alt = o.querySelector('.sta-boxInfo-gh_textContainer header').textContent.trim();
      h.cargaScrollAuto({ obj: o }, function () {
        $(o).addClass('sta-active');
        $img
          .css('background-image', "url('" + imgback + "')")
          .append($('<img />', { src: imgback, class: 'imgOculta', alt: alt }));
      })
    })(a[i])
  };
})(document.querySelectorAll('.tpl-boxInfo-gh'), window.jQuery, window.hotusa && hotusa());

(function (o, $, h, _) {

  if (!o || !$ || !h || !_) return false;

  var form = o.querySelector('form'),
  url = $(form).attr('action'),
  obj = {
    name: {
      o: form.name
    },
    surnames: {
      o: form.surnames
    },
    email: {
      type: 'mail',
      o: form.email
    },
    phone: {
      o: form.phone
    },
    commentary: {
      o: form.commentary
    },
    politics: {
      o: form.politics
    },
    file: {
      o: form['file[]'],
      text: form.querySelector('.sta-formCV-gh_text.sta-text'),
      ext : ['application/pdf']
    },
    errors: {
      $o: $(o.querySelector('.sta-formCV-gh_error')),
      $empty: $('<li></li>').text( form.e_empty.value ),
      $email: $('<li></li>').text( form.e_email.value ),
      $poli: $('<li></li>').text( form.e_politics.value ),
      $fileExt: $('<li></li>').text( form.e_attached.value ),
      $fileSize: $('<li></li>').text( form.e_attachedSize.value ),
      $ok: $('<li></li>').text( form.e_ok.value )
    },
    oblig: []
  },
  valid = function () {
    var envio = true,
    empty = false,
    email = false,
    poli = false,
    fileSize = false,
    fileExt = false;

    obj.errors.$o.removeClass('sta-ko sta-ok').empty();

    for (var i = 0; i < obj.oblig.length; i++) {
      (function (elem) {
        switch (elem.type) {
          //format mail
          case 'mail':
            if (!h.mail(elem.o.value.trim())) {
              email = true;
              envio = false;
              elem.$o.addClass('sta-ko');
            } else {
              elem.$o.removeClass('sta-ko');
            };
            break;

          //empty only
          default:
            if (!elem.o.value.trim()) {
              empty = true;
              envio = false;
              elem.$o.addClass('sta-ko');
            } else {
              elem.$o.removeClass('sta-ko')
            }
            break;
        };
      })(obj.oblig[i]);
    };

    //files
    (function( file ){
      var files = file.o.files,
      sizeTotal = 0;

      for (var i = 0; i < files.length; i++) {
        (function( file ){
          var size = file.size;//bytes
          sizeTotal += size;
          
          if( obj.file.ext.indexOf( file.type ) < 0 ){
            fileExt = true;
            envio = false;
          };

          //10Mb max por archivo
          if( parseInt( size / (1024 * 1024) ) > 10 ){
            fileSize = true;
            envio = false;
          };
        
        })( files[i] );
      };

      //25Mb max total archivos
      if( parseInt( sizeTotal / (1024 * 1024) ) > 25 ){
        fileSize = true;
        envio = false;
      };

      fileExt || fileSize ? file.$o.parent().addClass('sta-ko') : file.$o.parent().removeClass('sta-ko');

    })( obj.file );


    if (!obj.politics.o.checked) {
      envio = false;
      poli = true;
      obj.politics.$o.addClass('sta-ko');
    } else {
      obj.politics.$o.removeClass('sta-ko');
    }

    if (empty) obj.errors.$o.append(obj.errors.$empty);
    if (email) obj.errors.$o.append(obj.errors.$email);
    if (fileExt) obj.errors.$o.append(obj.errors.$fileExt);
    if (fileSize) obj.errors.$o.append(obj.errors.$fileSize);
    if (poli) obj.errors.$o.append(obj.errors.$poli);

    if (!envio) obj.errors.$o.addClass('sta-ko');

    return envio;

  },
  enviarArchivo = function(){
    var fd = new FormData( form );
    
    $.ajax({
      url: url,
      type: 'POST',
      data: fd,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success:
      function(c){
        switch(c){
          case 'OK':
            form.reset();
            obj.file.text.innerText = '';
            obj.errors.$o.append(obj.errors.$ok).addClass('sta-ok');
            break;
          case 'ERR':
            console.trace("Not template", c);
            break;
          case 'KO - Error Formato Datos JSON':
          case 'KO':
          default:
            console.trace(c);
            break;
        };
      },
      error: function (c) {
        console.trace("ERROR:", c);
      }
    });
  };

  //obligatorios && $o
  (function () {
    obj.oblig.push(obj.name, obj.surnames, obj.email, obj.phone, obj.file);

    _.forOwn(obj, function (value, key) {
      if (key == 'errors' || key == 'oblig') return true;
      value.$o = $(value.o);
    });

    obj.file.$o = obj.file.$o.parent();
  })();

  //event text full
  (function () {
    var arrText = [obj.name, obj.surnames, obj.email, obj.phone, obj.commentary]
    for (var i = 0; i < arrText.length; i++) {
      (function ($inp) {
        $inp.change(function () {
          this.value.trim()
            ? $inp.addClass('sta-fill')
            : $inp.removeClass('sta-fill');
        })
      })(arrText[i].$o);
    };
  })();

  //event change in oblig
  (function (oblig) {
    function ev(elem) {
      switch (elem.type) {
        //format mail
        case 'mail':
          $(elem.o).change(function () {
            h.mail(this.value.trim())
              ? elem.$o.removeClass('sta-ko')
              : elem.$o.addClass('sta-ko');
          });
          break;

        //empty only
        default:
          $(elem.o).change(function () {
            this.value.trim()
              ? elem.$o.removeClass('sta-ko')
              : elem.$o.addClass('sta-ko');
          });
          break;
      };
    };
    for (var i = 0; i < oblig.length; i++) ev(oblig[i]);
  })(obj.oblig);

  //event change file
  (function( inp ){
    $(inp).on('change',function(){
      obj.file.$o.parent().removeClass('sta-ko');
      
      var str = '',
      files = this.files;

      for (var i = 0; i < files.length; i++) {
        str += files[i].name;
        if( i < files.length - 1 ) str += ', ';
      }
      obj.file.text.innerText = str;
    })
  })( obj.file.o );


  $(form).submit(function (e) {
    e.preventDefault();
    if (valid()) enviarArchivo()
  });

})(document.querySelector('.tpl-formCV-gh'), window.jQuery, window.hotusa && hotusa(), window._);

(function (a, $, h) {
  if (!a.length || !$ || !h) return false;

  var ev = function (o) {
    if (o.classList.contains('v3')) {
      var $bkc = $(o.querySelector('.sta-banner-gh_imgAbs')),
        src = $bkc.data('bck'),
        $img = $('<img />', { class: 'imgOculta' });

      if (src) {
        h.cargaScrollAuto({ obj: o, dual: true }, function () {
          $bkc
            .css('background-image', "url('" + src + "')")
            .append($img.attr('src', src));
        })
      };
    }
  };
  for (var i = 0; i < a.length; i++) ev(a[i]);

})(document.querySelectorAll('.tpl-banner-gh'), window.jQuery, window.hotusa && hotusa());

(function (a, $, h){
  if (!a.length || !$ || !h) return false;

  var fn = function(o){
    var $img = $( o.querySelector('img') ),
    src = $img.data('src');

    h.cargaScrollAuto({obj:o,dual:true},function(){
      $img.attr('src',src);
    })
  };

  for (var i = 0; i < a.length; i++) fn( a[i] );

})(document.querySelectorAll('.tpl-banner2-gh'), window.jQuery, window.hotusa && hotusa());

(function (o, $, h, servlet) {
    if (!o || !$ || !h ) return false;

    function dobleCero(num) {
      var tam = num.toString().length;
      if (tam < 2) num = '0' + num;
      return num;
    };
    function crearHtml(obj) {
      var $html = $backup.clone(),
      $img = $('<img />', { class: 'imgOculta', alt: obj.title });

      //IMAGEN
      $($html[0].querySelector(".sta-pressCard-gh_bkc"))
        .css('background-image', "url('" + obj.image + "')")
        .append($img.attr('src', obj.image))

      //FECHA
      var fecha = new Date(obj.date);
      $($html[0].querySelector(".sta-pressCard-gh_date")).text(dobleCero(fecha.getDate()) + '/' + dobleCero(fecha.getMonth()+1) + '/' + fecha.getFullYear());

      //TITULO
      $($html[0].querySelector(".sta-pressCard-gh_textTitle")).text(obj.title);

      //GENERAMOS URL CON HASH EN CADA NOTICIA
      var tmp = $($html[0].querySelector(".sta-pressCard-gh_enlace")).attr('href');
      $($html[0].querySelector(".sta-pressCard-gh_enlace")).attr('href',tmp+'#noticia_'+obj.id);

      return $html;
    };
    function combinarDatos(_json,fn) {
      var _jsonTemp = _json,
        keys = _.keys(_json);

      //combinamos
      for (var i = 0; i < keys.length; i++) {

        if (jsonGeneral[keys[i]].totalNews > 0 && _jsonTemp[keys[i]].news && _jsonTemp[keys[i]].news.length) {
          jsonGeneral[keys[i]].news = jsonGeneral[keys[i]].news.concat(_jsonTemp[keys[i]].news);
          jsonGeneral.all.news = jsonGeneral.all.news.concat(_jsonTemp[keys[i]].news);
        };
        jsonGeneral[keys[i]].loadNextPage = _jsonTemp[keys[i]].loadNextPage;
        if (jsonGeneral[keys[i]].loadNextPage) jsonGeneral.all.loadNextPage = true;

      };

      //control sobre idioma all
      if (idiomaAll) {
        idioma_select = 'all';
        idiomaAll = false;
      };

      $o.removeClass('sta-loading');

      typeof fn === 'function' ? fn() : cargarNoticias();
    };
    function cargarNoticias() {
      for (var i = 0; i < max && cargados < jsonGeneral[idioma_select].news.length; i++, cargados++) {
        $lista.append(crearHtml(jsonGeneral[idioma_select].news[cargados]));
      };

      if (paginacionMod && (cargados < jsonGeneral[idioma_select].news.length || jsonGeneral[idioma_select].loadNextPage) && !paginacionActive) {

        $paginacionMod.removeClass('sta-hide');
        paginacionActive = true;

      } else if (paginacionMod && cargados >= jsonGeneral[idioma_select].news.length && paginacionActive) {
        if (!jsonGeneral[idioma_select].loadNextPage) {
          $paginacionMod.addClass('sta-hide');
          paginacionActive = false;
        }
      };
    };
    function cargamosMore(fn) {
      if (cargados < jsonGeneral[idioma_select].news.length) {
        //faltan por cargar
        cargarNoticias();
        fn();
      } else if (cargados >= jsonGeneral[idioma_select].news.length && jsonGeneral[idioma_select].loadNextPage) {
        paginacionRuta++;
        $o.addClass('sta-loading');
        $paginacionMod.addClass('sta-hide');
        paginacionActive = false;
        if (idioma_select == 'all') {
          idiomaAll = true;
          idioma_select = 'ES';
        };

        if(fn){
          h.cargarJSON(ruta(), function(json){
            combinarDatos(json,fn);
          });
        }else{
          h.cargarJSON(ruta(), combinarDatos);
        }
      };
    };
    function cargarPaginacion() {
      $(paginacionMod.querySelector('.sta-pagOpi-gh_cargarMas')).click(cargamosMore);
    };
    function checkHash(_json){
      var locationHash = window.location.hash,
      hash = locationHash.includes('noticia_') && locationHash.split('_')[1],
      numberRequest = 0;
      if(hash){
        filteredObject = _.find(_json[idioma_act].news, function(e){return e.id === parseInt(hash)});
        if(!filteredObject && numberRequest < 1){
          cargamosMore(function(){checkHash(_json)});
          numberRequest++;
          $paginacionMod.removeClass('sta-hide');
          paginacionActive = true;
        }else{
          filteredObject && servlet( filteredObject );
        }
      }
    };
    var $o = $(o),
      jsonGeneral = false,
      paginacionMod = document.querySelector('.tpl-pagOpi-gh'),
      $paginacionMod = $(paginacionMod),
      paginacionActive = false,
      idioma_act = $('html').attr('lang').toUpperCase(),
      $lista = $(o.querySelector('.sta-pressCard-gh_cardList')),
      $backup = $('.sta-pressCard-gh_cardElement', $lista).clone().removeClass('sta-oculto'),
      idioma_select = idioma_act,
      idiomaAll = false,
      paginacionRuta = 1,
      homeNews = $o.hasClass('sta-maxThree'),
      noPetition = $o.hasClass('sta-noPress'),
      max = homeNews ? 3 : 10,
      cargados = 0,
      ruta = function () {
        return '/api/cms/press_releases/get/news/' + paginacionRuta + '/' + idioma_act
      },
      callback = function (_json) {
        jsonGeneral = _json;

        var keys = _.keys(jsonGeneral);

        jsonGeneral.all = { news: [], loadNextPage: false, totalNews: 0 };

        //continuamos si hay idiomas
        if (keys.length) {

          //creamos all
          for (var i = 0; i < keys.length; i++) {
            if (jsonGeneral[keys[i]].totalNews > 0 && jsonGeneral[keys[i]].news && jsonGeneral[keys[i]].news.length) {
              jsonGeneral.all.news = jsonGeneral.all.news.concat(jsonGeneral[keys[i]].news);
              jsonGeneral.all.totalNews += jsonGeneral[keys[i]].totalNews;
              if (jsonGeneral[keys[i]].loadNextPage) jsonGeneral.all.loadNextPage = true;
            };
          };


          $o.removeClass('sta-loading');
          checkHash(_json);
          cargarNoticias();

          if (paginacionMod && !homeNews) cargarPaginacion();
        } else {
          $o.remove();
          console.trace('Sin noticias');
        };
      };

    $lista.empty();
    if(!noPetition)  {
      h.cargarJSON(ruta(), callback);
      //BOTON MODAL
      if(servlet){
        window.onhashchange = function(){
          checkHash( jsonGeneral );
        }
      }
    }
})(document.querySelector('.tpl-pressCard-gh'), window.jQuery, window.hotusa && hotusa(), window.servlet);

/*Inicio .tpl-iconText-gh*/
(function(a, $, h) {

  if(!a.length || !$ || !h) return false;

  for (var i = 0; i < a.length; i++) {
    (function($o) {
      h.cargaScrollAuto({obj:$o}, function() {
        $o.addClass('sta-active');
      })
    })( $(a[i]) );
  }

})(document.querySelectorAll('.tpl-iconText-gh'), window.jQuery, window.hotusa && hotusa());
/*Fin .tpl-iconText-gh*/

/*Inicio .tpl-article2-gh*/
(function(a, $, h) {

  if(!a.length || !$ || !h) return false;

  for (var i = 0; i < a.length; i++) {
    (function(o) {
      h.cargaScrollAuto({obj:o}, function() {
        $(o).addClass('sta-active');
      })
    })(a[i])
  }
})(document.querySelectorAll('.tpl-article2-gh'), window.jQuery, window.hotusa && hotusa());
/*Fin .tpl-article2-gh*/

/*Inicio .tpl-text-gh*/
(function(a, $, h) {

  if(!a.length || !$ || !h) return false;

  for (var i = 0; i < a.length; i++) {
    (function(o) {
      h.cargaScrollAuto({obj:o,dual:true}, function() {
        $(o).addClass('sta-active');
      })
    })(a[i])
  }
})(document.querySelectorAll('.tpl-text-gh'), window.jQuery, window.hotusa && hotusa());
/*Fin .tpl-text-gh*/


/* INICIO .tpl-boxesOpen-gh*/
(function (a, $, h) {
  if (!a.length || !$ || !h) return false;

  var animationTime = 550,
  animatePermitted = true,
  hideSibling = function (sibling) {
    $(sibling).animate({
      height: 0,
      opacity: 0
    }, animationTime, 'linear', function () {
      sibling.style.display = 'none';
      sibling.style.height = '';
      sibling.style.opacity = '';
    });
  },
  goSmall = function (s) {
    s.style.width = '';
    s.style.marginLeft = '';

    var endWidth = s.offsetWidth,
    endMargin = parseInt(window.getComputedStyle(s).marginLeft),
    initWidth = s.parentElement.offsetWidth;

    s.style.width = initWidth + 'px';
    s.style.marginLeft = '0';

    $(s).animate({
      width: endWidth,
      marginLeft: endMargin
    }, animationTime, 'linear')

  },
  goBig = function (s) {
    var totalWidth = s.parentElement.offsetWidth;

    $(s).animate({
      width: totalWidth,
      marginLeft: 0
    }, animationTime, 'linear')
  },
  showSibling = function (sibling) {
    //sibling.style.opacity = 0;
    //sibling.style.display = '';
    var totalHeight = sibling.offsetHeight;
    //sibling.style.height = 0;

    $(sibling).slideDown(animationTime, 'linear');


    /*h.animate({
      elem: sibling,
      draw: function (progress) {
        sibling.style.opacity = progress;
        sibling.style.height = (totalHeight * progress) + 'px';
      },
      duration: animationTime,
      callback: function () {
        sibling.style.opacity = '';
        sibling.style.height = '';
      }

    })*/
  },
  closeSibling = function (s) {
    var totalWidth = s.offsetWidth,
    $s = $(s),
    art = s.querySelector('article');

    art.style.width = totalWidth + 'px';

    $s.animate({
      width: 0,
      marginLeft: 0,
      opacity: 0
    },animationTime,'linear',function () {
      s.style.display = 'none';
      s.style.width = '';
      s.style.marginLeft = '';
      s.style.opacity = '';
    });
  },
  openSibling = function (s) {
    s.style.marginLeft = '';
    s.style.display = '';
    s.style.width = '';

    var endWidth = s.offsetWidth,
    endMargin = parseInt(window.getComputedStyle(s).marginLeft),
    art = s.querySelector('article');

    s.style.marginLeft = '0';
    s.style.width = '0';

    $(s).animate({
      width: endWidth,
      marginLeft: endMargin,
      opacity: 1
    }, animationTime, 'linear', function (){
      art.style.width = '';
    });
  },
  expandSection = function (s) {
    var test = s.parentElement.parentElement;
    test.style.width = '100%';
    test.style.marginLeft = '0';

    $(s).slideDown(animationTime, 'linear', function (){
      animatePermitted = true;
    })

    test.style.width = '';
    test.style.marginLeft = '';

    if (!mobile) goBig(s.parentElement.parentElement);
  },
  constraintSection = function (s) {
    $(s).slideUp(animationTime, 'linear', function () {
      animatePermitted = true;
    })

    if (!mobile) goSmall(s.parentElement.parentElement)
  },
  open = function (aBtns, siblings, section, siblings2) {
    aBtns[0].classList.add('js-hide')
    aBtns[1].classList.remove('js-hide')

    //recorriendo hermanos para ocultar
    expandSection(section);
    if (siblings2) for (var i = 0; i < siblings2.length; i++) closeSibling(siblings2[i]);
    for (var i = 0; i < siblings.length; i++) hideSibling(siblings[i]);
  },
  close = function (aBtns, siblings, section, siblings2) {
    aBtns[0].classList.remove('js-hide');
    aBtns[1].classList.add('js-hide');
    constraintSection(section)
    if (siblings2) for (var i = 0; i < siblings2.length; i++) openSibling(siblings2[i]);
    for (var i = 0; i < siblings.length; i++) showSibling(siblings[i]);
  },
  mobile = (function (o) {
    var a = o.querySelector('.sta-boxesOpen-gh_list');

    if (!a) return false;

    return window.getComputedStyle(a).display == 'block';
  })(a[0]),
  ev = function (o) {
    if (o.classList.contains('sta-oculto')) return false;
    var articles = o.querySelectorAll('.sta-boxesOpen-gh_arti'),
    arrayArticles = Array.from(articles);
    if (articles.length == 1) {
      o.classList.add('js-only_one');
      return false
    }
    for (var i = 0; i < articles.length; i++) {
      (function (article, position) {
        var btnShow = article.querySelector('.fn-open'),
        btnHide = article.querySelector('.fn-close'),
        siblings = arrayArticles.filter(function (e) {
          return e !== article;
        }),
        section = article.querySelector('section'),
        siblingsDesk = [];

        switch ((position + 1) % 3) {
          case 0://esto es cuando es el tercero
            siblingsDesk.push(arrayArticles[position - 1], arrayArticles[position - 2])
            break;
          case 1://esto es el primero
            if (arrayArticles[position + 1]) siblingsDesk.push(arrayArticles[position + 1])
            if (arrayArticles[position + 2]) siblingsDesk.push(arrayArticles[position + 2])
            break;
          case 2://esto es el segundo
            siblingsDesk.push(arrayArticles[position - 1])
            if (arrayArticles[position + 1]) siblingsDesk.push(arrayArticles[position + 1])
            break;
        }
        var siblings2 = arrayArticles.filter(function (e) {
          return e !== siblingsDesk[0] && e !== siblingsDesk[1] && e !== article;
        })

        btnShow.addEventListener('click', function (e) {
          if (!animatePermitted) return false;
          animatePermitted = false;
          mobile
            ? open([btnShow, btnHide], siblings, section)
            : open([btnShow, btnHide], siblings2, section, siblingsDesk);
        });
        btnHide.addEventListener('click', function () {
          if (!animatePermitted) return false;
          animatePermitted = false;
          mobile
            ? close([btnShow, btnHide], siblings, section)
            : close([btnShow, btnHide], siblings2, section, siblingsDesk);
        });
      })(articles[i], i);
    }
  }
  for (var i = 0; i < a.length; i++) ev(a[i])
})(document.querySelectorAll('.tpl-boxesOpen-gh'), window.jQuery, window.hotusa && hotusa());
/* FIN .tpl-boxesOpen-gh*/


var openModalMultiVideos = (function (o, btns, $, h) {
  if (!o || !$ || !h) return false;

  function ocultarFlechas() {
      $buttonRight.addClass("sta-disabled");
      $buttonLeft.addClass("sta-disabled");

      if (li.length * anchoLi > anchoUl) {
          $buttonRight.removeClass("sta-disabled");
      }
      if ($ul.scrollLeft()) $buttonLeft.removeClass("sta-disabled")
  }
  function changeMov(accion) {
      animation = false;
      $ul.animate({ scrollLeft: $ul.scrollLeft() + (accion * anchoUl) }, 1e3, function () {
          $ul.scrollLeft()
              ? $buttonLeft.removeClass("sta-disabled")
              : $buttonLeft.addClass("sta-disabled");

          ($ul.scrollLeft() + anchoUl >= anchoLi * li.length - 2)
              ? $buttonRight.addClass("sta-disabled")
              : $buttonRight.removeClass("sta-disabled");

          animation = true;
      });
  }
  function cargarYoutube(id) {
      var html = $('<div></div>', { 'class': 'embed_youtube', 'id': 'idYoutube_' + id });
      $video.html(html);

      var player,
          _obj = {
              videoId: id,
              playerVars: { 
                modestbranding: 1,
                'autoplay': 1,
               },
              events: {
                  onReady: function (e) {
                      player = _obj.player;
                      e.target.playVideo()
                  }
              }
          }
      if (!youtubeCargada) {
          h.cargarFicheroJS('https://www.youtube.com/iframe_api',
              function () {
                  youtubeCargada = true;
                  $o.addClass("sta-visible");
                  YT.ready(function () {
                      player = new YT.Player('idYoutube_' + _obj.videoId, _obj);
                  });

              });
      } else {
          YT.ready(function () {
              player = new YT.Player('idYoutube_' + _obj.videoId, _obj);
          });
      }
  }
  function cargarWistia(id) {

      var html = $('<div></div>', { 'class': 'wistia_embed wistia_async_' + id, 'id': 'idWistia_' + id });
      $video.html(html);

      if (!wistiaCargada) {
          wistiaCargada = true;
          h.cargarFicheroJS('https://fast.wistia.net/assets/external/E-v1.js', function () {
              $o.addClass("sta-visible");
          });
      }


      window._wq = window._wq || [];

      var _temp = 'idWistia_' + id,
          _temp2 = {},
          _temp3 = {
              autoPlay: true,
              videoFoam: false,
              playButton: false,
              playbar: true,
              playerColor: "002a46",
              smallPlayButton: true,
              fullscreenButton: true,
              volumeControl: true

          };
      _temp2[_temp] = _temp3;
      _wq.push(_temp2);

  }

  var $o = $(o),
  $html = $('html'),
  cell = o.querySelector('.sta-modalVideoMulti-gh_cell'),
  bOpen = false,
  $ul = $(o.querySelector(".sta-modalVideoMulti-gh_lista")),
  li = o.querySelectorAll(".sta-modalVideoMulti-gh_listaVideo"),
  $liButtomFirst = $(o.querySelector(".sta-modalVideoMulti-gh_listaVideo button")),
  anchoLi = (function ($ancho) {
      $(window).resize(function () {
          anchoLi = $ancho.outerWidth(true);
      })
      return $ancho.outerWidth(true);
  })($(o.querySelector(".sta-modalVideoMulti-gh_listaVideo"))),
  anchoUl = (function ($ancho) {
      $(window).resize(function () {
          anchoUl = $ancho.width();
      })
      return $ancho.width();
  })($ul),
  $buttonLeft = $(o.querySelector(".sta-modalVideoMulti-gh_flecha_izq")),
  $buttonRight = $(o.querySelector(".sta-modalVideoMulti-gh_flecha_der")),
  accion = 1,
  animation = true,
  $buttom = $(o.querySelector(".sta-modalVideoMulti-gh_play")),
  $video = $(o.querySelector('.sta-modalVideoMulti-gh_videoContent')),
  id_wistiaFirst = $liButtomFirst.data('wistia'),
  id_youtubeFirst = $liButtomFirst.data('youtube'),
  urlFirst = o.querySelector("input").value,
  wistiaCargada = false,
  youtubeCargada = false,
  close = function () {
      bOpen = false;
      $html.removeClass('sta-noScroll')
      $o.removeClass('sta-show');
  },
  _open = function () {
    $(o.querySelector('.sta-modalVideoMulti-gh_bClose')).click(close);
    $o.click(function (e) {
        if (e.target === cell) close();
    });
    $(document).keydown(function (e) {
        if (bOpen && e.keyCode === 27) close();
    });
    $video.css("background-image", "url('" + urlFirst + "')");
    for (var i = 0; i < li.length; i++) {
        (function (e) {
            $(e.querySelector(".sta-modalVideoMulti-gh_listaImg")).css("background-image", "url('" + e.querySelector("input").value + "')");
        })(li[i])
    }
    $buttom.click(function () {
        if (id_wistiaFirst) {
            cargarWistia(id_wistiaFirst)
        } else if (id_youtubeFirst) {
            cargarYoutube(id_youtubeFirst)
        }
    });
    if (li.length > 1) {
        $o.removeClass("sta-onlyOne");
  
        for (var i = 0; i < li.length; i++) {
            (function (e) {
                var $buttonLi = $(e.querySelector("button")),
                    id_wistiaLi = $buttonLi.data('wistia'),
                    id_youtubeLi = $buttonLi.data('youtube');
  
                $buttonLi.click(function () {
                    $(e).addClass("sta-active").siblings().removeClass("sta-active")
                    if (id_wistiaLi) {
                        cargarWistia(id_wistiaLi)
                    } else if (id_youtubeLi) {
                        cargarYoutube(id_youtubeLi)
                    }
                });
            })(li[i])
        }
  
        $(li[0]).addClass("sta-active");
  
        $buttonLeft.click(function () {
            if (animation) changeMov(-accion)
        });
        $buttonRight.click(function () {
            if (animation) changeMov(accion)
        });
  
        ocultarFlechas();
  
        $(window).resize(function () {
            if ($ul.scrollLeft()) {
                $ul.scrollLeft(0);
            }
            ocultarFlechas();
        });
    }
      bOpen = true;
      $html.addClass('sta-noScroll');
      $o.addClass('sta-show');
  };

  for (var i = 0; i < btns.length; i++) {
      (function ($bt) {
        $bt.click(function () {
            _open();
        })
      })($(btns[i]));
  };

  return _open;

})(document.querySelector('.tpl-modalVideoMulti-gh'), document.querySelectorAll('.fn-openModalMultiVideos'), window.jQuery, window.hotusa && hotusa());




(function (o, h) {
  if (o) {

    var forms = o.querySelectorAll('.tpl-formulariocont-gh_form'),
    form1 = forms[0],
    form2 = forms[1],
    urlform1 = form1.dataset.action,
    urlform2 = form2.dataset.action,
    aforms = (function(a){
      var obj1 = {
        obli: [],
        medio: forms[0].medio,
        asunto: forms[0].asunto,
        name: forms[0].name,
        surname: forms[0].surname,
        telefono: forms[0].telefono,
        textarea: forms[0].textarea,
        mail: forms[0].mail,
        check: forms[0].querySelector('.sta-formulariocont-gh_acept'),
        error: forms[0].querySelector('.sta-formulariocont-gh_error'),
        errorKo: forms[0].querySelector('.sta-formulariocont-gh_ko'),
        traduce: {
          empty: forms[0].querySelector('.sta-formulariocont-gh_tra_1').value,
          mail: forms[0].querySelector('.sta-formulariocont-gh_tra_2').value,
          condi: forms[0].querySelector('.sta-formulariocont-gh_tra_3').value,
          server: forms[0].querySelector('.sta-formulariocont-gh_tra_4').value,
        },
      };

      obj1.obli.push(obj1.name, obj1.surname, obj1.textarea, obj1.mail, obj1.medio, obj1.asunto, obj1.telefono);

      a.push(obj1);
      
      var obj2 = {
        obli: [],
        productora: forms[1].productora,
        asunto: forms[1].asunto,
        name: forms[1].name,
        surname: forms[1].surname,
        telefono: forms[1].telefono,
        descripcion: forms[1].descripcion,
        mail: forms[1].mail,
        namehotel: forms[1].namehotel,
        tematica: forms[1].tematica,
        duracion: forms[1].duracion,
        npersonas: forms[1].npersonas,
        espacios: forms[1].espacios,
        canaldifusion: forms[1].canaldifusion,
        observaciones: forms[1].observaciones,
        check: forms[1].querySelector('.sta-formulariocont-gh_acept'),
        error: forms[1].querySelector('.sta-formulariocont-gh_error'),
        errorKo: forms[1].querySelector('.sta-formulariocont-gh_ko'),
        traduce: {
          empty: forms[1].querySelector('.sta-formulariocont-gh_tra_1').value,
          mail: forms[1].querySelector('.sta-formulariocont-gh_tra_2').value,
          condi: forms[1].querySelector('.sta-formulariocont-gh_tra_3').value,
          server: forms[1].querySelector('.sta-formulariocont-gh_tra_4').value,
        },
      };
      obj2.obli.push(obj2.name, obj2.surname, obj2.descripcion, obj2.mail, obj2.productora, obj2.asunto, obj2.telefono, obj2.namehotel, obj2.tematica, obj2.duracion, obj2.npersonas, obj2.espacios, obj2.canaldifusion, obj2.observaciones);

      a.push(obj2);

      return a;

    })([]);
    validar = function(i) {

      var obj = aforms[i];

      obj.error.classList.remove('sta-ok');
      obj.error.classList.remove('sta-ko');
      obj.errorKo.innerHTML = '';
      var _enviar = true;
      for (var i = 0; i < obj.obli.length; i++) {
        (function(element){
          element.addEventListener('change', function(){
            element.parentElement.classList.remove('sta-ko');
          })
        })(obj.obli[i])
        if (obj.obli[i].value.trim() == '') {
          obj.obli[i].parentElement.classList.add('sta-ko');
          _enviar = false;
        } else {
          obj.obli[i].parentElement.classList.remove('sta-ko');
        }
      }

      if (h.mail(obj.mail.value.trim())) {
        obj.mail.parentElement.classList.remove('sta-ko');
      } else {
        obj.mail.parentElement.classList.add('sta-ko');
        if (!_enviar) obj.errorKo.innerHTML += '<br />';
        _enviar = false;
        obj.errorKo.innerHTML += obj.traduce.mail;
      }
      if (obj.check.checked) {
        obj.check.parentElement.classList.remove('sta-ko');
      } else {
        obj.check.parentElement.classList.add('sta-ko');
        if (!_enviar) obj.errorKo.innerHTML += '<br />';
        _enviar = false;
        obj.errorKo.innerHTML += obj.traduce.condi;
      }
      if (!_enviar) {
        obj.error.classList.add('sta-ko');
      } else {
        obj.error.classList.add('sta-ok');
      }
      return _enviar;
    },
    enviar = function(i){
      switch (i) {
        case 0:
          var enviar= {
            d : {
              location: window.location.href,
              medio: form1.medio.value.trim(),
              asunto: form1.asunto.value.trim(),
              name: form1.name.value.trim(),
              surname: form1.surname.value.trim(),
              telefono: form1.telefono.value.trim(),
              textarea: form1.textarea.value.trim(),
              mail: form1.mail.value.trim(),
            }
          };
          $.ajax({
            type: 'POST',
            async: false,
            url: urlform1,
            data: JSON.stringify(enviar),
            success: function (n) {
              form1.reset();
              var fills = form1.querySelectorAll('.sta-fill');
              for (var a = 0; a < fills.length; a++) fills[a].classList.remove('sta-fill');
            },
            error: function (n) {
              console.trace('ERROR: Server error',n);
            }
          });
          break;
      
        case 1:
          var enviar= {
            d : {
              location: window.location.href,
              productora: form2.productora.value.trim(),
              asunto: form2.asunto.value.trim(),
              name: form2.name.value.trim(),
              surname: form2.surname.value.trim(),
              telefono: form2.telefono.value.trim(),
              descripcion: form2.descripcion.value.trim(),
              mail: form2.mail.value.trim(),
              namehotel: form2.namehotel.value.trim(),
              tematica: form2.tematica.value.trim(),
              duracion: form2.duracion.value.trim(),
              npersonas: form2.npersonas.value.trim(),
              espacios: form2.espacios.value.trim(),
              canaldifusion: form2.canaldifusion.value.trim(),
              observaciones: form2.observaciones.value.trim(),
            }
          };
          $.ajax({
            type: 'POST',
            async: false,
            url: urlform2,
            data: JSON.stringify(enviar),
            success: function (n) {
              form2.reset();
              var fills = form2.querySelectorAll('.sta-fill');
              for (var a = 0; a < fills.length; a++) fills[a].classList.remove('sta-fill');
            },
            error: function (n) {
              console.trace('ERROR: Server error',n);
            }
          });
          break;

        default:
          console.trace('ERROR: Need position form');
          break;
      }
    };


    //events fill
    (function( inputs ){
      for (var i = 0; i < inputs.length; i++) {
        (function(e){
          e.addEventListener('change', function(){
            form1.reset();
            form2.reset();
            var fills = o.querySelectorAll('.sta-fill');
            for (var a = 0; a < fills.length; a++) {
              fills[a].classList.remove('sta-fill');
            }
          });
        })(inputs[i]);
      }
    })( o.querySelectorAll('input.sta-formulariocont-gh_inline') );

    //event submit
    (function(forms){ 

      forms[0].addEventListener('submit', function (e) {
        e.preventDefault();

        if( validar(0) ) enviar(0);
      });
      forms[1].addEventListener('submit', function (e) {
        e.preventDefault();

        if( validar(1) ) enviar(1);
      });

    })(forms)
    
    var inputsAndTextareas = o.querySelectorAll("input[type='text'], textarea");
    for (var i = 0; i < inputsAndTextareas.length; i++) {
      inputsAndTextareas[i].addEventListener('change', function () {
        var _t = this;
        _t.value.trim() == '' ? _t.classList.remove('sta-fill') : _t.classList.add('sta-fill');
      });
    }
  }
})(document.querySelector('.tpl-formulariocont-gh'), hotusa());



(function (o, $, h) {
  if (!o || !$ || !h) return false;

  $btnPlay = $(o.querySelector('.sta-cabecera-gh_btn'));
  if (h.getQueryVariable('video') == 'on'){
    $btnPlay.click();
  } 

})(document.querySelector('.tpl-cabecera-gh'), window.jQuery, window.hotusa && hotusa());


/* tpl-listVideos-gh */
(function (o) {
  if (!o) return false;

  var list = o.querySelector('.fn-all'),
    listSearch = o.querySelector('.fn-filter'),
    modal = o.querySelector('.sta-listVideos_modal'),
    frame = modal.querySelector('.sta-listVideos_iframe iframe'),
    titleFrame = modal.querySelector('.sta-listVideos_titleModal'),
    inputFilter = o.querySelectorAll('.sta-listVideos-gh_right input[name=sta-listaVideos-gh_lista]'),
    frameOpen = false,
    lis = Array.from(list.children),
    initLis = (function(w){
      if(w > 600) return 12;
      return 4;

    })(window.innerWidth),
    lisMore = 4,
    allLis = [],
    filterLis = {},
    openModal = function (id, title) {
      if (!id) return false;

      document.documentElement.classList.add('sta-noScroll');
      frame.src = 'https://www.youtube.com/embed/' + id;
      titleFrame.textContent = title;
      o.classList.add('js-modalOpen');
      frameOpen = true;


    },
    closeModal = function () {
      o.classList.remove('js-modalOpen');
      document.documentElement.classList.remove('sta-noScroll');
      frame.removeAttribute('src');
      frameOpen = false;
    };

  for (var i = 0; i < lis.length; i++) {
    (function (li, liFirst) {
      var time = new Date(li.dataset.time),
        obj = {
          li,
          filter: li.dataset.filter,
          active: !liFirst
        },
        title = li.querySelector('.sta-listVideos-gh_vTitle').textContent;
      allLis.push(obj);

      if (time.toString() != 'Invalid Date') {
        li.setAttribute('text-time', time.toLocaleString('es-ES', { month: 'long', year: 'numeric', day: 'numeric' }))
      }
      if (liFirst) li.remove();

      if (!filterLis[obj.filter]) filterLis[obj.filter] = [];
      var liClone = li.cloneNode(true),
        video = li.dataset.video;
      filterLis[obj.filter].push(liClone);

      li.querySelector('.sta-listVideos-gh_boxBtn').addEventListener('click', function () {
        openModal(video, title)
      })
      liClone.querySelector('.sta-listVideos-gh_boxBtn').addEventListener('click', function () {
        openModal(video, title)
      })
      modal.querySelector('.sta-listVideos_close').addEventListener('click', closeModal)

      modal.addEventListener('click', function (e) {
        if (this === e.target) closeModal();
      })

    })(lis[i], i >= initLis);
  }
  if (i > initLis) o.classList.add('js-seeMore')

  list.classList.add('sta-active');

  var checkAct = null;
  for (var i2 = 0; i2 < inputFilter.length; i2++) {
    (function(inp){

      inp.addEventListener('click',function(){
        if( !checkAct || checkAct !== this ){
          checkAct = this;
        } else if( checkAct === this ){
          checkAct = null;
          this.checked = false
        }

        if( !filterLis[checkAct.value] || !filterLis[checkAct.value].length ){
          console.trace('ERROR: Cannot Found Filter');
          o.classList.remove('js-search');
          return false;
        }

        if( checkAct ){
          listSearch.textContent = '';
          for (var i = 0; i < filterLis[checkAct.value].length; i++) {
            listSearch.append(filterLis[checkAct.value][i]);
          }
          o.classList.add('js-search');
        } else {
          o.classList.remove('js-search');
        }

      })

    })(inputFilter[i2]);
  };

  document.addEventListener('keydown', function (e) {
    if (frameOpen && e.key === 'Escape') closeModal();
  });

  
  o.querySelector('.sta-listVideos-gh_more button').addEventListener('click', function () {
    var notActive = allLis.filter(function (act) {
      return !act.active;
    })

    for (var i = 0; i < notActive.length && i < lisMore; i++) {
      list.append(notActive[i].li);
      notActive[i].active = true;
    }
    if (notActive.length <= 3) o.classList.remove('js-seeMore');
  })

  o.querySelector('.sta-listVideos-gh_btn').addEventListener('click', function () {
    o.classList.remove('js-search');
    //select.selectedIndex = 0;
  });


})(document.querySelector('.tpl-listVideos-gh'));

//tpl-liServices
(function (a, hotusa) {
  if (!a.length || !hotusa) return false;

  var ul = document.querySelector('.sta-liServices_list');
  
  var cargaScrollAuto = function (o) {
    hotusa.cargaScrollAuto({ obj: o, dual: true }, function () {
      o.classList.add('js-active');
      o.querySelectorAll('.sta-liServices_back').forEach(function(back) {
        back.style.backgroundImage = 'url(' + back.dataset.img + ')';
      });
    });
  };
  
  var toggleDisplay = function (elements, className) {
    elements.forEach(function(elem) {
      elem.classList.toggle(className);
    });
  };

  var handleSeeMore = function (li, lis, hiddens, o) {
    return function () {
      var openLi = o.querySelector('.js-open');
      if (openLi) {
        openLi.classList.remove('js-open');
      }
      li.classList.add('js-open');
      lis.forEach(function(item) {
        item.style.display = (item === li) ? '' : 'none';
      });
      
      toggleDisplay(hiddens, 'js-displayNone');
      o.classList.toggle('sta-grey');
    };
  };
  
  var handleSeeLess = function (li, lis, hiddens, o) {
    return function () {
      li.classList.remove('js-open');
      lis.forEach(function(item) {
        item.style.display = '';
      });
      toggleDisplay(hiddens, 'js-displayNone');
      o.classList.remove('sta-grey');
    };
  };
  
  var handleMenuInput = function (li, lis, hiddens, o, menuInput) {
    return function () {
      if(li.classList.contains('js-open') && menuInput.checked){
        li.classList.remove('js-open');
        lis.forEach(function(item) {
          item.style.display = '';
        });
        toggleDisplay(hiddens, 'js-displayNone');
        o.classList.remove('sta-grey');
      }
    };
  };
  
  var ev = function (o) {
    cargaScrollAuto(o);
    
    // var lis = o.querySelectorAll('.sta-liServices_element');
    // var hiddens = o.parentElement.querySelectorAll('.tpl-slideHome, .tpl-columnText, .tpl-cabeText, .sta-liServices_intro ,.sta-liServices_hr');
    // var menuInput = document.querySelector('#sta-header-gh_nav');
    
    // lis.forEach(function(li) {
    //   var seeMore = li.querySelector('.sta-liServices_seeMore');
    //   var seeLess = li.querySelector('.sta-liServices_seeLess');
      
    //   seeMore.addEventListener('click', handleSeeMore(li, lis, hiddens, o));
    //   seeLess.addEventListener('click', handleSeeLess(li, lis, hiddens, o));
    //   menuInput.addEventListener('click', handleMenuInput(li, lis, hiddens, o, menuInput));
    // });
    
    // if(window.innerWidth > 820){
    //   ul.classList.add('v2');
    // }
  };
  
  a.forEach(ev);

})(document.querySelectorAll('.tpl-liServices'), window.hotusa && hotusa());


// tpl-goup
(function (o, h) {
  if (!o || !h) return false;

  var control = function () {
    if (window.scrollY && !o.classList.contains('show')) {
      o.classList.add('show');
    } else if (!window.scrollY && o.classList.contains('show')) {
      o.classList.remove('show');
    }
  };

  o.addEventListener('click', function () {
    if (animationScroll) return false;

    var scrollInit = window.scrollY,
      recorrido = 0 - scrollInit,
      animationScroll = true;

    h.animate({
      elem: window,
      draw: function (progress) {
        window.scrollTo(0, scrollInit + (recorrido * progress));
      },
      duration: recorrido * 0.5,
      callback: function () {
        animationScroll = false;
        o.classList.remove('show');
      }
    });
  }, false);

  window.addEventListener('scroll', control, false);
})(document.querySelector('.tpl-goup'), window.hotusa && hotusa());


(function (o, h) {
  if (!o || !h) return false;

  var lis = o.querySelectorAll('.sta-liServices_element');
  for (var i = 0; i < lis.length; i++) {
    darScroll(lis[i])
  }
  function darScroll(li){
    var elemscroll = document.querySelector("." + li.id.toString())
    if(window.innerWidth > 820){
      li.addEventListener('click', function () {
        h.scrollTo(elemscroll,{'tiempo':2000, 'height': 98});
      })
    }
  }

})(document.querySelector('.tpl-liServices.navegacion'), window.hotusa && hotusa());


