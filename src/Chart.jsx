import { useRef, useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function Chart(props) {
    const chartRef = useRef(null);

    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv");
        const myTheme = am5.Theme.new(root);
        myTheme.rule("Grid").setAll({
            stroke: am5.color(0x00FF00),
            strokeWidth: 2
        });
        const myAnimation = am5themes_Animated.new(root);
        root.setThemes([myTheme, myAnimation]);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout
            })
        );
        let data = [
            { category: "Laptop", value1: 150 ** 2, value2: 180 ** 2, value3: 170 ** 2 },
            { category: "SmartPhone", value1: 150000000, value2: 250 ** 2, value3: 290000000000 },
            { category: "Tablet", value1: 120 ** 2, value2: 140 ** 2, value3: 130 ** 2 },
            { category: "Headphone", value1: 200 ** 2, value2: 210 ** 2, value3: 220 ** 2 },
            { category: "SmartWatch", value1: 180 ** 2, value2: 160 ** 2, value3: 190 ** 2 }
        ];

        // Hitung total sebelum membuat series
        data = data.map(item => ({
            ...item,
            total: item.value1 + item.value2 + item.value3
        }));
        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            logarithmic: true,
            extraTooltipPrecision: 1,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {}),
            categoryField: "category"
        }));
        xAxis.data.setAll(data);
        // change format y label
        yAxis.get("renderer").labels.template.adapters.add("text", function (text, target) {
            let value = target.dataItem?.get("value");

            if (value === undefined || value === null) {
                return text; // Jika undefined, pakai teks default
            }

            if (value >= 1_000_000_000_000) return parseFloat((value / 1_000_000_000_000).toFixed(1)) + " T";
            if (value >= 1_000_000_000) return parseFloat((value / 1_000_000_000).toFixed(1)) + " M";
            if (value >= 1_000_000) return parseFloat((value / 1_000_000).toFixed(1)) + " jt";
            if (value >= 1_000) return parseFloat((value / 1_000).toFixed(1)) + " rb";

            return value.toString(); // Jika di bawah 1000, tampilkan angka asli
        });


        function createSeries(name, field) {
            let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: field,
                categoryXField: "category"
            }));
            series.data.setAll(data);

            // series.set("tooltip", am5.Tooltip.new(root, {
            //     labelText: "{category}\n{name} :  ${formatNumber(value)}"
            // }));


            const formatNumber = (value) => {
                if (value >= 1_000_000_000_000) return parseFloat((value / 1_000_000_000_000).toFixed(1)) + " T";
                if (value >= 1_000_000_000) return parseFloat((value / 1_000_000_000).toFixed(1)) + " M";
                if (value >= 1_000_000) return parseFloat((value / 1_000_000).toFixed(1)) + " jt";
                if (value >= 1_000) return parseFloat((value / 1_000).toFixed(1)) + " rb";
                return value;
            };

            series.columns.template.adapters.add("tooltipText", (text, target) => {
                // console.log("DataItem:", target.dataItem); // Debugging
                let value = target.dataItem?.get("valueY");
                return `{category}\n{name} : ${formatNumber(value)}`;
            });

            // Menambahkan bullet label dengan format angka dan kategori yang benar
            series.bullets.push(function (root) {
                return am5.Bullet.new(root, {});
            });
            series.bullets.push(function (root) {
                let label = am5.Label.new(root, {
                    text: "{name}: {valueY}",
                    centerX: am5.percent(50),
                    centerY: am5.percent(100),
                    populateText: true
                });
                label.adapters.add("text", (text, target) => {
                    let value = target.dataItem?.get("valueY") || 0;
                    return `${name}: ${formatNumber(value)}`;
                });
                return am5.Bullet.new(root, {
                    locationX: 0.5,
                    locationY: 1.0,
                    sprite: label
                });
            });

            return series;
        }
        function createLineSeries(name, field) {
            let series = chart.series.push(am5xy.LineSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: field,
                categoryXField: "category",
                stroke: am5.color(0xFF0000), // Warna garis merah
                fill: am5.color(0xFF0000)
            }));

            series.strokes.template.setAll({
                strokeWidth: 2,
                stroke: am5.color(0xFF0000)
            });

            series.data.setAll(data);

            // Format angka yang sama seperti pada Y-Axis
            const formatNumber = (value) => {
                if (value >= 1_000_000_000_000) return parseFloat((value / 1_000_000_000_000).toFixed(1)) + " T";
                if (value >= 1_000_000_000) return parseFloat((value / 1_000_000_000).toFixed(1)) + " M";
                if (value >= 1_000_000) return parseFloat((value / 1_000_000).toFixed(1)) + " jt";
                if (value >= 1_000) return parseFloat((value / 1_000).toFixed(1)) + " rb";
                return value;
            };

            // Bullet default (lingkaran dengan label)
            series.bullets.push(function (root, seriesDataItem) {
                // Container untuk bullet dan label
                let container = am5.Container.new(root, {
                    layout: root.verticalLayout, // Vertical layout memastikan jarak tidak berantakan
                    centerY: am5.percent(100) // Pastikan bullet tetap sejajar dengan data series
                });

                // Bullet Circle (Lingkaran)
                let circle = am5.Circle.new(root, {
                    radius: 5, // Ukuran bullet
                    fill: am5.color(0xFF0000), // Warna bullet merah
                    strokeWidth: 1,
                    stroke: am5.color(0xffffff) // Warna stroke putih di sekitar bullet
                });

                // Bullet Label (Teks di atas bullet)
                let label = am5.Label.new(root, {
                    text: `{valueY}`, // Menampilkan nilai Y
                    fontSize: 13, // Ukuran teks
                    fill: am5.color(0x000000), // Warna teks hitam
                    centerX: am5.percent(50),
                    centerY: am5.percent(-150), // Menambahkan jarak dari bullet
                    paddingBottom: 5, // Jarak antara label dan bullet
                    populateText: true
                });

                // Menambahkan formatNumber ke dalam label
                label.adapters.add("text", function (text, target) {
                    let value = target.dataItem?.get("valueY");
                    return formatNumber(value);  // Gunakan formatNumber untuk nilai Y
                });

                // Menambahkan bullet dan label ke dalam container
                container.children.push(label);
                container.children.push(circle);

                return am5.Bullet.new(root, {
                    sprite: container,
                    locationY: 0.5 // Mengatur bullet agar tetap sejajar dengan garis
                });
            });

            return series;
        }

        let series1 = createSeries("A", "value1");
        let series2 = createSeries("B", "value2");
        let series3 = createSeries("C", "value3");

        // Hitung total untuk line chart
        data.forEach(item => {
            item.total = item.value1 + item.value2 + item.value3;
        });

        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);
        legend.setAll({
            x: am5.percent(50),
            centerX: am5.percent(50),
            y: am5.percent(100),
            centerY: am5.percent(100)
        });

        // Buat Total Series dengan fungsi createLineSeries
        let totalSeries = createLineSeries("Total", "total");

        // Pastikan totalSeries memiliki data
        totalSeries.data.setAll(data);
        // Tambahkan totalSeries ke legend utama
        legend.data.setAll([...chart.series.values]);

        let scrollbar = am5.Scrollbar.new(root, {
            orientation: "horizontal"
        });

        let tooltip = am5.Tooltip.new(root, {});

        tooltip.get("background").setAll({
            fill: am5.color(0xeeeeee)
        });


        scrollbar.set("tooltip", tooltip);

        scrollbar.startGrip.set("tooltipText", "Drag to zoom");
        scrollbar.endGrip.set("tooltipText", "Drag to zoom");

        chart.set("scrollbarX", scrollbar);

        chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none" // Hanya menampilkan tooltip untuk satu series
        }));

        chartRef.current = chart;

        return () => {
            root.dispose();
        };
    }, []);

    useLayoutEffect(() => {
        chartRef.current.set("paddingRight", props.paddingRight);
    }, [props.paddingRight]);

    return <div id="chartdiv" style={{ width: "100%", height: "650px" }}></div>;
}

export default Chart;
