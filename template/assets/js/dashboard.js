
var riskScore = 65;
(function($) {
  'use strict';
  $.fn.andSelf = function() {
    return this.addBack.apply(this, arguments);
  }
  $(function() {
    if ($("#transaction-history").length) {
      var areaData = {
        labels: ["Risk score"],
        datasets: [{
          data: [riskScore, 100-riskScore],
          backgroundColor: [riskScore > 50 ? "#00d25b" : "#ffab00"]
         }
        ]
      };
      var areaOptions = {
        responsive: true,
        maintainAspectRatio: true,
        segmentShowStroke: false,
        cutoutPercentage: 70,
        elements: {
          arc: {
              borderWidth: 0
          }
        },      
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
      var transactionhistoryChartPlugins = {
        beforeDraw: function(chart) {
          var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;
      
          ctx.restore();
          var fontSize = 3;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";
      
          var text = riskScore, 
              textX = Math.round((width - ctx.measureText(text).width) / 1.98),
              textY = height / 2.1;
      
          ctx.fillText(text, textX, textY);

          ctx.restore();
          var fontSize = 1;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'center';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#6c7293";

          var texts = "", 
              textsX = Math.round((width - ctx.measureText(text).width) / 1.5),
              textsY = height / 1;
      
          ctx.fillText(texts, textsX, textsY);
          ctx.save();
        }
      }
      var transactionhistoryChartCanvas = $("#transaction-history").get(0).getContext("2d");
      var transactionhistoryChart = new Chart(transactionhistoryChartCanvas, {
        type: 'doughnut',
        data: areaData,
        options: areaOptions,
        plugins: transactionhistoryChartPlugins
      });
    }
    $("#description").html(riskScore < 25 ? "Your score is low. To improve your security, follow our instructions and take the necessary steps to increase it." : riskScore >= 25 && riskScore <= 50 ? "Your score is okay, but there's always room for improvement. Take a look at our guidelines and see what steps you can take to enhance your security." : "You're really good at security! Keep up the good work and continue to prioritize safety in your online transactions.");
    });
})(jQuery);