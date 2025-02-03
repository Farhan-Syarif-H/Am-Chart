import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function LineChart() {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    // Pastikan tidak ada root yang sudah ada
    if (chartRef.current) {
      chartRef.current.dispose();
    }

    let root = am5.Root.new("chartdiv");
    chartRef.current = root; // Simpan root agar bisa di-dispose nanti

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    // Data
    let data = [
      { month: "Jan", technology: 3500, healthcare: 4200, finance: 3000 },
      { month: "Feb", technology: 4100, healthcare: 4500, finance: 3200 },
      { month: "Mar", technology: 3900, healthcare: 4700, finance: 3300 },
      { month: "Apr", technology: 4200, healthcare: 4900, finance: 3500 },
      { month: "May", technology: 4600, healthcare: 5200, finance: 3700 },
      { month: "Jun", technology: 4700, healthcare: 5300, finance: 4000 },
      { month: "Jul", technology: 4800, healthcare: 5400, finance: 4200 },
      { month: "Aug", technology: 4900, healthcare: 5500, finance: 4400 },
      { month: "Sep", technology: 4200, healthcare: 5000, finance: 3800 },
      { month: "Oct", technology: 4000, healthcare: 4800, finance: 3600 },
      { month: "Nov", technology: 3800, healthcare: 4600, finance: 3400 },
      { month: "Dec", technology: 3500, healthcare: 4300, finance: 3200 },
    ];

    // X-Axis
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: "month",
      })
    );
    xAxis.data.setAll(data);

    // Y-Axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Fungsi untuk membuat Series Line
    function createSeries(name, field, color) {
      let series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: field,
          categoryXField: "month",
          stroke: am5.color(color),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}",
            getFillFromSprite: false,  // Nonaktifkan warna default
            background: am5.Rectangle.new(root, {
              fill: am5.color(color),   // Warna tooltip sesuai warna garis
              fillOpacity: 0.8,         // Sesuaikan transparansi
              stroke: am5.color("#ffffff"), // Tambahkan border putih untuk kontras
              strokeWidth: 1
            }),
          }),
        })
      );

      // Tambahkan titik di setiap data
      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(color),
            stroke: am5.color("#fff"),
            strokeWidth: 2,
          }),
        })
      );

      series.data.setAll(data);
    }


    // Buat 3 garis dengan warna yang berbeda
    createSeries("Technology", "technology", 0xff0000); // Merah
    createSeries("Healthcare", "healthcare", 0x00ff00); // Hijau
    createSeries("Finance", "finance", 0x0000ff); // Biru

    // Tambahkan Legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Tambahkan Cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
}

export default LineChart;
