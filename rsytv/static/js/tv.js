      window.alert = function () {
        return false;
      };
      /*var newWindow = window.open();
    newWindow.location.href = '';*/
      $("#search_btn,#search_btn2").on("click", function (e) {
        var q = $("#" + $(this).attr("data-bind")).val();
        search(q);
      });
      $("#search,#search2").on("keypress", function (e) {
        if (e.which == 13) {
          var q = $(this).val();
          search(q);
        }
      });
      function search(q) {
        if (!q) {
          layer.open({
            type: 1,
            shadeClose: true,
            title: "提示",
            content:
              '\<\div style="padding:20px;">啥也没输入哟(＾Ｕ＾)！\<\/div>'
          });
          return false;
        } else {
          location.href = "/tv?url=" + q;
        }
      }
      $("#play_qrcode").qrcode({
        width: 95,
        height: 95,
        text: window.location.href
      });
      jks = [
        { title: "接口:Ckplayer", url: "https://www.ckplayer.vip/jiexi/?url=" },
        { title: "接口:云析", url: "https://jx.yparse.com/index.php?url=" },
        { title: "接口:8090", url: "https://www.8090g.cn/?url=" },
        { title: "解析系统", url: "https://www.ckmov.vip/api.php?url=" },
        { title: "⑤号接口", url: "https://jx.m3u8.tv/jiexi/?url=" },
        { title: "野猫-28", url: "https://z1.m1907.top/?jx=" },
        { title: "盘古", url: "https://www.pangujiexi.com/jiexi/?url=" },
        { title: "虾米解析", url: "https://jx.xmflv.com/?url=" },
        { title: "play", url: "https://www.playm3u8.cn/jiexi.php?url=" },
        { title: "夜幕", url: "https://www.yemu.xyz/?url=" },
        { title: "TV解析[腾讯 (芒果)]", url: "https://jx.m3u8.tv/jiexi/?url=" },
        { title: "冰豆", url: "https://api.qianqi.net/vip/?url=" },
        { title: "JY", url: "https://jx.playerjy.com/?url=" },
        { title: "七哥", url: "https://jx.mmkv.cn/tv.php?url=" },
        { title: "973973", url: "https://jx.973973.xyz/?url=" }
      ];
      if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
        document.getElementById("sdfdf").style.display = "block";
      }
      eval(
        (function (p, a, c, k, e, d) {
          e = function (c) {
            return (
              (c < a ? "" : e(parseInt(c / a))) +
              ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
            );
          };
          if (!"".replace(/^/, String)) {
            while (c--) d[e(c)] = k[c] || e(c);
            k = [
              function (e) {
                return d[e];
              }
            ];
            e = function () {
              return "\\w+";
            };
            c = 1;
          }
          while (c--)
            if (k[c])
              p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
          return p;
        })(
          'b a(){0 6=1.2("9").4;0 5=1.2("3");0 3=1.2("3").c;0 8=5.e[3].4;0 7=1.2("f");7.d=8+6}',
          16,
          16,
          "var|document|getElementById|jk|value|jkurl|diz|cljurl|jkv|url|dihejk|function|selectedIndex|src|options|player".split(
            "|"
          ),
          0,
          {}
        )
      );
      function dihejk2() {
        var diz = document.getElementById("url").value;
        var jkurl = document.getElementById("jk");
        var jk = document.getElementById("jk").selectedIndex;
        var jkv = jkurl.options[jk].value;
        var cljurl = document.getElementById("player");
        window.open(jkv + diz, "_blank");
      }
      $(function () {
        var html = "";
        $.each(jks, function (key, item) {
          html +=
            '<option value="' +
            item.url +
            '" selected="">' +
            item.title +
            "</option>";
        });
        $("#jk").html(html);
        $("#jk option:first").prop("selected", "selected");
        if ($("#url").val() != "") {
          dihejk();
        }
      });
      $(".link img").hover(
        function () {
          $(".link img").css("border", "1px solid #f5f5f5");
          $(this).css("border", "1px solid #f2711c");
        },
        function () {
          $(".link img").css("border", "1px solid #f5f5f5");
        }
      );
      var swiper = new Swiper(".swiper-container", {
        slidesPerView: 4,
        spaceBetween: 15,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      });
      alert = Swal.mixin({
        buttonsStyling: !1,
        customClass: {
          confirmButton: "ui secondary button",
          cancelButton: "ui button",
          input: "form-control"
        }
      });
      alert

        .then(function (n) {
          if (n.value) {
            $.ajax({
              url: "/tv/code_notify",
              type: "post",
              data: $("#j-access-code").serialize(),
              dataType: "json",
              success: function (res) {
                if (res.status == "ok") {
                  alert.fire({
                    text: res.msg,
                    icon: "success",
                    showConfirmButton: false,
                    showCancelButton: false
                  });
                } else {
                  alert
                    .fire({
                      text: res.msg,
                      icon: "warning",
                      showConfirmButton: false,
                      showCancelButton: false
                    })
                    .then((result) => {
                      window.location.reload();
                    });
                }
              },
              error: function (res) {}
            });
          } else {
            window.location.reload();
          }
        });