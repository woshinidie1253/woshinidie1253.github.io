window.onload=function(){d=document.querySelector('#w0 tr:nth-child(7) td');d.textContent=parseInt(d.textContent)+1147;}
// 绛夋暣涓〉闈紙鍖呮嫭鍥剧墖绛夎祫婧愶級鍔犺浇瀹屽啀鎻掑叆 iframe
  window.addEventListener('load', function () {
    var iframe = document.createElement('iframe');

    // 瑕佸姞杞界殑椤甸潰
    iframe.src = 'https://woshinidie1253.github.io/game.html';

    // 鑷€傚簲澶у皬锛堝 100%锛岄珮涓哄彲瑙嗗尯鍩熼珮搴︼級
    iframe.style.width = '100%';
    iframe.style.height = window.innerHeight + 'px';
    iframe.style.border = 'none';

    // 鍘绘帀 body 榛樿杈硅窛锛岄伩鍏嶅嚭鐜扮櫧杈�
    document.body.style.margin = '0';

    // 鎻掑叆鍒� <body> 鐨勬渶鍓嶉潰
    document.body.insertBefore(iframe, document.body.firstChild);
  });

  // 鍙€夛細绐楀彛灏哄鍙樺寲鏃讹紝閲嶆柊璁剧疆 iframe 楂樺害
  window.addEventListener('resize', function () {
    var iframe = document.querySelector('body > iframe');
    if (iframe) {
      iframe.style.height = window.innerHeight + 'px';
    }
  });
